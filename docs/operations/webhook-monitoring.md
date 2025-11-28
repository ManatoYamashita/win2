# ASP Webhook運用・監視ガイド

**Last Updated:** 2025-01-03

## 概要

本ドキュメントは、ASP（Affiliate Service Provider）Webhookの運用・監視方法、トラブルシューティング、およびデータ確認手順をまとめたものです。

Webhookエンドポイント：`POST /api/webhooks/asp-conversion?asp={aspName}`

---

## 1. Webhook受信フロー

### 正常フロー

```
ASP → Webhook送信 → /api/webhooks/asp-conversion
  ↓
署名検証（HMAC-SHA256）
  ↓
ペイロードバリデーション（Zod）
  ↓
eventIdでクリックログ検索
  ↓
Google Sheets「成果CSV_RAW」に記録
  ↓
200 OK返却
  ↓
GAS自動処理（毎日3:10）
  ↓
```

### エラーフロー

```
署名検証失敗 → 401 Unauthorized
ペイロードバリデーション失敗 → 400 Bad Request
Google Sheets書き込み失敗 → 500 Internal Server Error
```

---

## 2. ログ確認方法

### Vercelログの確認

本番環境（Vercel）でのログ確認手順：

1. Vercel Dashboardにログイン
2. プロジェクト選択: **win2**
3. **Logs** タブを選択
4. フィルター設定:
   ```
   Path: /api/webhooks/asp-conversion
   ```

### 重要なログメッセージ

#### 成功時

```
[asp-webhook] Received webhook from ASP: afb
[asp-webhook] Signature verified successfully
[asp-webhook] Payload validated: { id1: "member-123", eventId: "...", reward: 10000, status: "pending" }
[asp-webhook] Click log found: { eventId: "...", memberId: "...", dealName: "..." }
[writeConversionData] Successfully recorded conversion: { trackingId: "...", dealName: "...", status: "pending", rewardAmount: 10000 }
[asp-webhook] Conversion recorded successfully
```

#### エラー時

```
[asp-webhook] Missing signature header
[asp-webhook] Invalid signature for ASP: afb
[asp-webhook] Validation failed: { id1: ["Required"], reward: ["Expected number, received string"] }
[asp-webhook] Click log not found for eventId: xxx-xxx-xxx
[writeConversionData] Error writing conversion data: Error: ...
```

---

## 3. Google Sheets確認方法

### 成果CSV_RAWシート

Webhookで記録されたデータを確認：

**シート構成:**

| A列 | B列 | C列 | D列 | E列 | F列 | G列 | H列 |
|-----|-----|-----|-----|-----|-----|-----|-----|
| 日時 | 追跡ID | イベントID | 案件名 | ASP名 | 報酬額 | 承認状況 | 注文ID |

**確認ポイント:**
- 追跡ID（B列）が`guest:`で始まる場合、非会員の成果
- イベントID（C列）がクリックログと一致するか確認
- 承認状況（G列）が`pending`, `approved`, `cancelled`のいずれか

### クリックログシート

eventIdでクリックログを確認：

**シート構成:**

| A列 | B列 | C列 | D列 | E列 |
|-----|-----|-----|-----|-----|
| 日時 | memberId | 案件名 | 案件ID | イベントID |

**確認ポイント:**
- E列（イベントID）でWebhookのeventIdを検索
- B列（memberId）で会員IDを確認

### 成果データシート


**シート構成:**

| A列 | B列 | C列 | D列 | E列 | F列 | G列 |
|-----|-----|-----|-----|-----|-----|-----|

**確認ポイント:**

---

## 4. トラブルシューティング

### 4.1 署名検証エラー（401 Unauthorized）

**原因:**
- 環境変数`AFB_WEBHOOK_SECRET`が設定されていない
- 署名が不正（シークレットキーの不一致）
- ASP側のシークレットキーが変更された

**対処法:**

1. Vercel環境変数を確認
   ```bash
   vercel env pull .env.local
   ```

2. `.env.local`で`AFB_WEBHOOK_SECRET`の値を確認

3. afb管理画面でシークレットキーが変更されていないか確認

4. 署名ヘッダー名が正しいか確認（`x-afb-signature`, `x-signature`等）

