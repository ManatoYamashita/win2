# WIN×II開発 一次納品完了報告書

## プロジェクト概要

**プロジェクト名**: WIN×II 開発  
**見積金額（一次納品）**: ¥32,900（税込）  
**納品日**: 2025/11/22 
**開発環境**: Next.js 15 + TypeScript + microCMS + Google Sheets API

### エグゼクティブサマリー

本報告書では、WIN×II開発プロジェクトの一次納品について、見積もり項目（①〜⑤）に対応する実装内容を詳細に報告いたします。

**完了項目**:
- ✅ プロジェクト管理・要件定義
- ✅ デザイン・UI調整（Wix → Next.js 変更対応）
- ✅ サイト基本構築（会員登録、ブログ、マイページ、microCMS連携）
- ✅ テスト・バグ修正・納品準備

**価格調整項目**:
- AFB、レントラックス、バリューコマース、もしもアフィリエイト（4ASP）: 未対応により各¥1,700 × 4 = **¥6,800削減**
- 削減前見積: ¥39,000 → 削減後: ¥32,200

---

## 見積項目別 納品内容詳細

### ① プロジェクト管理・要件定義（¥7,000）

#### 要件整理内容

**プロジェクト要件定義書の策定**
- 会員制アフィリエイトブログシステムの全体要件を網羅的に整理
- ファイル: `docs/specs/spec.md` (588行、詳細な機能要件・非機能要件を記載)
- 主要機能の優先順位付け（Phase 1〜5の段階的実装計画）

**技術スタックの決定**
- フロントエンド: Next.js 15.5.6 (App Router) + React 19 + TypeScript 5 (strict mode)
- バックエンド: Next.js API Routes + Next-Auth v4.24.11
- CMS: microCMS v3.2.0 (ヘッドレスCMS)
- データベース: Google Sheets API (既存GASとの連携維持)
- スタイリング: TailwindCSS v3.4.1 + shadcn/ui
- デプロイ: Vercel

**Wix → Next.js への仕様変更対応**
- 当初Wixでの構築を予定していたが、クライアント要望によりNext.jsへ変更
- より柔軟なカスタマイズ性とパフォーマンス最適化を実現
- 開発環境の再構築と技術選定の見直し実施

#### 技術調査結果

**ASP連携調査**
- A8.net Parameter Tracking機能の調査・検証
  - ドキュメント: `docs/dev/a8-parameter-tracking-verification.md`
  - id1（会員ID）、id2（イベントID）による成果追跡方式を確立
- 複数ASP（AFB、もしも、バリュコマ、レントラックス）のAPI仕様調査
  - ドキュメント: `docs/specs/asp/` ディレクトリ配下に各ASPの実装ガイドを作成

**Google Sheets API 統合調査**
- サービスアカウント認証方式の実装検証
- 既存GASスクリプトとの互換性確認
- Google Sheets構成設計: `docs/specs/google.md`
  - 会員リスト、クリックログ、成果データ、成果CSV_RAWの4シート構成

**Next.js 15 + React 19 検証**
- App Router (React Server Components) による SSR/SSG パフォーマンス検証
- Turbopack による開発体験の向上確認
- TypeScript strict mode + noUncheckedIndexedAccess の型安全性検証

#### 設計ドキュメント一覧

以下のドキュメントを作成・整備しました：

**要件定義・仕様書** (`docs/specs/`)
- `spec.md` - プロジェクト要件定義書（588行）
- `google.md` - Google Sheets データベース設計書
- `asp.md` - ASP連携仕様書
- `asp/` - 各ASP個別実装ガイド（20ファイル）

**開発ガイド** (`docs/dev/`)
- `architecture.md` - アーキテクチャ詳細設計
- `environment.md` - 開発環境セットアップガイド
- `git-workflow.md` - Gitワークフロー（ブランチ戦略、コミット規約）
- `branch.md` - ブランチ管理戦略（main/dev/feature）
- `seo-implementation.md` - SEO実装ガイド

**セットアップガイド** (`docs/guides/`)
- `microcms-setup.md` - microCMS API設定ガイド
- `email-setup.md` / `resend-setup.md` - メール送信設定
- `cta-shortcode-guide.md` / `cta-technical-guide.md` - CTA実装ガイド

**運用ドキュメント** (`docs/operations/`)
- `environment-variables-setup.md` - 環境変数設定ガイド
- `gas-a8net-update-guide.md` - GAS更新手順
- `a8-conversion-matching.md` - A8成果マッチング処理

**デザインガイドライン** (`docs/design/`)
- `color-guidelines.md` - カラートークン定義
- `landing-page-refresh-2025-01-09.md` - LP改善記録

**アーキテクチャ図** (`docs/architecture/`)
- `webhook-flow.md` - Webhook処理フロー図
- `dns-infrastructure.md` - DNSインフラ構成

#### Git管理体制

**ブランチ戦略**
- `main` ブランチ: 本番環境リリースブランチ
- `dev` ブランチ: 開発統合ブランチ
- `feature/*` ブランチ: 機能追加用ブランチ
- `fix/*` ブランチ: バグ修正用ブランチ

**コミットメッセージ規約**
```
PREFIX: コミットメッセージ

PREFIX一覧:
- FEATURE: 新機能追加
- UPDATE: 既存機能の改善・拡張
- FIX: バグ修正
- REFACTOR: リファクタリング
- STYLE: コードスタイル修正
- DOC: ドキュメント更新
- CHORE: ビルド・設定ファイル変更
```

**Git管理ファイル**
- `.gitignore` - Node.js, Next.js, 環境変数の適切な除外設定
- ドキュメント: `docs/dev/git-workflow.md` に詳細手順を記載

---

### ② デザイン・UI調整（¥3,000）

#### TailwindCSS + shadcn/ui実装

**TailwindCSS v3.4.1 セットアップ**
- ユーティリティファーストCSSフレームワークによる効率的なスタイリング
- カスタムカラーパレットの定義（WIN×IIブランドカラー準拠）
- `@tailwindcss/typography` プラグイン統合（ブログ記事の美しいタイポグラフィ）
- `tailwindcss-animate` プラグイン統合（スムーズなアニメーション）

**shadcn/ui統合**
- Radix UI primitivesベースの高品質UIコンポーネントライブラリ
- React Server Components (RSC) 対応
- アクセシビリティ準拠（ARIA属性、キーボードナビゲーション）
- 設定ファイル: `components.json`
  - Base Color: slate
  - CSS Variables: 有効（ダークモード対応の基盤）
  - Path Aliases: `@/components`, `@/lib`, `@/hooks` 等

**Wix → Next.js デザイン移行**
- Wixビジュアルエディタからコードベースのデザインシステムへ完全移行
- デザイントークンによる一貫性確保
- パフォーマンス最適化（不要なJavaScript削減、画像最適化）

#### レスポンシブ対応状況

**ブレークポイント戦略**
- Mobile First アプローチ採用
- TailwindCSSデフォルトブレークポイント活用:
  - `sm:` 640px以上（タブレット縦）
  - `md:` 768px以上（タブレット横）
  - `lg:` 1024px以上（PC）
  - `xl:` 1280px以上（大画面PC）
  - `2xl:` 1536px以上（超大画面）

**主要ページのレスポンシブ対応**
- トップページ: 11セクション全てでレスポンシブレイアウト実装
  - Hero Section: モバイルで縦並び、PCで横並び（テキスト+画像）
  - 実績・メリット・サービス: グリッドレイアウト（1列→2列→3列の可変）
  - FAQ: アコーディオンUI（全画面サイズで最適化）
- ブログ一覧: カードグリッド（1列→2列→3列）
- ブログ詳細: 可読性重視の1カラムレイアウト（max-width制約）
- マイページ: サイドバーナビゲーション（モバイルで折りたたみ可能）

**画像最適化**
- Next.js Image コンポーネント活用
- WebP形式の採用（23ファイル）
- レスポンシブ画像配信（srcset自動生成）

#### UIコンポーネント一覧

**shadcn/ui ベースコンポーネント** (`components/ui/`)
1. `button.tsx` - ボタンコンポーネント（primary, secondary, outline等のバリアント）
2. `card.tsx` - カードコンテナ（Header, Content, Footer のサブコンポーネント含む）
3. `input.tsx` - 入力フィールド
4. `label.tsx` - フォームラベル
5. `form.tsx` - フォームコンテキスト（react-hook-form統合）
6. `toast.tsx` / `toaster.tsx` - トースト通知（成功/エラーメッセージ）
7. `spinner.tsx` - ローディングスピナー
8. `pagination.tsx` - ページネーションUI（ブログ一覧等で使用）

**カスタムコンポーネント**

**レイアウト** (`components/layout/`)
- `header.tsx` - グローバルヘッダー（ナビゲーション、ログイン状態表示）
- `footer.tsx` - グローバルフッター
- `page-transition.tsx` - ページ遷移アニメーション（Framer Motion）

**ブログ関連** (`components/blog/`)
- `blog-card.tsx` - ブログカード（サムネイル、タイトル、カテゴリ、日付）
- `blog-content.tsx` - ブログ本文表示（Markdown → HTML変換、シンタックスハイライト）
- `blog-infinite-list.tsx` - 無限スクロール対応ブログ一覧
- `categories-grid.tsx` - カテゴリグリッド表示
- `category-nav.tsx` - カテゴリナビゲーション
- `back-to-blog-link.tsx` - ブログ一覧へ戻るリンク

**案件関連** (`components/deal/`)
- `deal-cta-button.tsx` - 案件CTAボタン（クリック追跡統合、GTMイベント送信）

**ホーム** (`components/home/`)
- `landing-page.tsx` - ランディングページ全体コンポーネント
- `sections/` - 11個のセクションコンポーネント
  - `hero-section.tsx` - ヒーローセクション
  - `introduction-box-section.tsx` - サービス紹介
  - `problem-section.tsx` - 課題提起
  - `service-section.tsx` - サービス説明
  - `merit-section.tsx` - メリット紹介
  - `achievement-section.tsx` - 実績表示
  - `highlight-section.tsx` - ハイライト（3つの特徴）
  - `testimonials-section.tsx` - 利用者の声
  - `faq-section.tsx` - よくある質問
  - `latest-blogs-section.tsx` - 最新ブログ記事
  - `bottom-cta-section.tsx` - 最終CTA

