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
│
├── design/
│   └── color-guidelines.md   ← ブランド/アクセントカラーの命名規則と運用ルール
│
├── dev/
│   ├── architecture.md       ← アーキテクチャ詳細・ディレクトリ構成・設定ファイル解説
│   ├── branch.md             ← Git ブランチ戦略・CI/CD・コミット規約
│   ├── environment.md        ← 開発環境セットアップ（Node.js / nvm / Turbopack / 環境変数）
│   └── seo-implementation.md ← SEO実装ガイド（メタデータ、OGP、Twitter Card、構造化データ）
│
├── guides/                   ← ユーザー/開発者向けガイド
│   ├── cta-shortcode-guide.md    ← CTAショートコード使用ガイド（クライアント向け）
│   ├── cta-technical-guide.md    ← CTAショートコード技術仕様（開発者向け）
│   ├── email-setup.md            ← Email送信設定ガイド（Resend, 環境別手順）
│   ├── microcms-setup.md         ← microCMS設定ガイド（API作成、フィールド定義、環境変数設定）
│   └── resend-setup.md           ← Resend.com 詳細セットアップ手順書（DNS設定・ドメイン検証・APIキー）
│
├── architecture/             ← アーキテクチャ決定記録・インフラ構成
│   └── dns-infrastructure.md ← DNS/メールインフラ構成、Wix DNS制限、RESEND_VALIDフィーチャーフラグ
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
| **design/color-guidelines.md** | ブランドカラー運用ガイド | `win2-primary-orage` を中心としたカラートークン命名、背景/ステータスカラー、運用ルール |

#### `specs/` - 仕様・外部連携

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **spec.md** | プロジェクト要件定義書 | 技術スタック、データフロー、API設計、画面設計、開発フェーズ |
| **google.md** | Google Sheets構成 | 会員リスト、クリックログ、成果データ、GASコード |

> ※ ASPなどの認証情報はセキュアストレージ（社内共有ドライブ等）で管理し、リポジトリには保存しないこと。

#### `specs/asp/` - ASP統合仕様・実装ガイド

**実装優先度: AFB（最優先） > A8.net（集計レポートのみ）**

| ファイル | 内容 | 主要トピック | 優先度 |
|---------|------|------------|--------|
| **afb-implementation-guide.md** | AFBポストバック実装ガイド | Webhook実装、セキュリティ（IPホワイトリスト）、Google Sheets統合、テスト手順、トラブルシューティング | 🔥 **最優先** |
| **a8net-api.md** | A8.net API仕様（広告主契約前提） | **⚠️ Media Member制限あり**: 個別成果トラッキング不可、API利用不可、代替実装方法（AFB優先、手動CSV、広告主契約変更） | ⏸️ 保留中 |

**重要な制限事項:**
- **A8.net**: 現在のMedia Member契約では個別成果データにアクセスできないため、会員別キャッシュバック機能は実装不可
- **AFB**: リアルタイムポストバック対応のため、会員別トラッキングが可能（推奨）
- **実装方針**: AFBを優先実装し、A8.netは集計レポートとして使用

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

#### `dev/` - 開発規約

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **dev/architecture.md** | アーキテクチャ詳細 | ディレクトリ構成、TypeScript/TailwindCSS設定、実装済み機能、データフロー |
| **dev/environment.md** | 開発環境セットアップ | Node.js 22（nvm）、Turbopackデフォルト設定、必須コマンド、環境変数、チェックリスト |
| **dev/branch.md** | ブランチ戦略 | 2ブランチ管理（dev/main）、PR規約、コミットメッセージ形式、CI/CD |
| **dev/seo-implementation.md** | SEO実装ガイド | 全ページのメタデータ、OGP、Twitter Card、JSON-LD構造化データ、検証方法、今後の改善案 |

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

---

## 参照ドキュメント

本プロジェクトの全体像を理解するには、以下のドキュメントを参照してください：

- `../CLAUDE.md` - プロジェクト概要・アーキテクチャ・開発ガイド（Claude Code向け）
- `./specs/spec.md` - WIN×Ⅱ 要件定義書（必読）
- `./dev/branch.md` - Git ブランチ戦略・コミット規約
- `../.taskmaster/CLAUDE.md` - Task Master AI 統合ガイド
