# WIN×Ⅱ Phase 1 残り機能実装 PRD

## 概要

Phase 1の基本機能実装の残りタスクを定義します。会員登録とNext-Auth認証基盤は完成済みのため、以下の機能を実装してPhase 1を完了させます。

## 前提条件（完了済み）

- ✅ Next.js 15 + TypeScript環境構築
- ✅ Next-Auth v4.24.11セットアップ
- ✅ Google Sheets API連携
- ✅ microCMS SDK設定
- ✅ 会員登録API (`/api/register`)
- ✅ shadcn/ui基本コンポーネント

## 実装が必要な機能

### 1. ログイン機能

**目的:** 既存会員がメールアドレスとパスワードでログインできるようにする

**要件:**
- ログインフォームページ (`/login`)
- Next-Auth CredentialsProviderによる認証（既に設定済み）
- ログイン成功後、マイページ (`/mypage`) にリダイレクト
- ログイン失敗時、エラーメッセージ表示
- セッション保持期間: 30日間（既に設定済み）

**技術的詳細:**
- `signIn('credentials', { email, password })` を使用
- フォームバリデーション（Zod + react-hook-form）
- エラーハンドリング（パスワード誤り、存在しないメールアドレス）

### 2. ブログ一覧・詳細ページ

**目的:** 非会員・会員問わず、ブログ記事を閲覧できるようにする

**要件:**

#### 2.1 ブログ一覧ページ (`/blogs`)
- microCMS API経由でブログ記事一覧を取得
- カード形式で表示（サムネイル、タイトル、カテゴリ、公開日）
- ページネーション対応（1ページ10件）
- カテゴリフィルタリング機能
- SEO対応（メタタグ、OGP）

#### 2.2 ブログ詳細ページ (`/blogs/[slug]`)
- microCMS APIで記事詳細取得
- Markdown/リッチテキストのレンダリング
- 関連案件のCTAボタン表示
- 案件CTAボタンクリック時、`/api/track-click` 経由でアフィリエイトURLにリダイレクト
- SEO対応（記事ごとのメタタグ、OGP）

**技術的詳細:**
- Server Component で microCMS データ取得
- `generateStaticParams` で静的生成
- カテゴリはmicroCMSの参照フィールドから取得

### 3. クリック追跡API（最重要）

**目的:** 会員・非会員が案件に応募した際、追跡IDを付与してログを記録する

**要件:**
- API Route: `POST /api/track-click`
- リクエストボディ: `{ dealId: string }`
- 処理フロー:
  1. セッション確認（Next-Auth `getServerSession`）
  2. 会員の場合: `memberId` を取得、非会員の場合: `guest:UUID` を生成（Cookie保存）
  3. microCMS APIで案件情報取得（`dealId` から `affiliateUrl` を取得）
  4. Google Sheets「クリックログ」に記録（日時, memberId/guest:UUID, 案件名, dealId）
  5. `affiliateUrl` に `?id1={memberId or guest:UUID}` を付与
  6. レスポンス: `{ trackingUrl: string }`
- エラーハンドリング: 案件が存在しない、Google Sheets書き込み失敗

**技術的詳細:**
- 非会員UUIDはCookieに保存（httpOnly: false, sameSite: lax, maxAge: 365日）
- `addClickLog()` 関数を使用（`lib/sheets.ts`）
- microCMS `deals` APIからdealId検索

### 4. マイページ機能

**目的:** 会員が自分の登録情報と申込履歴を確認できるようにする

**要件:**

#### 4.1 マイページトップ (`/mypage`)
- 認証必須（middleware or getServerSession）
- 会員情報表示（氏名、メールアドレス、生年月日、郵便番号、電話番号）
- 登録情報編集機能（将来実装でも可）
- ログアウトボタン

#### 4.2 申込履歴ページ (`/mypage/history`)
- 認証必須
- Google Sheets「クリックログ」から自分のmemberIdでフィルタリング
- Google Sheets「成果データ」から自分のmemberIdでフィルタリング
- 表示内容:
  - 案件名
  - 申込日時
  - 承認状況（応募済/承認/否認）
  - キャッシュバック金額（承認済みの場合のみ）
- 合計キャッシュバック金額の表示

**技術的詳細:**
- `getClickLogsByMemberId(memberId)` を使用
- `getResultsByMemberId(memberId)` を使用
- データマージ: クリックログと成果データを案件名でマッチング

### 5. 案件一覧ページ（会員限定）

**目的:** 会員が利用可能な案件を一覧表示する

**要件:**
- ページ: `/deals`
- 認証必須（middleware or getServerSession）
- microCMS `deals` APIから全案件取得
- カード形式で表示（案件名、報酬額、キャッシュバック率、説明）
- カテゴリフィルタリング
- 各案件に「申し込む」ボタン → `/api/track-click` 経由でリダイレクト

**技術的詳細:**
- Server Component で deals 一覧取得
- カテゴリはmicroCMSの参照フィールド
- キャッシュバック金額は `rewardAmount * cashbackRate` で計算表示

## 技術仕様

### API Routes
- `POST /api/track-click` - クリック追跡とリダイレクトURL生成

### Pages (App Router)
- `/login` - ログインページ
- `/blogs` - ブログ一覧
- `/blogs/[slug]` - ブログ詳細
- `/mypage` - マイページトップ
- `/mypage/history` - 申込履歴
- `/deals` - 案件一覧（会員限定）

### Google Sheets Operations
- `addClickLog()` - クリックログ追加（既存関数）
- `getClickLogsByMemberId()` - 会員のクリックログ取得（既存関数）
- `getResultsByMemberId()` - 会員の成果データ取得（既存関数）

### microCMS API
- `GET /api/v1/blogs` - ブログ一覧取得
- `GET /api/v1/blogs/:id` - ブログ詳細取得
- `GET /api/v1/deals` - 案件一覧取得
- `GET /api/v1/deals/:id` - 案件詳細取得
- `GET /api/v1/categories` - カテゴリ一覧取得

## 優先順位

1. **最優先:** クリック追跡API (`/api/track-click`) - システムの核心機能
2. **高:** ログイン機能 - 会員限定機能の前提
3. **高:** ブログ詳細ページ - CTAボタンからtrack-click APIを呼ぶため
4. **中:** マイページ機能 - 会員のエンゲージメント向上
5. **中:** ブログ一覧ページ - SEO・集客のため
6. **低:** 案件一覧ページ - 会員限定の補助機能

## 成功基準

- 会員がログインできる
- ブログ記事が閲覧できる（一覧・詳細）
- 非会員・会員ともに案件に応募でき、クリックログが記録される
- 会員がマイページで申込履歴を確認できる
- 会員が案件一覧ページで案件を探せる
- すべてのページでLighthouseスコア90以上

## 非機能要件

- TypeScript strict mode準拠
- すべてのフォームにバリデーション（Zod）
- エラーハンドリングの徹底
- Loading UIの実装
- モバイルレスポンシブ対応
- SEO対応（メタタグ、OGP）
