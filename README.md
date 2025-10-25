# WIN×Ⅱ

会員制アフィリエイトブログプラットフォーム

## プロジェクト概要

WIN×Ⅱ は、ASP（アフィリエイトサービスプロバイダー）の案件を紹介し、会員にキャッシュバックを提供する会員制ブログプラットフォームです。Next.js 15、microCMS、Google Sheets API を活用した現代的なJamstackアーキテクチャで構築されています。

### 主要機能

- **ブログ記事管理**: microCMS でコンテンツ管理、SEO対応（OGP、sitemap.xml）
- **ASP案件紹介**: A8.net、AFB、もしもアフィリエイト、バリューコマース対応
- **会員機能**: 登録・ログイン、マイページ、申込履歴管理
- **キャッシュバックシステム**: 成果の20%を会員に還元
- **トラッキング**: 会員・非会員（guest:UUID）のクリックログ記録

### 実装状況

✅ **Phase 1 完了（100%）**:
- Next.js 15.1.4 プロジェクト初期化（App Router、TypeScript 5 strict mode）
- TailwindCSS v3.4.1 + shadcn/ui セットアップ（Button、Input、Card、Label、Form、Toast）
- microCMS SDK 統合（Blog、Deal、Category 型定義完了）
- Google Sheets API 認証・ユーティリティ関数実装
- 基本レイアウトコンポーネント（Header、Footer、SessionProvider）
- Next-Auth v5 基盤設定完了

✅ **Phase 2 完了（100%）**:
- 会員登録機能（Zod バリデーション + react-hook-form）
- 会員登録 API（`/api/register`、bcrypt パスワードハッシュ化）
- ログイン/ログアウト機能（Next-Auth v5 CredentialsProvider）
- 認証保護ミドルウェア（`/mypage/*`、`/deals/*` 保護）
- マイページ実装（登録情報表示、サイドナビゲーション）
- 会員情報取得 API（`/api/members/me`）

⏳ **未実装**:
- ブログ記事一覧・詳細ページ（Phase 3）
- 案件一覧ページ（Phase 4）
- クリック追跡API（Phase 4）
- 申込履歴表示（Phase 4）

---

## 技術スタック

### フロントエンド
- **Next.js**: 15.1.4（App Router、React Server Components）
- **React**: 19
- **TypeScript**: 5（strict mode、noUncheckedIndexedAccess 有効）
- **TailwindCSS**: v3.4.1
- **shadcn/ui**: Radix UI primitives ベース

### バックエンド・API
- **Next.js API Routes**: サーバーサイドAPI
- **Next-Auth**: v4.24.11（安定版）
- **Google Sheets API**: googleapis v164.1.0
- **microCMS SDK**: v3.2.0（Headless CMS）
- **bcryptjs**: v3.0.2（パスワードハッシュ化、salt rounds: 10）

### バリデーション・ユーティリティ
- **zod**: v4.1.12
- **class-variance-authority**: v0.7.1

### デプロイ
- **Vercel**（予定）

---

## クイックスタート

### 前提条件

- **Node.js**: 18.x 以上
- **npm**: 9.x 以上
- **Google Cloud Platform アカウント**: Sheets API サービスアカウント設定済み
- **microCMS アカウント**: API キー発行済み

### インストール

```bash
# リポジトリクローン
git clone <repository-url>
cd win2

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.local を編集して必要な環境変数を設定
```

### 環境変数設定

`.env.local` に以下を設定：

```bash
# microCMS
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# Google Sheets API
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# Next-Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key  # openssl rand -base64 32 で生成推奨
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

### ビルド・本番起動

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start
```

### リント・型チェック

```bash
# ESLint実行
npm run lint

# TypeScript型チェック
npx tsc --noEmit
```

---

## ディレクトリ構成

```text
win2/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ
│   └── globals.css         # グローバルCSS
│
├── components/             # Reactコンポーネント
│   ├── providers/          # React Context Providers
│   │   └── session-provider.tsx  # Next-Auth SessionProvider
│   └── ui/                 # shadcn/ui コンポーネント
│
├── lib/                    # ユーティリティ・API関数
│   ├── googleapis.ts       # Google Sheets 認証
│   ├── sheets.ts           # Sheets 操作関数
│   ├── microcms.ts         # microCMS クライアント
│   ├── auth.ts             # Next-Auth 設定
│   ├── validations/        # Zod バリデーションスキーマ
│   └── utils.ts            # shadcn/ui ユーティリティ
│
├── hooks/                  # React カスタムフック
│   └── use-toast.ts        # Toast通知フック
│
├── types/                  # TypeScript 型定義
│   ├── microcms.ts         # microCMS API型
│   └── next-auth.d.ts      # Next-Auth 型拡張
│
├── middleware.ts           # 認証保護ミドルウェア
│
├── docs/                   # プロジェクトドキュメント
│   ├── index.md            # ドキュメント索引
│   ├── specs/              # 要件定義・仕様
│   │   ├── spec.md         # 要件定義書
│   │   ├── google.md       # Google Sheets 構成
│   │   └── asp.md          # ASP認証情報（秘匿）
│   └── dev/                # 開発ドキュメント
│       ├── architecture.md # アーキテクチャ詳細
│       └── branch.md       # Git ブランチ戦略
│
├── .env.local              # 環境変数（Git管理外）
├── .env.example            # 環境変数テンプレート
│
├── tsconfig.json           # TypeScript 設定
├── tailwind.config.ts      # TailwindCSS 設定
├── components.json         # shadcn/ui 設定
├── next.config.ts          # Next.js 設定
│
├── CLAUDE.md               # Claude Code向けガイド
└── README.md               # 本ファイル
```

