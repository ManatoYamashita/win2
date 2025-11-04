# ASP統合実装 - セッション引き継ぎドキュメント

**作成日:** 2025-01-03
**更新日:** 2025-11-03（ポストバック統合実装完了）
**ブランチ:** `feature/asp-webhook-integration`
**最終コミット:** `8bfbef9 FEAT: AFB APIクライアント実装`

---

## ⚠️ 【重要】AFB統合実装 - 一旦中断（2025-11-04）

**中断理由:**
- AFBのアカウント登録申請が失敗したため、ポストバック統合は一旦中断いたします。

**実装完了済み:**
- ✅ AFBポストバック型定義（types/afb-postback.ts）
- ✅ Webhook受信エンドポイント（app/api/webhooks/afb-postback/route.ts）
- ✅ クリックトラッキング修正（&paidパラメータ追加）
- ✅ ローカルテスト成功（成果記録・重複スキップ確認）
- ✅ APIポーリング実装（バックアップ用として保持）

**実装状態:**
- コードはすべて保持されており、いつでも再開可能です。
- ドキュメントのみ「中断」状態として記録しております。

**再開時の手順:**
1. AFBアカウント登録を再申請
2. AFB管理画面でサイトIDを確認
3. AFBポストバック申請フォームを送信
4. 承認後、疎通テストを実施

**詳細:** `docs/handoff/afb-postback-integration.md` を参照

---

## 🎉 ポストバック統合実装完了（2025-11-03）- 本番運用保留中

**発見:**
- AFBは明確に**リアルタイムポストバックをサポート**しており、`paid`パラメータで会員IDを直接取得可能
- APIポーリング方式は情報不足による誤判断でした
- ポストバック方式なら、推測マッチングアルゴリズムは**不要**

---

## 📋 現在の進捗状況（フェーズ1: APIポーリング 100%完了、ポストバック統合 100%完了）

### ✅ 完了した実装

#### 1. 方針転換のクリーンアップ
- **コミット:** `4409a7d REFACTOR: ASP統合方針変更 - Webhookからポーリング方式へ`
- **削除ファイル:**
  - `app/api/webhooks/asp-conversion/route.ts`（Webhook受信エンドポイント）
  - `lib/webhooks/verify-signature.ts`（署名検証）
  - `lib/validations/asp-webhook.ts`（Webhookバリデーション）
- **理由:** AFB APIはリアルタイムWebhookではなくGET APIであり、カスタムパラメータ（id1, eventId）がレスポンスに含まれないため

#### 2. AFB API基盤実装
- **コミット:** `8bfbef9 FEAT: AFB APIクライアント実装`
- **追加ファイル:**
  - `types/afb-api.ts`: AFB成果データAPIの完全な型定義
  - `lib/asp/afb-client.ts`: AFB APIクライアント実装
- **主要関数:**
  - `fetchAfbConversions()`: 基本的な成果データ取得
  - `fetchAfbConversionsByDateRange()`: 日付範囲指定
  - `fetchAfbConversionsLastNDays()`: 過去N日間取得
  - `fetchAfbPendingAndApprovedConversions()`: 未承認・承認済み取得

#### 3. 環境変数設定
- **更新ファイル:** `.env.example`
- **追加変数:**
  - `AFB_PARTNER_ID`: パートナーID
  - `AFB_API_KEY`: APIキー（authorizationtoken）

---

## 🔜 次回セッションで実装すべきタスク

### フェーズ1続き: APIポーリング実装（残り50%、推定2-3時間）

#### タスク1: Vercel Cronジョブ実装
**ファイル:** `app/api/cron/sync-afb-conversions/route.ts`

```typescript
// 実装内容:
// - 10分毎or1時間毎にAFB APIをポーリング
// - 過去7日間の成果データを取得
// - 取得データをGoogle Sheets「成果CSV_RAW」に記録
// - 重複チェック（commit_idで判定）
// - エラーハンドリングとリトライロジック
```

**参考:**
- Vercel Cron: https://vercel.com/docs/cron-jobs
- 既存実装: `lib/asp/afb-client.ts` の `fetchAfbConversionsLastNDays()`
- Google Sheets書き込み: `lib/sheets.ts` の `writeConversionData()`

#### タスク2: vercel.json設定
**ファイル:** `vercel.json`（新規作成 or 既存更新）

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-afb-conversions",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**注意:**
- 開発環境では動作しない（本番環境のみ）
- ローカルテストは手動でエンドポイントを叩く

#### タスク3: 自動マッチングアルゴリズム実装
**ファイル:** `lib/matching/conversion-matcher.ts`

```typescript
// 実装内容:
// - クリックログ（Google Sheets）と成果データを照合
// - マッチングロジック:
//   1. 時間範囲でフィルター（クリック時刻 ± 24時間）
//   2. 案件名の部分一致
//   3. 報酬額の妥当性チェック（案件マスタの報酬額と比較）
// - マッチング精度スコア計算（0-100%）
//   - 90%以上: 自動承認候補
//   - 70-89%: 要確認
//   - 70%未満: 手動割り当て
// - 複数候補がある場合の処理
```

