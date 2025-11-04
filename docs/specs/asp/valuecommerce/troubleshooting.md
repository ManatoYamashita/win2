# ValueCommerce API - トラブルシューティングガイド

**最終更新日:** 2025-01-04
**対象:** 実装・運用時のエラー対応
**難易度:** 初級〜中級

---

## 目次

1. [認証エラー](#認証エラー)
2. [APIリクエストエラー](#apiリクエストエラー)
3. [データ処理エラー](#データ処理エラー)
4. [Cronジョブエラー](#cronジョブエラー)
5. [Google Sheets連携エラー](#google-sheets連携エラー)
6. [デバッグ手法](#デバッグ手法)
7. [サポート問い合わせ](#サポート問い合わせ)

---

## 認証エラー

### エラー: `401 Unauthorized - Invalid signature`

**症状:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid OAuth signature"
}
```

**原因:**
- OAuth署名の生成ロジックが間違っている
- Consumer Secret または Access Token Secret が間違っている
- タイムスタンプの ズレ（サーバー時刻不正）

**対処法:**

#### 1. 環境変数の確認

```bash
# ローカル環境
cat .env.local | grep VALUECOMMERCE

# 出力例:
# VALUECOMMERCE_CONSUMER_KEY=vc_xxxxxxxx
# VALUECOMMERCE_CONSUMER_SECRET=xxxxxxxxxx
# VALUECOMMERCE_ACCESS_TOKEN=xxxxxxxxxx
# VALUECOMMERCE_ACCESS_TOKEN_SECRET=xxxxxxxxxx
```

**チェックポイント:**
- ✅ 各値が正しくコピーされているか
- ✅ 先頭・末尾にスペースが入っていないか
- ✅ 改行コードが混入していないか

#### 2. 認証情報の再生成

ValueCommerce管理画面で認証情報を再生成:
1. 「ツール」→「Webサービス」→「OAuth認証情報」
2. 「認証情報を再生成」ボタンをクリック
3. 新しい4つの値をコピー
4. 環境変数を更新
5. アプリケーションを再起動

```bash
# Vercel環境変数の更新
vercel env rm VALUECOMMERCE_CONSUMER_SECRET production
vercel env add VALUECOMMERCE_CONSUMER_SECRET production
# 新しい値を入力

# 本番デプロイ
vercel --prod
```

#### 3. OAuth署名生成ロジックの検証

テストスクリプトで署名生成をデバッグ:

```javascript
// scripts/debug-oauth-signature.js
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

const oauth = new OAuth({
  consumer: {
    key: process.env.VALUECOMMERCE_CONSUMER_KEY || "",
    secret: process.env.VALUECOMMERCE_CONSUMER_SECRET || "",
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    console.log("Base String:", base_string);
    console.log("Key:", key.substring(0, 10) + "...");

    const signature = crypto.createHmac("sha1", key).update(base_string).digest("base64");
    console.log("Generated Signature:", signature);

    return signature;
  },
});

const token = {
  key: process.env.VALUECOMMERCE_ACCESS_TOKEN || "",
  secret: process.env.VALUECOMMERCE_ACCESS_TOKEN_SECRET || "",
};

const request = {
  url: "https://webservice.valuecommerce.ne.jp/OrderReport",
  method: "GET",
  data: {
    start_date: "2025-01-01",
    end_date: "2025-01-04",
  },
};

const authHeader = oauth.toHeader(oauth.authorize(request, token));
console.log("\nFinal Authorization Header:", authHeader["Authorization"]);
```

実行:
```bash
node scripts/debug-oauth-signature.js
```

---

### エラー: `401 Unauthorized - Invalid consumer key`

**症状:**
```
Error: Request failed with status code 401
Response: Invalid consumer key
```

**原因:**
- Consumer Keyが間違っている
- Consumer Keyのプレフィックス（`vc_`）が欠落

**対処法:**

1. Consumer Keyの形式確認:
   ```bash
   echo $VALUECOMMERCE_CONSUMER_KEY
   # 正しい形式: vc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. ValueCommerce管理画面で再確認:
   - 「ツール」→「Webサービス」→「OAuth認証情報」
   - Consumer Key をコピー＆ペースト（手入力は避ける）

---

## APIリクエストエラー

### エラー: `429 Too Many Requests`

**症状:**
```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the maximum number of requests per day (1,000)"
}
```

**原因:**
- 1日のAPIリクエスト制限（1,000回）を超過
- Cron頻度が高すぎる
- テスト時の大量リクエスト

**対処法:**

#### 1. 当日のリクエスト数を確認

```bash
# Vercel Logsでリクエスト数をカウント
vercel logs --follow | grep "[valuecommerce-api] Fetching orders"
```

#### 2. Cron頻度の調整

**現在の設定:** 10分間隔（144回/日）

**調整案1: 15分間隔（96回/日）**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/valuecommerce-sync",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**調整案2: 営業時間のみ実行（9時〜21時、1時間ごと = 13回/日）**
```json
{
  "crons": [
    {
      "path": "/api/cron/valuecommerce-sync",
      "schedule": "0 9-21 * * *"
    }
  ]
}
```

#### 3. 翌日まで待機

レート制限は **日本時間0時にリセット** されます。

---

### エラー: `500 Internal Server Error`

**症状:**
```
Error: Request failed with status code 500
Response: Internal Server Error
```

**原因:**
- ValueCommerce API側の一時的な障害
- 不正なリクエストパラメータ

**対処法:**

#### 1. リクエストパラメータの確認

```typescript
// 日付形式が正しいか確認
const params = {
  start_date: "2025-01-01", // ✅ YYYY-MM-DD形式
  end_date: "2025-01-04",   // ✅ YYYY-MM-DD形式
  count: 100,               // ✅ 1〜100の範囲内
};

// ❌ 悪い例
const badParams = {
  start_date: "01-01-2025",  // ❌ 形式違い
  end_date: "2025-01-35",    // ❌ 存在しない日付
  count: 200,                // ❌ 最大100を超過
};
```

#### 2. リトライ実装

```typescript
// lib/valuecommerce-api.ts
async function fetchOrderReportWithRetry(
  params: OrderReportRequest,
  maxRetries = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchOrderReport(params);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        console.warn(`[valuecommerce-api] Retry ${i + 1}/${maxRetries} after 500 error`);
        await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1))); // 5秒, 10秒, 15秒
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded for ValueCommerce API");
}
```

#### 3. ValueCommerce障害情報の確認

- [ValueCommerceお知らせページ](https://www.valuecommerce.ne.jp/info/)
- システムメンテナンス情報を確認

---

## データ処理エラー

### エラー: `Failed to parse ValueCommerce XML response`

**症状:**
```
Error: Failed to parse ValueCommerce XML response
at parseOrderReportXML (lib/valuecommerce-api.ts:120)
```

**原因:**
- 予期しないXML構造
- 空のレスポンス
- xml2jsのパースエラー

**対処法:**

#### 1. XMLレスポンスのログ出力

```typescript
// lib/valuecommerce-api.ts
export async function parseOrderReportXML(xmlString: string): Promise<OrderReportResponse> {
  console.log("[valuecommerce-api] XML Response (first 500 chars):", xmlString.substring(0, 500));

  try {
    const result = await parseStringPromise(xmlString, {
      explicitArray: false,
      mergeAttrs: true,
    });

    console.log("[valuecommerce-api] Parsed Result:", JSON.stringify(result, null, 2).substring(0, 500));
    // ...
  } catch (error) {
    console.error("[valuecommerce-api] XML Parse Error:", error);
    console.error("[valuecommerce-api] Full XML:", xmlString); // デバッグ用
    throw error;
  }
}
```

#### 2. xml2jsオプションの調整

```typescript
const result = await parseStringPromise(xmlString, {
  explicitArray: false,   // 配列を強制しない
  mergeAttrs: true,       // 属性をマージ
  trim: true,             // 前後の空白を除去
  normalizeTags: false,   // タグ名を小文字化しない
  xmlns: false,           // xmlns属性を無視
});
```

#### 3. 空レスポンスの処理

```typescript
if (!xmlString || xmlString.trim().length === 0) {
  console.warn("[valuecommerce-api] Empty XML response");
  return {
    orders: [],
    totalCount: 0,
    page: 1,
    count: 0,
  };
}
```

---

### エラー: `No member found for clickId: xxx`

**症状:**
```
[valuecommerce-sync] No member found for order VC-12345678
[valuecommerce-sync] Failed matches: 15
```

**原因:**
- Click ID（`sid`）がクリックログに記録されていない
- `/api/track-click` で `eventId` が正しく設定されていない
- クリックログとの照合ロジックが間違っている

**対処法:**

#### 1. クリックログの確認

```bash
# Google Sheetsで確認
# シート名: クリックログ
# E列（eventId）に sidが記録されているか確認
```

#### 2. `/api/track-click` の修正

```typescript
// app/api/track-click/route.ts
if (aspName === "valuecommerce") {
  const sid = memberId || guestUuid;

  // eventIdにsidを記録
  await writeClickLog({
    timestamp: new Date().toISOString(),
    memberId: memberId || guestUuid,
    dealName,
    dealId,
    eventId: sid, // ← 重要！
  });

  trackingUrl = `${affiliateUrl}&sid=${encodeURIComponent(sid)}`;
}
```

#### 3. 照合ロジックの確認

```typescript
// lib/valuecommerce-api.ts
export async function matchClickIdWithMember(clickId: string): Promise<string | null> {
  const clickLogs: ClickLogRow[] = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");

  // デバッグログ追加
  console.log(`[matchClickIdWithMember] Searching for clickId: ${clickId}`);
  console.log(`[matchClickIdWithMember] Total click logs: ${clickLogs.length}`);

  const matchedLog = clickLogs.find(log => log.eventId === clickId);

  if (matchedLog) {
    console.log(`[matchClickIdWithMember] Match found: ${JSON.stringify(matchedLog)}`);
    return matchedLog.memberId;
  }

  // 部分一致も試す（データ形式が異なる場合）
  const partialMatch = clickLogs.find(log => log.eventId.includes(clickId) || clickId.includes(log.eventId));
  if (partialMatch) {
    console.log(`[matchClickIdWithMember] Partial match found: ${JSON.stringify(partialMatch)}`);
    return partialMatch.memberId;
  }

  console.warn(`[matchClickIdWithMember] No match for clickId: ${clickId}`);
  return null;
}
```

---

## Cronジョブエラー

### エラー: Cronが実行されない

**症状:**
- Vercel Dashboard の「Crons」タブで実行履歴がない
- ログに `[valuecommerce-sync]` が出力されない

**対処法:**

#### 1. vercel.json の確認

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/valuecommerce-sync",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**チェックポイント:**
- ✅ `path` がAPIルートと一致しているか
- ✅ `schedule` がcron式として正しいか
- ✅ `vercel.json` がプロジェクトルートにあるか

#### 2. Vercelデプロイの確認

```bash
# vercel.jsonが反映されているか確認
vercel deploy --prod

# デプロイ後、Vercel Dashboardで確認
# プロジェクト → Settings → Crons
```

#### 3. 手動実行でテスト

```bash
curl -X GET "https://your-app.vercel.app/api/cron/valuecommerce-sync" \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

---

### エラー: `401 Unauthorized` (Cron認証)

**症状:**
```json
{
  "error": "Unauthorized"
}
```

**原因:**
- `CRON_SECRET` 環境変数が設定されていない
- Cronリクエストのヘッダーが正しくない

**対処法:**

#### 1. CRON_SECRET の設定

```bash
# ランダムな秘密鍵生成
openssl rand -base64 32

# Vercel環境変数に追加
vercel env add CRON_SECRET production
# 生成した値を入力
```

#### 2. Cronエンドポイントの認証ロジック確認

```typescript
// app/api/cron/valuecommerce-sync/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  console.log("[valuecommerce-sync] Auth header:", authHeader?.substring(0, 20) + "...");
  console.log("[valuecommerce-sync] Expected token:", expectedToken?.substring(0, 20) + "...");

  if (authHeader !== expectedToken) {
    console.warn("[valuecommerce-sync] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ...
}
```

---

## Google Sheets連携エラー

### エラー: `Google Sheets API error: 429 Quota exceeded`

**症状:**
```
Error: Google Sheets API error: 429 Quota exceeded
at writeConversionData (lib/sheets.ts:200)
```

**原因:**
- Google Sheets APIのクォータ超過（100リクエスト/100秒）

**対処法:**

#### 1. バッチ書き込みの実装

```typescript
// lib/sheets.ts
export async function batchWriteConversionData(
  conversions: ConversionWebhookData[]
): Promise<void> {
  const rows = conversions.map(data => [
    data.timestamp,
    data.trackingId,
    data.eventId,
    data.dealName,
    data.aspName,
    data.rewardAmount,
    data.status,
    data.orderId,
  ]);

  await appendSheet(SHEET_NAMES.RESULT_CSV_RAW, rows); // 1リクエストで複数行追加
}
```

#### 2. Cronロジックの修正

```typescript
// app/api/cron/valuecommerce-sync/route.ts
const conversionsToWrite: ConversionWebhookData[] = [];

for (const order of orders) {
  // ... 重複チェック、照合処理

  conversionsToWrite.push(conversionData);
}

// 一括書き込み（1リクエスト）
if (conversionsToWrite.length > 0) {
  await batchWriteConversionData(conversionsToWrite);
}
```

---

## デバッグ手法

### 1. ローカル環境でのステップ実行

```bash
# 開発サーバー起動
npm run dev

# デバッガー付きで起動（VS Code）
# F5キー → "Next.js: debug full stack" を選択
```

**ブレークポイント設定:**
- `lib/valuecommerce-api.ts:fetchOrderReport()` の最初の行
- `app/api/cron/valuecommerce-sync/route.ts` の GET handler 内

### 2. ログレベルの調整

```typescript
// lib/valuecommerce-api.ts
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("[DEBUG] Request URL:", url.toString());
  console.log("[DEBUG] OAuth Header:", authHeader);
  console.log("[DEBUG] Response:", response.data);
}
```

### 3. Postmanでのテスト

1. Postmanに以下のリクエストを登録:
   - Method: `GET`
   - URL: `https://webservice.valuecommerce.ne.jp/OrderReport?start_date=2025-01-01&end_date=2025-01-04&count=1`
   - Headers:
     - `Authorization`: OAuth署名（`generateOAuthSignature()` の出力を使用）
     - `Accept`: `application/xml`

2. 「Send」をクリックして手動実行

---

## サポート問い合わせ

### ValueCommerceサポート

**メール:** support@valuecommerce.ne.jp

**問い合わせ内容のテンプレート:**

```
件名: [Webサービス API] 注文レポートAPIの認証エラーについて

お世話になっております。
メディア会員ID: vc_xxxxxxxx
サイト名: WIN×Ⅱ

以下の問題が発生しております。

【発生している問題】
注文レポートAPIにて401 Unauthorized エラーが発生します。

【再現手順】
1. OAuth 1.0a署名を生成
2. GET https://webservice.valuecommerce.ne.jp/OrderReport にリクエスト
3. 401エラーが返却される

【エラーメッセージ】
{
  "error": "Unauthorized",
  "message": "Invalid OAuth signature"
}

【試した対処法】
- OAuth認証情報の再生成
- 署名アルゴリズムの確認（HMAC-SHA1）
- 環境変数の再設定

【環境】
- アプリケーション: Next.js 15 (Vercel)
- OAuth Library: oauth-1.0a (npm)
- Consumer Key: vc_xxxxxxxx（最初の10文字のみ）

お手数ですが、ご確認いただけますでしょうか。

よろしくお願いいたします。
```

---

## チェックリスト

実装・運用時の最終確認:

### 認証
- [ ] 環境変数が正しく設定されている
- [ ] OAuth署名が正常に生成される
- [ ] テストリクエストが成功する

### APIリクエスト
- [ ] 日付形式が正しい（YYYY-MM-DD）
- [ ] レート制限を超えていない
- [ ] タイムアウト設定が適切（30秒推奨）

### データ処理
- [ ] XMLパースが成功する
- [ ] Click ID照合ロジックが動作する
- [ ] Google Sheets書き込みが成功する

### Cronジョブ
- [ ] vercel.jsonが正しく設定されている
- [ ] CRON_SECRET が設定されている
- [ ] Vercel Dashboardで実行履歴が確認できる

### 監視
- [ ] エラーログを定期的に確認
- [ ] Google Sheetsのデータ増加を確認
- [ ] Cron実行頻度が適切か確認

---

## 参考リンク

- [ValueCommerce Webサービス FAQ](https://www.valuecommerce.ne.jp/webservice/faq/)
- [認証設定ガイド](./authentication-setup.md)
- [注文レポートAPI実装ガイド](./order-api-guide.md)
- [ASP統合プロジェクト概要](../README.md)

---

_Last Updated: 2025-01-04_
_Document Version: 1.0.0_
_Maintained by: WIN×Ⅱ Development Team_