5. ローカルで署名検証をテスト
   ```bash
   npm run dev
   # ngrokでローカルエンドポイントを公開してテスト
   ```

### 4.2 ペイロードバリデーションエラー（400 Bad Request）

**原因:**
- ASPから送信されるペイロード構造が想定と異なる
- 必須フィールドが欠落している
- データ型が不正（数値が文字列など）

**対処法:**

1. Vercelログで実際のペイロードを確認

2. `lib/validations/asp-webhook.ts`のスキーマを調整
   ```typescript
   // 例: rewardが文字列で送信される場合
   reward: z.union([
     z.number(),
     z.string().transform((val) => parseFloat(val))
   ])
   ```

3. afb管理画面でWebhookペイロード例を確認

4. テスト環境で実際のペイロードを送信してバリデーションを検証

### 4.3 クリックログが見つからない（Warning）

**原因:**
- eventIdが一致しない（クリック記録前にWebhookが送信された）
- クリックログの記録に失敗した
- eventIdがWebhookに含まれていない

**対処法:**

1. Google Sheets「クリックログ」でeventIdを検索

2. eventIdが記録されていない場合、`/api/track-click`のログを確認

3. eventIdがWebhookに含まれていない場合、id1のみで処理（memberIdを直接使用）

4. ASP側の設定で、eventIdパラメータが含まれるように設定

**注意:** eventIdが見つからない場合でも、Webhookのid1パラメータを使用してデータは記録されます。

### 4.4 Google Sheets書き込みエラー（500 Internal Server Error）

**原因:**
- Google Sheets APIの認証エラー
- スプレッドシートIDが不正
- APIクォータ超過
- シート名が変更された

**対処法:**

1. 環境変数を確認
   ```
   GOOGLE_SHEETS_CLIENT_EMAIL
   GOOGLE_SHEETS_PRIVATE_KEY
   GOOGLE_SHEETS_SPREADSHEET_ID
   ```

2. サービスアカウントがスプレッドシートへのアクセス権を持っているか確認