**参考:**
- クリックログ取得: `lib/sheets.ts` の `readSheet(SHEET_NAMES.CLICK_LOG)`
- 案件マスタ取得: `lib/sheets.ts` の `getDealById()`

---

### フェーズ2: 管理画面実装（推定3-4時間）

#### タスク4: 成果確認ページ
**ファイル:** `app/admin/conversions/page.tsx`

```typescript
// 実装内容:
// - 未確認成果一覧表示（Table形式）
// - マッチング候補の表示（クリックログとの照合結果）
// - フィルター機能（日付、ASP、承認状態）
// - ページネーション（50件/ページ）
// - 一括承認ボタン（スコア90%以上のみ）
// - 認証チェック（管理者のみアクセス可）
```

#### タスク5: 成果詳細・編集ページ
**ファイル:** `app/admin/conversions/[id]/page.tsx`

```typescript
// 実装内容:
// - 成果詳細情報の表示
// - マッチング候補リスト（スコア順）
// - 手動でmemberIdを割り当て（ドロップダウン）
// - 承認・却下ボタン
// - メモ欄の編集
// - 履歴表示（誰がいつ編集したか）
```

#### タスク6: 管理画面API
**ファイル:** `app/api/admin/conversions/*`

```typescript
// 実装エンドポイント:
// - GET /api/admin/conversions: 成果一覧取得
// - GET /api/admin/conversions/[id]: 詳細取得
// - PUT /api/admin/conversions/[id]: 承認・却下・編集
// - POST /api/admin/conversions/[id]/match: 手動マッチング

// 認証:
// - getServerSession(authOptions)でセッション確認
// - session.user.role === "admin" チェック
// - 403エラーで拒否
```

---

### フェーズ3: ドキュメント更新（推定1時間）

#### タスク7: ASP統合ドキュメント更新
**ファイル:** `docs/asp-api-integration.md`

```markdown
// 更新内容:
// - AFB Webhook → AFB API Polling に変更
// - 手動運用フローの追記
// - マッチングアルゴリズムの説明
// - トラブルシューティング追加
```

#### タスク8: 運用マニュアル作成
**ファイル:** `docs/operations/conversion-approval-workflow.md`

```markdown
// 記載内容:
// - 成果確認の手順（毎日のタスク）
// - マッチング精度の判断基準
// - 手動割り当ての方法
// - トラブルシューティング
// - よくある質問（FAQ）
```

---

## 🔑 環境変数の取得方法

### AFB管理画面へのアクセス

```
URL: https://www.afi-b.com/
ID: ohshiro-group
PW: kanri1993
```

### 取得すべき情報

1. **パートナーID（AFB_PARTNER_ID）**
   - 場所: パートナー管理画面のURL or プロフィールページ
   - 形式: 半角英数字（例: `9999`）

2. **APIキー（AFB_API_KEY）**
   - 場所: 「API設定」または「API連携」メニュー
   - 発行方法: 「APIキー発行」ボタンをクリック
   - 形式: 長い英数字文字列（例: `abcd1234efgh5678...`）

### 環境変数設定

#### 開発環境（ローカル）
```bash
# .env.localファイルを作成
cp .env.example .env.local

# 以下を.env.localに追記
AFB_PARTNER_ID=取得したパートナーID
AFB_API_KEY=取得したAPIキー
```

#### 本番環境（Vercel）
```bash
# Vercel CLIで設定
vercel env add AFB_PARTNER_ID
vercel env add AFB_API_KEY

# または Vercel Dashboard → Settings → Environment Variables
```

---

## 🧪 テスト方法

### ローカルでのAPIクライアントテスト

```bash
# 開発サーバー起動
npm run dev

# 別ターミナルで簡単なテストスクリプト実行
# （次回セッションで作成）
node scripts/test-afb-api.js
```

### Cronジョブのテスト

```bash
# ローカルでエンドポイントを直接叩く
curl http://localhost:3000/api/cron/sync-afb-conversions

# または Vercel Dashboard → Deployments → [最新デプロイ] → Crons
```

### Google Sheets確認

```
1. Google Sheets「成果CSV_RAW」シートを開く
2. 最新行にAFBから取得したデータが記録されているか確認
3. 列構成:
   A: 日時
   B: 追跡ID（空白 or 仮の値）
   C: イベントID（空白）
   D: 案件名（adv_name）
   E: ASP名（"afb"）
   F: 報酬額（margin）
   G: 承認状況（commit_flgを変換）
   H: 注文ID（commit_id）
```

---

## 💡 重要な技術的決定事項

### 1. Webhook → Polling方式への変更