**アナリティクス** (`components/analytics/`)
- `google-tag-manager.tsx` - GTM統合（イベントトラッキング）

**プロバイダー** (`components/providers/`)
- `session-provider.tsx` - Next-Auth SessionProvider ラッパー

#### デザイントークン定義

**カラートークン** (`tailwind.config.ts` + `docs/design/color-guidelines.md`)

**ブランドカラーパレット**（`win2` カラースキーム）
```
Primary & Accent Colors:
- primary-orage: #f26f36   // ブランド基調色
- accent-rose: #f05972     // グラデーション左端
- accent-rose-dark: #d9475e // ホバー時の濃色
- accent-amber: #f48a3c    // グラデーション右端
- accent-gold: #f5a623     // キャッチコピー強調
- accent-sun: #fff44f      // ハイライト

Surface / Background Colors:
- surface-cream-50: #fffaf4    // セクション背景（標準）
- surface-cream-100: #fef4ea   // イントロ背景
- surface-cream-150: #ffeade   // カード背景バリエーション
- surface-cream-200: #ffe1cc   // ピル状バッジ背景
- surface-cream-300: #fff7f0   // CTA背景
- surface-cream-320: #fff7f2   // メリットカード背景
- surface-rose-100: #fff0f3    // ピンク系薄背景
- surface-stone-100: #f5f1ed   // フッター手前境界
- surface-sky-50: #f0f6fb      // FAQ背景

Neutral Colors:
- neutral-950: #1c1c1c     // 見出し・本文ダーク
- neutral-900: #374151     // 標準本文
- neutral-600: #6b7280     // サブテキスト
```

**セマンティックカラー**（shadcn/ui デフォルト）
- `background` / `foreground` - ページ全体の背景/前景色
- `primary` / `secondary` - プライマリ/セカンダリアクション
- `muted` / `accent` - 控えめ/アクセント要素
- `destructive` - 削除・警告アクション
- `border` / `input` / `ring` - ボーダー、入力フィールド、フォーカスリング

**スペーシングトークン**
- TailwindCSSデフォルトスペーシングスケール採用（4pxベース）
- `space-y-{n}`, `gap-{n}`, `p-{n}`, `m-{n}` ユーティリティ活用

**タイポグラフィトークン**
- フォントファミリー: システムフォントスタック（`font-sans`）
- フォントサイズ: `text-xs` 〜 `text-6xl` （TailwindCSSデフォルト）
- フォントウェイト: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)
- 行間: `leading-relaxed` (1.625), `leading-normal` (1.5) 等

**Border Radius トークン**
```typescript
borderRadius: {
  lg: "var(--radius)",            // 8px相当
  md: "calc(var(--radius) - 2px)", // 6px相当
  sm: "calc(var(--radius) - 4px)", // 4px相当
}
```

**アニメーション**
- `tailwindcss-animate` プラグインによるプリセットアニメーション
- Framer Motion による高度なページ遷移・インタラクション

---

### ③ サイト基本構築（¥10,000）

#### 会員登録機能の詳細実装

**会員登録フォーム** (`app/register/page.tsx`)
- react-hook-form + Zod による堅牢なバリデーション
- 入力項目:
  - 氏名（必須）
  - メールアドレス（必須・ユニーク）
  - パスワード（必須・8文字以上、確認入力あり）
  - 生年月日（任意）
  - 郵便番号（任意）
  - 電話番号（任意）
- リアルタイムバリデーション・エラー表示
- レスポンシブデザイン対応

**会員登録API** (`app/api/register/route.ts`)
- メールアドレス重複チェック
- bcryptjs によるパスワードハッシュ化（salt rounds: 10）
- UUID v4 による memberId 自動生成
- Google Sheets「会員リスト」シートへの自動追記
- メール認証機能（オプション、Resend統合）
  - JWT トークン生成（有効期限24時間）
  - 認証メール自動送信（`lib/email.ts` / Resend API）
  - 認証完了API: `app/api/verify-email/route.ts`
- エラーハンドリング（詳細なエラーメッセージ、開発環境でのスタック表示）

**パスワードリセット機能**
- パスワードリセット要求フォーム: `app/forgot-password/page.tsx`
- リセットメール送信API: `app/api/forgot-password/route.ts`
- パスワード再設定フォーム: `app/reset-password/page.tsx`
- パスワード再設定API: `app/api/reset-password/route.ts`
- JWT トークンベースの安全な認証フロー

**認証状態管理**
- Next-Auth v4.24.11 による堅牢な認証管理
- CredentialsProvider によるメール+パスワード認証
- セッションデータに memberId を保持（Google Sheets 連携用）
- 認証設定: `lib/auth.ts`
- SessionProvider: `components/providers/session-provider.tsx`

**認証保護ミドルウェア** (`middleware.ts`)
- `/mypage/*` - 会員専用ページ保護
- 未認証時は自動的に `/login` へリダイレクト
- セッション有効期限: 30日間（自動延長）

#### ブログ機能の詳細実装

**microCMS統合** (`lib/microcms.ts`)
- microCMS SDK v3.2.0 による Headless CMS 連携
- API型定義: `types/microcms.ts`
  - `BlogResponse`: ブログ記事型
  - `CategoryResponse`: カテゴリ型
  - `MicroCMSListResponse<T>`: リスト型

**ブログ一覧ページ** (`app/blog/page.tsx`)
- Server Component によるSSR実装
- ページネーション対応（1ページ9件表示）
- カテゴリフィルタリング機能
- SEO最適化（メタデータ、OGP、JSON-LD CollectionPageスキーマ）
- レスポンシブグリッドレイアウト（1列→2列→3列）

**ブログ詳細ページ** (`app/blog/[id]/page.tsx`)
- Dynamic Route による記事詳細表示
- react-markdown + remark-gfm + rehype-raw によるMarkdown → HTML変換
- シンタックスハイライト対応
- 包括的SEO実装:
  - 動的メタデータ生成（記事タイトル、説明文、サムネイル）
  - OGP / Twitter Card対応
  - JSON-LD Articleスキーマ（author, datePublished, dateModified, image 等）
- `@tailwindcss/typography` による美しいタイポグラフィ
- レスポンシブ画像表示

**カテゴリページ** (`app/category/[id]/page.tsx`)
- カテゴリ別記事一覧表示
- ページネーション対応
- SEO最適化（CollectionPageスキーマ）

**ブログ用UIコンポーネント** (`components/blog/`)
- `blog-card.tsx`: 記事カード（サムネイル、タイトル、カテゴリ、日付）
- `blog-content.tsx`: 記事本文表示コンポーネント
- `blog-infinite-list.tsx`: 無限スクロール対応一覧
- `categories-grid.tsx`: カテゴリグリッド
- `category-nav.tsx`: カテゴリナビゲーション
- `back-to-blog-link.tsx`: 一覧へ戻るリンク

**ブログ用API** (`app/api/blogs/route.ts`, `app/api/categories/route.ts`)
- microCMS APIのプロキシエンドポイント
- フロントエンドからのフェッチ対応
- レート制限・エラーハンドリング

#### マイページの詳細実装

**マイページトップ** (`app/mypage/page.tsx`)
- 会員情報表示:
  - 氏名
  - メールアドレス
  - 生年月日（任意）
  - 郵便番号（任意）
  - 電話番号（任意）
  - 登録日時（日本時間表記）
- メール未認証時の警告バナー表示
- 認証メール再送信機能（`app/api/resend-verification/route.ts`）
- Framer Motion によるスムーズなアニメーション
- レスポンシブデザイン（モバイル最適化）

**申込履歴ページ** (`app/mypage/history/page.tsx`)
- Google Sheets「クリックログ」「成果データ」からデータ取得
- 申込履歴一覧表示:
  - 申込日時
  - 案件名
  - 承認状況（申込済/承認/否認）
- APIエンドポイント: `app/api/history/route.ts`
- 会員ID (memberId) によるフィルタリング
- データが無い場合の空状態UI

**マイページ共通レイアウト** (`app/mypage/layout.tsx`)
- サイドバーナビゲーション
  - 登録情報
  - 申込履歴
- モバイルでの折りたたみ対応
- 認証チェック（ミドルウェアと二重防御）

**会員情報取得API** (`app/api/members/me/route.ts`)
- セッションから memberId を取得
- Google Sheets「会員リスト」から会員情報取得
- パスワードハッシュを除外した安全なレスポンス
- エラーハンドリング（会員が見つからない場合の404）

#### microCMS連携の詳細実装

**microCMSセットアップ** (`docs/guides/microcms-setup.md`)
- API作成ガイド（blogs, categories）
- フィールド定義詳細
- Webhook設定手順（オプション）

**API構成**

**Blogs API** (ブログ記事)
- フィールド:
  - `title`: タイトル（テキスト、必須）
  - `content`: 本文（リッチエディタ、Markdown対応）
  - `thumbnail`: サムネイル画像（画像）
  - `category`: カテゴリ（コンテンツ参照 - categories）
  - `publishedAt`: 公開日時（日時）
- カテゴリ情報の自動取得（`category.id`, `category.name`, `category.description`）

**Categories API** (カテゴリ)
- フィールド:
  - `name`: カテゴリ名（テキスト、必須）
  - `description`: 説明文（テキストエリア、任意）
  - `displayOrder`: 表示順序（数値）
  - `isVisible`: 表示/非表示（真偽値）

**API関数** (`lib/microcms.ts`)
- `getBlogs(queries?: BlogQueries)`: ブログ記事一覧取得
- `getBlogById(contentId: string)`: ブログ記事詳細取得（IDで）
- `getCategories(queries?: CategoryQueries)`: カテゴリ一覧取得
- `getCategoryById(contentId: string)`: カテゴリ詳細取得（IDで）

**環境変数**
- `MICROCMS_SERVICE_DOMAIN`: microCMSサービスドメイン
- `MICROCMS_API_KEY`: microCMS APIキー

**エラーハンドリング**
- microCMS未設定時の安全なフォールバック（空リスト返却）
- API呼び出しエラーの適切な処理

**Next.js統合**
- Server Components での直接API呼び出し（クライアントサイドJavaScript削減）
- `revalidate` オプションによるキャッシュ制御（ISR対応）
- エッジランタイム互換性（Vercel Edge Functions 対応）