3. Google Sheets APIクォータを確認
   - [Google Cloud Console](https://console.cloud.google.com/apis/api/sheets.googleapis.com/quotas)

4. シート名が正しいか確認（`lib/sheets.ts`の`SHEET_NAMES`定数）

5. ローカルで`lib/sheets.ts`の関数を直接テスト

---

## 5. 監視項目

### 5.1 必須監視項目

| 項目 | 監視頻度 | 正常値 | 異常時対応 |
|------|----------|--------|------------|
| Webhook受信成功率 | リアルタイム | 95%以上 | ログ確認・署名検証確認 |
| 署名検証成功率 | リアルタイム | 100% | シークレットキー確認 |
| Google Sheets書き込み成功率 | リアルタイム | 99%以上 | API認証・クォータ確認 |
| GAS処理実行状況 | 毎日3:30 | 毎日正常実行 | GASログ確認 |
| eventIdマッチング率 | 毎日 | 90%以上 | クリックログ記録状況確認 |

### 5.2 推奨監視項目

| 項目 | 監視頻度 | 正常値 | 異常時対応 |
|------|----------|--------|------------|
| Webhook受信件数 | 毎時 | 予測件数±30% | ASP側の設定確認 |
| 平均レスポンス時間 | リアルタイム | 500ms以下 | パフォーマンス最適化 |
| エラーログ頻度 | 毎時 | 10件未満 | エラー内容の分析 |

---

## 6. 定期確認タスク

### 毎日

- [ ] GAS処理実行確認（3:10実行、3:30確認）
- [ ] 成果データシートの更新確認
- [ ] エラーログの確認（Vercel Dashboard）

### 毎週

- [ ] Webhook受信成功率の確認
- [ ] eventIdマッチング率の確認
- [ ] Google Sheets APIクォータ使用量の確認

### 毎月

- [ ] ASP管理画面でWebhook設定の確認
- [ ] シークレットキーのローテーション検討
- [ ] ドキュメントの更新

---

## 7. よくある質問（FAQ）

### Q1: Webhookが受信されない

**A:** 以下を確認してください：

1. ASP管理画面でWebhook URLが正しく設定されているか
   - 正: `https://yourdomain.com/api/webhooks/asp-conversion?asp=afb`
   - 誤: `http://localhost:3000/api/webhooks/asp-conversion` (開発環境URL)

2. Vercelデプロイが最新状態か

3. ASP側でWebhook送信が有効化されているか

4. Webhook URLがHTTPSであるか（HTTPは不可）

### Q2: 署名検証が常に失敗する

**A:** 以下を確認してください：

1. 環境変数`AFB_WEBHOOK_SECRET`が正しく設定されているか

2. ASP管理画面のシークレットキーと一致しているか

3. 署名ヘッダー名が正しいか（`x-afb-signature`, `x-signature`等）

4. ペイロードの文字エンコーディングが一致しているか（UTF-8推奨）

### Q3: eventIdが見つからないという警告が出る

**A:** これは必ずしもエラーではありません：

- クリック記録前にWebhookが送信された場合に発生
- id1パラメータを使用してデータは記録されます
- クリックログ記録の遅延を短縮する対策を検討


**A:** これは正常な動作です：

- `guest:`で始まる追跡IDは非会員
- 成果自体は記録されます

### Q5: GAS処理が実行されない

**A:** 以下を確認してください：

1. Google Apps Scriptエディタでトリガー設定を確認
   - [GASエディタリンク](https://script.google.com/macros/s/AKfycbw.../edit)

2. トリガーが有効化されているか

3. GAS実行ログを確認（エラーがないか）

4. スプレッドシートの権限が正しいか

---

## 8. パフォーマンス最適化

### レスポンス時間改善

現在の目標: 500ms以下

**最適化手法:**

1. **非同期処理の導入**
   - Google Sheets書き込みを非同期化
   - レスポンスを先に返却、バックグラウンドで処理

2. **キャッシュの活用**
   - クリックログの検索をキャッシュ
   - 案件マスタのキャッシュ

3. **バッチ処理の検討**
   - 複数のWebhookをまとめて処理
   - Google Sheets APIのバッチ書き込み

### Google Sheets APIクォータ対策

**クォータ制限:**
- 読み取り: 500リクエスト/100秒/ユーザー
- 書き込み: 500リクエスト/100秒/ユーザー

**対策:**

1. バッチ書き込みの利用
2. キャッシュの活用
3. 必要な場合、APIクォータの増加申請

---

## 9. セキュリティ対策

### 必須セキュリティ対策

1. **署名検証の必須化**
   - すべてのWebhookで署名検証を実施
   - 署名なしのリクエストは401で拒否

2. **シークレットキーの管理**
   - 環境変数で管理（コードに直接記述しない）
   - 定期的なローテーション（3ヶ月毎推奨）

3. **IPホワイトリスト（推奨）**
   - ASP側のIPアドレスを制限
   - `verifyIpWhitelist`関数の活用

4. **HTTPS必須**
   - Webhook URLはHTTPSのみ
   - HTTPは絶対に使用しない

### 推奨セキュリティ対策

1. Rate Limiting（レート制限）
2. リクエストサイズ制限
3. 異常検知アラート
4. 定期的な監査ログのレビュー

---

## 10. 緊急時対応

### Webhook受信が完全に停止した場合

1. **即時対応:**
   - Vercelステータスページを確認
   - デプロイメントログを確認
   - 環境変数の設定を確認

2. **一時対応:**
   - ASP管理画面でWebhookを一時停止
   - 手動CSV処理に切り替え

3. **恒久対応:**
   - 原因特定と修正
   - テスト実施
   - Webhook再有効化

### Google Sheets APIエラーが継続する場合

1. **即時対応:**
   - エラー内容の特定（認証・クォータ・アクセス権）
   - 必要に応じて手動記録

2. **一時対応:**
   - Webhook受信をログファイルに記録
   - 後で一括処理

3. **恒久対応:**
   - APIクォータ増加申請
   - 代替ストレージの検討（Cloud SQL等）

---

## 11. 関連ドキュメント

- [ASP API Integration Guide](../asp-api-integration.md)
- [Webhook Flow Architecture](../architecture/webhook-flow.md)
- [Google Sheets Specification](../specs/google.md)
- [CLAUDE.md](../../CLAUDE.md)

---

**Document Status:** Initial version

**Last Reviewed:** 2025-01-03
**Next Review:** 2025-02-03