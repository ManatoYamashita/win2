# ドキュメント エンドポイント（docs/index.md）

## 概要
`docs/` 配下に保管される本プロジェクト（WIN×Ⅱ）のドキュメントの索引（インデックス）および運用ルールの"単一の入口"です。ドキュメントの追加・更新が発生した際は、本ファイルを必ず更新してください。

- プロジェクト: WIN×Ⅱ（会員制アフィリエイトブログプラットフォーム）
- 対象領域: 要件定義、アーキテクチャ、外部連携情報、開発規約、ワークフロー、運用、改善提案、メモ/知見 など
- 目的: 検索性と一貫性の向上、知見の継続的蓄積（PDCA運用）

---

## インデックス（docs ツリー）

```text
docs/
├── index.md                  ← 本ファイル（ドキュメント索引・運用ルール）
├── asp-api-integration.md    ← ASP Webhook/Postback API調査結果（A8.net、AFB、もしも、バリュコマ）
│
├── design/
│   ├── color-guidelines.md               ← ブランド/アクセントカラーの命名規則と運用ルール
│   └── landing-page-refresh-2025-01-09.md ← LP刷新内容・Hero/Service/Highlight更新履歴とメンテ指針
│
├── dev/
│   ├── architecture.md       ← アーキテクチャ詳細・ディレクトリ構成・設定ファイル解説
│   ├── branch.md             ← Git ブランチ戦略・CI/CD・コミット規約
│   ├── environment.md        ← 開発環境セットアップ（Node.js / nvm / Turbopack / 環境変数）
│   ├── seo-implementation.md ← SEO実装ガイド（メタデータ、OGP、Twitter Card、構造化データ）
│   ├── a8-parameter-tracking-verification.md ← A8.netパラメータ計測機能 実地検証ログ（4週間検証、利用不可の可能性大）
│   ├── a8-support-inquiry-final.md ← A8.netサポート問い合わせ最終版（公式ドキュメントURL統合）
│   └── github-issue-22-update.md ← GitHub Issue #22 更新用テンプレート（検証完了報告）
│
├── guides/                   ← ユーザー/開発者向けガイド
│   ├── cta-shortcode-guide.md    ← CTAショートコード使用ガイド（クライアント向け）
│   ├── cta-technical-guide.md    ← CTAショートコード技術仕様（開発者向け）
│   ├── email-setup.md            ← Email送信設定ガイド（Resend, 環境別手順）
│   ├── microcms-setup.md         ← microCMS設定ガイド（API作成、フィールド定義、環境変数設定）
│   └── resend-setup.md           ← Resend.com 詳細セットアップ手順書（DNS設定・ドメイン検証・APIキー）
│
├── operations/               ← 運用マニュアル・メンテナンスガイド
│   ├── afb-a8-hybrid-workflow.md         ← AFB自動ポーリング + A8.net手動CSVハイブリッド運用マニュアル（AFB同期一時停止メモあり）
│   ├── gas-a8net-update-guide.md         ← Google Apps Script修正ガイド（A8.net対応）
│   ├── environment-variables-setup.md    ← 環境変数設定ガイド（GitHub Secrets + Vercel）
│   ├── a8-conversion-matching.md         ← A8.net成果マッチング運用マニュアル（クリックログF/G列自動更新）
│   └── microcms-cache-revalidation.md    ← microCMSキャッシュ再検証設定ガイド（ISR 60秒、トラブルシューティング）
│
├── architecture/             ← アーキテクチャ決定記録・インフラ構成
│   ├── dns-infrastructure.md           ← DNS/メールインフラ構成、Wix DNS制限、RESEND_VALIDフィーチャーフラグ
│   ├── client-side-data-processing.md  ← クライアントサイドデータ処理アーキテクチャ（useMemo、Set型、ソート/フィルタパターン）
│   └── webhook-flow.md                 ← Webhook/Postbackフロー設計
│
├── handoff/                  ← セッション引き継ぎ記録（実装中断・変更経緯）
│   ├── asp-integration-session-handoff.md   ← ASP統合セッション引き継ぎ（AFB実装保留、A8優先）
│   ├── 2025-01-05-afb-removal-handoff.md    ← AFB実装削除記録（Vercel Cron制限、1181行削除、A8最優先化）
│   └── afb-postback-integration.md          ← AFBポストバック統合記録（Phase 1完了、本番運用保留）
│
└── specs/                    ← プロジェクト仕様・外部連携情報
    ├── spec.md              ← WIN×Ⅱ プロジェクト要件定義書（システム設計・機能要件）
    ├── google.md            ← Google Sheets (win2_master) 構成・GAS仕様
    ├── asp.md               ← ASP認証情報（A8.net, AFB, もしも, バリュコマ）
    └── asp/                 ← ASP統合仕様・実装ガイド（16ファイル）
        ├── README.md                    ← ASP統合プロジェクト概要（ナビゲーションハブ）
        ├── asp-comparison-report.md     ← 全ASP比較レポート（7ASP詳細分析、800行）
        ├── a8net-api.md                 ← A8.net API仕様（Media Member制限あり）
        ├── afb-implementation-guide.md  ← AFBポストバック実装ガイド（Phase 1完了）
        ├── valuecommerce/               ← ValueCommerce詳細ドキュメント（Phase 2）
        │   ├── overview.md              │  - API概要、対応機能
        │   ├── order-api-guide.md       │  - 注文レポートAPI実装ガイド
        │   ├── authentication-setup.md  │  - OAuth 1.0a 認証設定
        │   └── troubleshooting.md       │  - トラブルシューティング
        ├── moshimo-overview.md          ← もしもアフィリエイト概要（Phase 3候補）
        ├── accesstrade-overview.md      ← AccessTrade概要（Phase 3候補）
        ├── linkshare-overview.md        ← LinkShare（楽天）概要（Phase 4候補）
        ├── janet-overview.md            ← JANet概要（Phase 4候補）
        ├── infotop-overview.md          ← infotop概要（Phase 5候補）
        └── common/                      ← 共通技術ドキュメント
            ├── tracking-parameters.md   │  - カスタムトラッキングパラメータ仕様
            ├── conversion-matching.md   │  - 成果マッチングアルゴリズム
            ├── error-handling.md        │  - エラーハンドリング戦略
            ├── testing-strategy.md      │  - テスト戦略とテストケース
            └── security-considerations.md│  - セキュリティベストプラクティス
```