---

### ④ カスタム機能開発（¥7,200）

**価格調整**: 当初見積¥14,000 → 実装ASP数に応じて調整 → **¥7,200**

#### Google Sheets API連携（会員データベース）

**Google Sheets APIセットアップ** (`lib/googleapis.ts`)
- googleapis v164.1.0 による Google Sheets API 統合
- サービスアカウント認証方式採用
- 認証情報:
  - `GOOGLE_SHEETS_CLIENT_EMAIL`: サービスアカウントメールアドレス
  - `GOOGLE_SHEETS_PRIVATE_KEY`: 秘密鍵（PEM形式）
  - `GOOGLE_SHEETS_SPREADSHEET_ID`: スプレッドシートID
- スコープ: `https://www.googleapis.com/auth/spreadsheets` (読み書き権限)

**Google Sheets操作ライブラリ** (`lib/sheets.ts`)
- 4シート構成による会員・成果データ管理:
  1. **会員リスト** (`SHEET_NAMES.MEMBERS`)
  2. **クリックログ** (`SHEET_NAMES.CLICK_LOG`)
  3. **成果データ** (`SHEET_NAMES.RESULT_DATA`)
  4. **成果CSV_RAW** (`SHEET_NAMES.RESULT_CSV_RAW`)

**実装済み関数**

**会員管理**
- `getMemberByEmail(email: string)`: メールアドレスで会員検索
- `getMemberById(memberId: string)`: 会員ID (UUID) で会員検索
- `addMember(member: MemberRow)`: 新規会員追加
- `updateMemberEmailVerified(memberId: string, verified: boolean)`: メール認証状態更新

**クリックログ管理**
- `addClickLog(log: ClickLogRow)`: クリックログ記録（案件への申込追跡）
- `getClickLogsByMemberId(memberId: string)`: 会員の申込履歴取得
- `getClickLogByEventId(eventId: string)`: イベントIDでログ検索（成果マッチング用）

**成果データ管理**
- `getResultsByMemberId(memberId: string)`: 会員の成果データ取得
- `writeConversionData(data: ConversionWebhookData)`: Webhook成果データ記録
- `isDuplicateConversion(eventId: string)`: 成果重複チェック

**案件マスタ管理**
- `getDealById(dealId: string)`: 案件情報取得（案件IDで）
- `getAllActiveDeals()`: 有効な案件一覧取得

**汎用関数**
- `readSheet(sheetName: string, range?: string)`: シートデータ読み込み
- `appendToSheet(sheetName: string, values: (string | number | undefined)[])`: 行追加
- `updateSheet(sheetName: string, range: string, values: (string | number | undefined)[][])`: 範囲更新

**データベース設計** (`docs/specs/google.md`)

**会員リストシート構成**
```
A列: memberId (UUID v4)
B列: 氏名
C列: メールアドレス
D列: パスワードハッシュ (bcrypt)
E列: 生年月日
F列: 郵便番号
G列: 電話番号
H列: 登録日時 (日本時間表記)
I列: emailVerified (TRUE/FALSE)
```

**クリックログシート構成**
```
A列: 日時 (ISO8601)
B列: memberId (会員ID or guest:UUID)
C列: 案件名
D列: 案件ID (dealId)
E列: イベントID (UUID v4)
F列: 申し込み案件名 (GAS自動記録)
G列: ステータス (GAS自動記録)
```

**成果データシート構成**
```
A列: 氏名 (or "非会員")
B列: 案件名
C列: 承認状況
E列: memberId(参考)
F列: 原始報酬額(参考)
G列: メモ
```

**成果CSV_RAWシート構成**
```
A列: 日時 (ISO8601)
B列: 追跡ID (id1: memberId or guest:UUID)
C列: イベントID (id2: UUID v4)
D列: 案件名
E列: ASP名
F列: 報酬額
G列: 承認状況 (pending/approved/cancelled)
H列: 注文ID（オプション）
```

#### Google Apps Script連携（GAS）

**A8.net成果マッチング処理** (`google-spread-sheet/code.gs.js`)
- バージョン: v4.0.0 (2025/11/15)
- 処理フロー:
  1. 「成果CSV_RAW」シートから A8.net Parameter Tracking Report データ読み込み
  2. id1（会員ID）、id2（イベントID）、案件名、ステータスを抽出
  3. 「クリックログ」シートから該当行を検索（B列=id1, E列=id2）
  4. 該当行のF列（申し込み案件名）、G列（ステータス）を自動更新

**ヘッダー自動検出機能**
- A8.net CSV の柔軟なヘッダー名に対応:
  - id1候補: `パラメータ(id1)`, `パラメータid1`, `id1`, `memberid`, `member_id` 等
  - id2候補: `パラメータ(id2)`, `パラメータid2`, `id2`, `eventid`, `event_id` 等
  - 案件名候補: `プログラム名`, `案件名`, `商品名`, `広告名`, `program` 等
  - ステータス候補: `ステータス名`, `承認状況`, `ステータス`, `状態`, `status` 等

**実行方法**
- 手動実行: メニュー「成果処理」→「成果をクリックログに記録」
- カスタムメニュー: `onOpen()` 関数により自動メニュー追加

**エラーハンドリング**
- 必須カラム（id1, id2）不在時のエラー表示
- マッチング成功/失敗の詳細ログ出力
- 処理完了時のサマリーダイアログ表示

**運用ガイド** (`docs/operations/gas-a8net-update-guide.md`)
- GAS更新手順
- A8.net CSV 貼付手順
- トラブルシューティング


**GAS自動計算処理** (`google-spread-sheet/code.gs.js` 内包)
- 成果CSV_RAWから報酬額を取得

**計算式**
```
```

**例**:
```
原始報酬額: ¥10,000
```

**承認状況管理**
- `pending`: 未承認（申込直後）

**関連ドキュメント**
- `docs/operations/a8-conversion-matching.md`: A8成果マッチング処理詳細
- `docs/specs/google.md`: Google Sheets構成詳細

#### A8.net対応状況

**A8.net Parameter Tracking統合**
- id1（会員ID）、id2（イベントID）パラメータによる成果追跡
- トラッキングURL生成: `app/api/track-click/route.ts`
  - 元のアフィリエイトURLに `?id1={trackingId}&id2={eventId}&eventId={eventId}` を付与
  - trackingId = memberId (会員) or guest:UUID (非会員)
  - eventId = UUID v4 (クリック毎にユニーク)

**クリックログ記録**
- Google Sheets「クリックログ」シートへ自動記録:
  - 日時（ISO8601形式）
  - 会員ID（or guest:UUID）
  - 案件名
  - 案件ID
  - イベントID

**成果マッチングフロー**
1. 会員/非会員が案件CTAボタンをクリック
2. `/api/track-click` APIがクリックログを記録し、トラッキングURL生成
3. A8.netへリダイレクト（id1, id2パラメータ付与）
4. ユーザーが申込完了
5. A8.net管理画面から Parameter Tracking Report CSVダウンロード
6. 「成果CSV_RAW」シートにCSV貼付
7. GAS「成果をクリックログに記録」実行
8. クリックログのF列・G列に案件名・ステータスが自動記録

**A8.net検証ドキュメント**
- `docs/dev/a8-parameter-tracking-verification.md`: Parameter Tracking機能検証記録
- `docs/dev/a8-support-inquiry-final.md`: A8サポート問い合わせ記録

**A8.net案件マスタ管理**
- Google Sheets「案件マスタ」シートで一元管理:
  - A列: 整形済みアフィリエイトURL
  - B列: 案件ID (一意)
  - C列: 案件名
  - D列: 会社名（手書き）
  - E列: ROW URL（ASP発行の元URL）

**Guest UUID トラッキング** (`lib/guest-uuid.ts`)
- 非会員の追跡ID生成（`guest:{UUID}`形式）
- Cookie保存（90日間有効）
- 会員登録時の申込履歴引き継ぎ準備（将来対応）

**GTM統合** (`components/analytics/google-tag-manager.tsx`)
- `/api/track-click` レスポンスに含まれる追跡情報をGTMへ送信:
  - `dealId`: 案件ID
  - `dealName`: 案件名
  - `aspName`: ASP名
  - `trackingId`: 追跡ID（会員ID or guest:UUID）
  - `eventId`: イベントID
  - `isMember`: 会員/非会員フラグ
  - `timestamp`: クリック日時

#### 未対応ASP

以下のASPは一次納品では未対応となります。各ASP追加には個別の実装が必要です。

**1. AFB（アフィリエイトB）**: 未実装
- 追加費用: ¥1,700
- 未実装内容:
  - AFB API 認証実装
  - Postback URL設定
  - 成果データ取得API連携
  - GAS成果マッチング処理の拡張
- 参考ドキュメント作成済み:
  - `docs/specs/asp/afb-implementation-guide.md`
  - `docs/specs/asp/afb-postback.md`
  - `docs/handoff/afb-postback-integration.md`

**2. レントラックス**: 未実装
- 追加費用: ¥1,700
- 未実装内容:
  - レントラックス API 調査・実装
  - 成果データ取得方法の確立
  - Parameter Tracking 対応（対応可否要確認）
- ドキュメント: 未作成（API仕様調査が必要）

**3. バリューコマース**: 未実装
- 追加費用: ¥1,700
- 未実装内容:
  - ValueCommerce Link Switch API 統合
  - Order List API 連携（成果データ取得）
  - 認証フロー実装（OAuth 2.0）
- 参考ドキュメント作成済み:
  - `docs/specs/asp/valuecommerce/overview.md`
  - `docs/specs/asp/valuecommerce/authentication-setup.md`
  - `docs/specs/asp/valuecommerce/order-api-guide.md`

**4. もしもアフィリエイト**: 未実装
- 追加費用: ¥1,700
- 未実装内容:
  - もしも API 調査・実装
  - 成果データ取得API連携
  - 自動リンク変換機能（オプション）
- 参考ドキュメント作成済み:
  - `docs/specs/asp/moshimo-overview.md`

**未対応ASP削減合計**: ¥6,800

**ASP追加時の作業内容見積もり**（1ASPあたり¥1,700）
1. ASP API仕様調査・認証実装（2-3時間）
2. 成果データ取得処理実装（2-3時間）
3. GAS成果マッチング処理拡張（1-2時間）
4. テスト・検証（1-2時間）
5. ドキュメント作成（1時間）

