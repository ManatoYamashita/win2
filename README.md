# win2 プロジェクト README

君はまた、新しいおもちゃに手を伸ばしたわけですか。ふふ…美しく始めるために、まずは全体を見通しましょう。ここにあるのは Google Apps Script と Wix Velo の二面性を持つ、小さながらも人の業を映す鏡のような構成です。

## 概要

- **目的**: Google スプレッドシートと Wix サイトの連携を通じた業務オペレーションの自動化・可視化。
- **構成**:
  - `gas/`: Google Apps Script 用コード（`code.gs`）。
  - `wix-velo/`: Wix Velo 用コード。
    - `backend/`: サーバーサイド Web モジュール（`gSheetsLogger.jsw` など）。
    - `frontend/`: フロントのページ・コンポーネント（例: `案件一覧.js`）。

## ディレクトリ構成

```text
/Users/manatoy_mba/Desktop/dev/win2/
  ├─ gas/
  │   └─ code.gs
  ├─ wix-velo/
  │   ├─ backend/
  │   │   ├─ event.js
  │   │   └─ gSheetsLogger.jsw
  │   └─ frontend/
  │       └─ 案件一覧.js
  ├─ README.md
  └─ win2-project.md
```

## 前提技術とランタイム

- Google Apps Script (GAS) — スクリプトは Apps Script ランタイム上で実行。
- Wix Velo — Wix サイト内のバックエンド/フロントで稼働。
- ローカル編集は一般的なエディタ（本リポジトリはソースの保管とレビューを目的）。

## セットアップ（ローカル）

このリポジトリはローカル実行を前提にしていません。編集・レビュー・版管理を行い、以下の手順で各プラットフォームへ反映します。

1. GAS への反映

- 方式A: エディタ画面で `gas/code.gs` の内容を Google Apps Script エディタにコピーペースト。
- 方式B: `clasp` を利用した同期（導入時は Google アカウントとプロジェクト紐付けが必要）。
  - 参考コマンド例:

    ```bash
    npm install -g @google/clasp
    clasp login
    clasp create --type sheets --title "win2-gas"
    clasp push
    ```

1. Wix Velo への反映

- Wix エディタ（または Wix Studio）を開き、`wix-velo/backend/` および `wix-velo/frontend/` のソースを対応箇所へ反映。
- `*.jsw` は Velo の Backend Modules として作成し、エクスポート関数のシグネチャ一致を確認してください。

## 環境変数・設定

Wix と GAS の双方で、外部サービス（例: Google Sheets）にアクセスする場合があります。以下を確認してください。

- Google Sheets ID や範囲はコード内の定数で指定されている可能性があります。運用環境に合わせて書き換えを行うこと。
- 認可スコープ（GAS）は初回実行時に承認が必要です。
- Wix 側での Secrets Manager 利用を検討（機密情報をコードに直書きしない）。

## 開発フロー（PDCA と Issue 運用）

人は理想を語り、同じ過ちを繰り返します。だからこそ、儀式が必要なのです — PDCA。

1. PLAN（計画）
   - `.cursor/rules/general.mdc` を確認し、適用ルールを明記。
   - GitHub の Issue を起票/紐付け（MCP or CLI）。
   - 要件・設計・テスト観点を短く定義。

2. DO（実行）
   - 小さな単位で実装し、Issue に進捗を紐付け。
   - GAS/Wix へ反映して動作確認。

3. CHECK（評価）
   - 期待値と実動作との差分を記録。
   - ルール遵守・性能・セキュリティを点検。

4. ACTION（改善）
   - 知見を整理し、ルールへ反映提案。
   - Issue を更新し、次のサイクルへ。

## コーディング規約とコミット規約

- 原則としてシンプルな責務分離、明確な命名、不要な外部依存を避けること。
- コミットメッセージのプレフィックス:
  - `FEATURE`, `REFACTORING`, `FIX`, `STYLE`, `DOC`
  - 例: `FEATURE: Add logging to gSheetsLogger` / `FEATURE: gSheetsLogger にログ機能追加`

## テスト/検証の基本

- GAS: 単体関数ごとにログ出力を確認。可能なら擬似データで副作用を最小化。
- Wix: `*.jsw` の公開関数はフロントから呼び出し検証。エラーハンドリングとステータスコード準拠を確認。

## デプロイ・運用

- GAS: バージョン作成とデプロイを適切に管理（トリガー設定含む）。
- Wix: 本番/ステージング環境の切替がある場合はサイト複製またはブランチ戦略を選択。
- 機密情報は Secrets / プロパティサービスなどに退避。

## よくある落とし穴

- スプレッドシート権限不足（共有設定ミス）。
- Wix のバックエンド権限（データ権限/Secrets 未設定）。
- GAS のトリガーが編集後に未更新。

## ライセンス

プロジェクト固有のライセンスが未定義の場合、私たちは空白の契約書を握りしめているのと同じです。必要に応じて追記してください。

---

君はどう考えるかね？ この設計がもたらす結末を。フフフ…完成形など存在しません。あるのは絶え間ない改善と、過ちの記録だけです。
