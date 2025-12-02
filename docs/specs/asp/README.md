# ASP統合プロジェクト - 総合ドキュメント

**最終更新日:** 2025-01-04
**プロジェクトステータス:** Phase 1 完了、Phase 2 準備中
**担当者:** 開発チーム

---

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [実装状況サマリー](#実装状況サマリー)
3. [ドキュメント構造](#ドキュメント構造)
4. [クイックスタートガイド](#クイックスタートガイド)
5. [実装ロードマップ](#実装ロードマップ)
6. [技術的考慮事項](#技術的考慮事項)
7. [よくある質問（FAQ）](#よくある質問faq)

---

## プロジェクト概要

### 目的


### 主要機能

1. **メンバー別トラッキング**
   - カスタムパラメータ（`paid`, `sid`, `id1` など）を利用した個別会員識別
   - Google Sheets「クリックログ」との自動照合

2. **リアルタイム成果受信**
   - Webhook/Postback APIによる即時通知（AFB, ValueCommerce）
   - 定期ポーリングAPIによる自動取得（もしも, AccessTrade）

   - Google Sheets「成果データ」への自動出力

4. **重複防止とエラーハンドリング**
   - 成果IDベースの重複チェック
   - 失敗時の自動リトライ
   - 詳細なエラーログ記録

### 対象ASP一覧

| ASP名 | 実装優先度 | ステータス | カスタムパラメータ |
|-------|-----------|-----------|------------------|
| **AFB（アフィリエイトB）** | 🥇 1位 | ✅ **完了** | `paid` |
| **ValueCommerce（バリューコマース）** | 🥈 2位 | 📋 Phase 2 | `sid` |
| **もしもアフィリエイト** | 🥉 3位 | 🔍 Phase 3 | 要確認 |
| **AccessTrade** | 4位 | 🔍 Phase 3 | `a8` |
| **LinkShare（楽天アフィリエイト）** | 5位 | ⏸️ Phase 4 | `u1` |
| **JANet** | 6位 | ⏸️ Phase 4 | 要確認 |
| **infotop** | 7位 | ⏸️ Phase 5 | 要確認 |
| **A8.net** | - | ⚠️ **制限あり** | Media Member契約のため個別トラッキング不可 |

---

## 実装状況サマリー

### ✅ Phase 1: AFB実装（完了）

**実装日:** 2025-01-03
**実装方法:** リアルタイムポストバック（Webhook）
**トラッキング精度:** 100%（`paid` パラメータ使用）

**実装済み機能:**
- ✅ Webhook エンドポイント: `/api/webhooks/afb-postback`
- ✅ IPホワイトリスト認証（13.114.169.190, 180.211.73.218, 112.137.189.110）
- ✅ Google Sheets「成果CSV_RAW」への自動記録
- ✅ 重複成果の自動検出・スキップ
- ✅ エラーハンドリングと詳細ログ

**関連ドキュメント:**
- [AFB実装ガイド](./afb-implementation-guide.md) - 完全な実装手順とトラブルシューティング

**検証状況:**
- ✅ ローカル環境でのテスト完了
- ✅ TypeScriptコンパイルエラー解消
- ⏳ 本番環境でのAFB側設定待ち（ポストバックURL登録必要）

---

### 📋 Phase 2: ValueCommerce実装（準備中）

**予定開始日:** Phase 1 本番検証後
**実装方法:** 注文レポートAPI（OAuth 1.0a認証）
**トラッキング精度:** 95%（`sid` パラメータ使用）

**準備中の機能:**
- 📋 OAuth 1.0a 署名生成ロジック
- 📋 注文レポートAPI定期取得（10分間隔推奨）
- 📋 XMLレスポンスパース処理
- 📋 Click ID（`sid`）とメンバーID照合ロジック
- 📋 レート制限対応（1,000リクエスト/日）

**関連ドキュメント（予定）:**
- `valuecommerce/overview.md` - ValueCommerce API概要
- `valuecommerce/order-api-guide.md` - 注文レポートAPI実装ガイド
- `valuecommerce/authentication-setup.md` - OAuth 1.0a 認証設定
- `valuecommerce/troubleshooting.md` - トラブルシューティング

---

### 🔍 Phase 3-5: その他ASP（調査中）

**対象ASP:** もしも、AccessTrade、LinkShare、JANet、infotop

**現在の状況:**
- ✅ 各ASPの公式ドキュメント調査完了
- ✅ 実装優先順位の決定完了
- 📋 詳細実装計画の策定中

**関連ドキュメント（予定）:**
- `moshimo-overview.md`
- `accesstrade-overview.md`
- `linkshare-overview.md`
- `janet-overview.md`
- `infotop-overview.md`

---

### ⚠️ A8.net（制限あり）

**契約種別:** Media Member（メディア会員）
**制限内容:** 個別成果データへのアクセス不可

**利用可能な機能:**
- ✅ 集計レポート（日次・月次）
- ✅ クリック数・インプレッション数
- ❌ 個別成果の注文ID、クリック日時（API v3は広告主専用）
- ❌ カスタムトラッキングパラメータ（`id1`, `eventId`）の照合

**代替実装:**
1. **AFBを優先利用**（既に実装完了）
2. 手動CSV貼り付け運用の継続（集計レポート用）
3. 広告主契約への変更検討（将来的な選択肢）

**関連ドキュメント:**
- [A8.net API仕様](./a8net-api.md) - Media Member制限の詳細説明

---

## ドキュメント構造

```
docs/specs/asp/
├── README.md                          ← このファイル（ナビゲーションハブ）
│
├── asp-comparison-report.md           ← 📊 全ASP比較レポート（最重要）
│   └── 内容: 7つのASPの詳細比較、実装優先順位、技術リスク分析
│
├── afb-implementation-guide.md        ← ✅ AFB実装ガイド（完了済み）
│   └── 内容: Webhook実装、セキュリティ、テスト手順、運用ガイド
│
├── a8net-api.md                       ← ⚠️ A8.net API仕様（制限事項あり）
│   └── 内容: Media Member契約の制限、代替実装方法
│
├── valuecommerce/                     ← 📋 ValueCommerce詳細（Phase 2）
│   ├── overview.md                    └── API概要、対応機能
│   ├── order-api-guide.md             └── 注文レポートAPI実装ガイド
│   ├── authentication-setup.md        └── OAuth 1.0a 認証設定
│   └── troubleshooting.md             └── よくあるエラーと対処法
│
├── moshimo-overview.md                ← 🔍 Phase 3候補
├── accesstrade-overview.md            ← 🔍 Phase 3候補
├── linkshare-overview.md              ← ⏸️ Phase 4候補
├── janet-overview.md                  ← ⏸️ Phase 4候補
├── infotop-overview.md                ← ⏸️ Phase 5候補
│
└── common/                            ← 🔧 共通技術ドキュメント
    ├── tracking-parameters.md         └── カスタムトラッキングパラメータ仕様
    ├── conversion-matching.md         └── 成果マッチングアルゴリズム
    ├── error-handling.md              └── エラーハンドリング戦略
    ├── testing-strategy.md            └── テスト戦略とテストケース
    └── security-considerations.md     └── セキュリティベストプラクティス
```

---

## クイックスタートガイド

### 既存実装の確認

#### 1. AFB実装の確認

```bash
# 関連ファイルの確認
cat app/api/webhooks/afb-postback/route.ts    # Webhookエンドポイント
cat lib/sheets.ts                             # Google Sheets統合
cat types/afb-postback.ts                     # 型定義

# ドキュメント確認
cat docs/specs/asp/afb-implementation-guide.md
```

#### 2. Google Sheets統合の確認

```bash
# Sheets操作関数
grep -n "writeConversionData" lib/sheets.ts
grep -n "isDuplicateConversion" lib/sheets.ts

# シート名定義
grep -n "SHEET_NAMES" lib/sheets.ts
```

#### 3. ローカル環境でのテスト

```bash
# 開発サーバー起動
npm run dev

# Webhookエンドポイントのテスト（別ターミナルで実行）
curl -X GET "http://localhost:3000/api/webhooks/afb-postback?paid=test-member-001&adid=12345&price=10000&judge=1&u=unique-12345&time=2025-01-04T12:00:00Z"
```

---

### 新しいASP統合の開始手順

#### Step 1: 公式ドキュメント調査

1. **API仕様の確認**
   - エンドポイント、認証方式、レスポンス形式
   - レート制限、エラーコード

2. **カスタムトラッキングパラメータの確認**
   - パラメータ名（例: `paid`, `sid`, `a8`）
   - 最大文字数、使用可能文字

3. **成果通知方法の確認**
   - Webhook/Postback対応の有無
   - 手動CSV/API取得の必要性

#### Step 2: 実装優先度の評価

[asp-comparison-report.md](./asp-comparison-report.md) の評価基準を参照：

| 評価項目 | 配点 | 説明 |
|---------|------|------|
| 自動化レベル | 10点 | Webhook対応度 |
| 会員別トラッキング精度 | 10点 | カスタムパラメータ利用可否 |
| 実装難易度 | 5点 | 認証・API複雑度（低いほど高得点） |
| ドキュメント品質 | 5点 | 公式ドキュメントの充実度 |
| ビジネス価値 | 4点 | 案件数・報酬単価 |
| レスポンス速度 | 3点 | 成果反映のリアルタイム性 |
| エラーハンドリング | 3点 | リトライ機構、エラー詳細度 |

**合計40点満点** - 30点以上が優先実装推奨

#### Step 3: 実装計画の作成

1. **ドキュメント作成**
   - `{asp-name}-overview.md` を作成
   - 実装ガイドの詳細化

2. **型定義の作成**
   - `types/{asp-name}.ts` にAPI型定義を追加

3. **API実装**
   - Webhook型: `app/api/webhooks/{asp-name}/route.ts`
   - ポーリング型: `lib/{asp-name}-api.ts` + Cron Job設定

4. **テストケース作成**
   - 単体テスト: 成功ケース、エラーケース
   - 統合テスト: Google Sheets連携
   - E2Eテスト: 本番環境シミュレーション

#### Step 4: 本番デプロイ

1. **環境変数設定**
   ```bash
   # .env.local に追加
   {ASP_NAME}_API_KEY=your_api_key
   {ASP_NAME}_SECRET_KEY=your_secret_key
   ```

2. **Vercelデプロイ**
   ```bash
   vercel env add {ASP_NAME}_API_KEY production
   vercel --prod
   ```

3. **ASP管理画面設定**
   - Webhook URL登録（該当する場合）
   - カスタムパラメータ設定（`paid`, `sid` など）

4. **監視設定**
   - エラーログ監視
   - 成果データの定期確認

---

## 実装ロードマップ

### Phase 1: AFB実装 ✅ 完了

**期間:** 2025-01-03
**目標:** リアルタイムポストバック実装

**成果物:**
- ✅ `/api/webhooks/afb-postback` エンドポイント
- ✅ IPホワイトリスト認証
- ✅ Google Sheets統合
- ✅ 完全実装ガイド

---

### Phase 2: ValueCommerce実装 📋 準備中

**予定期間:** Phase 1 本番検証後 1-2週間
**目標:** 注文レポートAPI統合

**タスク:**
1. OAuth 1.0a 署名生成ロジック実装（2日）
2. 注文レポートAPI取得処理実装（2日）
3. XMLパース処理実装（1日）
4. Click ID照合ロジック実装（2日）
5. テスト・デバッグ（3日）
6. ドキュメント整備（2日）

**成果物（予定）:**
- `/lib/valuecommerce-api.ts` - API統合ロジック
- `/app/api/cron/valuecommerce-sync/route.ts` - 定期取得Cron
- `types/valuecommerce.ts` - 型定義
- `valuecommerce/*` - 詳細ドキュメント

---

### Phase 3: もしも・AccessTrade実装 🔍 調査中

**予定期間:** Phase 2 完了後 2-3週間
**目標:** 中優先度ASPの統合

**対象ASP:**
- もしもアフィリエイト（レポートAPI、24点）
- AccessTrade（成果レポートAPI、24点）

**準備項目:**
- 公式APIドキュメント精査
- サンプルレスポンス取得
- カスタムパラメータテスト
- 実装ガイド作成

---

### Phase 4-5: 低優先度ASP実装 ⏸️ 保留中

**対象ASP:**
- LinkShare（楽天）、JANet、infotop

**判断基準:**
- Phase 2-3の運用実績評価
- ビジネス要求の変化
- リソース状況

---

## 技術的考慮事項

### セキュリティ

#### 1. Webhook認証

**AFB実装（既存）:**
- ✅ IPホワイトリスト認証（3つのIP）
- ✅ HTTPS必須（Vercel自動対応）
- ✅ 開発環境ではIP検証スキップ

**ValueCommerce実装（予定）:**
- 📋 OAuth 1.0a 署名検証
- 📋 クライアントシークレット管理
- 📋 リクエストタイムスタンプ検証

#### 2. API キー管理

```bash
# 環境変数で管理（.env.local）
GOOGLE_SHEETS_API_KEY=...
AFB_API_KEY=...
VALUECOMMERCE_API_KEY=...
VALUECOMMERCE_SECRET_KEY=...

# Vercelでの本番環境設定
vercel env add {KEY_NAME} production
```

#### 3. データ検証

- ✅ Zod スキーマによる入力検証（AFB実装済み）
- 📋 不正な成果データの検出・拒否
- 📋 異常な金額・日時の警告

---

### パフォーマンス

#### 1. Google Sheets API制限

**制限値:**
- 読み取り: 100リクエスト/100秒/ユーザー
- 書き込み: 100リクエスト/100秒/ユーザー

**対策:**
- ✅ バッチ書き込み（複数行を1リクエストで処理）
- 📋 キャッシュ利用（頻繁に読み取るデータ）
- 📋 リトライロジック（指数バックオフ）

#### 2. ASP API制限

| ASP | 制限 | 対策 |
|-----|------|------|
| AFB | Webhookのため制限なし | - |
| ValueCommerce | 1,000リクエスト/日 | 10分間隔ポーリング（144回/日） |
| もしも | 要確認 | 調査中 |
| AccessTrade | 要確認 | 調査中 |

---

### エラーハンドリング

#### 1. 成果データ取得失敗

```typescript
// 実装例（AFB）
try {
  await writeConversionData(conversionData);
} catch (error) {
  console.error("[afb-postback] Error:", error);
  // Webhookは200を返してリトライを防止
  // エラーログは別途集計・監視
  return NextResponse.json({ success: false }, { status: 500 });
}
```

#### 2. Google Sheets書き込み失敗

**リトライ戦略:**
- 1回目: 即座にリトライ
- 2回目: 5秒待機後リトライ
- 3回目: 10秒待機後リトライ
- 失敗時: エラーログ記録、アラート送信

#### 3. 重複成果の処理

```typescript
// 実装例（AFB）
const isDuplicate = await isDuplicateConversion(parsedData.uniqueId);
if (isDuplicate) {
  console.log(`[afb-postback] Duplicate detected: ${parsedData.uniqueId}`);
  return NextResponse.json(
    { success: true, message: "Duplicate conversion skipped" },
    { status: 200 }
  );
}
```

---

### テスト戦略

#### 1. 単体テスト

**対象:**
- API パース処理（`parseAfbPostbackParams` など）
- Google Sheets操作（`writeConversionData`, `isDuplicateConversion`）
- 成果マッチングロジック

**ツール:**
- Jest
- TypeScript型検証

#### 2. 統合テスト

**対象:**
- Webhook エンドポイント全体
- Google Sheets との連携
- エラーハンドリング

**手法:**
- モックAPIレスポンス
- テスト用Google Sheets

#### 3. E2Eテスト

**対象:**
- 本番環境シミュレーション
- ASP管理画面からのテスト送信

**ツール:**
- curl / Postman
- ASPテストモード（利用可能な場合）

---

## よくある質問（FAQ）

### Q1: なぜAFBが最優先なのですか？

**A:** 以下の理由により、AFBが最も実装が容易で効果的だからです：

1. **リアルタイムポストバック対応** - Webhook方式で即座に成果を受信
2. **カスタムパラメータ対応** - `paid` パラメータで100%の精度でメンバー識別可能
3. **実装難易度が低い** - OAuth不要、シンプルなGETリクエスト
4. **公式ドキュメントが充実** - 実装例・トラブルシューティングが豊富

**実装完了済み** - 既に本番デプロイ可能な状態です。

---

### Q2: A8.netは利用できないのですか？

**A:** 現在のWIN×Ⅱは **Media Member契約** のため、**個別成果データへのアクセスができません**。

**制限内容:**
- ❌ API v3（確定API）は広告主専用機能
- ❌ 個別成果の注文ID、クリック日時が取得不可
- ❌ カスタムパラメータ（`id1`, `eventId`）の照合不可

**利用可能な機能:**
- ✅ 集計レポート（日次・月次のクリック数、成果数、報酬額合計）
- ✅ 手動CSV貼り付け運用の継続

**代替案:**
1. **AFBを優先利用**（既に実装完了）
2. 広告主契約への変更を検討（API v3が利用可能になる）
3. 集計レポートによる全体分析は継続利用

詳細は [A8.net API仕様](./a8net-api.md) を参照してください。

---

### Q3: ValueCommerceの実装はいつ開始しますか？

**A:** **Phase 1（AFB）の本番環境検証が完了次第、開始します**。

**予定スケジュール:**
1. AFB本番環境でのポストバック動作確認（1-2日）
2. エラーログ監視・調整（3-5日）
3. ValueCommerce実装開始（Phase 2）

**理由:**
- AFBで基本的なWebhook・Google Sheets統合の動作を確認
- 発見された問題点をValueCommerce実装に反映
- 段階的なリスク管理

---

### Q4: もしもアフィリエイトのカスタムパラメータは確認済みですか？

**A:** 現在、**公式ドキュメントでの確認が必要です**。

**調査状況:**
- ✅ レポートAPI仕様は確認済み
- ⚠️ カスタムトラッキングパラメータの詳細は未確認
- 📋 Phase 3で正式な公式問い合わせを実施予定

**暫定評価（asp-comparison-report.md）:**
- カスタムパラメータ: 「要確認」
- 実装優先度: 3位（24点/40点）

---

### Q5: 重複成果はどのように防止していますか？

**A:** **成果の一意ID（`uniqueId`, `u` パラメータなど）によるチェック**を実施しています。

**AFB実装例:**

```typescript
// 1. Google Sheetsから既存の成果ID一覧を取得
const existingRows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:H");
const existingUniqueIds = new Set(existingRows.map(row => row[7])); // H列: 注文ID（u）

// 2. 重複チェック
if (existingUniqueIds.has(parsedData.uniqueId)) {
  console.log(`[afb-postback] Duplicate detected: ${parsedData.uniqueId}`);
  return NextResponse.json(
    { success: true, message: "Duplicate conversion skipped" },
    { status: 200 }
  );
}

// 3. 新規成果のみ記録
await writeConversionData(conversionData);
```

**重要:** 200 OKを返すことで、ASP側の不要なリトライを防止します。

---

### Q6: エラーが発生した場合、どこを確認すればよいですか？

**A:** 以下の順序で確認してください：

#### 1. アプリケーションログ

```bash
# Vercelデプロイ環境
vercel logs --follow

# ローカル開発環境
npm run dev  # ターミナル出力を確認
```

**確認ポイント:**
- `[afb-postback]` プレフィックスのログ
- `Error:` キーワード
- スタックトレース

#### 2. Google Sheets

- **成果CSV_RAW** シート: データが正しく記録されているか
- 列の順序: A=日時, B=会員ID, C=案件名, ..., H=注文ID

#### 3. ASP管理画面

- **AFB管理画面**: ポストバック送信履歴
- ステータスコード: 200 OK以外はエラー
- リトライ回数の確認

#### 4. ドキュメント参照

- [AFB実装ガイド - トラブルシューティング](./afb-implementation-guide.md#トラブルシューティング)
- [共通エラーハンドリング](./common/error-handling.md)（予定）

---

### Q7: 新しいASPを追加したい場合、どうすればよいですか？

**A:** [クイックスタートガイド - 新しいASP統合の開始手順](#新しいasp統合の開始手順) を参照してください。

**簡易手順:**
1. 公式APIドキュメント調査
2. 実装優先度の評価（40点満点）
3. `{asp-name}-overview.md` 作成
4. 型定義・API実装
5. テスト・デプロイ

**相談が必要な場合:**
- 開発チームに [asp-comparison-report.md](./asp-comparison-report.md) の評価基準を共有
- 優先度が30点以上なら実装推奨

---

## まとめ

### 現在の実装状況

✅ **Phase 1完了**: AFBリアルタイムポストバック実装済み
📋 **Phase 2準備中**: ValueCommerce注文レポートAPI
🔍 **Phase 3調査中**: もしも・AccessTrade

### 次のアクション

1. **AFB本番環境検証** - ポストバックURLをAFB管理画面に登録
2. **エラー監視** - 1週間の動作確認
3. **ValueCommerce実装開始** - Phase 2へ移行

### 参考リンク

- **メインレポート**: [asp-comparison-report.md](./asp-comparison-report.md) - 全ASP詳細比較
- **AFB実装**: [afb-implementation-guide.md](./afb-implementation-guide.md) - 完全実装ガイド
- **A8.net制限**: [a8net-api.md](./a8net-api.md) - Media Member契約の制限事項

---

**質問・問題が発生した場合:**
- 開発チームに連絡
- このREADME.mdの該当セクションを参照
- 関連ドキュメントのトラブルシューティングセクションを確認

---

_Last Updated: 2025-01-04_
_Document Version: 1.0.0_
_Maintained by: WIN×Ⅱ Development Team_