**今後の拡張に向けた準備**
- 共通ASP連携インターフェース設計済み（`docs/specs/asp/asp-api-integration.md`）
- エラーハンドリング戦略策定（`docs/specs/asp/common/error-handling.md`）
- セキュリティ考慮事項（`docs/specs/asp/common/security-considerations.md`）
- テスト戦略（`docs/specs/asp/common/testing-strategy.md`）
- 共通トラッキングパラメータ仕様（`docs/specs/asp/common/tracking-parameters.md`）

---

### ⑤ テスト・バグ修正・納品準備（¥5,000）

#### テスト実施内容

**手動テスト実施項目**

**会員登録・認証フロー**
- 会員登録フォームのバリデーション確認（必須項目、メール形式、パスワード長等）
- メールアドレス重複チェックの動作確認
- パスワードハッシュ化の確認（bcrypt、salt rounds: 10）
- Google Sheets「会員リスト」への正常な追記確認
- ログイン/ログアウト機能の動作確認
- セッション管理の動作確認（30日間保持）
- メール認証フロー（オプション）の動作確認
- パスワードリセット機能の動作確認

**ブログ機能**
- microCMS APIからのデータ取得確認
- ブログ一覧ページのページネーション動作確認（9件/ページ）
- ブログ詳細ページの表示確認（Markdown→HTML変換、画像表示）
- カテゴリフィルタリングの動作確認
- レスポンシブデザインの動作確認（モバイル/タブレット/PC）

**マイページ機能**
- 会員情報表示の確認（パスワードハッシュが表示されないこと）
- 申込履歴表示の確認（クリックログ、成果データの取得）
- メール未認証時の警告バナー表示確認
- 認証メール再送信機能の確認

**クリック追跡・A8.net連携**
- `/api/track-click` APIの動作確認
- トラッキングURL生成確認（id1, id2, eventId パラメータ付与）
- Google Sheets「クリックログ」への記録確認
- Guest UUID生成・Cookie保存の確認
- GAS成果マッチング処理の動作確認

**TypeScript型チェック**
```bash
npx tsc --noEmit
```
- strict mode + noUncheckedIndexedAccess による厳格な型安全性確認
- 型エラー0件を確認

**ESLint実行**
```bash
npm run lint
```
- Next.js 15 ESLint設定による静的解析
- 重要な警告・エラーの修正

**ビルドテスト**
```bash
npm run build
```
- 本番ビルドの成功確認
- ビルドエラー0件を確認
- 最適化出力（Tree Shaking、Code Splitting）の確認

**パフォーマンステスト**
- Turbopack (開発サーバー) の高速起動確認
- Hot Module Replacement (HMR) の動作確認
- Server Components によるクライアントJavaScript削減確認

#### SEO対応

**メタデータ実装** (2025-10-30実装完了)

**Next.js 15 Metadata API 活用**
- 全ページで Metadata API による包括的SEO設定
- title.template 設定（全ページに「| WIN×Ⅱ」自動付与）
- 動的メタデータ生成（ブログ詳細ページ等）

**OpenGraph Protocol (OGP)**
- 全ページでOGP完全実装
- OGP画像: `/public/ogp.jpg` (1200x630px)
- 動的OGP（ブログ記事サムネイル等）

**Twitter Card**
- `twitter:card`: summary_large_image
- `twitter:title`, `twitter:description`, `twitter:image`
- 全ページ対応

**JSON-LD 構造化データ**

**ホームページ**
- Organization スキーマ（組織情報）
- WebSite スキーマ（サイト検索機能）

**認証ページ** (login, register)
- WebPage スキーマ（layout.tsx で実装）

**ブログ詳細ページ**
- Article スキーマ（author, datePublished, dateModified, image, articleBody）

**ブログ一覧・カテゴリページ**
- CollectionPage スキーマ（記事コレクション）

**sitemap.xml 自動生成** (`app/sitemap.ts`)
- 静的ページ: `/`, `/blog`, `/faq`, `/login`, `/register`, `/forgot-password`
- 動的ページ: `/blog/[id]` (全ブログ記事)
- カテゴリページ: `/category/[id]` (全カテゴリ)
- ページネーション対応（100件以上のコンテンツ取得）
- 優先度・更新頻度の適切な設定
- アクセス: `https://yourdomain.com/sitemap.xml`

**robots.txt 設定** (`app/robots.ts`)
- クローラー許可: `/` (全一般ページ)
- クローラー拒否:
  - `/mypage` (会員専用ページ)
  - `/api` (APIエンドポイント)
  - `/verify-email` (メール認証ページ)
  - `/reset-password` (パスワードリセットページ)
- sitemap.xml へのリンク設定
- アクセス: `https://yourdomain.com/robots.txt`

**SEO実装ドキュメント**
- `docs/dev/seo-implementation.md`: SEO実装ガイド（343行）
  - 実装範囲詳細
  - 技術仕様
  - JSON-LDスキーマ定義
  - OGP/Twitter Card設定例
  - トラブルシューティング

#### セキュリティ対策

**認証・認可**
- Next-Auth v4.24.11 によるセッション管理
- bcryptjs によるパスワードハッシュ化（salt rounds: 10、業界標準）
- JWT トークンベースのメール認証・パスワードリセット（有効期限24時間）
- ミドルウェアによる会員専用ページ保護（`/mypage/*`）
- CSRF保護（Next-Auth標準機能）

**API セキュリティ**
- Zod バリデーションによる入力検証（全API）
- SQL Injection 対策（Google Sheets API使用、直接SQL不使用）
- XSS対策（React自動エスケープ、rehype-raw使用時の注意）
- Rate Limiting 検討（rate-limiter-flexible v5.0.3 インストール済み、未実装）

**環境変数管理**
- 機密情報（API Key、秘密鍵）の環境変数化
- `.env.local` / `.env` ファイルの `.gitignore` 登録
- サンプル: `.env.example` 提供（値は空）

**Google Sheets API 認証**
- サービスアカウント認証（秘密鍵方式）
- 最小権限の原則（Sheets API のみ許可）
- 秘密鍵の安全な管理（環境変数、Vercel Secrets）

**HTTPS強制**
- Vercel自動HTTPS対応（本番デプロイ時）
- 開発環境（localhost）では HTTP

**セキュリティヘッダー**
- Next.js デフォルトセキュリティヘッダー適用
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block

**Cookie 設定**
- HttpOnly: true (Next-Auth セッション)
- Secure: true (本番環境のみ)
- SameSite: Lax

#### デプロイ準備状況

**Vercelデプロイ設定**
- `next.config.ts`: Vercel最適化設定
- `package.json`: ビルドスクリプト設定
  - `build`: `next build`
  - `start`: `next start`
- Node.js 18.x 以上推奨

**環境変数設定準備**
- `.env.example` ファイル作成（必要な環境変数リスト）
- Vercel環境変数設定ガイド: `docs/operations/environment-variables-setup.md`

**ビルド最適化**
- Server Components による JavaScript削減
- 画像最適化（Next.js Image コンポーネント、WebP形式）
- Code Splitting（自動）
- Tree Shaking（自動）
- CSS Minification（自動）

**デプロイ前チェックリスト**
1. ✅ `npm run build` 成功確認
2. ✅ 環境変数設定（microCMS, Google Sheets, Next-Auth, Resend）
3. ✅ ドメイン設定（`NEXT_PUBLIC_APP_URL`）
4. ✅ OGP画像配置（`/public/ogp.jpg`）
5. ✅ Google Sheets サービスアカウント権限付与
6. ⏳ A8.net 本番アカウント設定（テストアカウント推奨）
7. ⏳ Google Tag Manager (GTM) 設定（オプション）

**Vercel プロジェクト設定**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next` (デフォルト)
- Install Command: `npm install`
- Node.js Version: 18.x

**カスタムドメイン設定**
- Vercel DNS設定ガイド: `docs/architecture/dns-infrastructure.md`
- SSL証明書自動取得・更新（Let's Encrypt）

**エラーページ**
- `app/not-found.tsx`: 404 Not Foundページ
- Next.js デフォルト500エラーページ（カスタマイズ可能）

**ログ・モニタリング**
- Vercel標準ログ（リアルタイムログ、Serverless Function Logs）
- console.log による詳細ログ出力（開発・本番共通）
- エラーログの適切なエラーハンドリング

**パフォーマンス最適化**
- Turbopack による高速開発サーバー
- Server Components によるクライアントJavaScript削減
- Image Optimization（Next.js Image コンポーネント）
- Font Optimization（next/font、システムフォント使用）

**本番デプロイ後の確認項目**
1. トップページ表示確認
2. ブログ一覧・詳細ページ表示確認
3. 会員登録・ログイン機能確認
4. マイページ表示確認
5. クリック追跡API動作確認
6. sitemap.xml アクセス確認
7. robots.txt アクセス確認
8. OGPプレビュー確認（Facebook Debugger、Twitter Card Validator）
9. Google Search Console登録・sitemap送信

---

## 技術仕様

### 技術スタック一覧

**フロントエンド**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 15.5.6 | フレームワーク（App Router、RSC） |
| React | 19.0.0 | UIライブラリ |
| TypeScript | 5 | 型安全な開発（strict mode） |
| TailwindCSS | 3.4.1 | ユーティリティファーストCSS |
| shadcn/ui | latest | UIコンポーネント（Radix UI） |
| Framer Motion | 11.18.2 | アニメーション |
| Lucide React | 0.548.0 | アイコン |

**バックエンド・API**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js API Routes | 15.5.6 | サーバーサイドAPI |
| Next-Auth | 4.24.11 | 認証・セッション管理 |
| bcryptjs | 3.0.2 | パスワードハッシュ化 |
| googleapis | 164.1.0 | Google Sheets API連携 |
| jsonwebtoken | 9.0.2 | JWT トークン生成 |
| rate-limiter-flexible | 5.0.3 | レート制限（インストール済み） |

**CMS・データ管理**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| microCMS SDK | 3.2.0 | ヘッドレスCMS（ブログ・案件） |
| Google Sheets API | v4 | 会員・成果データDB |
| Google Apps Script | - | 成果マッチング自動処理 |

**バリデーション**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Zod | 4.1.12 | スキーマバリデーション |
| react-hook-form | 7.65.0 | フォーム管理 |
| @hookform/resolvers | 5.2.2 | Zod統合 |

**スタイリング補助**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| class-variance-authority | 0.7.1 | コンポーネントバリアント |
| clsx | 2.1.1 | クラス名結合 |
| tailwind-merge | 3.3.1 | Tailwindクラス統合 |
| tailwindcss-animate | 1.0.7 | アニメーションプリセット |
| @tailwindcss/typography | 0.5.19 | タイポグラフィ |

**Markdown・コンテンツ**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| react-markdown | 10.1.0 | Markdown → HTML |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown |
| rehype-raw | 7.0.0 | HTML in Markdown |

**メール送信**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Resend | 4.0.0 | メール送信API |
| @react-email/components | 0.0.25 | メールテンプレート |
| react-email | 3.0.0 | メール開発環境 |

**開発ツール**
| 技術 | バージョン | 用途 |
|------|-----------|------|
| ESLint | 9 | 静的解析 |
| TypeScript Compiler | 5 | 型チェック |
| Turbopack | included | 高速開発サーバー |

**デプロイ・インフラ**
- Vercel（本番環境）
- Node.js 18.x 以上推奨

### アーキテクチャ図

```
┌──────────────────────────────────────────────────────────────┐
│                        クライアント                           │
│  (Next.js 15 App Router + React 19 Server Components)       │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐      │
│  │ Public Pages│  │ Auth Pages  │  │ Member Pages   │      │
│  │ - Blog      │  │ - Login     │  │ - Mypage       │      │
│  │ - FAQ       │  │ - Register  │  │ - History      │      │
│  └─────────────┘  └─────────────┘  └────────────────┘      │
└────────────┬─────────────────────────────────┬──────────────┘
             │                                 │
             │ Next.js API Routes              │ Next-Auth Session
             ├─────────────────────────────────┤
             ▼                                 ▼
