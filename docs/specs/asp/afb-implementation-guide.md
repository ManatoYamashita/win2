# AFBリアルタイムポストバック実装ガイド

**最終更新日:** 2025-01-04
**ステータス:** 実装準備完了
**優先度:** 最優先

---

## 概要


### なぜAFB優先なのか？

- **A8.net制限**: Media Member契約では個別成果データにアクセスできない（詳細: `docs/specs/asp/a8net-api.md`）
- **AFBの優位性**: リアルタイムポストバック公式対応、会員別トラッキング可能
- **実装難易度**: 低（Webhookエンドポイント作成のみ）
- **所要時間**: 2-3日で完成可能

---

## AFBポストバック仕様

### エンドポイント形式

AFBからのポストバックは **GETリクエスト** で送信されます。

```
https://yourdomain.com/api/webhooks/afb-postback?paid={trackingId}&u={eventId}&price={rewardAmount}&judge={status}&adid={adId}&time={timestamp}
```

### パラメータ仕様

| パラメータ | 説明 | 例 | 必須 |
|----------|------|------|------|
| `paid` | トラッキングID（memberId or guest:UUID） | `abc123-def456` | ✅ |
| `u` | AFB成果ID（ユニークキー） | `987654321` | ✅ |
| `price` | 報酬額（円） | `1000` | ✅ |
| `judge` | ステータス（0:未承認, 1:承認, 9:非承認） | `1` | ✅ |
| `adid` | 広告ID | `12345` | ⚠️ |
| `time` | 成果発生日時（YYYY-MM-DD HH:mm:ss） | `2025-01-04 15:30:00` | ⚠️ |

**注意:**
- `paid` パラメータは `/api/track-click` で自動的に付与されます（実装済み）
- `u` (eventId) もクリック時に自動生成されます
- `judge` の値変化により、成果ステータスが更新されます

### ステータス変換ロジック

```typescript
const statusMap: Record<string, "pending" | "approved" | "cancelled"> = {
  "0": "pending",    // 未承認（成果発生）
};
```

---

## 実装手順

### Phase 1: AFB管理画面設定

#### 1.1 AFBアカウントにログイン

- URL: https://www.afi-b.com/
- 認証情報: `docs/specs/asp.md` を参照

#### 1.2 ポストバックURL設定

1. AFB管理画面 → 「ツール」 → 「ポストバック設定」
2. 以下のURLを登録:

```
開発環境: http://localhost:3000/api/webhooks/afb-postback
本番環境: https://yourdomain.com/api/webhooks/afb-postback
```

3. **通知タイプ**: 全て選択（成果発生、承認、却下）
4. **再送設定**: ON（最大3回リトライ）
5. **テストモード**: ONでテスト実行

#### 1.3 IPアドレス確認

AFB本番環境のIPアドレス: **13.114.169.190**

（テスト環境のIPは要確認）

---

### Phase 2: Webhookエンドポイント実装

#### 2.1 ファイル作成: `app/api/webhooks/afb-postback/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeConversionData, isDuplicateConversion } from "@/lib/sheets";

// AFBからのポストバック許可IP
const ALLOWED_IPS = process.env.NODE_ENV === "production"
  ? ["13.114.169.190"]
  : ["127.0.0.1", "::1"]; // 開発環境