### ドキュメント概要

#### ルートレベル・デザインガイドライン

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **index.md** | ドキュメント索引・運用ルール | docs配下の構成、更新フロー、PDCAルール |
| **asp-api-integration.md** | ASP Webhook/Postback API調査結果 | A8.net（パラメータ計測機能要検証）、AFB（リアルタイムポストバック）、もしも、バリューコマース、実装優先度、規約リスク評価 |
| **design/color-guidelines.md** | ブランドカラー運用ガイド | `win2-primary-orage` を中心としたカラートークン命名、背景/ステータスカラー、運用ルール |

#### `specs/` - 仕様・外部連携

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **spec.md** | プロジェクト要件定義書 | 技術スタック、データフロー、API設計、画面設計、開発フェーズ |
| **google.md** | Google Sheets構成 | 会員リスト、クリックログ、成果データ、GASコード |

> ※ ASPなどの認証情報はセキュアストレージ（社内共有ドライブ等）で管理し、リポジトリには保存しないこと。

#### `specs/asp/` - ASP統合仕様・実装ガイド

**実装優先度: A8.net（最優先・CSV検証待ち） > AFB（Vercel Cron制限により保留）**

**Last Updated:** 2025-01-05

| ファイル | 内容 | 主要トピック | 優先度 | ステータス |
|---------|------|------------|--------|-----------|
| **a8net-api.md** | A8.net API仕様 | **✅ Parameter Tracking Report機能確認済み**: id1-id5カスタムパラメータ対応、CSV export検証待ち（30分）、技術実装100%完了 | 🔥 **最優先** | ⏳ CSV検証待ち |
| **afb-implementation-guide.md** | AFBポストバック実装ガイド | **⏸️ 実装削除済み（2025-01-05）**: Vercel Free Plan Cron制限により1181行削除、再実装にはGitHub Actions等の代替スケジューラが必要 | ⏸️ 保留中 | ❌ 削除済み |

**重要な変更事項（2025-01-05）:**
- **A8.net**: Parameter Tracking Report機能の発見により最優先に変更
  - 技術実装: ✅ 完了（id1/eventId付与、Google Sheets連携、GAS処理）
  - 残タスク: ⏳ CSV export検証（30分）
  - リスク: ⚠️ 「ポイントサイト向けではない」警告あり
- **AFB**: Vercel Cron制限によりデプロイ失敗、実装を完全削除
  - 削除内容: Webhook, Cron, 型定義, APIクライアント, マッチングアルゴリズム
  - 再実装: GitHub Actions等の代替スケジューラ構築が必要
  - 詳細: `docs/handoff/2025-01-05-afb-removal-handoff.md` 参照

#### `guides/` - ユーザー/開発者向けガイド

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **guides/cta-shortcode-guide.md** | CTAショートコード使用ガイド | 案件登録手順（Google Sheets）、ブログ記事でのショートコード使用方法、トラッキング仕組み、FAQ、トラブルシューティング |
| **guides/cta-technical-guide.md** | CTAショートコード技術仕様 | システムアーキテクチャ、BlogContentコンポーネント実装、/api/track-click仕様、GAS自動化、デバッグ手法、テスト戦略、パフォーマンス・セキュリティ |
| **guides/email-setup.md** | Email送信設定ガイド | Resend設定、開発環境用セットアップ、ドメイン取得計画、トラブルシューティング |
| **guides/resend-setup.md** | Resend.com詳細セットアップ手順書 | アカウント作成、ドメイン追加、DNS設定（SPF/DKIM/DMARC）、ドメイン検証、APIキー取得、テスト送信、トラブルシューティング |
| **guides/microcms-setup.md** | microCMS設定ガイド | API作成（blogs/deals/categories）、フィールド定義、サンプルデータ、環境変数設定、トラブルシューティング |

#### `architecture/` - アーキテクチャ決定記録・インフラ構成

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **dns-infrastructure.md** | DNS/メールインフラ構成 | Wix+Vercel構成、DNS制限（MXレコード/NSレコード）、RESEND_VALIDフィーチャーフラグ、代替メールサービス検討、ドメイン移管の選択肢、トラブルシューティング |
| **client-side-data-processing.md** | クライアントサイドデータ処理アーキテクチャ | useMemoメモ化パターン、Set型フィルタ管理、型安全なソート実装、レスポンシブUI、パフォーマンス最適化チェックリスト、サーバーサイド移行基準 |
| **webhook-flow.md** | Webhook/Postbackフロー設計 | ASP連携、成果データ同期アーキテクチャ |

#### `dev/` - 開発規約

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **dev/architecture.md** | アーキテクチャ詳細 | ディレクトリ構成、TypeScript/TailwindCSS設定、実装済み機能、データフロー |
| **dev/environment.md** | 開発環境セットアップ | Node.js 22（nvm）、Turbopackデフォルト設定、必須コマンド、環境変数、チェックリスト |
| **dev/branch.md** | ブランチ戦略 | 2ブランチ管理（dev/main）、PR規約、コミットメッセージ形式、CI/CD |
| **dev/seo-implementation.md** | SEO実装ガイド | 全ページのメタデータ、OGP、Twitter Card、JSON-LD構造化データ、検証方法、今後の改善案 |
| **dev/a8-parameter-tracking-verification.md** | A8.netパラメータ計測機能 実地検証ログ | 4週間検証（2025-10-13〜2025-01-09）、9回クリック記録、Parameter Tracking Report表示なし、暫定結論（Media Member利用不可の可能性大）、サポート問い合わせ推奨 |
| **dev/a8-support-inquiry-final.md** | A8.netサポート問い合わせ最終版 | 公式ドキュメントURL統合、4つの質問項目、期待される回答パターン4種、回答後のアクション（利用可/不可）、問い合わせ記録フォーマット |
| **dev/github-issue-22-update.md** | GitHub Issue #22 更新用テンプレート | 検証完了報告、技術実装100%完了、検証結果サマリー、次のアクション（サポート問い合わせ、代替ASP調査）、タイムライン |