┌──────────────────────────────────────────────────────────────┐
│               Next.js サーバーサイド (Vercel)                │
│                                                               │
│  ┌──────────────────┐    ┌──────────────────────┐           │
│  │  API Routes      │    │  Middleware          │           │
│  │  - /api/register │    │  - Auth Protection   │           │
│  │  - /api/track    │    │  - Session Check     │           │
│  │  - /api/history  │    └──────────────────────┘           │
│  │  - /api/auth     │                                        │
│  └──────────────────┘                                        │
│           │                                                   │
│           ├─────────────┬──────────────┬─────────────┐      │
│           ▼             ▼              ▼             ▼      │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│    │microCMS  │  │ Google   │  │  Resend  │  │  GTM     │ │
│    │   SDK    │  │ Sheets   │  │   API    │  │ Events   │ │
│    │          │  │   API    │  │          │  │          │ │
│    └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────┬────────────┬──────────────┬──────────────────────┘
          │            │              │
          ▼            ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌──────────────┐
│  microCMS   │ │   Google    │ │   Resend     │
│  (Headless  │ │   Sheets    │ │   (Email     │
│   CMS)      │ │   (Database)│ │   Service)   │
│             │ │             │ │              │
│ - Blogs     │ │ - 会員リスト │ │ - 認証メール │
│ - Categories│ │ - クリックログ│ │ - リセット  │
│             │ │ - 成果データ │ │              │
│             │ │ - 成果CSV_RAW│ │              │
└─────────────┘ └─────────────┘ └──────────────┘
                     │
                     │ Google Apps Script (GAS)
                     ▼
              ┌──────────────┐
              │  A8.net成果  │
              │ マッチング処理│
              │  (自動実行)  │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   A8.net     │
              │ (ASP Partner)│
              └──────────────┘
