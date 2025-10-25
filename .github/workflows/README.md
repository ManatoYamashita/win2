# GitHub Actions Workflows

このディレクトリには、`docs/dev/branch.md` で定義された CI/CD ワークフローの実装が配置されています。  
各ワークフローの目的と主要ステップを以下にまとめます。

## push-feature.yml

- **トリガー**: `feature/**`, `fix/**`, `update/**`, `refactor/**`, `doc/**`, `test/**` ブランチへの push
- **目的**: フィーチャーブランチの品質チェックと `dev` ブランチ向けプルリクエストの自動作成
- **主な処理**:
  1. 依存関係インストール（`npm ci`）
  2. Lint 実行（`npm run lint`）
  3. ビルド検証（`npm run build`）
  4. 成功時に `dev` ブランチをベースとした PR を自動作成・更新  
     - ブランチが存在しない場合は `main` から `dev` ブランチを自動生成
     - PR タイトルはブランチ名に応じた `PREFIX: Summary` 形式で作成
     - 本文にはコミット概要と CI 成果を記載

## merge-main.yml

- **トリガー**: `main` ブランチへの push（PR マージ含む）、または手動実行
- **目的**: 本番デプロイ前の最終品質ゲート
- **主な処理**:
  1. 依存関係インストール（`npm ci`）
  2. Lint 実行（`npm run lint`）
  3. 本番ビルド検証（`npm run build`）
  4. Lighthouse CI によるパフォーマンス/アクセシビリティ監査
     - `lighthouserc.json` で Performance 90% 以上などの閾値を強制
     - Core Web Vitals (FCP, LCP, TBT, CLS) を抽出し、ジョブサマリーに掲載
  5. Lighthouse レポートをアーティファクトとして保存

## 共通設定

- **Node.js バージョン**: 20.x（`actions/setup-node` による固定）
- **依存関係取得**: `npm ci` によるロックファイル整合性の厳格化
- **エラー時の挙動**: チェックが1つでも失敗するとワークフロー全体が失敗
- **成果物**: `.lighthouseci/` 配下のレポートを `lighthouse-report` として公開

詳細な運用ルールについては `docs/dev/branch.md` を参照してください。