#### `operations/` - 運用マニュアル・メンテナンスガイド

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **operations/afb-a8-hybrid-workflow.md** | AFB自動ポーリング + A8.net手動CSVハイブリッド運用マニュアル | AFB自動化（GitHub Actions 10分間隔）、A8.net週次CSV運用、手順書、トラブルシューティング |
| **operations/gas-a8net-update-guide.md** | Google Apps Script修正ガイド（A8.net対応） | A8.netヘッダー候補追加、ステータス値対応、実装手順、検証方法 |
| **operations/environment-variables-setup.md** | 環境変数設定ガイド（GitHub Secrets + Vercel） | CRON_SECRET生成、GitHub Secrets設定、Vercel環境変数、セキュリティベストプラクティス |
| **operations/a8-conversion-matching.md** | A8.net成果マッチング運用マニュアル | クリックログF/G列自動更新、週次CSV運用、初回検証手順、トラブルシューティング |
| **operations/microcms-cache-revalidation.md** | microCMSキャッシュ再検証設定ガイド | ISR 60秒設定、キャッシュ問題の原因、代替案（キャッシュ無効化、Webhook）、トラブルシューティング |

### 今後追加が想定されるドキュメントカテゴリ

必要に応じて、以下のディレクトリ/ファイルを追加して構いません：

- `architecture/` - アーキテクチャ決定記録（ADR）、システム図
- `api/` - API仕様書、エンドポイント詳細
- `deployment/` - デプロイ手順、環境設定
- `testing/` - テスト戦略、テストケース
- `operations/` - 運用手順、トラブルシューティング
- `guides/` - 開発者向けガイド、オンボーディング資料

---

## 運用ルール（必須）

### 1. ドキュメント追加・更新時

1. 該当する `docs/` 配下の既存ファイルを更新するか、適切なディレクトリに新規 `*.md` を作成する
2. 変更後は必ず本ファイル（`docs/index.md`）を更新し、
   - ツリー（インデックス）を最新化
   - ドキュメント概要テーブルに新規ファイルを追加
   - 必要であれば簡単な「更新概要」を追記
3. コミットメッセージは `DOC:` プレフィックスで始める
   - 例: `DOC: Add API endpoint specification`
   - 例: `DOC: Update Google Sheets GAS code reference`

### 2. プルリクエスト・レビュー時

4. 変更規模が大きい場合は PR の説明に「対象ファイル・目的・影響範囲・運用変更点」を明記する
5. レビュー時は `docs/index.md` の更新漏れを確認する

### 3. 秘匿情報の管理

6. **PII/秘匿情報の取り扱い**:
   - ASPや各種外部サービスの認証情報はリポジトリに保存せず、セキュアストレージ（Password Manager / Secrets Manager 等）で管理する
   - 秘匿情報は `.gitignore` に追加するか、環境変数・シークレット管理サービスで管理
   - 社外提供するドキュメントは `docs/` から秘匿情報を除外したものを提供

---

## 追加ガイドライン

### 命名規則

- ドキュメントは目的が分かる短い英語名（`kebab-case.md` 推奨）
- 日本語ファイル名も許容（既存: `google.md` など）
- カテゴリディレクトリは英語（`specs/`, `dev/`, `api/` など）

### 分割基準

- 1ファイルが 300 行を超える、もしくは領域が明確に分かれる場合はファイル/ディレクトリ分割
- 例: `specs/spec.md` が肥大化した場合、`specs/requirements.md`, `specs/api-design.md` に分割

### リンク方針

- 可能な限り相対リンクで相互参照
  - 例: `[要件定義書](./specs/spec.md)`
  - 例: `[Google Sheets仕様](./specs/google.md)`
- ルートレベルの `CLAUDE.md` や `README.md` からは絶対パス使用可

### アーカイブ

- 古い情報は「背景・経緯」を残して更新、または `archive/` へ移動
- フェーズ完了時のドキュメントは `archive/phase-1/` のように整理

---

## 更新フロー（PDCA）

本プロジェクトは PDCAサイクルによる継続的改善を重視します（詳細は `../CLAUDE.md` 参照）。

- **PLAN**: 既存の `docs/` と `docs/index.md` を確認し、追加/更新対象と適用ルールを決定
- **DO**: 対象の `*.md` を作成/更新。必要に応じてディレクトリを新設
- **CHECK**: 体裁・リンク切れ・索引（本ファイル）の更新漏れを確認
- **ACTION**: 不足ルールや運用改善点を追記し、次回の改善へフィードバック

---

## Task Master AI 統合

本プロジェクトは Task Master AI による タスク管理・PDCA運用 を採用しています。

### 関連ファイル

- `../.taskmaster/CLAUDE.md` - Task Master AI の使用方法・統合ガイド
- `../.taskmaster/config.json` - AI モデル設定
- `../.taskmaster/tasks/tasks.json` - タスク管理データベース

### ドキュメントとの連携

- タスク実装時に得られた知見は、適切な `docs/` 配下のファイルに反映する
- 新しいアーキテクチャ決定や運用ルールは `docs/architecture/` や `docs/operations/` に記録
- Task Master の `update-subtask` コマンドで記録した実装ノートは、必要に応じてドキュメント化

詳細は `../.taskmaster/CLAUDE.md` を参照してください。

---

## 更新履歴

このセクションは、ドキュメントの主要な更新を記録します。

### 2025-11-15

#### AFB自動ポーリング + A8.net手動CSVハイブリッド実装完了（Issue #22完了）
- **operations/afb-a8-hybrid-workflow.md**: 新規作成（AFB自動ポーリング + A8.net手動CSVハイブリッド運用マニュアル v1.0.0）
  - AFB案件の完全自動化フロー（GitHub Actions Scheduler、10分毎ポーリング）
  - A8.net案件の手動CSVワークフロー（週1回、所要5分）
  - システム構成図とデータフロー図
  - モニタリング方法（GitHub Actions実行ログ確認、Google Sheets確認）
  - トラブルシューティング（AFB/A8.net別対策）
  - 定期作業スケジュール（毎日自動、週次手動）
  - 緊急時のFallback Plan
