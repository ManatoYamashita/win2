# ValueCommerce 注文レポートAPI - 実装ガイド

**最終更新日:** 2025-01-04
**実装フェーズ:** Phase 2
**推定実装期間:** 7-10日

---

## 目次

1. [実装概要](#実装概要)
2. [OAuth 1.0a 署名生成](#oauth-10a-署名生成)
3. [注文レポートAPI呼び出し](#注文レポートapi呼び出し)
4. [XMLパース処理](#xmlパース処理)
5. [Click ID照合ロジック](#click-id照合ロジック)
6. [Cronジョブ実装](#cronジョブ実装)
7. [エラーハンドリング](#エラーハンドリング)
8. [テスト手順](#テスト手順)
9. [デプロイ手順](#デプロイ手順)

---

## 実装概要

### 主要コンポーネント

```
lib/valuecommerce-api.ts
├── generateOAuthSignature()    # OAuth 1.0a 署名生成
├── fetchOrderReport()          # 注文レポート取得
├── parseOrderReportXML()       # XML → JSON変換
└── matchClickIdWithMember()    # Click ID照合

app/api/cron/valuecommerce-sync/route.ts
├── GET handler                 # Cron実行エンドポイント
├── validateCronSecret()        # Cron認証
└── syncValueCommerceOrders()   # 同期処理

types/valuecommerce.ts
├── OrderReportRequest          # APIリクエスト型
├── OrderReportResponse         # APIレスポンス型
└── Order                       # 注文データ型
```

### データフロー

```
[Vercel Cron (10分間隔)]
    ↓
[/api/cron/valuecommerce-sync]
    ↓
[fetchOrderReport() @ lib/valuecommerce-api.ts]
    - OAuth署名生成
    - API GET https://webservice.valuecommerce.ne.jp/OrderReport
    - XMLレスポンス取得
    ↓
[parseOrderReportXML()]
    - XML → JSON変換
    - 各注文データを抽出
    ↓
[matchClickIdWithMember()]
    - clickId（sid）でクリックログ検索
    - メンバーID取得
    ↓
[writeConversionData() @ lib/sheets.ts]
    - 重複チェック（orderNumber）
    - Google Sheets「成果CSV_RAW」に追記
    ↓
[ログ出力]
    - 成功: 取得件数、新規追加件数
    - 失敗: エラー詳細
```

---

## OAuth 1.0a 署名生成

### 1. パッケージインストール

```bash
npm install oauth-1.0a crypto-js
npm install --save-dev @types/oauth-1.0a
```

### 2. 型定義（types/valuecommerce.ts）

```typescript
/**
 * OAuth 1.0a 認証情報
 */
export interface ValueCommerceOAuthConfig {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

/**
 * 注文レポートAPIリクエストパラメータ
 */
export interface OrderReportRequest {
  /** 検索開始日（YYYY-MM-DD） */
  start_date: string;
  /** 検索終了日（YYYY-MM-DD） */
  end_date: string;
  /** ステータスフィルタ（任意） */
  status?: "pending" | "approved" | "rejected";
  /** ページ番号（デフォルト: 1） */
  page?: number;
  /** 1ページあたりの件数（デフォルト: 20、最大: 100） */
  count?: number;
}

/**
 * 注文データ
 */
export interface Order {
  /** 注文番号（一意識別子） */
  orderNumber: string;
  /** 注文日時（ISO8601形式） */
  orderDate: string;
  /** 報酬額（円） */
  commission: number;
  /** ステータス */
  status: "pending" | "approved" | "rejected";
  /** Click ID（sidパラメータの値） */
  clickId: string;
  /** 広告主名 */
  merchantName: string;
  /** 商品名 */
  productName: string;
}

/**
 * 注文レポートAPIレスポンス
 */
export interface OrderReportResponse {
  /** 注文データ配列 */
  orders: Order[];
  /** 総件数 */
  totalCount: number;
  /** 現在のページ */
  page: number;
  /** 1ページあたりの件数 */
  count: number;
}
```

### 3. OAuth署名生成実装（lib/valuecommerce-api.ts）

```typescript
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import type { ValueCommerceOAuthConfig, OrderReportRequest } from "@/types/valuecommerce";

/**
 * OAuth 1.0a 署名生成関数
 *
 * @param method HTTPメソッド（"GET" or "POST"）
 * @param url リクエストURL
 * @param params クエリパラメータ
 * @returns OAuth署名付きヘッダー
 */
function generateOAuthSignature(
  method: "GET" | "POST",
  url: string,
  params: Record<string, string | number>
): string {
  const config: ValueCommerceOAuthConfig = {
    consumerKey: process.env.VALUECOMMERCE_CONSUMER_KEY || "",
    consumerSecret: process.env.VALUECOMMERCE_CONSUMER_SECRET || "",
    accessToken: process.env.VALUECOMMERCE_ACCESS_TOKEN || "",
    accessTokenSecret: process.env.VALUECOMMERCE_ACCESS_TOKEN_SECRET || "",
  };

  // OAuth 1.0a インスタンス作成
  const oauth = new OAuth({
    consumer: {
      key: config.consumerKey,
      secret: config.consumerSecret,
    },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    },
  });

  const token = {
    key: config.accessToken,
    secret: config.accessTokenSecret,
  };

  const requestData = {
    url,
    method,
    data: params,
  };

  // OAuth署名生成
  const oauthHeaders = oauth.toHeader(oauth.authorize(requestData, token));

  return oauthHeaders["Authorization"];
}
```

**重要ポイント:**
- `HMAC-SHA1` 署名方式を使用
- 環境変数から認証情報を取得
- `crypto` モジュールでSHA1ハッシュ生成

---

## 注文レポートAPI呼び出し

### 実装（lib/valuecommerce-api.ts）

```typescript
import axios from "axios";

/**
 * 注文レポートAPI呼び出し
 *
 * @param params リクエストパラメータ
 * @returns XMLレスポンス文字列
 */
export async function fetchOrderReport(
  params: OrderReportRequest
): Promise<string> {
  const baseUrl = "https://webservice.valuecommerce.ne.jp/OrderReport";

  // クエリパラメータ構築
  const queryParams: Record<string, string | number> = {
    start_date: params.start_date,
    end_date: params.end_date,
  };

  if (params.status) {
    queryParams.status = params.status;
  }
  if (params.page) {
    queryParams.page = params.page;
  }
  if (params.count) {
    queryParams.count = params.count;
  }

  // OAuth署名生成
  const authHeader = generateOAuthSignature("GET", baseUrl, queryParams);

  // APIリクエスト
  const url = new URL(baseUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  console.log(`[valuecommerce-api] Fetching orders: ${url.toString()}`);

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: authHeader,
        Accept: "application/xml",
      },
      timeout: 30000, // 30秒タイムアウト
    });

    console.log(`[valuecommerce-api] Response status: ${response.status}`);
    return response.data; // XMLレスポンス文字列
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[valuecommerce-api] API Error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `ValueCommerce API error: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw error;
  }
}
```

**重要ポイント:**
- `Accept: application/xml` ヘッダーを明示
- タイムアウト設定（30秒）
- エラー時の詳細ログ出力

---

## XMLパース処理

### 1. パッケージインストール

```bash
npm install xml2js
npm install --save-dev @types/xml2js
```

### 2. 実装（lib/valuecommerce-api.ts）

```typescript
import { parseStringPromise } from "xml2js";
import type { Order, OrderReportResponse } from "@/types/valuecommerce";

/**
 * XMLレスポンスをパースして注文データを抽出
 *
 * @param xmlString XMLレスポンス文字列
 * @returns パース済み注文レポート
 */
export async function parseOrderReportXML(
  xmlString: string
): Promise<OrderReportResponse> {
  try {
    const result = await parseStringPromise(xmlString, {
      explicitArray: false, // 配列を強制しない
      mergeAttrs: true,     // 属性をマージ
    });

    // XMLルート構造: <orderReport><orders><order>...</order></orders></orderReport>
    const ordersData = result.orderReport?.orders?.order || [];

    // 単一の注文の場合は配列化
    const ordersArray = Array.isArray(ordersData) ? ordersData : [ordersData];

    const orders: Order[] = ordersArray.map((orderXml: any) => ({
      orderNumber: orderXml.orderNumber || "",
      orderDate: orderXml.orderDate || "",
      commission: Number(orderXml.commission) || 0,
      status: parseStatus(orderXml.status),
      clickId: orderXml.clickId || "",
      merchantName: orderXml.merchantName || "",
      productName: orderXml.productName || "",
    }));

    return {
      orders,
      totalCount: orders.length,
      page: 1, // XMLからページ情報が取得できない場合はデフォルト
      count: orders.length,
    };
  } catch (error) {
    console.error("[valuecommerce-api] XML Parse Error:", error);
    throw new Error("Failed to parse ValueCommerce XML response");
  }
}

/**
 * ステータス文字列を型安全に変換
 */
function parseStatus(status: string): "pending" | "approved" | "rejected" {
  const normalized = status.toLowerCase();
  if (normalized === "pending" || normalized === "approved" || normalized === "rejected") {
    return normalized;
  }
  // デフォルトは保留扱い
  return "pending";
}
```

**重要ポイント:**
- `explicitArray: false` で単一要素も配列に統一
- 数値フィールド（`commission`）は `Number()` で変換
- ステータスは型安全に変換

---

## Click ID照合ロジック

### 実装（lib/valuecommerce-api.ts）

```typescript
import { readSheet, SHEET_NAMES } from "@/lib/sheets";
import type { ClickLogRow } from "@/lib/sheets";

/**
 * Click ID（sid）からメンバーIDを取得
 *
 * @param clickId ValueCommerceのClick ID（sidパラメータの値）
 * @returns メンバーID（見つからない場合はnull）
 */
export async function matchClickIdWithMember(
  clickId: string
): Promise<string | null> {
  try {
    // クリックログ取得
    const clickLogRows = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");
    const clickLogs: ClickLogRow[] = clickLogRows.map(row => ({
      timestamp: row[0] || "",
      memberId: row[1] || "",
      dealName: row[2] || "",
      dealId: row[3] || "",
      eventId: row[4] || "",
    }));

    // eventId列でClick IDを検索
    // （注: eventIdにsidを記録する実装が必要）
    const matchedLog = clickLogs.find(log => log.eventId === clickId);

    if (matchedLog) {
      console.log(
        `[valuecommerce-api] Matched clickId ${clickId} to member ${matchedLog.memberId}`
      );
      return matchedLog.memberId;
    }

    console.warn(`[valuecommerce-api] No member found for clickId: ${clickId}`);
    return null;
  } catch (error) {
    console.error("[valuecommerce-api] Error matching click ID:", error);
    throw error;
  }
}
```

**実装上の注意:**
- クリックログの `eventId` 列に ValueCommerce の `sid` を記録する必要がある
- `/api/track-click` で ValueCommerce リンク生成時に `eventId` を設定

**改善案（track-click.tsの修正）:**

```typescript
// app/api/track-click/route.ts
if (aspName === "valuecommerce") {
  // sidパラメータ生成
  const sid = memberId || guestUuid;

  // eventIdにsidを記録
  await writeClickLog({
    timestamp: new Date().toISOString(),
    memberId: memberId || guestUuid,
    dealName,
    dealId,
    eventId: sid, // ← sidをeventIdに記録
  });

  // リンク生成
  trackingUrl = `${affiliateUrl}&sid=${encodeURIComponent(sid)}`;
}
```

---

## Cronジョブ実装

### 1. Cronエンドポイント作成

**ファイル:** `app/api/cron/valuecommerce-sync/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  fetchOrderReport,
  parseOrderReportXML,
  matchClickIdWithMember,
} from "@/lib/valuecommerce-api";
import { writeConversionData, isDuplicateConversion } from "@/lib/sheets";
import type { ConversionWebhookData } from "@/lib/sheets";

/**
 * ValueCommerce 注文レポート定期同期Cronジョブ
 *
 * 実行頻度: 10分間隔
 * URL: GET /api/cron/valuecommerce-sync
 * 認証: Vercel Cron Secret（CRON_SECRET環境変数）
 *
 * 処理フロー:
 * 1. 過去24時間の注文データを取得
 * 2. XMLパース
 * 3. Click ID照合でメンバーID取得
 * 4. Google Sheets「成果CSV_RAW」に追記（重複スキップ）
 * 5. ログ出力
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Cron認証チェック
    const authHeader = request.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedToken) {
      console.warn("[valuecommerce-sync] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[valuecommerce-sync] Starting sync process...");

    // 2. 過去24時間の日付範囲を計算
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startDate = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD
    const endDate = now.toISOString().split("T")[0];

    // 3. 注文レポート取得
    const xmlResponse = await fetchOrderReport({
      start_date: startDate,
      end_date: endDate,
      count: 100, // 最大件数取得
    });

    // 4. XMLパース
    const orderReport = await parseOrderReportXML(xmlResponse);
    const orders = orderReport.orders;

    console.log(`[valuecommerce-sync] Fetched ${orders.length} orders`);

    // 5. 各注文を処理
    let newConversions = 0;
    let skippedDuplicates = 0;
    let failedMatches = 0;

    for (const order of orders) {
      try {
        // 重複チェック
        const isDuplicate = await isDuplicateConversion(order.orderNumber);
        if (isDuplicate) {
          skippedDuplicates++;
          continue;
        }

        // Click ID照合
        const memberId = await matchClickIdWithMember(order.clickId);
        if (!memberId) {
          failedMatches++;
          console.warn(
            `[valuecommerce-sync] No member found for order ${order.orderNumber}`
          );
          continue;
        }

        // Google Sheets書き込み
        const conversionData: ConversionWebhookData = {
          trackingId: memberId,
          eventId: order.clickId,
          dealName: `${order.merchantName} - ${order.productName}`,
          aspName: "valuecommerce",
          rewardAmount: order.commission,
          status: order.status === "approved" ? "承認" : "保留",
          orderId: order.orderNumber,
          timestamp: order.orderDate,
        };

        await writeConversionData(conversionData);
        newConversions++;

        console.log(
          `[valuecommerce-sync] Recorded conversion: ${order.orderNumber} for member ${memberId}`
        );
      } catch (error) {
        console.error(
          `[valuecommerce-sync] Error processing order ${order.orderNumber}:`,
          error
        );
      }
    }

    // 6. 結果サマリー
    const summary = {
      success: true,
      totalFetched: orders.length,
      newConversions,
      skippedDuplicates,
      failedMatches,
      timestamp: new Date().toISOString(),
    };

    console.log("[valuecommerce-sync] Sync completed:", summary);

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("[valuecommerce-sync] Sync error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

### 2. Vercel Cron設定

**ファイル:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/valuecommerce-sync",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**Cron式の意味:**
- `*/10 * * * *` = 10分ごと実行
- 1日144回実行（1,000リクエスト/日の制限内）

### 3. 環境変数設定

```bash
# .env.local
CRON_SECRET=your-random-secret-token
VALUECOMMERCE_CONSUMER_KEY=your_consumer_key
VALUECOMMERCE_CONSUMER_SECRET=your_consumer_secret
VALUECOMMERCE_ACCESS_TOKEN=your_access_token
VALUECOMMERCE_ACCESS_TOKEN_SECRET=your_access_token_secret

# Vercel本番環境
vercel env add CRON_SECRET production
vercel env add VALUECOMMERCE_CONSUMER_KEY production
vercel env add VALUECOMMERCE_CONSUMER_SECRET production
vercel env add VALUECOMMERCE_ACCESS_TOKEN production
vercel env add VALUECOMMERCE_ACCESS_TOKEN_SECRET production
```

---

## エラーハンドリング

### 1. API認証エラー

**エラー:** `401 Unauthorized`

**原因:**
- OAuth署名が不正
- Consumer Key/Secretが間違っている
- Access Token/Secretが期限切れ

**対処法:**
1. 環境変数を再確認
2. ValueCommerce管理画面で認証情報を再生成
3. ローカル環境でOAuth署名をテスト

### 2. レート制限エラー

**エラー:** `429 Too Many Requests`

**原因:**
- 1,000リクエスト/日の制限超過

**対処法:**
1. Cron頻度を減らす（10分→15分）
2. ページング処理の最適化
3. エラー時の指数バックオフ実装

### 3. XMLパースエラー

**エラー:** `Failed to parse ValueCommerce XML response`

**原因:**
- 予期しないXML構造
- 空のレスポンス

**対処法:**
1. XMLレスポンスをログ出力
2. 実際の構造に合わせてパースロジック修正
3. `xml2js` のオプション調整

### 4. Google Sheets書き込みエラー

**エラー:** `Google Sheets API error`

**原因:**
- APIクォータ超過
- 認証情報エラー

**対処法:**
1. バッチ書き込みの実装（複数行を1リクエスト）
2. リトライロジックの追加
3. エラーログの監視

---

## テスト手順

### 1. ローカル環境でのOAuth署名テスト

```bash
# 開発サーバー起動
npm run dev

# 別ターミナルでテストスクリプト実行
node scripts/test-valuecommerce-api.js
```

**テストスクリプト例（scripts/test-valuecommerce-api.js）:**

```javascript
const { fetchOrderReport, parseOrderReportXML } = require("../lib/valuecommerce-api");

(async () => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const today = new Date();

    const xml = await fetchOrderReport({
      start_date: yesterday.toISOString().split("T")[0],
      end_date: today.toISOString().split("T")[0],
      count: 10,
    });

    console.log("XML Response:", xml);

    const parsed = await parseOrderReportXML(xml);
    console.log("Parsed Orders:", JSON.stringify(parsed, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
})();
```

### 2. Cronエンドポイントの手動実行

```bash
# ローカル環境
curl -X GET "http://localhost:3000/api/cron/valuecommerce-sync" \
  -H "Authorization: Bearer ${CRON_SECRET}"

# 本番環境（Vercelデプロイ後）
curl -X GET "https://your-app.vercel.app/api/cron/valuecommerce-sync" \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

### 3. Google Sheets確認

**確認項目:**
- ✅ 「成果CSV_RAW」シートに新規行が追加されているか
- ✅ 列の順序: A=日時, B=会員ID, C=eventId, D=案件名, E=ASP名, F=報酬額, G=ステータス, H=注文ID
- ✅ 重複成果がスキップされているか（同じorderNumberが複数ない）

---

## デプロイ手順

### 1. コードレビュー

```bash
# TypeScriptコンパイルチェック
npx tsc --noEmit

# Lintチェック
npm run lint

# テスト実行
npm test
```

### 2. 環境変数設定（Vercel）

```bash
vercel env add CRON_SECRET production
vercel env add VALUECOMMERCE_CONSUMER_KEY production
vercel env add VALUECOMMERCE_CONSUMER_SECRET production
vercel env add VALUECOMMERCE_ACCESS_TOKEN production
vercel env add VALUECOMMERCE_ACCESS_TOKEN_SECRET production
```

### 3. Vercelデプロイ

```bash
# 本番デプロイ
vercel --prod

# デプロイ確認
vercel logs --follow
```

### 4. Cron動作確認

**Vercel Dashboard:**
1. 「Crons」タブを開く
2. `/api/cron/valuecommerce-sync` の実行履歴を確認
3. 直近のログを確認:
   - `[valuecommerce-sync] Starting sync process...`
   - `[valuecommerce-sync] Fetched X orders`
   - `[valuecommerce-sync] Sync completed`

### 5. 監視設定

**推奨監視項目:**
- Cronジョブの実行成功率（Vercel Dashboard）
- エラーログの頻度（`vercel logs`）
- Google Sheetsの成果データ増加率

**アラート設定:**
- 3回連続でCron失敗 → メール通知
- API認証エラー → 即座に通知
- レート制限エラー → Cron頻度調整を検討

---

## 次のステップ

### Phase 2 完了後の改善案

1. **キャッシュ実装**
   - クリックログのメモリキャッシュ（10分間保持）
   - API呼び出し回数削減

2. **バッチ処理最適化**
   - Google Sheetsバッチ書き込み（複数行を1リクエスト）
   - パフォーマンス向上

3. **エラー通知強化**
   - Slackインテグレーション
   - 重要エラーの即座通知

4. **ダッシュボード追加**
   - `/admin/valuecommerce-status` ページ
   - 同期履歴、エラー統計の可視化

---

## 参考リンク

- [ValueCommerce OAuth 1.0a認証ガイド](./authentication-setup.md)
- [トラブルシューティング](./troubleshooting.md)
- [AFB実装ガイド](../afb-implementation-guide.md)（参考実装）

---

_Last Updated: 2025-01-04_
_Document Version: 1.0.0_
_Maintained by: WIN×Ⅱ Development Team_