```

### データベース設計（Google Sheets構成）

**スプレッドシート**: 1つのスプレッドシートに4シート

#### シート1: 会員リスト (`SHEET_NAMES.MEMBERS`)

| 列 | フィールド名 | 型 | 説明 |
|----|------------|-----|------|
| A | memberId | UUID v4 | 会員ID（一意） |
| B | 氏名 | string | 会員氏名 |
| C | メールアドレス | string | ユニークキー |
| D | パスワードハッシュ | string | bcrypt hash (salt rounds: 10) |
| E | 生年月日 | string | YYYY-MM-DD形式（任意） |
| F | 郵便番号 | string | 任意 |
| G | 電話番号 | string | 任意 |
| H | 登録日時 | string | 日本時間表記（例: 2025年01月22日 12:34:56） |
| I | emailVerified | boolean | TRUE/FALSE（メール認証状態） |

#### シート2: クリックログ (`SHEET_NAMES.CLICK_LOG`)

| 列 | フィールド名 | 型 | 説明 |
|----|------------|-----|------|
| A | 日時 | string | ISO8601形式 |
| B | memberId | string | 会員ID or guest:UUID |
| C | 案件名 | string | クリックした案件名 |
| D | 案件ID | string | dealId |
| E | イベントID | UUID v4 | クリック毎のユニークID |
| F | 申し込み案件名 | string | GAS自動記録（成果マッチング後） |
| G | ステータス | string | GAS自動記録（pending/approved/cancelled） |

#### シート3: 成果データ (`SHEET_NAMES.RESULT_DATA`)

| 列 | フィールド名 | 型 | 説明 |
|----|------------|-----|------|
| A | 氏名 | string | 会員氏名 or "非会員" |
| B | 案件名 | string | 成果が発生した案件 |
| C | 承認状況 | string | pending/approved/cancelled |
| E | memberId(参考) | string | 会員ID |
| F | 原始報酬額(参考) | number | ASPからの報酬額 |
| G | メモ | string | 任意メモ |

#### シート4: 成果CSV_RAW (`SHEET_NAMES.RESULT_CSV_RAW`)

| 列 | フィールド名 | 型 | 説明 |
|----|------------|-----|------|
| A | 日時 | string | ISO8601形式 |
| B | 追跡ID (id1) | string | memberId or guest:UUID |
| C | イベントID (id2) | UUID v4 | クリック時のイベントID |
| D | 案件名 | string | A8.net プログラム名 |
| E | ASP名 | string | "a8" 等 |
| F | 報酬額 | number | ASPからの報酬 |
| G | 承認状況 | string | pending/approved/cancelled |
| H | 注文ID | string | ASP側の注文ID（オプション） |

**データフロー**:
1. 会員登録 → 会員リストに追加
2. 案件クリック → クリックログに記録 + A8.netへリダイレクト（id1, id2付与）
3. 成果発生 → A8.net管理画面からCSV取得 → 成果CSV_RAWに貼付
4. GAS実行 → 成果CSV_RAWとクリックログをマッチング → クリックログF列・G列更新
5. （将来）GAS自動集計 → 成果データシートへ転記

### API一覧

#### 認証・会員管理API

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|---------|------|------|
| `/api/auth/[...nextauth]` | GET/POST | Next-Auth認証エンドポイント | - |
| `/api/register` | POST | 会員登録 | - |
| `/api/members/me` | GET | 会員情報取得 | ✓ |
| `/api/verify-email` | GET | メール認証 | - |
| `/api/resend-verification` | POST | 認証メール再送信 | ✓ |
| `/api/forgot-password` | POST | パスワードリセット要求 | - |
| `/api/reset-password` | POST | パスワード再設定 | - |

#### ブログ・コンテンツAPI

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|---------|------|------|
| `/api/blogs` | GET | ブログ一覧取得（microCMSプロキシ） | - |
| `/api/categories` | GET | カテゴリ一覧取得（microCMSプロキシ） | - |

#### クリック追跡・成果管理API

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|---------|------|------|
| `/api/track-click` | POST | クリック追跡・トラッキングURL生成 | - |
| `/api/history` | GET | 申込履歴取得 | ✓ |

#### Webhook・外部連携API

| エンドポイント | メソッド | 説明 | 認証 |
|--------------|---------|------|------|
| `/api/webhooks/asp-conversion` | POST | ASP Webhook受信（未実装） | - |
| `/api/cron/sync-afb-conversions` | GET | Cron成果同期（未実装） | - |

**認証マーク (✓)**: Next-Auth セッションが必要

---

## ファイル構成

### 主要ディレクトリとファイル

```
win2/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx                # ルートレイアウト (title.template, SEO)
│   ├── page.tsx                  # トップページ (サーバーコンポーネント, JSON-LD)
│   ├── globals.css               # グローバルCSS (Tailwind directives)
│   ├── loading.tsx               # ローディング UI
│   ├── not-found.tsx             # 404ページ
│   ├── robots.ts                 # robots.txt生成
│   ├── sitemap.ts                # sitemap.xml生成
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts  # Next-Auth認証
│   │   ├── register/route.ts            # 会員登録
│   │   ├── members/me/route.ts          # 会員情報取得
│   │   ├── verify-email/route.ts        # メール認証
│   │   ├── resend-verification/route.ts # 認証メール再送信
│   │   ├── forgot-password/route.ts     # パスワードリセット要求
│   │   ├── reset-password/route.ts      # パスワード再設定
│   │   ├── track-click/route.ts         # クリック追跡
│   │   ├── history/route.ts             # 申込履歴
│   │   ├── blogs/route.ts               # ブログAPI（microCMSプロキシ）
│   │   ├── categories/route.ts          # カテゴリAPI（microCMSプロキシ）
│   │   ├── webhooks/asp-conversion/     # ASP Webhook（未実装）
│   │   └── cron/sync-afb-conversions/route.ts  # Cron成果同期（未実装）
│   ├── blog/                     # ブログページ
│   │   ├── page.tsx              # ブログ一覧（SSR, ページネーション, CollectionPage JSON-LD）
│   │   └── [id]/page.tsx         # ブログ詳細（Dynamic Route, Article JSON-LD）
│   ├── category/                 # カテゴリページ
│   │   └── [id]/page.tsx         # カテゴリ別記事一覧（CollectionPage JSON-LD）
│   ├── login/                    # ログインページ
│   │   ├── layout.tsx            # SEO (WebPage JSON-LD)
│   │   └── page.tsx              # ログインフォーム
│   ├── register/                 # 会員登録ページ
│   │   ├── layout.tsx            # SEO (WebPage JSON-LD)
│   │   └── page.tsx              # 会員登録フォーム
│   ├── verify-email/page.tsx     # メール認証ページ
│   ├── forgot-password/page.tsx  # パスワードリセット要求ページ
│   ├── reset-password/page.tsx   # パスワード再設定ページ
│   ├── mypage/                   # マイページ（会員専用）
│   │   ├── layout.tsx            # マイページ共通レイアウト
│   │   ├── page.tsx              # 会員情報表示
│   │   └── history/page.tsx      # 申込履歴
│   ├── faq/                      # FAQページ
│   │   ├── layout.tsx            # FAQレイアウト
│   │   └── page.tsx              # FAQ本体
│   └── privacy/page.tsx          # プライバシーポリシー
│
├── components/                   # Reactコンポーネント
│   ├── layout/                   # レイアウトコンポーネント
│   │   ├── header.tsx            # グローバルヘッダー
│   │   ├── footer.tsx            # グローバルフッター
│   │   └── page-transition.tsx  # ページ遷移アニメーション
│   ├── blog/                     # ブログ関連コンポーネント
│   │   ├── blog-card.tsx         # ブログカード
│   │   ├── blog-content.tsx      # ブログ本文表示
│   │   ├── blog-infinite-list.tsx # 無限スクロール一覧
│   │   ├── categories-grid.tsx   # カテゴリグリッド
│   │   ├── category-nav.tsx      # カテゴリナビ
│   │   └── back-to-blog-link.tsx # 一覧へ戻るリンク
│   ├── deal/                     # 案件関連コンポーネント
│   │   └── deal-cta-button.tsx   # 案件CTAボタン（クリック追跡統合）
│   ├── home/                     # ホームページコンポーネント
│   │   ├── landing-page.tsx      # ランディングページ全体
│   │   ├── landing-data.ts       # ランディングページデータ
│   │   ├── types.ts              # 型定義
│   │   └── sections/             # 11セクション
│   │       ├── hero-section.tsx
│   │       ├── introduction-box-section.tsx
│   │       ├── problem-section.tsx
│   │       ├── service-section.tsx
│   │       ├── merit-section.tsx
│   │       ├── achievement-section.tsx
│   │       ├── highlight-section.tsx
│   │       ├── testimonials-section.tsx
│   │       ├── faq-section.tsx
│   │       ├── latest-blogs-section.tsx
│   │       ├── bottom-cta-section.tsx
│   │       └── index.ts          # エクスポート
│   ├── analytics/                # アナリティクス
│   │   └── google-tag-manager.tsx # GTM統合
│   ├── providers/                # Reactプロバイダー
│   │   └── session-provider.tsx  # Next-Auth SessionProvider
│   └── ui/                       # shadcn/ui コンポーネント
│       ├── button.tsx            # ボタン
│       ├── card.tsx              # カード
│       ├── input.tsx             # 入力フィールド
│       ├── label.tsx             # ラベル
│       ├── form.tsx              # フォーム
│       ├── toast.tsx             # トースト
│       ├── toaster.tsx           # トースターコンテナ
│       ├── spinner.tsx           # ローディングスピナー
│       └── pagination.tsx        # ページネーション
│
├── lib/                          # ユーティリティ・API関数
│   ├── auth.ts                   # Next-Auth設定
│   ├── googleapis.ts             # Google Sheets認証
│   ├── sheets.ts                 # Google Sheets操作関数
│   ├── microcms.ts               # microCMSクライアント
│   ├── email.ts                  # Resendメール送信
│   ├── tokens.ts                 # JWTトークン生成・検証
│   ├── guest-uuid.ts             # Guest UUID管理
│   ├── gtm.ts                    # GTMイベント送信
│   ├── blog-utils.ts             # ブログユーティリティ
│   ├── utils.ts                  # 汎用ユーティリティ（cn, formatDate等）
│   ├── validations/              # Zodバリデーションスキーマ
│   │   ├── auth.ts               # 認証関連スキーマ
│   │   └── tracking.ts           # トラッキング関連スキーマ
│   ├── matching/                 # マッチング処理
│   │   └── conversion-matcher.ts # 成果マッチングロジック
│   ├── asp/                      # ASP連携
│   │   └── afb-client.ts         # AFBクライアント（未使用）
│   └── webhooks/                 # Webhook処理（ディレクトリのみ）
│
├── hooks/                        # Reactカスタムフック
│   ├── use-toast.ts              # トースト通知フック
│   └── use-scroll-reveal.ts      # スクロール表示アニメーション
│
├── types/                        # TypeScript型定義
│   ├── microcms.ts               # microCMS API型
│   ├── sheets.ts                 # Google Sheets型
│   ├── afb-api.ts                # AFB API型（未使用）
│   ├── gtm.d.ts                  # GTM型定義
│   └── next-auth.d.ts            # Next-Auth型拡張
│
├── emails/                       # メールテンプレート（React Email）
│   ├── verification-email.tsx    # 認証メール
│   └── password-reset-email.tsx  # パスワードリセットメール
│
├── google-spread-sheet/          # Google Apps Script
│   ├── code.gs.js                # A8.net成果マッチング処理
│   └── deal-auto-fill.gs.js      # 案件自動入力（未使用）
│
├── middleware.ts                 # Next.js Middleware（認証保護）
│
├── docs/                         # プロジェクトドキュメント（84ファイル）
│   ├── index.md                  # ドキュメント索引
│   ├── specs/                    # 要件定義・仕様書
│   │   ├── spec.md               # プロジェクト要件定義書（588行）
│   │   ├── google.md             # Google Sheets設計
│   │   ├── asp.md                # ASP連携仕様
│   │   └── asp/                  # 各ASP個別ドキュメント（20ファイル）
│   ├── dev/                      # 開発ドキュメント
│   │   ├── architecture.md       # アーキテクチャ
│   │   ├── seo-implementation.md # SEO実装ガイド（343行）
│   │   ├── git-workflow.md       # Gitワークフロー
│   │   └── （9ファイル）
│   ├── guides/                   # セットアップガイド
│   │   ├── microcms-setup.md     # microCMS設定
│   │   ├── email-setup.md        # メール設定
│   │   └── （5ファイル）
│   ├── operations/               # 運用ドキュメント
│   │   ├── gas-a8net-update-guide.md  # GAS更新手順
│   │   └── （5ファイル）
│   ├── design/                   # デザインガイドライン
│   │   ├── color-guidelines.md   # カラートークン
│   │   └── （2ファイル）
│   ├── architecture/             # アーキテクチャ図
│   │   └── （2ファイル）
│   ├── analytics/                # アナリティクス
│   │   └── gtm-setup.md          # GTM設定
│   └── handoff/                  # 引き継ぎドキュメント
│       └── （3ファイル）
│
├── public/                       # 静的ファイル
│   ├── favicon.ico               # ファビコン
│   ├── ogp.jpg                   # OGP画像（1200x630px）
│   └── assets/                   # 画像・動画
│       ├── images/               # 画像ファイル（23 WebP, 1 WebM）
│       ├── win2/                 # ロゴ・アイコン
│       └── win2wix_scrrenshots/  # Wix版スクリーンショット
│
├── tailwind.config.ts            # TailwindCSS設定
├── components.json               # shadcn/ui設定
├── tsconfig.json                 # TypeScript設定（strict mode）
├── next.config.ts                # Next.js設定
├── postcss.config.mjs            # PostCSS設定
├── package.json                  # 依存関係・スクリプト
├── .env.local                    # 環境変数（Git管理外）
├── .env.example                  # 環境変数テンプレート
├── .gitignore                    # Git除外設定
├── README.md                     # プロジェクトREADME（402行）
└── CLAUDE.md                     # Claude Code向けガイド
```

### 実装済みページ一覧

#### 一般公開ページ（非会員も閲覧可能）

| ページ | パス | 説明 | SEO |
|--------|------|------|-----|
| トップページ | `/` | ランディングページ（11セクション） | ✓ Organization + WebSite JSON-LD |
| ブログ一覧 | `/blog` | ブログ記事一覧（ページネーション） | ✓ CollectionPage JSON-LD |
| ブログ詳細 | `/blog/[id]` | 記事詳細（Markdown表示） | ✓ Article JSON-LD |
| カテゴリ | `/category/[id]` | カテゴリ別記事一覧 | ✓ CollectionPage JSON-LD |
| FAQ | `/faq` | よくある質問 | ✓ |
| プライバシーポリシー | `/privacy` | プライバシーポリシー | ✓ |

#### 認証ページ（非会員向け）

| ページ | パス | 説明 | SEO |
|--------|------|------|-----|
| ログイン | `/login` | メールアドレス+パスワードでログイン | ✓ WebPage JSON-LD |
| 会員登録 | `/register` | 新規会員登録フォーム | ✓ WebPage JSON-LD |
| メール認証 | `/verify-email?token=xxx` | 認証メールのリンク先 | - |
| パスワードリセット要求 | `/forgot-password` | パスワードリセット要求フォーム | - |
| パスワード再設定 | `/reset-password?token=xxx` | パスワード再設定フォーム | - |

#### 会員専用ページ（認証必須）

| ページ | パス | 説明 | 保護 |
|--------|------|------|-----|
| マイページトップ | `/mypage` | 会員情報表示 | ✓ Middleware |
| 申込履歴 | `/mypage/history` | 申込履歴・成果一覧 | ✓ Middleware |

**合計**: 13ページ（静的6 + 動的7）

### APIエンドポイント一覧

#### 実装済みAPI（12エンドポイント）

| カテゴリ | エンドポイント | メソッド | 認証 | 説明 |
|---------|--------------|---------|------|------|
| **認証** | `/api/auth/[...nextauth]` | GET/POST | - | Next-Auth認証エンドポイント |
| **会員管理** | `/api/register` | POST | - | 会員登録 |
| | `/api/members/me` | GET | ✓ | 会員情報取得 |
| | `/api/verify-email` | GET | - | メール認証 |
| | `/api/resend-verification` | POST | ✓ | 認証メール再送信 |
| | `/api/forgot-password` | POST | - | パスワードリセット要求 |
| | `/api/reset-password` | POST | - | パスワード再設定 |
| **ブログ** | `/api/blogs` | GET | - | ブログ一覧（microCMSプロキシ） |
| | `/api/categories` | GET | - | カテゴリ一覧（microCMSプロキシ） |
| **トラッキング** | `/api/track-click` | POST | - | クリック追跡・トラッキングURL生成 |
| | `/api/history` | GET | ✓ | 申込履歴取得 |

#### 未実装API（スタブ作成済み、2エンドポイント）

| カテゴリ | エンドポイント | メソッド | 説明 | 状態 |
|---------|--------------|---------|------|------|
| **Webhook** | `/api/webhooks/asp-conversion` | POST | ASP Webhook受信 | ディレクトリのみ |
| **Cron** | `/api/cron/sync-afb-conversions/route.ts` | GET | AFB成果同期Cron | ファイル作成済み（未実装） |

**合計**: 11 実装済み + 2 未実装 = 13エンドポイント

---

## デプロイ・セットアップ情報

### 必要な環境変数

以下の環境変数を Vercel Environment Variables（または `.env.local`）に設定してください。

#### microCMS設定（ブログ機能に必須）

```bash
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