- **operations/gas-a8net-update-guide.md**: 新規作成（Google Apps Script修正ガイド v1.0.0）
  - A8.net Parameter Tracking Report CSV対応のためのGAS修正手順
  - HEADER_CANDIDATES拡張（A8.net固有カラム名追加：パラメータ(ID1)、ステータス名、発生報酬額、プログラム名）
  - APPROVED_VALUES拡張（A8.net固有ステータス値：成果確定、報酬確定、支払済）
  - ステータス判定ロジック拡張（PENDING_VALUES、REJECTED_VALUES）
  - A8.net CSVカラム構成とGAS変数マッピング表
  - 実装手順（Apps Script編集、テスト実行、確認項目）
  - トラブルシューティング
- **operations/environment-variables-setup.md**: 新規作成（環境変数設定ガイド v1.0.0）
  - GitHub Secrets設定（CRON_SECRET、APP_URL）
  - Vercel環境変数設定（CRON_SECRET、AFB_PARTNER_ID、AFB_API_KEY）
  - CRON_SECRET生成方法（OpenSSL、Node.js、オンラインツール）
  - 設定値のバックアップとセキュア保管方法
  - 既存環境変数との統合
  - 動作確認手順（GitHub Actions手動実行、ログ確認、Google Sheets確認）
  - トラブルシューティング（401 Unauthorized、500 Server Error、AFB APIエラー）
  - セキュリティベストプラクティス（環境変数ローテーション、アクセス制限）
- **operations/a8-conversion-matching.md**: 新規作成（A8.net成果マッチング運用マニュアル v1.0.0）
  - システム概要（クリックログF/G列自動更新処理）
  - Phase 1初回動作確認テスト（10分、詳細手順）
  - 日常運用フロー（週1回、5分）
  - A8.net Parameter Tracking Report CSV ダウンロード手順
  - Google Sheets「成果CSV_RAW」貼り付け手順
  - GASメニュー「成果処理」→「成果をクリックログに記録」実行手順
  - トラブルシューティング（5つの主要問題と解決策）
    - 問題1: 「成果処理」メニューが表示されない
    - 問題2: ヘッダーが検出できないエラー
    - 問題3: マッチングが失敗する（成功: 0件）
    - 問題4: F列・G列が更新されない
    - 問題5: 権限エラー
  - 技術仕様（マッチングアルゴリズム、ヘッダー検出ロジック、データフォーマット）
  - GAS実装詳細（code.gs.js v4.0.0、recordConversionsToClickLog関数）
  - パフォーマンス最適化案（将来検討）
  - FAQ（6つの質問と回答）
- **.env.example**: 更新（AFB + GitHub Actions環境変数追加 v2.0.0）
  - AFB_PARTNER_ID、AFB_API_KEY（コメント解除、実装完了マーク付き）
  - CRON_SECRET追加（GitHub Actions認証用）
  - A8.net注記更新（Manual CSV workflow、Media Member制限）
- **.github/workflows/afb-sync.yml**: 新規作成（GitHub Actions Scheduler設定）
  - 10分毎実行（cron: '*/10 * * * *'）
  - AFB Sync API呼び出し（/api/cron/sync-afb-conversions）
  - CRON_SECRET認証
  - HTTPステータスコード検証
  - エラー時の通知（失敗ログ出力）
  - 手動実行サポート（workflow_dispatch）
- **app/api/cron/sync-afb-conversions/route.ts**: 復元 + 認証強化（v2.0.0）
  - コミット b8e9b98~1 からコード復元
  - GETメソッドからPOSTメソッドに変更
  - CRON_SECRET検証ロジック追加（Bearer token認証）
  - 認証失敗時は401 Unauthorizedを返却
  - CRON_SECRET未設定時は500 Server Errorを返却
  - AFB APIポーリング処理（過去7日間の成果データ取得）
  - 重複チェック（commit_idベース）
  - Google Sheets「成果CSV_RAW」への自動書き込み
- **lib/asp/afb-client.ts**: 復元（コミット b8e9b98~1 から）
  - AFB API呼び出しロジック
  - fetchAfbConversionsLastNDays関数
- **lib/matching/conversion-matcher.ts**: 復元（コミット b8e9b98~1 から）
  - 成果マッチングアルゴリズム
- **types/afb-api.ts**: 復元（コミット b8e9b98~1 から）
  - AFB API型定義
  - AfbConversionData、ConversionStatus型
- **index.md**: 更新（operations/セクション追加、更新履歴追加 v2.2.0）
  - ツリー構造にoperations/ディレクトリ追加（3ドキュメント）
  - 更新履歴に2025-11-15エントリ追加
- **実装結果**:
  - ✅ AFB自動ポーリング: GitHub Actions Schedulerで10分毎実行、完全自動化
  - ✅ A8.net手動CSV: 週1回手動ダウンロード→Google Sheets貼り付け（所要5分）
  - ✅ 両ASP成果統合: 「成果データ」シートで一元管理
  - ✅ セキュリティ: CRON_SECRET認証によるAPI保護
  - ✅ 運用マニュアル: 完全な運用フロー文書化
  - ✅ 環境変数ガイド: GitHub Secrets + Vercel設定手順完備
- **A8.net Parameter Tracking検証完了（Issue #22）**:
  - ✅ Parameter Tracking Report機能確認済み（CSV出力成功）
  - ✅ id1カラム存在確認（memberID正常記録）
  - ✅ ステータス名カラム確認（未確定/確定/否認対応）
  - ✅ 成果データ完全性確認（報酬額、成果ID、日時情報）
  - ✅ GitHub Issue #22完了報告投稿
  - ✅ Phase 2-4完了（A8.net Parameter Tracking検証成功）