**理由:**
- AFB APIはリアルタイムWebhookではなくGET API
- カスタムパラメータ（id1, eventId）がレスポンスに含まれない
- メディア会員の立場では個別成果追跡に制限がある

**影響:**
- 完全自動マッチングは不可能
- 推測マッチング + 手動確認フローが必要
- リアルタイム性は失われる（10分〜1時間遅延）

### 2. マッチングアルゴリズムの設計

**アプローチ:**
```
1. 時間ベースフィルター
   - クリックログの visit_time と成果データの commit_time を比較
   - ± 24時間以内のものを候補とする

2. 案件名の部分一致
   - クリックログの dealName と成果データの adv_name を比較
   - 完全一致: +40点
   - 部分一致: +20点

3. 報酬額の妥当性チェック
   - 案件マスタの rewardAmount と成果データの margin を比較
   - 一致: +30点
   - 許容範囲内（±10%）: +15点

4. デバイス・リファラ（将来拡張）
   - device, ref, keyword を活用してスコアを向上

合計100点満点でスコア計算
```

### 3. Google Sheetsのスキーマ変更

**成果CSV_RAWシートの拡張:**

| 列 | 項目 | 説明 |
|----|------|------|
| A | 日時 | 成果発生日時 |
| B | 追跡ID | クリックログとマッチング後に設定 |
| C | イベントID | （AFB APIでは取得不可、空白） |
| D | 案件名 | adv_name |
| E | ASP名 | "afb" |
| F | 報酬額 | margin |
| G | 承認状況 | commit_flg変換（pending/approved/cancelled） |
| H | 注文ID | commit_id（AFB固有ID） |
| **I** | **マッチングスコア** | **0-100（新規追加）** |
| **J** | **マッチングステータス** | **未確認/確認済み/却下（新規追加）** |
| **K** | **確認者** | **管理者のemail（新規追加）** |
| **L** | **確認日時** | **ISO8601形式（新規追加）** |

**注意:** 次回セッションでGoogle Sheetsに列を追加する必要があります。

---

## 📂 ファイル構成（現在）

```
win2/
├── app/
│   └── api/
│       └── track-click/
│           └── route.ts（既存：クリックログ記録）
├── lib/
│   ├── asp/
│   │   └── afb-client.ts（新規：AFB APIクライアント）
│   └── sheets.ts（既存：Google Sheets操作）
├── types/
│   └── afb-api.ts（新規：AFB API型定義）
├── docs/
│   ├── asp-api-integration.md（要更新）
│   ├── architecture/
│   │   └── webhook-flow.md（参考のみ、実装方針変更済み）
│   ├── operations/
│   │   └── webhook-monitoring.md（参考のみ、実装方針変更済み）
│   └── handoff/
│       └── asp-integration-session-handoff.md（本ファイル）
└── .env.example（更新済み：AFB_PARTNER_ID, AFB_API_KEY追加）
```

---

## 📝 Todoリスト（次回セッション）

### 優先度: 高

- [ ] AFB管理画面にログインしてAPIキー取得
- [ ] 環境変数設定（ローカル・本番）
- [ ] Vercel Cronジョブ実装
- [ ] vercel.json設定
- [ ] 自動マッチングアルゴリズム実装
- [ ] Google Sheetsに列追加（マッチングスコア、ステータス等）

### 優先度: 中

- [ ] 管理画面実装（成果確認ページ）
- [ ] 管理画面実装（成果詳細・編集ページ）
- [ ] 管理画面API実装

### 優先度: 低

- [ ] ドキュメント更新
- [ ] 運用マニュアル作成
- [ ] テストスクリプト作成

---

## 🚨 注意事項

### 1. AFB APIのクォータ制限
- 仕様書に記載なし → 実際に叩いて確認する
- 過度なポーリングは避ける（推奨: 1時間毎）

### 2. Google Sheets APIクォータ
- 読み取り: 500リクエスト/100秒/ユーザー
- 書き込み: 500リクエスト/100秒/ユーザー
- バッチ書き込みを活用する

### 3. Vercel Cronの制限
- Free: 実行時間10秒まで
- Pro: 実行時間5分まで
- 大量データ取得時はタイムアウトに注意

### 4. 認証・権限管理
- 管理画面は必ず認証チェックを実装
- session.user.role フィールドを追加する必要がある可能性
- 現在の Next-Auth設定を確認

---

## 📞 連絡事項

### 完了報告
このセッションで実装した内容：
- ✅ 方針転換のクリーンアップ
- ✅ AFB API型定義
- ✅ AFB APIクライアント
- ✅ 環境変数設定

### 次回セッション開始時の確認事項
1. AFB_PARTNER_IDとAFB_API_KEYを取得できたか
2. ローカル環境で`npm run dev`が正常に起動するか
3. Google Sheetsへのアクセス権限に問題がないか

---

**Last Updated:** 2025-01-03
**Next Session:** フェーズ1続き（Cronジョブ・マッチングアルゴリズム）から開始