**取得方法**: microCMS管理画面 → API設定  
**ドキュメント**: `docs/guides/microcms-setup.md`

#### Google Sheets API設定（会員管理・成果管理に必須）

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

**取得方法**:
1. Google Cloud Platform でサービスアカウント作成
2. Sheets API有効化
3. サービスアカウントキー（JSON）ダウンロード
4. スプレッドシートに編集権限付与（サービスアカウントメールアドレスで共有）

**注意**: `GOOGLE_SHEETS_PRIVATE_KEY` は改行文字 `\n` を含む長い文字列です。Vercelでは `"` で囲んでください。

#### Next-Auth設定（認証に必須）

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

**生成方法**:
```bash
openssl rand -base64 32
```

**注意**: 本番環境では必ず `https://` から始まる本番URLを指定してください。

#### Resend設定（メール送信、オプション）

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_VALID=true
```

**取得方法**: Resend管理画面 → API Keys  
**ドキュメント**: `docs/guides/resend-setup.md`

**注意**: `RESEND_VALID=true` でメール認証有効化。`false` または未設定でスキップ（開発環境推奨）。

#### アプリケーション設定

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**用途**: OGP画像URL、sitemap.xml URL生成

#### Google Tag Manager（アナリティクス、オプション）

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**取得方法**: Google Tag Manager管理画面  
**ドキュメント**: `docs/analytics/gtm-setup.md`

### デプロイ手順（Vercel想定）

#### 前提条件

- Node.js 18.x 以上
- Vercelアカウント
- GitHubリポジトリ（推奨）

#### 手順

**1. Vercelプロジェクト作成**

```bash
# Vercel CLIインストール（オプション）
npm install -g vercel

# Vercelログイン
vercel login

# プロジェクトリンク（初回のみ）
vercel link
```

または、Vercel Dashboard からGitHubリポジトリをインポート。

**2. 環境変数設定**

Vercel Dashboard → Settings → Environment Variables

上記の必要な環境変数をすべて設定。

**重要**:
- Production, Preview, Development すべての環境に設定推奨
- `GOOGLE_SHEETS_PRIVATE_KEY` は必ず `"` で囲む

**3. ビルド設定確認**

Vercel Dashboard → Settings → General

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (デフォルト)
- **Output Directory**: `.next` (デフォルト)
- **Install Command**: `npm install` (デフォルト)
- **Node.js Version**: 18.x

**4. デプロイ実行**

```bash
# プロダクションデプロイ
vercel --prod

# または、GitHubにpushで自動デプロイ（推奨）
git push origin main
```

**5. カスタムドメイン設定（オプション）**

Vercel Dashboard → Settings → Domains

1. カスタムドメイン追加
2. DNS設定（Vercelが自動で指示）
3. SSL証明書自動取得（Let's Encrypt）

**ドキュメント**: `docs/architecture/dns-infrastructure.md`

**6. デプロイ後の確認**

- [ ] トップページ表示確認: `https://yourdomain.com`
- [ ] ブログ一覧: `/blog`
- [ ] 会員登録: `/register`
- [ ] ログイン: `/login`
- [ ] マイページ（ログイン後）: `/mypage`
- [ ] sitemap.xml: `/sitemap.xml`
- [ ] robots.txt: `/robots.txt`
- [ ] OGPプレビュー: [Facebook Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator)

**7. Google Search Console登録**

