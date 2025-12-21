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
│   ├── gas-deployment-guide.md           ← GASデプロイガイド（Rentracks対応v4.1.0、デプロイ手順、トラブルシューティング）
│   ├── rentracks-conversion-matching.md  ← Rentracks成果マッチング運用マニュアル（週1回CSV処理、uix分割、トラブルシューティング、技術仕様）
│   ├── microcms-cache-revalidation.md    ← microCMSキャッシュ再検証設定ガイド（ISR 60秒、トラブルシューティング）
│   └── rentracks-investigation-report.md ← レントラックス成果トラッキング実装方法調査報告書（Phase 1: 情報収集待ち）
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
├── MANUAL/                   ← 手動運用マニュアル（PDF形式）
│   └── m1_a8.netの申込履歴を更新する.pdf    ← A8.net申込履歴更新手順（PDFマニュアル）
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

#### `operations/` - 運用マニュアル・メンテナンスガイド

| ファイル | 内容 | ステータス | 主要トピック |
|---------|------|-----------|------------|
| **afb-a8-hybrid-workflow.md** | AFB自動ポーリング + A8.net手動CSVハイブリッド運用マニュアル | ✅ 運用中（AFB同期一時停止中） | AFB自動同期（GitHub Actions、10分毎）、A8.net手動CSV（週1回、5分）、モニタリング方法、トラブルシューティング、定期作業スケジュール |
| **gas-a8net-update-guide.md** | Google Apps Script修正ガイド（A8.net対応） | ✅ 実装完了 | HEADER_CANDIDATES拡張（A8.net固有カラム名）、APPROVED_VALUES拡張（A8.net固有ステータス値）、ステータス判定ロジック、実装手順、トラブルシューティング |
| **environment-variables-setup.md** | 環境変数設定ガイド（GitHub Secrets + Vercel） | ✅ 実装完了 | GitHub Secrets設定、Vercel環境変数設定、CRON_SECRET生成方法、セキュリティベストプラクティス |
| **a8-conversion-matching.md** | A8.net成果マッチング運用マニュアル | ✅ 運用中 | クリックログF/G列自動更新処理、Phase 1初回動作確認テスト、日常運用フロー（週1回、5分）、トラブルシューティング、技術仕様、FAQ |
| **gas-deployment-guide.md** | GASデプロイガイド（Rentracks対応v4.1.0） | ✅ 実装完了 | デプロイ手順、v4.1.0変更点（HEADER_CANDIDATES拡張、uix分割処理）、トラブルシューティング、サンプルCSVテストデータ、期待される実行結果 |
| **rentracks-conversion-matching.md** | Rentracks成果マッチング運用マニュアル（v1.0.0） | ✅ 運用準備完了 | 週1回の運用フロー（5分）、詳細手順（Rentracks CSV→Google Sheets→GAS実行）、トラブルシューティング（5つの問題パターン）、技術仕様（uixパラメータ形式、CSV構造、GAS処理フロー）、FAQ（8つの質問と回答） |
| **microcms-cache-revalidation.md** | microCMSキャッシュ再検証設定ガイド | ✅ 実装完了 | ISR 60秒設定、キャッシュ問題の原因、代替案（キャッシュ無効化、Webhook）、トラブルシューティング |
| **rentracks-investigation-report.md** | レントラックス成果トラッキング実装方法調査報告書 | ⏸️ アーカイブ | コンバージョンタグ方式（`_rt.cinfo`）、A8.net/AFBとの違い、広告主連携必須、実装前確認事項チェックリスト、実装スケジュール提案、リスクと注意事項 |

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

#### `MANUAL/` - 手動運用マニュアル（PDF形式）

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **m1_a8.netの申込履歴を更新する.pdf** | A8.net申込履歴更新手順 | PDF形式の手動運用マニュアル、A8.net成果データ更新フロー |

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