---

## データベース設計

### Google Sheets 構成

**シート1: 会員リスト**
- memberId（UUID）、氏名、メールアドレス、パスワードハッシュ、生年月日、郵便番号、電話番号、登録日時

**シート2: クリックログ**
- 日時、memberId（or guest:UUID）、案件名、案件ID

**シート3: 成果データ**（GAS自動出力）
- 氏名、案件名、承認状況、キャッシュバック金額、memberId、原始報酬額、メモ

**シート4: 成果CSV_RAW**（手動貼付）
- id1、dealName、reward、status

### microCMS API構成

**blogs**: ブログ記事（title, slug, content, thumbnail, category, relatedDeals, etc.）
**deals**: ASP案件（dealId, dealName, aspName, rewardAmount, cashbackRate, affiliateUrl, etc.）
**categories**: カテゴリ（name, slug, displayOrder, isVisible）

---

## 主要な開発規約

### Git ブランチ戦略

2ブランチ管理（dev/main）+ Feature branches

- `main`: 本番環境リリースブランチ
- `dev`: 開発統合ブランチ
- `feature/*`: 機能追加ブランチ
- `fix/*`: バグ修正ブランチ

詳細は `docs/dev/branch.md` 参照。

### コミットメッセージ形式

```
PREFIX: コミットメッセージ

詳細説明（任意）
```

**PREFIX一覧**:
- `FEATURE`: 新機能追加
- `UPDATE`: 既存機能の改善・拡張
- `FIX`: バグ修正
- `REFACTOR`: リファクタリング
- `STYLE`: コードスタイル修正
- `DOC`: ドキュメント更新
- `CHORE`: ビルド・設定ファイル変更

### TypeScript 厳格設定

- `strict: true`: 厳格な型チェック
- `noUncheckedIndexedAccess: true`: 配列・オブジェクトアクセス時の undefined チェック必須

---

## ドキュメント

詳細なプロジェクト情報は `docs/` ディレクトリ配下を参照：

- **[docs/index.md](docs/index.md)**: ドキュメント索引（このファイルから開始）
- **[docs/specs/spec.md](docs/specs/spec.md)**: プロジェクト要件定義書（必読）
- **[docs/dev/architecture.md](docs/dev/architecture.md)**: アーキテクチャ詳細
- **[docs/dev/branch.md](docs/dev/branch.md)**: Git ブランチ戦略
- **[CLAUDE.md](CLAUDE.md)**: Claude Code 向けプロジェクトガイド

---

## 開発フェーズ

### Phase 1: 環境構築・基盤実装（100% 完了）
- [x] Next.js 15 プロジェクト初期化
- [x] TailwindCSS + shadcn/ui セットアップ
- [x] microCMS SDK 統合
- [x] Google Sheets API 認証・ユーティリティ実装
- [x] 基本レイアウトコンポーネント
- [x] Next-Auth v5 基盤設定

### Phase 2: 認証・会員機能（100% 完了）
- [x] 会員登録API + フォーム（Zod + react-hook-form）
- [x] ログイン/ログアウト（Next-Auth v5 CredentialsProvider）
- [x] 認証保護ミドルウェア
- [x] マイページ（登録情報表示、サイドナビゲーション）
- [ ] 登録情報編集（Phase 3 で実装予定）
- [ ] 申込履歴表示（Phase 4 で実装予定）

### Phase 3: CMS連携・ブログ機能（未着手）
- ブログ記事一覧（ISR）・詳細ページ（SSG）
- カテゴリフィルタリング
- OGP動的生成、sitemap.xml自動生成

### Phase 4: ASP案件・追跡機能（未着手）
- 案件一覧ページ（会員限定）
- クリック追跡API（/api/track-click）
- guest:UUID 永続化ロジック
- 記事内CTA統合

### Phase 5: テスト・最適化（未着手）
- A8.net テストアカウント動作確認
- レスポンシブデザイン調整
- Lighthouseパフォーマンス最適化（目標: 90+）
- セキュリティ監査
- 本番デプロイ（Vercel）

---

## ライセンス

本プロジェクトはプライベート利用を想定しています。

---

## 連絡先

プロジェクトに関する質問や提案は、プロジェクトオーナーまで連絡してください。
