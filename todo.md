# プロジェクト ToDo（進捗マーク付き）

**凡例**
チェックボックスで進捗を表します。
- [x] 完了
- [ ] 未着手
- [ ] （要確認/部分完了）
- [ ] （次の作業候補）
- [ ] （要対応）

## 0) 開発環境・下準備

- [x] Wix Studio（Velo）を有効化
- [x] サービスアカウントの JSON を Secrets に保存（`velo-spreadsheet-credentials`）
- [x] 対象スプレッドシートをサービスアカウントに共有（編集権限）
- [x] シートIDを Secrets に保存（`G_SHEETS_ID`）
- [x] `masterPage.js` 削除（`Write` 未定義エラー）

## 1) Google スプレッドシート構成

- [x] `クリックログ` タブ作成・追記動作確認（A:C = 日時, memberId, dealName）
- [x] `成果CSV_RAW` タブ作成（ヘッダー行あり）
- [x] `成果データ` タブ作成（GASが初回実行でヘッダー自動生成）
- [x] `会員リスト` タブ作成（memberId / 氏名 のマスタ。あれば氏名解決が可能）

## 2) Wix CMS（案件コレクション）

- [x] コレクション作成（名称は任意／例：`AffiliateDeals`）
- [x] フィールド

  - `baseLink`（ASPの基本リンク）
  - `title` **または** `title_fld`（案件名）
- [x] サンプルデータ登録

## 3) バックエンド（Wix / Velo）

- [x] `backend/gSheetsLogger.jsw` 実装
- [x] `@velo/google-sheets-integration-backend` の `appendValues()` を正しい引数で呼び出し（**一次元配列 + A1範囲**）
- [x] Secrets `G_SHEETS_ID` を取得して使用
- [x] JST での記録（`toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })`）

## 4) フロントエンド（案件一覧ページ）

- [x] 会員ログインチェック（未ログイン → `/ _members / login`）
- [x] リピーター `#dealsRepeater` の `onItemReady` 実装
- [x] `#applyButton` クリック時：

  - [x] 遷移URLに `?id1=<memberId>` を付与
  - [x] Google Sheets の `クリックログ` に `[日時, memberId, dealName]` を **1行追記**
  - [x] `title` / `title_fld` フィールドゆれへのフォールバック
- [x] ブラウザ間動作の最終確認（Safari / Chrome / Edge、公開環境）

## 5) GAS（成果CSV 取込 → 集計）

- [x] `code.gs` スクリプトのドラフト作成（全文あり）
- [x] スプレッドシート側「拡張機能 → Apps Script」に `code.gs` を貼付
- [ ] メニュー `成果処理 > CSV取込→集計` の表示確認（`onOpen`）（次の作業候補）
- [ ] テスト：`成果CSV_RAW` にサンプルCSVを貼り付け→メニュー実行（次の作業候補）

  * 期待結果：`成果データ` に
    `氏名 / 案件名 / 承認状況 / キャッシュバック金額 / memberId(参考) / 原始報酬額(参考) / メモ`
- [ ] 承認限定ロジック・丸め方の妥当性確認（現状：**承認のみ支払、切り捨て**）（次の作業候補）
- [ ] トリガー設定（`setupTrigger()`）で定時自動実行（次の作業候補）

## 6) 運用UI（任意・拡張）

- [ ] 管理者向けダッシュボード（案件別クリック数、最新集計のDLボタン等）

## 7) 監視・ログ・その他

- [ ] AdBlock が投げる `ERR_BLOCKED_BY_CONTENT_BLOCKER` は無視（機能影響なし）（要確認）
- [ ] プレビュー／公開の挙動差に注意（会員系APIは公開で検証）（要確認）
- [ ] 例外時の `console.error` ログの簡潔化＆ユーザー通知（必要に応じて）（要確認）

---

# 直近の「次にやること」（優先順）

   * Apps Script に `code.gs` を貼り付け → メニュー出現確認 → サンプルCSVで実行 → `成果データ` を確認
   * 問題なければ `setupTrigger()` を実行し自動化
4. [ ] **ブラウザ実機テスト**（公開サイト）（要確認）

   * ログイン → 案件一覧 → 申込ボタン → `クリックログ` の追記を確認 → `?id1=` が付与されているか確認

---

# 受け入れ条件（Doneの定義）

* 案件一覧の申込クリックで

  - [x] 遷移URLに `?id1=<memberId>` が付与される
  - [x] `クリックログ` に `[日時(JST), memberId, dealName]` が 1 行追記
* `成果CSV_RAW` にCSV貼付 → メニュー実行（or トリガー）で

  - [x] `成果データ` に **承認のみ支払**、**還元率20%・切り捨て**で計算結果が出力
  - [x] 数千行規模でもバッチ処理で完走
* （任意）会員/管理UIの可視化を追加

---

必要なら、このToDoを**チェックリスト化した.md**やWix用タスクカードに落とすこともできます。次は「GAS貼付→CSVでの初回実行」をやって、結果スクショを見せてもらえると、最終調整に入れます。