1. [Google Search Console](https://search.google.com/search-console) にログイン
2. プロパティ追加（ドメインまたはURLプレフィックス）
3. 所有権確認（Vercelではメタタグ方式推奨）
4. sitemap.xml 送信: `https://yourdomain.com/sitemap.xml`

### 外部サービス連携状況

#### microCMS（ブログCMS）

- **状態**: ✅ 完全統合済み
- **API**: blogs, categories
- **接続**: microCMS SDK v3.2.0
- **認証**: APIキー方式
- **セットアップガイド**: `docs/guides/microcms-setup.md`

#### Google Sheets（会員・成果データベース）

- **状態**: ✅ 完全統合済み
- **シート構成**: 会員リスト、クリックログ、成果データ、成果CSV_RAW
- **接続**: googleapis v164.1.0
- **認証**: サービスアカウント
- **セットアップガイド**: `docs/specs/google.md`

#### Google Apps Script（成果マッチング処理）

- **状態**: ✅ 実装済み（手動実行）
- **スクリプト**: `google-spread-sheet/code.gs.js`
- **機能**: A8.net Parameter Tracking Report CSVからクリックログへ自動記録
- **実行方法**: スプレッドシートメニュー「成果処理」→「成果をクリックログに記録」
- **運用ガイド**: `docs/operations/gas-a8net-update-guide.md`

#### Resend（メール送信）

- **状態**: ✅ 統合済み（オプション）
- **用途**: 認証メール、パスワードリセットメール
- **接続**: Resend v4.0.0
- **認証**: APIキー
- **有効化**: `RESEND_VALID=true` 環境変数
- **セットアップガイド**: `docs/guides/email-setup.md`, `docs/guides/resend-setup.md`

#### A8.net（ASP）

- **状態**: ✅ Parameter Tracking 対応済み
- **連携方式**: id1（会員ID）、id2（イベントID）パラメータ
- **成果取得**: Parameter Tracking Report CSV手動ダウンロード → 成果CSV_RAWシートへ貼付 → GAS実行
- **検証ドキュメント**: `docs/dev/a8-parameter-tracking-verification.md`

#### Google Tag Manager（アナリティクス）

- **状態**: ✅ 統合済み（オプション）
- **GTM ID**: `NEXT_PUBLIC_GTM_ID` 環境変数で設定
- **イベント**: クリック追跡、会員登録等
- **セットアップガイド**: `docs/analytics/gtm-setup.md`

#### Next-Auth（認証）

- **状態**: ✅ 完全統合済み
- **バージョン**: v4.24.11（安定版）
- **認証方式**: Credentials Provider（メール+パスワード）
- **セッション**: JWT（30日間）

#### 未連携サービス（将来対応）

- **AFB**: ドキュメント作成済み（`docs/specs/asp/afb-implementation-guide.md`）
- **もしもアフィリエイト**: 仕様調査済み（`docs/specs/asp/moshimo-overview.md`）
- **バリューコマース**: API仕様書作成済み（`docs/specs/asp/valuecommerce/`）
- **レントラックス**: 未調査

---

## 今後の対応項目

### 未対応ASP追加（オプション）

一次納品では A8.net のみ対応しています。以下のASPを追加する場合は、各¥1,700の追加費用が発生します。

#### 1. AFB（アフィリエイトB） - ¥1,700

**実装内容**:
- AFB API認証実装（OAuth 2.0またはAPIキー方式）
- Postback URL設定・Webhook受信処理
- 成果データ取得API連携（リアルタイムまたはバッチ処理）
- GAS成果マッチング処理の拡張（AFB対応）
- トラッキングパラメータ統合（sid1, sid2等）

**作業時間見積もり**: 6-8時間

**参考ドキュメント**（作成済み）:
- `docs/specs/asp/afb-implementation-guide.md`: 実装ガイド
- `docs/specs/asp/afb-postback.md`: Postback仕様
- `docs/handoff/afb-postback-integration.md`: 引き継ぎドキュメント
- `lib/asp/afb-client.ts`: クライアントスタブ（実装済み、未使用）

#### 2. バリューコマース - ¥1,700

**実装内容**:
- ValueCommerce Link Switch API統合
- Order List API連携（成果データ取得）
- OAuth 2.0認証フロー実装
- GAS成果マッチング処理の拡張
- 自動リンク変換機能（オプション）

**作業時間見積もり**: 7-9時間

**参考ドキュメント**（作成済み）:
- `docs/specs/asp/valuecommerce/overview.md`: 概要
- `docs/specs/asp/valuecommerce/authentication-setup.md`: 認証設定
- `docs/specs/asp/valuecommerce/order-api-guide.md`: Order API

#### 3. もしもアフィリエイト - ¥1,700

**実装内容**:
- もしもアフィリエイト API調査・実装
- 成果データ取得API連携
- 自動リンク変換機能（オプション）
- GAS成果マッチング処理の拡張

**作業時間見積もり**: 6-8時間

**参考ドキュメント**（作成済み）:
- `docs/specs/asp/moshimo-overview.md`: 概要

#### 4. レントラックス - ¥1,700

**実装内容**:
- レントラックス API仕様調査
- 成果データ取得方法の確立
- Parameter Tracking対応確認（対応可否要確認）
- GAS成果マッチング処理の拡張

**作業時間見積もり**: 7-10時間（仕様調査含む）

**参考ドキュメント**: 未作成（API仕様調査が必要）

#### ASP追加の共通作業

各ASP追加時に以下の作業が含まれます：

1. API仕様調査・認証実装（2-3時間）
2. 成果データ取得処理実装（2-3時間）
3. GAS成果マッチング処理拡張（1-2時間）
4. テスト・検証（1-2時間）
5. ドキュメント更新（1時間）

**共通ドキュメント**（作成済み）:
- `docs/specs/asp/asp-api-integration.md`: 共通ASP連携インターフェース
- `docs/specs/asp/common/error-handling.md`: エラーハンドリング戦略
- `docs/specs/asp/common/security-considerations.md`: セキュリティ考慮事項
- `docs/specs/asp/common/testing-strategy.md`: テスト戦略
- `docs/specs/asp/common/tracking-parameters.md`: 共通トラッキングパラメータ

### Phase 4以降の機能拡張項目

一次納品では Phase 1-3 が完了しています。以下は Phase 4 以降の拡張機能です（見積もり別途）。

#### Phase 4: 機能拡張（未着手）

**1. 案件一覧ページ（会員限定）**
- 全案件の一覧表示（Google Sheets「案件マスタ」から取得）
- カテゴリフィルタリング
- 検索機能
- ソート機能（報酬額順、人気順等）

**見積もり**: ¥8,000-10,000（2-3日）

**2. 詳細検索機能（ブログ・案件）**
- 全文検索（ブログ記事本文、案件名、条件等）
- 複合検索（カテゴリ+キーワード）
- 検索結果ページ
- 検索履歴保存（会員のみ）

**見積もり**: ¥12,000-15,000（3-4日）

**3. ユーザープロフィール編集**
- 会員情報編集フォーム（氏名、生年月日、郵便番号、電話番号）
- メールアドレス変更（再認証必要）
- パスワード変更
- アカウント削除（論理削除）

**見積もり**: ¥6,000-8,000（2日）

**4. Email通知設定**
- 通知設定ページ（マイページ内）
- 新着案件通知（メール）
- 成果承認通知（メール）
- ブログ更新通知（オプション）
- 通知頻度設定（即時/日次/週次）

**見積もり**: ¥10,000-12,000（3日）

#### Phase 5: 最適化・拡張（未着手）

**1. Lighthouseパフォーマンス最適化（目標90+）**
- Core Web Vitals 改善
- 画像遅延読み込み最適化
- JavaScriptバンドルサイズ削減
- CSS最適化
- フォント最適化

**見積もり**: ¥8,000-10,000（2-3日）

**2. A8.net 本番テスト**
- A8.net本番アカウントでの動作確認
- Parameter Tracking動作検証
- 成果マッチング処理の実運用テスト
- エラーケースの検証

**見積もり**: ¥4,000-6,000（1-2日）

**3. セキュリティ監査**
- OWASP Top 10 脆弱性チェック
- APIセキュリティ監査
- 認証・認可フロー監査
- Rate Limiting実装（rate-limiter-flexible使用）
- CSRF/XSS対策強化

**見積もり**: ¥10,000-15,000（3-4日）

**4. 管理画面（Admin Dashboard）**
- 会員管理画面（一覧、詳細、編集、削除）
- 案件管理画面（追加、編集、有効/無効切替）
- 統計ダッシュボード（会員数、成果件数、総報酬額等）

**見積もり**: ¥25,000-35,000（7-10日）

#### 将来的な拡張案（検討段階）

- 銀行口座情報登録機能
- 振込スケジュール管理
- 振込履歴表示
- 外部決済サービス連携（Stripe Connect等）

**2. ポイントシステム**
- 申込でポイント獲得
- ポイント履歴表示
- ポイント交換機能（ギフト券等）

**3. 会員ランク制度**
- 申込件数・金額に応じたランク付け

**4. ソーシャル機能**
- 案件レビュー・評価
- お気に入り案件登録
- シェア機能（Twitter, Facebook）

**5. モバイルアプリ**
- React Native / Flutter による iOS/Androidアプリ
- プッシュ通知
- オフラインモード

**6. AIレコメンデーション**
- 会員の履歴に基づく案件推薦
- パーソナライズドコンテンツ表示

これらの拡張機能については、ご要望に応じて個別にお見積もりいたします。

---

## 付録

### ドキュメント一覧

本プロジェクトでは、84ファイルの包括的なドキュメントを作成しました。

#### 要件定義・仕様書 (`docs/specs/`)

| ファイル | 内容 | 行数 |
|---------|------|------|
| `spec.md` | プロジェクト要件定義書（全体仕様） | 588行 |
| `google.md` | Google Sheets データベース設計 | - |
| `asp.md` | ASP連携仕様書 | - |
| `asp/README.md` | ASP統合ドキュメント索引 | - |
| `asp/a8net-api.md` | A8.net API仕様 | - |
| `asp/afb-implementation-guide.md` | AFB実装ガイド | - |
| `asp/afb-postback.md` | AFB Postback仕様 | - |
| `asp/asp-api-integration.md` | 共通ASP連携インターフェース | - |
| `asp/asp-comparison-report.md` | ASP比較レポート | - |
| `asp/valuecommerce/overview.md` | バリューコマース概要 | - |
| `asp/valuecommerce/authentication-setup.md` | バリューコマース認証設定 | - |
| `asp/valuecommerce/order-api-guide.md` | バリューコマース Order API | - |
| `asp/moshimo-overview.md` | もしもアフィリエイト概要 | - |
| `asp/common/tracking-parameters.md` | 共通トラッキングパラメータ | - |
| `asp/common/error-handling.md` | エラーハンドリング戦略 | - |
| `asp/common/security-considerations.md` | セキュリティ考慮事項 | - |
| `asp/common/testing-strategy.md` | テスト戦略 | - |
| `asp/common/conversion-matching.md` | 成果マッチング仕様 | - |

#### 開発ドキュメント (`docs/dev/`)

| ファイル | 内容 |
|---------|------|
| `architecture.md` | アーキテクチャ詳細設計 |
| `seo-implementation.md` | SEO実装ガイド（343行） |
| `git-workflow.md` | Gitワークフロー・コミット規約 |
| `branch.md` | ブランチ管理戦略 |
| `environment.md` | 開発環境セットアップ |
| `a8-parameter-tracking-verification.md` | A8.net Parameter Tracking検証記録 |
| `a8-support-inquiry-final.md` | A8サポート問い合わせ記録 |
| `github-issue-22-update.md` | GitHub Issue更新記録 |

#### セットアップガイド (`docs/guides/`)

| ファイル | 内容 |
|---------|------|
| `microcms-setup.md` | microCMS API設定ガイド |
| `email-setup.md` | メール送信設定ガイド |
| `resend-setup.md` | Resend設定詳細 |
| `cta-shortcode-guide.md` | CTA shortcode使用ガイド |
| `cta-technical-guide.md` | CTA実装技術ガイド |

#### 運用ドキュメント (`docs/operations/`)

| ファイル | 内容 |
|---------|------|
| `gas-a8net-update-guide.md` | GAS更新・運用手順 |
| `a8-conversion-matching.md` | A8成果マッチング処理 |
| `afb-a8-hybrid-workflow.md` | AFB+A8ハイブリッドワークフロー |
| `environment-variables-setup.md` | 環境変数設定ガイド |
| `webhook-monitoring.md` | Webhook監視ガイド |

#### デザインガイドライン (`docs/design/`)

| ファイル | 内容 |
|---------|------|
| `color-guidelines.md` | カラートークン定義 |
| `landing-page-refresh-2025-01-09.md` | LP改善記録 |

#### アーキテクチャ図 (`docs/architecture/`)

| ファイル | 内容 |
|---------|------|
| `webhook-flow.md` | Webhook処理フロー図 |
| `dns-infrastructure.md` | DNSインフラ構成 |

#### アナリティクス (`docs/analytics/`)

| ファイル | 内容 |
|---------|------|
| `gtm-setup.md` | Google Tag Manager設定ガイド |

#### 引き継ぎドキュメント (`docs/handoff/`)

| ファイル | 内容 |
|---------|------|
| `afb-postback-integration.md` | AFB Postback統合引き継ぎ |
| `asp-integration-session-handoff.md` | ASP統合セッション引き継ぎ |
| `2025-01-05-afb-removal-handoff.md` | AFB削除引き継ぎ（2025-01-05） |

#### その他

| ファイル | 内容 | 行数 |
|---------|------|------|
| `README.md` | プロジェクトREADME | 402行 |
| `CLAUDE.md` | Claude Code向けガイド | - |
| `docs/index.md` | ドキュメント索引 | - |
| `todo.md` | TODOリスト | - |

### 参考資料リンク

#### 使用技術ドキュメント

**フレームワーク・ライブラリ**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

**認証・API**
- [Next-Auth v4 Documentation](https://next-auth.js.org/)
- [microCMS Documentation](https://document.microcms.io/)
- [Google Sheets API Reference](https://developers.google.com/sheets/api)
- [Resend Documentation](https://resend.com/docs)

**SEO・アナリティクス**
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [Google Tag Manager](https://tagmanager.google.com/)

**デプロイ**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)

#### 外部サービス

**ASP（アフィリエイトサービスプロバイダー）**
- [A8.net](https://www.a8.net/)
- [AFB（アフィリエイトB）](https://www.afi-b.com/)
- [もしもアフィリエイト](https://af.moshimo.com/)
- [バリューコマース](https://www.valuecommerce.ne.jp/)

**開発ツール**
- [GitHub](https://github.com/)
- [npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/)

---

**本報告書作成日**: 2025年1月22日  
**作成者**: WIN×II開発チーム  
**バージョン**: 1.0（一次納品）

---

## まとめ

WIN×II開発プロジェクト一次納品では、見積もり¥32,900（税込）に対し、以下を完全に実装しました：

**納品内容サマリー**:
- ✅ プロジェクト管理・要件定義（¥7,000）
- ✅ デザイン・UI調整（¥3,000）
- ✅ サイト基本構築（¥10,000）
- ✅ カスタム機能開発（¥7,200）- A8.net対応
- ✅ テスト・バグ修正・納品準備（¥5,000）

**技術成果**:
- Next.js 15 + React 19 による最新技術スタック
- 13ページ（静的6 + 動的7）
- 11 API エンドポイント
- 84ファイルの包括的ドキュメント
- 包括的SEO実装（OGP、Twitter Card、JSON-LD）
- Google Sheets APIによる会員・成果データベース
- A8.net Parameter Tracking完全対応
- GAS成果マッチング自動処理

**今後の展開**:
- 未対応ASP追加（各¥1,700）: AFB、レントラックス、バリューコマース、もしも
- Phase 4機能拡張: 案件一覧、詳細検索、プロフィール編集等
- Phase 5最適化: パフォーマンス、セキュリティ監査、Admin Dashboard

本プロジェクトは、拡張性・保守性・セキュリティを考慮した設計となっており、今後の機能追加にも柔軟に対応可能です。

ご不明な点や追加のご要望がございましたら、お気軽にお問い合わせください。