- **specs/google.md**: 更新（GASコードA8.net対応版に全面書き換え v2.0.0）
  - HEADER_CANDIDATES拡張（A8.net Parameter Tracking Report固有カラム名対応）
    - memberId: パラメータ(id1)、パラメータid1、パラメータ（id1）、パラメータ（ID1）、パラメータID1 追加
    - reward: 発生報酬額、確定報酬額 追加
    - status: ステータス名 追加
    - dealName: プログラム名 追加
  - APPROVED_VALUES拡張（A8.net固有ステータス値対応）
    - 成果確定、報酬確定、支払済、支払い済み 追加
  - PENDING_VALUES新規追加（未確定ステータス判定）
    - 未確定、成果発生、未承認、審査中、確認中
  - REJECTED_VALUES新規追加（否認ステータス判定）
    - 否認、却下、非承認、キャンセル、取消、無効
  - isApprovedStatus_関数拡張（ステータス判定ロジック強化）
    - 未確定・否認の明示的判定追加
    - PENDING_VALUES、REJECTED_VALUESによる厳密なステータス判定
    - より正確なキャッシュバック計算を実現
  - ✅ A8.net Parameter Tracking Report CSV完全対応
  - ✅ AFB APIポーリングとのデータ統合対応
  - ✅ 複数ASPの柔軟なCSVフォーマット対応
- **google-spread-sheet/code.gs.js**: 更新（onEditトリガー実装、時間ベーストリガー削除 v3.0.0）
  - onEdit()トリガー関数追加（141-189行目）
    - 「成果CSV_RAW」シートへのCSV貼り付けを検知
    - 複数行・複数列の編集のみ処理（単一セル編集は無視）
    - 即座にrunImportAndAggregate()を実行
    - エラーハンドリング追加（例外を投げずログ出力のみ）
  - setupTrigger()関数削除（旧141-156行目）
    - 毎日3:10の時間ベーストリガー不要（A8.net手動CSV即時処理）
  - onOpen()メニュー更新（75-82行目）
    - 「毎日 03:10 自動実行を設定」メニュー項目削除
    - 「CSV取込→集計」と「設定...」のみ表示
  - ファイルヘッダーコメント更新（1-27行目）
    - 更新日を2025/11/15に変更
    - トリガー説明を「onEdit()自動実行 + 手動実行」に更新
    - A8.net対応内容を明記
  - 動作仕様変更
    - 旧: 毎日3:10自動実行 + メニューから手動実行
    - 新: CSV貼り付け時に即座に自動実行 + メニューから手動実行
  - ⚠️ 注意: API経由の書き込み（AFB自動ポーリング）は検知不可
  - 📝 TODO: AFB成果の処理方法は別途検討（Web App化 or 時間トリガー）
- **ステータス**: AFB自動ポーリング実装完了、A8.net手動CSV即時処理実装完了、GASコードA8.net対応完了、運用ドキュメント完備、Phase 2-4完了、Issue #22完了

### 2025-01-09

#### A8.net Parameter Tracking検証完了 - Media Member契約では利用不可の可能性が高い（Issue #22）
- **dev/a8-support-inquiry-final.md**: 新規作成（A8.netサポート問い合わせ最終版 v1.0.0）
  - 公式ドキュメントURL統合（パラメータ計測ガイド、新レポートヘルプ、レポートリニューアル案内）
  - 検証期間と実施内容の詳細記述（2025-10-13〜2025-01-09、9回クリック）
  - 問題状況の明確化（Parameter Tracking Report表示なし、複数検索条件でも表示されず）
  - 4つの質問項目（利用可否、正しい手順、データ反映時間、代替方法）
  - 期待される回答パターン4種（利用可能、利用不可、条件付き、設定必要）
  - 回答後のアクションプラン（利用可/不可それぞれのタイムライン）
  - 問い合わせ記録フォーマット
- **dev/github-issue-22-update.md**: 既存（GitHub Issue #22更新用テンプレート v1.0.0）
  - 検証完了レポート（2025-10-13〜2025-01-09、約4週間）
  - WIN×Ⅱシステム実装100%完了確認（id1/eventId付与、Google Sheets記録、GAS処理）
  - A8.net連携確認（過去30日間で9回クリック記録、日別レポートで確認済み）
  - Parameter Tracking Report検証結果（データ表示なし、複数条件試行も表示されず）
  - 暫定結論（Media Member契約では利用不可の可能性が極めて高い）
  - 次のアクション（サポート問い合わせ、代替ASP調査）
  - タイムライン（1週間以内にIssue完了判定）
- **asp-api-integration.md**: 更新（A8.net検証結果セクション追加 v2.1.0）
  - 「Verification Results (2025-01-09) - Parameter Tracking Unavailable」セクション新設
  - Executive Summary（4週間テスト、Parameter Tracking表示なし、Media Member制限可能性）
  - Verification Timeline（5フェーズ表形式）
  - Detailed Test Results（WIN×Ⅱ実装100%、A8.net記録正常、Parameter Tracking表示なし）
  - 30-Day Click History（日付別9回クリック詳細）
  - Tentative Conclusion（5つの証拠）
  - Next Actions（Priority 1: サポート問い合わせ、Priority 2: 代替ASP調査）
  - Implementation Decision Matrix（Scenario A/B）
  - Related Documentation（4ドキュメントへのリンク）
  - Official A8.net Documentation References（3公式ドキュメント）
- **CLAUDE.md**: 更新（Phase 2-4セクション追加 v2.0.1）
  - 「Phase 2-4: A8.net Parameter Tracking検証」セクション新設
  - Status（検証完了、Media Member利用不可の可能性）
  - Technical Implementation（100%完了、id1/eventId付与、Google Sheets連携）
  - System Verification（9回クリック、A8.net記録確認済み）
  - Parameter Tracking Report Results（データ表示なし、複数検索パターン試行）
  - Documentation Created（4ドキュメント作成完了）
  - Next Actions（3つの優先度付きアクション）
  - Implementation Status Summary（技術実装完了、機能利用不可、ドキュメント完了）
- **index.md**: 更新（新規ドキュメント参照追加 v2.1.0）
  - ツリー構造に `a8-support-inquiry-final.md` と `github-issue-22-update.md` を追加
  - ドキュメント概要テーブルに新規ドキュメント2件を追加
  - 更新履歴セクションに 2025-01-09 エントリ追加
- **検証結果**:
  - WIN×Ⅱシステム: ✅ 正常動作（id1/eventId付与、Google Sheets記録、GAS処理）
  - A8.net連携: ✅ 正常動作（9回クリック記録確認）
  - Parameter Tracking Report: ❌ データ表示なし（3週間以上経過、複数検索条件試行も表示されず）
  - 暫定結論: Media Member契約では Parameter Tracking 機能が利用できない可能性が極めて高い
