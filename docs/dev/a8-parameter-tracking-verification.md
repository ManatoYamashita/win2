# A8.net Parameter Tracking Report CSV検証結果

## 検証日時
- **検証日**: 2025-01-08
- **検証者**: [記入してください]
- **検証環境**: A8.net Media Console (https://media-console.a8.net/report/parameter#)

## 検証目的

WIN×Ⅱプロジェクトにおいて、A8.netのParameter Tracking Report機能を使用して**会員別成果追跡**が可能かを検証する。

### 背景
- **技術実装**: 100%完了済み（id1パラメータ付与、クリックログ記録、GAS集計）
- **課題**: A8.net Media Member契約では、確定API v3（広告主専用）にアクセスできないため、個別成果データの取得可否が不明
- **検証ポイント**: Parameter Tracking ReportのCSVに`id1`カラムが含まれているか

## 検証手順

### Step 1: A8.net管理画面アクセス
1. A8.netログインページにアクセス: https://px.a8.net/a8v2/asLogin.do
2. 認証情報でログイン（`docs/specs/asp.md` 参照）
3. Parameter Tracking Reportに移動: https://media-console.a8.net/report/parameter#

### Step 2: CSV/Excelダウンロード
1. 期間指定: **2025年11月1日〜11月8日**（今月）
2. サイト、プログラム、素材ID、素材タイプの条件指定（必要に応じて）
3. パラメータ入力欄に任意のパラメータを入力（過去の記録確認のため）
4. 「絞り込む」ボタンをクリック
5. **CSV/Excelダウンロードボタン**をクリック

### Step 3: ファイル確認
1. ダウンロードしたファイルを開く（CSV or Excel）
2. カラム構成を確認
3. サンプルデータを記録（3-5行）

---

## 検証結果

### 1. CSV/Excelダウンロード機能

**ダウンロードボタンの場所**:
```
[記入してください: メニューパス、ボタン位置など]
例: 「レポート画面下部の『CSVダウンロード』ボタン」
```

**ダウンロードファイル形式**:
- [ ] CSV形式
- [ ] Excel形式 (.xlsx)
- [ ] その他: [記入してください]

### 2. カラム構成

**全カラム名**:
```
[記入してください: カラム名をカンマ区切りまたは改行区切りでリスト化]
例:
日付, プログラム名, 素材ID, クリック数, 成果数, id1, eventId, ...
```

### 3. 最重要確認項目: id1カラムの有無

**id1カラム**:
- [ ] ✅ **存在する**（会員別成果追跡が可能）
- [ ] ❌ **存在しない**（Media Member契約では個別追跡不可）

**id1カラムのサンプルデータ**（存在する場合）:
```
[記入してください: id1カラムの実際のデータ例を3-5行]
例:
id1
550e8400-e29b-41d4-a716-446655440000
guest:660e9511-f30c-52e5-b827-557766551111
550e8400-e29b-41d4-a716-446655440000
```

### 4. オプション確認項目: eventIdカラムの有無

**eventIdカラム**:
- [ ] 存在する
- [ ] 存在しない
- [ ] 確認未実施

**eventIdカラムのサンプルデータ**（存在する場合）:
```
[記入してください]
```

### 5. サンプルCSVデータ（3-5行）

```csv
[記入してください: ヘッダー行を含む3-5行のサンプルデータ]
例:
日付,プログラム名,素材ID,クリック数,成果数,id1,eventId
2025-11-01,プログラムA,12345,10,2,550e8400-e29b-41d4-a716-446655440000,770f9622-g41d-63f6-c938-668877662222
2025-11-02,プログラムB,67890,5,1,guest:660e9511-f30c-52e5-b827-557766551111,881g0733-h52e-74g7-d049-779988773333
```

---

## 検証結果の判定

### ✅ Case A: id1カラムあり（楽観シナリオ）

**判定**: 会員別成果追跡が可能

**影響**:
- WIN×Ⅱの会員別キャッシュバック機能が実現可能
- A8.netを主要ASPとして運用可能
- 技術実装は既に100%完了済み

**次のアクション**:
1. **運用マニュアル作成**（1-2時間）
   - `docs/operations/a8-csv-daily-workflow.md` 作成
   - 日次CSVダウンロード手順（スクリーンショット付き）
   - Google Sheets「成果CSV_RAW」へのペースト方法
   - GAS実行確認手順
   - トラブルシューティング

2. **ポリシーリスク評価**（30分）
   - ⚠️ **A8.net公式警告**: 「本機能はポイントサイト向けではありません」（出典: https://support.a8.net/a8/as/faq/manual/a8-parameter-guide.php）
   - WIN×Ⅱのビジネスモデル（キャッシュバック/ポイント還元）は制限対象の可能性
   - **アカウント停止リスク**を考慮した運用方針決定

   **リスク軽減策（3つのオプション）**:
   - **Option 1（最も安全）**: A8.netサポートへの事前問い合わせ
     - 質問案: 「会員別成果追跡目的でParameter Tracking機能を使用可能か？」
     - 質問案: 「キャッシュバックモデルは利用規約に違反しないか？」
     - メリット: 明確な許可を得られる
     - デメリット: ポリシー審査でアカウント停止のリスク

   - **Option 2（中程度）**: 小規模テスト運用（1-2週間）
     - 規模: 限定的な会員数・案件数
     - モニタリング: A8.netからの警告を注視
     - 警告が来たら即停止

   - **Option 3（保守的）**: A8.netは集計のみ利用
     - 会員別キャッシュバック無し
     - AFBまたは他ASPで会員別実装

3. **テスト運用開始**（即日可能）
   - 選択したリスク軽減策に基づく運用開始
   - モニタリング期間: 1-2週間

**タイムライン**: 当日〜3日以内に完了可能

---

### ❌ Case B: id1カラムなし（悲観シナリオ）

**判定**: Media Member契約では個別成果追跡不可

**影響**:
- A8.netでは会員別キャッシュバック機能が実現不可
- 代替ASPの検討が必要

**次のアクション**:
1. **A8.net運用方針変更**
   - 集計レポートのみ利用（プログラム別総報酬額、クリック数）
   - A8.net案件をプラットフォームに表示するが、WIN×Ⅱ独自のキャッシュバック対象外
   - 会員には「A8.net案件は集計のみ対応」と明示

2. **代替ASP検討**（1日）
   - **もしもアフィリエイト**: API仕様調査、会員別トラッキング可否確認
   - **バリューコマース**: API仕様調査、会員別トラッキング可否確認
   - **AFB再実装**: GitHub Actions Schedulerを使用したCronジョブ実装
     - 削除済みコード: コミット `b8e9b98` で保持済み（1181行）
     - 再実装時間: 1-2日（インフラ変更のみ）

3. **ドキュメント更新**
   - `docs/asp-api-integration.md` 更新（A8.net → Aggregate Only）
   - `docs/handoff/2025-01-05-afb-removal-handoff.md` 作成（削除経緯記録）

**タイムライン**: 1日（方針変更 + 代替ASP調査開始）

---

## 選択した次アクション

**検証結果に基づく次アクション**:
- [ ] Case A: 運用マニュアル作成 + ポリシーリスク評価
- [ ] Case B: 代替ASP検討 + ドキュメント更新

**選択理由**:
```
[記入してください: 検証結果に基づく判断理由]
```

**担当者**:
```
[記入してください: 次アクション実施者]
```

**期限**:
```
[記入してください: 次アクション完了予定日]
```

---

## 補足情報

### A8.net Parameter Tracking機能の制限事項

#### 公式ガイド記載の制限
出典: https://support.a8.net/a8/as/faq/manual/a8-parameter-guide.php

1. **ポイントサイト向けではない**
   - 公式警告: 「本機能はポイントサイト向けではありません」
   - WIN×Ⅱのビジネスモデル（キャッシュバック/ポイント還元）は制限対象の可能性

2. **Media Member契約の制限**
   - A8.net確定API v3（広告主専用）にアクセス不可
   - 個別の成果データ（order_no, order_click_date）取得不可（既知）
   - カスタムトラッキングパラメータ（id1, eventId）の個別マッチング可否（本検証で確認）

### WIN×Ⅱの現在の技術実装

#### 完了済み実装（100%）
- ✅ `/api/track-click`: id1パラメータ付与（`app/api/track-click/route.ts:113`）
- ✅ eventID生成: UUID v4自動生成
- ✅ クリックログ記録: Google Sheets「クリックログ」（E列: eventId追加）
- ✅ GAS自動集計: 毎日3:10実行（`docs/specs/google.md:155-476`）
- ✅ CSV取込フロー: Google Sheets「成果CSV_RAW」へのマニュアルペースト

#### トラッキングURL生成ロジック
```typescript
// app/api/track-click/route.ts:111-114
const trackingUrl = new URL(deal.affiliateUrl);
trackingUrl.searchParams.set("id1", trackingId); // memberId or guest:UUID
trackingUrl.searchParams.set("eventId", eventId); // UUID v4
```

### 関連ドキュメント

- **ASP統合調査結果**: `docs/asp-api-integration.md`
- **Google Sheets構造**: `docs/specs/google.md`
- **A8.net API仕様**: `docs/specs/asp/a8net-api.md`（広告主契約前提）
- **AFB削除記録**: `docs/handoff/2025-01-05-afb-removal-handoff.md`（作成予定）
- **セッション引き継ぎ**: `docs/handoff/asp-integration-session-handoff.md`

### 関連Issue・コミット

- **GitHub Issue**: #22 - A8.net Parameter Tracking Report CSV検証と運用フロー確立
- **最新コミット**: `8a72b92` (2025-01-05) - DOC: ASP統合包括ドキュメント作成
- **AFB削除コミット**: `b8e9b98` (2025-01-05) - REFACTOR: AFB実装削除 - A8.net対応最優先化

---

## 検証完了チェックリスト

- [ ] A8.net管理画面にログイン成功
- [ ] Parameter Tracking Reportにアクセス成功
- [ ] CSV/Excelダウンロード成功
- [ ] 全カラム名を記録
- [ ] id1カラムの有無を確認
- [ ] サンプルデータ（3-5行）を記録
- [ ] 次アクション決定（Case A or Case B）
- [ ] `docs/asp-api-integration.md` 更新（検証結果反映）
- [ ] GitHub Issue #22 更新（検証結果報告）

---

**検証完了日時**: [記入してください]

**検証者サイン**: [記入してください]