### 2025-12-21 (4回目)
- **GAS v4.3.1 → v4.3.2: eventId 必須チェック削除の緊急修正**
  - **google-spread-sheet/code.gs.js**: v4.3.1 → v4.3.2
    - FIX: eventId 列の必須チェックを削除（L142-145）
    - 原因: Rentracks CSV では eventId 列が存在しないためエラーが発生
    - 修正: eventId は任意として扱い、見つからない場合は警告ログのみ
    - 影響: Rentracks CSV が正常に処理可能に
  - **docs/operations/gas-deployment-guide.md**: v4.3.2セクション追加
    - v4.3.1デプロイ後のエラー詳細と修正内容を記載
  - **ステータス**: 実装完了、GASデプロイ待ち

### 2025-12-21 (3回目)
- **GAS v4.3.0 → v4.3.1: HEADER_CANDIDATES重複検出問題の緊急修正**
  - **google-spread-sheet/code.gs.js**: v4.3.0 → v4.3.1
    - FIX: HEADER_CANDIDATES.eventId から uix/備考 を削除
    - 原因: memberIdとeventIdが同じ列を検出し、uix分割処理が失敗
    - 影響: Rentracks CSV処理の正常化（A8.net互換性は維持）
  - **docs/operations/gas-deployment-guide.md**: v4.3.1セクション追加
    - 問題の詳細説明（症状、根本原因、修正後の動作）
  - **docs/operations/rentracks-conversion-matching.md**: トラブルシューティング#6追加
    - 「id1とid2が同じ値になる」問題の解決方法を明記
  - **ステータス**: 実装完了、GASデプロイ完了（v4.3.2で追加修正）

### 2025-12-21 (2回目)
- **GAS v4.2.0 → v4.3.0: Rentracks承認済件数対応**
  - **google-spread-sheet/code.gs.js**: v4.2.0 → v4.3.0
    - HEADER_CANDIDATES拡張: status候補に「承認済件数」を追加
    - 承認済件数→ステータス変換処理実装（0→"未確定", 1→"確定"）
    - A8.net CSVとの下位互換性を保証
  - **docs/operations/gas-deployment-guide.md**: v4.3.0対応に更新
    - v4.3.0の変更点セクション追加（承認済件数変換処理、変換例）
  - **docs/operations/rentracks-conversion-matching.md**: 承認済件数の扱いを追記
  - **ステータス**: 実装完了、GASデプロイ待ち