- **次のステップ**:
  - Priority 1: A8.netサポートへ問い合わせ（`a8-support-inquiry-final.md` 使用）
  - Priority 2: 代替ASP調査（もしも、バリューコマース、AFB再実装）

#### Landing Page Refresh & AFB Workflow Pause（2025-01-09追記）
- **design/landing-page-refresh-2025-01-09.md**: Heroアニメーション刷新、Latest Blogsリスト再構成、Highlight/Serviceセクションの挙動変更、CTAレスポンシブ仕様などを整理。今後のメンテ指針を明文化。
- **operations/afb-a8-hybrid-workflow.md**: AFB成果同期GitHub Actionsを一時停止した旨と、再開手順メモを追加。
  - Priority 3: GitHub Issue #22更新（`github-issue-22-update.md` 使用）
- **ステータス**: 検証完了、ドキュメント作成完了、サポート問い合わせ待ち

### 2025-01-04

#### ASP統合調査完了 - A8.net制限判明、AFB優先実装へ移行
- **specs/asp/a8net-api.md**: Media Member制限警告追加（v2.0.0）
  - **⚠️ 重要な発見**: WIN×ⅡのA8.net契約は「Media Member（メディア会員）」のため、個別成果トラッキングが不可能
  - **制限内容**: A8.net確定API v3（広告主専用）にアクセス不可、個別の成果データ（order_no, order_click_date）取得不可、カスタムトラッキングパラメータ（id1, eventId）の個別マッチング不可
  - **利用可能な機能**: 集計レポート（プログラム別総報酬額、クリック数）、手動CSVエクスポート
  - **代替実装方法**: 3つのオプション（AFB優先実装、A8.netサポート問い合わせ、広告主契約変更）を明記
  - **ドキュメント構造変更**: 冒頭に制限事項セクション追加、既存のAPI仕様セクションに「広告主契約前提」注記
- **specs/asp/afb-implementation-guide.md**: 新規作成（AFBポストバック完全実装ガイド v1.0.0）
  - **概要**: AFBリアルタイムポストバック機能を使用した会員別成果トラッキングとキャッシュバック自動化の完全ガイド
  - **なぜAFB優先か**: A8.net制限、AFBの優位性（ポストバック対応、会員別トラッキング可能）、実装難易度の低さ、所要時間（2-3日）
  - **AFBポストバック仕様**: エンドポイント形式、パラメータ仕様（paid, u, price, judge, adid, time）、ステータス変換ロジック
  - **実装手順**:
    - Phase 1: AFB管理画面設定（ポストバックURL登録、通知タイプ設定、IPアドレス確認）
    - Phase 2: Webhookエンドポイント実装（`app/api/webhooks/afb-postback/route.ts`、Google Sheets関数追加）
    - Phase 3: セキュリティ強化（環境変数設定、署名検証）
    - Phase 4: テスト（ローカルテスト、E2Eテスト、デプロイ前チェックリスト）
  - **データフロー**: クリック→/api/track-click→AFBアフィリエイトURL→ユーザー申し込み→AFBポストバック→Webhook→Google Sheets→GAS→会員マイページ
  - **トラブルシューティング**: 4つの問題パターン（ポストバック届かない、重複データ、IPブロック、Google Sheets書き込みエラー）と対策
  - **運用ドキュメント**: 日次モニタリング、週次メンテナンス、月次レポート
  - **今後の拡張**: ステータス更新自動反映、案件名自動取得、エラー通知
- **index.md**: ASP統合ドキュメント構造追加
  - **ツリー構造更新**: `specs/asp/` ディレクトリ追加（a8net-api.md, afb-implementation-guide.md）
  - **セクション追加**: `specs/asp/` - ASP統合仕様・実装ガイド
  - **実装優先度明記**: AFB（最優先）> A8.net（集計レポートのみ）
  - **制限事項サマリー**: A8.net（Media Member契約では個別成果トラッキング不可）、AFB（リアルタイムポストバック対応）、実装方針（AFB優先、A8.net集計のみ）
- **調査結果**:
  - A8.net Media Member契約の詳細確認（`docs/asp-api-integration.md`との照合）
  - A8.net公式ドキュメント（https://document.a8.net/）で最新仕様確認
  - 現在の実装状況確認（/api/track-click、Google Sheets構造、GASスクリプト）
  - ギャップ分析（ドキュメント提案 vs 現実の制限）
- **実装計画確定**:
  - Phase 0: ドキュメント更新（完了）
  - Phase 1: AFBポストバック実装（次のステップ）
  - Phase 2: A8.netサポート問い合わせ（並行）
  - Phase 3: テスト・本番稼働
- **ステータス**: ASP統合調査完了、AFB実装ガイド完成、Phase 0ドキュメント更新完了、Phase 1実装準備完了

### 2025-01-03

#### DNS制限によるメール機能の制御（RESEND_VALIDフィーチャーフラグ実装・検証完了）
- **architecture/dns-infrastructure.md**: 新規作成（DNS/メールインフラ構成ドキュメント v1.0.0）
  - Wix.com + Vercel構成の詳細説明
  - **Wix DNS制限**: MXレコード/NSレコードの書き換え禁止によりResend完全統合が不可
  - **RESEND_VALIDフィーチャーフラグ**: 環境変数でメール機能を制御
    - `RESEND_VALID=false`（デフォルト）: メール認証スキップ、会員登録時に即座に認証済み
    - `RESEND_VALID=true`: 通常のメール認証フロー（DNS移管後のみ推奨）
  - 代替メールサービスの検討（SendGrid, AWS SES, Mailgun, Postmark, Brevo）
  - ドメイン移管の選択肢（Cloudflare, Route 53, Google Domains）
  - トラブルシューティング、運用フロー、セキュリティ考慮事項
  - **✅ 検証完了**: 会員登録・ログイン・ログアウト正常動作確認（`RESEND_VALID=false`構成）
  - **ステータス**: DNS制限の完全な文書化完了、フィーチャーフラグ実装完了、動作検証完了