export async function GET(request: NextRequest) {
  try {
    // 1. IPホワイトリストチェック
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0] ||
                     request.headers.get("x-real-ip") ||
                     "unknown";

    if (process.env.NODE_ENV === "production" && !ALLOWED_IPS.includes(clientIP)) {
      console.warn(`[AFB Postback] Blocked IP: ${clientIP}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. パラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const paid = searchParams.get("paid");        // trackingId (memberId or guest:UUID)
    const eventId = searchParams.get("u");        // AFB成果ID
    const price = searchParams.get("price");      // 報酬額
    const judge = searchParams.get("judge");      // ステータス
    const adid = searchParams.get("adid");        // 広告ID
    const time = searchParams.get("time");        // 成果発生日時

    // 3. バリデーション
    if (!paid || !price || !judge) {
      console.error("[AFB Postback] Missing required parameters", {
        paid, price, judge, eventId
      });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 4. 重複チェック
    if (eventId && await isDuplicateConversion(eventId)) {
      console.log(`[AFB Postback] Duplicate conversion ignored: ${eventId}`);
      return NextResponse.json({ status: "duplicate" }, { status: 200 });
    }

    // 5. ステータス変換
    const statusMap: Record<string, "pending" | "approved" | "cancelled"> = {
      "0": "pending",
      "1": "approved",
      "9": "cancelled",
    };
    const status = statusMap[judge] || "pending";

    // 6. Google Sheetsに記録
    await writeConversionData({
      trackingId: paid,
      eventId: eventId || undefined,
      dealName: `AFB広告${adid || "不明"}`,  // 後でクリックログから取得
      aspName: "afb",
      rewardAmount: parseFloat(price),
      status: status,
      timestamp: time || new Date().toISOString(),
    });

    console.log(`[AFB Postback] Success: trackingId=${paid}, eventId=${eventId}, price=${price}, status=${status}`);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("[AFB Postback] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### 2.2 Google Sheets関数追加: `lib/sheets.ts`

```typescript
/**
 * 成果データを成果CSV_RAWシートに書き込む
 */
export async function writeConversionData(data: {
  trackingId: string;       // A列: id1
  eventId?: string;         // B列: eventId
  dealName: string;         // C列: 案件名
  aspName: string;          // D列: ASP名
  rewardAmount: number;     // E列: 報酬額
  status: "pending" | "approved" | "cancelled";  // F列: ステータス
  timestamp: string;        // G列: 成果発生日時
}): Promise<void> {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

  // ステータス変換（日本語）
  const statusJa: Record<string, string> = {
    pending: "未承認",
    approved: "承認",
    cancelled: "却下",
  };

  const row = [
    data.trackingId,           // A列: id1
    data.eventId || "",        // B列: eventId
    data.dealName,             // C列: 案件名
    data.aspName,              // D列: ASP名
    data.rewardAmount,         // E列: 報酬額
    statusJa[data.status],     // F列: ステータス
    data.timestamp,            // G列: 成果発生日時
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAMES.RESULT_CSV_RAW}!A:G`,
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  });

  console.log(`[Google Sheets] Conversion data written: ${data.trackingId}`);
}

/**
 * 重複チェック（eventIDベース）
 */
export async function isDuplicateConversion(eventId: string): Promise<boolean> {
  const rows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:L");
  return rows.some(row => row[1] === eventId); // B列: eventId
}
```

---

### Phase 3: セキュリティ強化

#### 3.1 環境変数設定

`.env.local` に以下を追加:

```bash
# AFB API Credentials
AFB_PARTNER_ID=your_afb_partner_id_here
AFB_API_KEY=your_afb_api_key_here

# Webhook Security
AFB_ALLOWED_IPS=13.114.169.190
```

#### 3.2 署名検証（推奨・将来実装）

AFBが署名パラメータを提供している場合、以下のような検証を追加:

```typescript
import crypto from "crypto";

function verifyAFBSignature(params: URLSearchParams, signature: string): boolean {
  const secret = process.env.AFB_API_KEY!;
  const data = Array.from(params.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  return signature === expectedSignature;
}
```

---

### Phase 4: テスト

#### 4.1 ローカルテスト

```bash
# 開発サーバー起動
npm run dev

# cURLでテストリクエスト送信
curl "http://localhost:3000/api/webhooks/afb-postback?paid=test-member-123&u=event-456&price=1000&judge=1&adid=789&time=2025-01-04%2015:30:00"

# Google Sheetsの成果CSV_RAWシートを確認
```

#### 4.2 AFBテスト環境でのE2Eテスト

1. AFBテスト案件でクリック発生（`/api/track-click`経由）
2. AFBテスト環境からポストバック送信
3. Google Sheetsに成果データが記録されることを確認
4. GASスクリプト実行（3:10または手動）

#### 4.3 本番環境デプロイ前チェックリスト

- [ ] `.env.local` にAFB認証情報設定済み
- [ ] Vercel環境変数設定済み（`AFB_PARTNER_ID`, `AFB_API_KEY`, `AFB_ALLOWED_IPS`）
- [ ] Google Sheetsの成果CSV_RAWシート構造確認（A~G列）
- [ ] IPホワイトリスト実装確認
- [ ] 重複チェック実装確認
- [ ] エラーログ実装確認
- [ ] AFB管理画面でポストバックURL登録済み

---

## データフロー

```
1. ユーザーがブログ記事のCTAボタンをクリック
   ↓
2. /api/track-click でクリックログ記録（Google Sheets: クリックログシート）
   - trackingId (memberId or guest:UUID) 生成
   - eventId (UUID v4) 生成
   ↓
3. AFBアフィリエイトURLにリダイレクト
   - パラメータ: ?paid={trackingId}&eventId={eventId}
   ↓
4. ユーザーがAFB案件に申し込み・購入
   ↓
5. AFBからポストバック送信
   - URL: /api/webhooks/afb-postback
   - パラメータ: paid, u, price, judge, adid, time
   ↓
6. Webhookエンドポイントで成果データ記録（Google Sheets: 成果CSV_RAWシート）
   - trackingId, eventId, dealName, aspName, rewardAmount, status, timestamp
   ↓
7. GASスクリプト自動実行（毎日3:10）
   - 成果CSV_RAWシートから未処理データ取得
   - クリックログシートと突合（trackingIdベース）
   ↓
8. 成果データシートに出力
   ↓
9. 会員がマイページで確認（/mypage/history）
```

---

## トラブルシューティング

### ポストバックが届かない

**チェック項目:**
1. AFB管理画面でポストバックURL設定確認
2. Vercelのログ確認（`vercel logs --follow`）
3. IPホワイトリストにAFBのIPが含まれているか確認
4. AFBテストモードで手動送信テスト

**解決策:**
- AFBサポートに問い合わせ（ポストバック送信履歴確認）
- Webhookエンドポイントのステータスコード確認（200を返しているか）

### 重複データが記録される

**原因:**
- AFBの再送機能により、同じ成果が複数回送信される

**解決策:**
- `isDuplicateConversion()` 関数でeventIDベースの重複チェック実装済み
- ステータスが変化した場合（未承認→承認）は、既存データを更新する必要あり（将来実装）

### IPホワイトリストで本番環境がブロックされる

**原因:**
- Vercelのプロキシ経由でリクエストが届く場合、`x-forwarded-for`ヘッダーを適切に処理していない

**解決策:**
```typescript
const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
                 request.headers.get("x-real-ip") ||
                 "unknown";
```

### Google Sheetsへの書き込みエラー

**チェック項目:**
1. サービスアカウントがスプレッドシートに共有されているか確認
2. 成果CSV_RAWシートの列構造確認（A~G列）
3. 環境変数 `GOOGLE_SHEETS_SPREADSHEET_ID` 確認

**解決策:**
- エラーログ確認（`console.error` の出力）
- Google Sheets API のクォータ確認（1日の書き込み上限）

---

## 運用ドキュメント

### 日次モニタリング

**確認項目:**
1. Vercelログで `/api/webhooks/afb-postback` のリクエスト数確認
2. Google Sheets「成果CSV_RAW」シートのデータ確認
3. GASスクリプト実行ログ確認（3:10実行結果）
4. 会員向けマイページで成果データ表示確認

### 週次メンテナンス

**作業項目:**
1. AFB管理画面で成果データとの整合性確認
2. 異常データ（重複、欠損）のチェック
3. Google Sheetsのデータ容量確認（1000行超えたらアーカイブ）

### 月次レポート

**集計項目:**
1. 総成果件数（承認/未承認/却下）
3. 会員別ランキング
4. 案件別パフォーマンス

---

## 関連ドキュメント

- `docs/specs/asp/a8net-api.md` - A8.net制限事項とMedia Member契約の詳細
- `docs/specs/asp/afb-postback.md` - AFBポストバック仕様の詳細調査
- `docs/specs/google.md` - Google Sheets構造とGASスクリプト
- `CLAUDE.md` - プロジェクト全体のアーキテクチャ

---

## 今後の拡張

### ステータス更新の自動反映

現在の実装では、成果のステータスが変化した場合（未承認→承認）、新しい行として追加されます。

**将来実装:**
- eventIDをキーに既存データを検索
- ステータスが変化した場合、既存行を更新
- 変更履歴を別シートに記録

### 案件名の自動取得

現在の実装では、`dealName` が `AFB広告{adid}` として記録されます。

**将来実装:**
- クリックログシートのeventIDと突合
- 実際の案件名を取得
- Google Sheetsに記録

### エラー通知

**将来実装:**
- Webhookエンドポイントでエラー発生時、Slack/Email通知
- 重要なエラー（Google Sheets書き込み失敗等）をアラート
- Sentry等のエラートラッキングサービス統合

---

**作成日:** 2025-01-04
**作成者:** Claude Code
**ステータス:** 実装準備完了