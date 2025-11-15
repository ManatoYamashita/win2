# AFB自動ポーリング + A8.net手動CSV ハイブリッド運用マニュアル

## 概要

WIN×ⅡではAFBとA8.netの2つのASPを運用しています。それぞれ異なる方法で成果データを取得・管理します。

| ASP | 取得方法 | 頻度 | 手動作業 |
|-----|---------|------|---------|
| **AFB** | GitHub Actions自動ポーリング（AFB API） | 10分毎 | なし |
| **A8.net** | Parameter Tracking Report CSV手動ダウンロード | 週1回または月1回 | あり（5分/回） |

---

## システム構成図

```
┌─────────────────────────────────────────────────────┐
│                    GitHub Actions                    │
│                  (cron: */10 * * * *)               │
└──────────────────────┬──────────────────────────────┘
                       │ 10分毎
                       ↓
           ┌──────────────────────┐
           │  /api/cron/sync-afb  │ ← CRON_SECRET認証
           └──────────────────────┘
                       │
                       ↓
              ┌─────────────┐
              │   AFB API   │
              └─────────────┘
                       │
                       ↓
         ┌──────────────────────────┐
         │  Google Sheets          │
         │  「成果CSV_RAW」シート   │
         └──────────────────────────┘
                       │
                       ↓
              ┌────────────────┐
              │  GAS自動実行   │ ← 毎日3:10 JST
              └────────────────┘
                       │
                       ↓
         ┌──────────────────────────┐
         │  Google Sheets          │
         │  「成果データ」シート     │
         └──────────────────────────┘
                       │
                       ↓
           ┌────────────────────┐
           │  Member MyPage     │ ← /mypage/history
           └────────────────────┘
```

---

## AFB案件の運用（完全自動）

### 自動処理フロー

1. **GitHub Actions Scheduler** が10分毎に起動（`*/10 * * * *`）
2. **AFB Sync API** (`/api/cron/sync-afb-conversions`) にPOSTリクエスト送信
3. **CRON_SECRET検証** で認証
4. **AFB APIポーリング** で過去7日間の成果データを取得
5. **重複チェック** で既存の成果をスキップ
6. **Google Sheets「成果CSV_RAW」** に新規成果を自動書き込み
7. **GAS自動実行** （毎日3:10 JST）でキャッシュバック計算
8. **「成果データ」シート** に反映完了
9. **メンバーMyPage** で確認可能

### モニタリング方法

#### GitHub Actions実行ログの確認

1. GitHubリポジトリにアクセス
2. `Actions` タブをクリック
3. `AFB成果データ同期` workflowを選択
4. 最新の実行ログを確認

**正常時のログ例:**
```
🚀 Starting AFB成果データ同期...
📊 HTTP Status: 200
📄 Response: {"success":true,"message":"AFB API polling completed successfully","summary":{"total":5,"new":2,"skipped":3,"recorded":2,"errors":0},"timestamp":"2025-11-15T12:34:56.789Z"}
✅ AFB同期が正常に完了しました
```

**エラー時のログ例:**
```
🚀 Starting AFB成果データ同期...
📊 HTTP Status: 401
📄 Response: {"success":false,"error":"Unauthorized"}
❌ AFB同期に失敗しました (HTTP 401)
```

#### Google Sheets「成果CSV_RAW」の確認

1. Google Sheetsにアクセス
2. 「成果CSV_RAW」シートを開く
3. H列（orderId）にAFBの成果IDが記録されていることを確認
4. C列（aspName）が「afb」であることを確認

---

## A8.net案件の運用（手動CSV）

### 手動作業フロー（週1回または月1回、所要時間: 5分）

#### Step 1: Parameter Tracking Reportにアクセス

1. A8.net管理画面にログイン
2. URL: `https://media-console.a8.net/report/parameter`
3. 期間を選択（例: 過去30日間）
4. 検索条件を設定（通常は空白でOK）
5. 「検索」ボタンをクリック

#### Step 2: CSVダウンロード

1. 成果データが表示されたら、「CSVエクスポート」ボタンをクリック
2. ファイル名例: `parameter_YYYYMMDD-YYYYMMDD_YYYYMMDDHHmmss.csv`
3. ダウンロードフォルダに保存

#### Step 3: Google Sheetsに貼り付け

1. ダウンロードしたCSVファイルを開く（Excelまたはテキストエディタ）
2. **ヘッダー行を含む全データ**を選択してコピー
3. Google Sheets「成果CSV_RAW」シートのA1セルを選択
4. 貼り付け（Ctrl+V / Cmd+V）

#### Step 4: GAS実行（オプション）

**自動実行の場合:**
- 毎日3:10 JSTにGASが自動実行されるため、何もする必要なし
- 翌日以降に「成果データ」シートに反映される

**手動実行の場合（即座に反映したい場合）:**
1. Google Sheetsメニュー: 「カスタムメニュー」→「成果データを更新」をクリック
2. 実行権限の確認ダイアログが表示されたら「許可」をクリック
3. 処理完了まで待機（通常30秒〜1分）

#### Step 5: 結果確認

1. 「成果データ」シートを開く
2. A8.net成果が追加されていることを確認
3. 承認状況、キャッシュバック金額が正しく計算されていることを確認

---

## 両ASP成果の統合管理

### 「成果データ」シートの構造