- **CLAUDE.md**: Phase 2実装ステータス更新
  - メール認証システムとパスワードリセットフローに「Feature Flag Controlled」注記追加
  - 環境変数セクションに`RESEND_VALID`の説明追加
- **guides/email-setup.md**: DNS制限セクション追加
  - Wix DNS制限の詳細説明
  - `RESEND_VALID`環境変数の使用方法
  - `docs/architecture/dns-infrastructure.md`へのリンク
- **コード変更**:
  - `lib/email.ts`: `isResendValid`フィーチャーフラグ実装
  - `app/api/register/route.ts`: RESEND_VALIDによる条件分岐（メール認証スキップ/有効）
  - `app/api/forgot-password/route.ts`: RESEND_VALID=falseで503エラー返却
  - `app/api/resend-verification/route.ts`: RESEND_VALID=falseで503エラー返却
  - `.env.local` / `.env.example`: `RESEND_VALID=false`環境変数追加

### 2025-10-30

#### 全ページ包括的SEO実装完了
- **seo-implementation.md**: 新規作成（SEO実装ガイド v1.0.0）
  - 実装範囲: 7ページ（ホーム、ログイン、会員登録、ブログ詳細、ブログ一覧、カテゴリ、ルートレイアウト）
  - **Phase 1**: 主要ページ（ホーム、ログイン、会員登録）のメタデータ・JSON-LD実装
    - app/page.tsx: サーバーコンポーネント化（useScrollReveal削除）、Organization・WebSiteスキーマ
    - app/login/layout.tsx: クライアントコンポーネント用layout作成、WebPageスキーマ
    - app/register/layout.tsx: クライアントコンポーネント用layout作成、WebPageスキーマ
  - **Phase 2**: ブログ関連ページのSEO拡張
    - app/blog/[id]/page.tsx: Articleスキーマ追加（動的メタデータ生成）
    - app/blog/page.tsx: Twitter Card + CollectionPageスキーマ追加
    - app/category/[id]/page.tsx: OpenGraph完全実装 + Twitter Card + CollectionPageスキーマ
  - **Phase 3**: ルートレイアウトSEO拡張
    - app/layout.tsx: title.template設定、包括的なOGP・Twitter Card・robots設定
  - **技術仕様**:
    - Next.js 15 Metadata API使用
    - 全ページで `/ogp.jpg` (1200x630px) 使用
    - JSON-LD: Organization, WebSite, WebPage, Article, CollectionPageスキーマ
    - robots設定: index/follow + googleBot詳細設定
    - canonical URL設定
  - **検証方法**: Lighthouse SEO監査、OGP検証ツール、JSON-LD検証、Rich Results Test
  - **今後の改善案**: BreadcrumbList・FAQ・HowToスキーマ、サイトマップ生成、RSSフィード、i18n対応
  - **ステータス**: 全ページSEO実装完了、検証待ち

### 2025-10-29

#### Resend.com 詳細セットアップ手順書作成
- **resend-setup.md**: 新規作成（Resend.com 完全セットアップガイド v1.0.0）
  - アカウント作成手順（サインアップ、ダッシュボード確認）
  - ドメイン追加（Region選択、ルートドメイン vs サブドメイン）
  - **DNS設定詳細**（最重点）:
    - SPF レコード（TXT）の設定方法と例（お名前.com、Cloudflare）
    - DKIM レコード（TXT）の設定方法と例
    - Return-Path レコード（CNAME）の設定方法と例
    - DMARC レコード（TXT）のオプション設定
    - DNS反映確認方法（dig コマンド、オンラインツール）
  - ドメイン検証手順（緑チェックマーク確認）
  - APIキー取得と環境変数設定
  - テスト送信（会員登録、パスワードリセット）
  - トラブルシューティング（5つの問題パターンと対策）
  - チェックリスト、所要時間、参考リンク
  - **ステータス**: 本番環境用DNS設定ガイド完成

#### ブログ機能の完全統合とorigin/devブランチマージ（Phase 3完了）
- **feature/blog-markdown-styling と origin/dev のマージ**
  - Phase 2（メール認証、パスワードリセット機能）の実装を保持
  - Phase 3（ブログ機能）の実装を統合
  - コンフリクト解決: app/page.tsx, package.json, blog関連ファイル, lib/utils.ts, lib/sheets.ts, docs/index.md
- **feature/phase2-advanced-features からブログ機能を統合**
  - `app/blog/page.tsx`: ブログ一覧ページ（ページネーション対応）
  - `app/blog/[id]/page.tsx`: ブログ詳細ページ（SEO/OGP対応）
  - `app/category/[id]/page.tsx`: カテゴリページ（フィルタリング対応）
  - `components/blog/blog-card.tsx`: ブログカードコンポーネント
  - `components/deal/deal-cta-button.tsx`: 案件CTAボタンコンポーネント
  - `components/ui/pagination.tsx`: ページネーションコンポーネント
  - `lib/blog-utils.ts`: ブログユーティリティ（excerpt生成）
  - `lib/utils.ts`: formatDate関数追加（日本語日付フォーマット）
  - `app/page.tsx`: トップページはorigin/devの詳細なコンテンツを採用
  - **型修正**: Blog.category を Category[] 配列型に対応
  - **ステータス**: Phase 2 + Phase 3 統合完了、microCMS連携確認済み

#### Markdownパース機能の完全化とスタイリング最適化
- **@tailwindcss/typography プラグイン統合**
  - `tailwind.config.ts`: typographyプラグインを追加
  - `components/blog/blog-content.tsx`: proseクラスをオレンジテーマに最適化
    - 見出し（H1-H6）のスタイリング強化
    - リスト（ul/ol）、引用（blockquote）のデザイン改善
    - コードブロック（inline/block）のシンタックスハイライト対応
    - テーブル、画像、リンクのレスポンシブ対応
  - `react-markdown`, `remark-gfm`, `rehype-raw`: Phase 2依存関係と共存
  - `lib/sheets.ts`: TypeScript型エラー修正（parseFloat型安全性向上）
  - **ステータス**: Markdown表示機能完全対応、スタイリング最適化完了