### 2025-12-21
- **GAS v4.2.0: クリックログシート ステータス色分け機能実装**
  - **google-spread-sheet/code.gs.js**: v4.1.0 → v4.2.0
    - 新規関数追加: `applyClickLogRowColors()` - G列（ステータス）の値に応じて行背景色を自動設定
    - 背景色ルール: 空=白、未確定=薄黄(#FFF9C4)、確定=薄緑(#C8E6C9)、否認=薄赤(#FFCDD2)、キャンセル=薄グレー(#E0E0E0)、その他=濃黄(#FFD700)
    - 自動適用: `recordConversionsToClickLog()`実行後に背景色を自動更新
    - 手動実行: メニュー「成果処理」→「クリックログの背景色を更新」
    - パフォーマンス最適化: バッチ処理による一括背景色設定
  - **docs/operations/gas-deployment-guide.md**: v4.2.0対応に更新
    - v4.2.0の変更点セクション追加（背景色ルール、使用例、メリット）
    - メニュー確認項目に「クリックログの背景色を更新」追加
    - バージョン情報更新（v4.2.0、2025-12-21）
  - **ステータス**: 実装完了、GASデプロイ待ち

### 2025-12-04
- **Rentracks成果トラッキング実装完了**: `operations/gas-deployment-guide.md`, `operations/rentracks-conversion-matching.md`新規作成、URLドメイン自動判定、uixパラメータ生成

### 2025-11-23
- **Rentracks調査報告書作成**: `operations/rentracks-investigation-report.md`新規作成（JavaScriptタグ方式、広告主連携必須、5-8週間実装見積）

### 2025-12-21
- **GAS v4.2.0: クリックログシート ステータス色分け機能実装**
  - **google-spread-sheet/code.gs.js**: v4.1.0 → v4.2.0
    - 新規関数追加: `applyClickLogRowColors()` - G列（ステータス）の値に応じて行背景色を自動設定
    - 背景色ルール: 空=白、未確定=薄黄(#FFF9C4)、確定=薄緑(#C8E6C9)、否認=薄赤(#FFCDD2)、キャンセル=薄グレー(#E0E0E0)、その他=濃黄(#FFD700)
    - 自動適用: `recordConversionsToClickLog()`実行後に背景色を自動更新
    - 手動実行: メニュー「成果処理」→「クリックログの背景色を更新」
    - パフォーマンス最適化: バッチ処理による一括背景色設定
  - **docs/operations/gas-deployment-guide.md**: v4.2.0対応に更新
    - v4.2.0の変更点セクション追加（背景色ルール、使用例、メリット）
    - メニュー確認項目に「クリックログの背景色を更新」追加
    - バージョン情報更新（v4.2.0、2025-12-21）
  - **ステータス**: 実装完了、GASデプロイ待ち

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

### 2025-11-15
- **AFB自動ポーリング + A8.net手動CSVハイブリッド実装完了**: `operations/`配下4ドキュメント新規作成、GitHub Actions 10分毎実行、GAS v3.0.0（onEditトリガー）、A8.net Parameter Tracking検証完了

### 2025-01-09
- **A8.net Parameter Tracking検証完了**: `dev/a8-support-inquiry-final.md`, `dev/github-issue-22-update.md`新規作成、Media Member契約では利用不可の可能性が高い

### 2025-01-04
- **ASP統合調査完了**: `specs/asp/a8net-api.md` v2.0.0（Media Member制限警告）、`specs/asp/afb-implementation-guide.md`新規作成、AFB優先実装へ移行

### 2025-01-03
- **DNS制限によるメール機能の制御**: `architecture/dns-infrastructure.md`新規作成、RESEND_VALIDフィーチャーフラグ実装・検証完了

### 2025-10-30
- **全ページ包括的SEO実装完了**: `dev/seo-implementation.md`新規作成（7ページのメタデータ・OGP・Twitter Card・JSON-LD）

### 2025-10-29
- **Resend.com詳細セットアップ手順書作成**: `guides/resend-setup.md`新規作成
- **ブログ機能の完全統合**: `app/blog/**`, `components/blog/**`実装、`@tailwindcss/typography`プラグイン統合

### 2025-10-27
- **Phase 3 CTA機能実装完了**: `guides/cta-shortcode-guide.md`, `guides/cta-technical-guide.md`新規作成、`components/blog/blog-content.tsx` v2.0.0

### 2025-10-26
- **Phase 3 ブログ機能実装完了**: `guides/microcms-setup.md`新規作成、BlogCard/DealCTAButton/Paginationコンポーネント実装

### 2025-10-25
- **Phase 2-1 Email Verification & Password Reset実装完了**: `guides/email-setup.md`新規作成

### 2025-01-25
- **Phase 1 実装状況を反映**
  - `specs/spec.md`: 技術スタックに具体的なバージョン番号を追加（Next.js 15.1.4、React 19、TailwindCSS v3.4.1 等）
  - `specs/spec.md`: Phase 1 チェックリストを更新し、70%完了状況を反映
  - 完了項目: Next.js初期化、TailwindCSS、microCMS SDK、Google Sheets API、shadcn/ui、基本レイアウト
  - 実装中: Next-Auth設定
  - `dev/architecture.md`: 新規作成（ディレクトリ構成とTypeScript設定の詳細を文書化）
  - 本ファイル（`index.md`）: 更新履歴セクション追加

---

## 参照ドキュメント

本プロジェクトの全体像を理解するには、以下のドキュメントを参照してください：

- `../CLAUDE.md` - プロジェクト概要・アーキテクチャ・開発ガイド（Claude Code向け）
- `./specs/spec.md` - WIN×Ⅱ 要件定義書（必読）
- `./dev/branch.md` - Git ブランチ戦略・コミット規約
- `../.taskmaster/CLAUDE.md` - Task Master AI 統合ガイド