| 列 | カラム名 | AFBデータ例 | A8.netデータ例 |
|----|---------|-----------|---------------|
| A | 氏名 | 山田太郎 | 佐藤花子 |
| B | 案件名 | AFB案件名 | アンケートモニタ... |
| C | 承認状況 | approved | 未確定 |
| D | キャッシュバック金額 | 560 | 0（未確定のため） |
| E | memberId(参考) | xxx-xxx-xxx | yyy-yyy-yyy |
| F | 原始報酬額(参考) | 2800 | 280 |
| G | メモ | | |
| H | ASP名（オプション） | afb | a8net |

### ASP識別方法

**方法1: 案件名で判別**
- AFB案件は通常、特定の命名パターンあり
- A8.net案件は「(15-0722)」のようなプログラムコード付き

**方法2: ASP名カラム追加（推奨）**
- GASコードを修正して、ASP名カラム（H列）を追加
- `docs/operations/gas-a8net-update-guide.md` 参照

---

## トラブルシューティング

### AFB自動ポーリング

#### 問題: GitHub Actionsが失敗する（HTTP 401）

**原因**: CRON_SECRETが設定されていない、または値が一致しない

**解決策**:
1. GitHub Secrets設定を確認
2. `CRON_SECRET`が正しく設定されているか確認
3. Vercel環境変数に同じ値が設定されているか確認

#### 問題: AFB APIからデータが取得できない

**原因1**: AFB API認証情報が間違っている
**解決策1**: Vercel環境変数の`AFB_PARTNER_ID`と`AFB_API_KEY`を確認

**原因2**: AFB APIがメンテナンス中
**解決策2**: AFB公式サイトでメンテナンス情報を確認

#### 問題: 成果データが重複する

**原因**: 重複チェックロジックが正しく動作していない
**解決策**:
1. Google Sheets「成果CSV_RAW」のH列（orderId）を確認
2. 同じorderIdが複数存在する場合は、手動で削除
3. `/api/cron/sync-afb-conversions/route.ts`のコードを確認

---

### A8.net手動CSV

#### 問題: Parameter Tracking Reportにデータが表示されない

**原因**: 成果が発生していない（クリックのみではデータ表示されない）

**解決策**: A8.netサポート回答（2025-01-09）により、Parameter Tracking Reportは**成果データのみ**を表示します。クリックのみではデータは表示されません。成果が発生するまで待機してください。

#### 問題: CSVをGoogle Sheetsに貼り付けたがエラーが出る

**原因**: ヘッダー行が含まれていない、またはデータ形式が不正

**解決策**:
1. **ヘッダー行（1行目）を含めて**全データをコピー
2. A1セルに貼り付け（既存データは上書きされる）
3. CSVファイルの文字コードを確認（UTF-8推奨）

#### 問題: キャッシュバック金額が0円のまま

**原因1**: ステータスが「未確定」のため（正常動作）

**解決策1**: 成果が確定したら再度CSVをダウンロードして貼り付け

**原因2**: ステータス値が`APPROVED_VALUES`に含まれていない

**解決策2**: `docs/operations/gas-a8net-update-guide.md`を参照し、ステータス値を追加

---

## 定期作業スケジュール

### 毎日（自動）

- **3:10 JST**: GAS自動実行（「成果CSV_RAW」→「成果データ」変換）
- **10分毎**: GitHub Actions AFB自動ポーリング

### 週次（手動）

- **月曜日 10:00**: A8.net Parameter Tracking Report CSVダウンロード→Google Sheets貼り付け（所要時間: 5分）

### 月次（手動・オプション）

- **月初1日**: 前月成果の最終確認
- **月末**: 次月の成果データをリセット（必要に応じて）

---

## モニタリングチェックリスト

### 毎週確認

- [ ] GitHub Actions AFB同期が正常に動作しているか（`Actions`タブで確認）
- [ ] A8.net CSV貼り付けが完了したか
- [ ] 「成果データ」シートに両ASPの成果が反映されているか
- [ ] メンバーMyPageで成果が正しく表示されているか

### 月次確認

- [ ] AFB APIキーの有効期限確認
- [ ] A8.net Parameter Tracking機能の利用可否確認（規約変更対応）
- [ ] Google Sheets容量確認（データ量が増加している場合はアーカイブ）

---

## 緊急時の対応

### AFB自動ポーリングが完全に停止した場合

**Fallback Plan**: 手動CSV取得

1. AFB管理画面にログイン
2. 成果レポートをCSVダウンロード
3. Google Sheets「成果CSV_RAW」に貼り付け（A8.netと同じ手順）
4. GAS実行

### Google Sheets APIが停止した場合

**Fallback Plan**: ローカルCSV管理

1. A8.net/AFBのCSVをローカルに保存
2. 復旧後にまとめて貼り付け

---

## 関連ドキュメント

- `docs/operations/gas-a8net-update-guide.md` - GAS修正ガイド（A8.net対応）
- `docs/specs/google.md` - Google Sheets構造とGAS完全コード
- `.github/workflows/afb-sync.yml` - GitHub Actions設定
- `docs/handoff/2025-01-05-afb-removal-handoff.md` - AFB実装削除経緯と復元要件
- `docs/dev/a8-parameter-tracking-verification.md` - A8.net検証記録

---

**作成日**: 2025-11-15
**最終更新**: 2025-11-15
**ステータス**: 完成