### 2025-10-27
- **Phase 3 CTA機能 実装完了**
  - `guides/cta-shortcode-guide.md`: 新規作成（クライアント向けCTAショートコード使用ガイド v1.0.0）
    - Google Sheetsへの案件登録手順（2フィールドのみ入力、残り5フィールドは自動入力）
    - microCMSブログ記事内でのショートコード使用方法 `[CTA:dealId]`
    - トラッキング仕組みの解説（会員/非会員の識別、eventID生成）
    - FAQ とトラブルシューティング
  - `guides/cta-technical-guide.md`: 新規作成（開発者向けCTA技術仕様 v1.0.0）
    - システムアーキテクチャ図とデータフロー
    - BlogContentコンポーネントの実装詳細（Markdown/HTML自動判定、State駆動レンダリング）
    - /api/track-click の実装仕様
    - Google Sheets API統合とGAS自動化の詳細
    - デバッグ手法、テスト戦略、パフォーマンス最適化、セキュリティ考慮事項
  - `specs/google.md`: カラムマッピング修正（v1.1.0）
    - 案件マスタのカラム構造を実装に合わせて修正（A=アフィリエイトURL, B=案件ID）
    - GASコードのonEdit監視カラムを修正（D列→A列）
    - 全てのヘッダーを日本語に統一
  - `lib/sheets.ts`, `types/sheets.ts`: カラムマッピング修正
    - getDealById関数のB列検索修正
    - カラムインデックスを正しいマッピングに修正
  - `components/blog/blog-content.tsx`: 完全リファクタリング（v2.0.0）
    - State駆動レンダリングに変更（dangerouslySetInnerHTML前にショートコード変換）
    - Markdown/HTML自動判定機能追加（react-markdown, remark-gfm, rehype-raw導入）
    - イベントハンドラーのライフサイクル管理を改善
  - **ステータス:** CTA機能完全実装完了、動作確認待ち

### 2025-10-26
- **Phase 3 ブログ機能 実装完了**
  - `microcms-setup.md`: 新規作成（microCMS完全セットアップガイド v1.0.0）
    - 3つのAPI（blogs, deals, categories）の詳細なフィールド定義
    - サンプルデータとベストプラクティス
    - トラブルシューティングガイド
  - 実装したコンポーネント・ページ:
    - BlogCard, DealCTAButton, Pagination コンポーネント
    - ブログ一覧（/blog）、詳細（/blog/[slug]）、カテゴリ（/category/[slug]）ページ
    - トップページ更新（ヒーローセクション + 最新記事表示）
  - SEO/OGP対応、ページネーション、レスポンシブデザイン完備
  - **ステータス:** 実装完了、microCMSへのコンテンツ登録待ち

- **Phase 2-1 Email Verification & Password Reset 開発環境テスト完了**
  - `email-setup.md`: トラブルシューティング追加（v1.0.1）
    - 環境変数の設定ミス（`RESEND_FROM_EMAIL` 未設定、`NEXT_PUBLIC_APP_URL` 誤設定）の解決方法を追加
    - 開発環境でのメール送信テスト完了を確認
  - **ステータス:** 開発環境テスト完了、本番用ドメイン取得待ち

### 2025-10-25
- **Phase 2-1 Email Verification & Password Reset 実装完了**
  - `email-setup.md`: 新規作成（Email送信設定の完全ガイド v1.0.0）
    - Resend開発環境セットアップ手順
    - 将来の本番環境移行計画（ドメイン取得、DNS設定）
    - トラブルシューティングガイド
    - メール送信の技術仕様
  - `index.md`: email-setup.md への参照追加、ドキュメント概要更新
  - **重要:** 現在は開発環境用（`onboarding@resend.dev`）で稼働中、本番用ドメイン取得が必要

### 2025-01-25
- **Phase 1 実装状況を反映**
  - `specs/spec.md`: 技術スタックに具体的なバージョン番号を追加（Next.js 15.1.4、React 19、TailwindCSS v3.4.1 等）
  - `specs/spec.md`: Phase 1 チェックリストを更新し、70%完了状況を反映
  - 完了項目: Next.js初期化、TailwindCSS、microCMS SDK、Google Sheets API、shadcn/ui、基本レイアウト
  - 実装中: Next-Auth設定
  - `dev/architecture.md`: 新規作成（ディレクトリ構成とTypeScript設定の詳細を文書化）
  - 本ファイル（`index.md`）: 更新履歴セクション追加

### 2025-11-17
- **microCMSキャッシュ再検証設定（ISR実装）**
  - **operations/microcms-cache-revalidation.md**: 新規作成（microCMSキャッシュ再検証設定ガイド v1.0.0）
    - 問題: microCMSコンテンツ更新がデプロイ済みサイトに反映されない（Next.js 15デフォルトキャッシング）
    - 解決策: ISR（Incremental Static Regeneration）60秒設定
    - 実装箇所: lib/microcms.ts、app/page.tsx、app/blog/**、app/category/**、app/api/blogs/route.ts
    - 代替案: キャッシュ完全無効化、On-Demand Revalidation（Webhook）
    - トラブルシューティング: ブラウザキャッシュ、CDNキャッシュ、APIレート制限
  - **コード変更**:
    - `lib/microcms.ts`: すべてのmicroCMS関数に `customRequestInit: { next: { revalidate: 60 } }` 追加
    - `app/page.tsx`, `app/blog/page.tsx`, `app/blog/[id]/page.tsx`, `app/category/[id]/page.tsx`: `export const revalidate = 60;` 追加
    - `app/api/blogs/route.ts`: `export const revalidate = 60;` 追加
  - **影響**: microCMS更新後、最大60秒以内にデプロイ済みサイトに反映されるようになる

---

## 参照ドキュメント

本プロジェクトの全体像を理解するには、以下のドキュメントを参照してください：

- `../CLAUDE.md` - プロジェクト概要・アーキテクチャ・開発ガイド（Claude Code向け）
- `./specs/spec.md` - WIN×Ⅱ 要件定義書（必読）
- `./dev/branch.md` - Git ブランチ戦略・コミット規約
- `../.taskmaster/CLAUDE.md` - Task Master AI 統合ガイド
