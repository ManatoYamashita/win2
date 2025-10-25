# WIN×Ⅱ アーキテクチャ ドキュメント

## 概要

本ドキュメントでは、WIN×Ⅱ プロジェクトの実装されたアーキテクチャの詳細を記載します。ディレクトリ構成、設定ファイル、主要な技術的決定を含みます。

**最終更新日**: 2025-01-25
**Phase 1 実装状況**: 70% 完了

---

## ディレクトリ構成

```text
win2/
├── app/                        # Next.js 15 App Router ディレクトリ
│   ├── layout.tsx              # ルートレイアウト（Header、Footer含む）
│   ├── page.tsx                # トップページ（/）
│   └── globals.css             # グローバルスタイル（TailwindCSS含む）
│
├── components/                 # Reactコンポーネント
│   └── ui/                     # shadcn/ui ベースコンポーネント
│       ├── button.tsx          # Buttonコンポーネント
│       ├── input.tsx           # Inputコンポーネント
│       ├── card.tsx            # Cardコンポーネント
│       └── label.tsx           # Labelコンポーネント
│
├── lib/                        # ライブラリ・ユーティリティ関数
│   ├── utils.ts                # shadcn/ui 用ユーティリティ（cn関数）
│   ├── googleapis.ts           # Google Sheets API 認証設定
│   ├── sheets.ts               # Google Sheets 操作関数
│   └── microcms.ts             # microCMS クライアント設定・API関数
│
├── types/                      # TypeScript 型定義
│   └── microcms.ts             # microCMS API レスポンス型定義
│
├── docs/                       # プロジェクトドキュメント
│   ├── index.md                # ドキュメント索引
│   ├── specs/                  # 仕様書
│   │   ├── spec.md             # 要件定義書
│   │   ├── google.md           # Google Sheets 構成
│   │   └── asp.md              # ASP 認証情報（秘匿）
│   └── dev/                    # 開発ドキュメント
│       ├── branch.md           # Git ブランチ戦略
│       └── architecture.md     # 本ファイル
│
├── public/                     # 静的ファイル
│
├── .env.local                  # 環境変数（秘匿、Git管理外）
├── .env.example                # 環境変数テンプレート
├── .gitignore                  # Git除外設定
│
├── tsconfig.json               # TypeScript 設定
├── tailwind.config.ts          # TailwindCSS 設定
├── components.json             # shadcn/ui 設定
├── next.config.ts              # Next.js 設定
├── package.json                # 依存関係・スクリプト
│
├── CLAUDE.md                   # Claude Code 向けプロジェクトガイド
└── README.md                   # プロジェクト README
```

---

## 技術スタック（実装済み）

### フロントエンド
- **Next.js**: 15.1.4（App Router）
- **React**: 19
- **TypeScript**: 5（strict mode、noUncheckedIndexedAccess有効）
- **TailwindCSS**: v3.4.1（v4は将来対応予定）
- **shadcn/ui**: Radix UI primitives ベース

### バックエンド・API
- **Next.js API Routes**: サーバーサイドAPI実装
- **Google Sheets API**: googleapis v164.1.0
- **microCMS SDK**: v3.2.0（Headless CMS）
- **bcryptjs**: v3.0.2（パスワードハッシュ化、salt rounds: 10）
- **Next-Auth**: v5.0.0-beta.29（実装中）

### バリデーション・ユーティリティ
- **zod**: v4.1.12（スキーマバリデーション）
- **class-variance-authority**: v0.7.1（コンポーネントバリアント管理）

---

## 設定ファイル詳細

### tsconfig.json

TypeScript 厳格設定を有効化しています。

```json
{
  "compilerOptions": {
    "strict": true,                        // 厳格モード有効
    "noUncheckedIndexedAccess": true,      // 配列・オブジェクトアクセス時のundefinedチェック必須
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]                       // パスエイリアス設定
    },
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**主要設定の意味**:
- `strict: true`: 型チェックの厳格化（暗黙的any禁止、null/undefinedチェック等）
- `noUncheckedIndexedAccess: true`: 配列やオブジェクトのインデックスアクセス時に `T | undefined` 型を強制し、存在チェックを必須化
- `paths`: `@/` エイリアスでルートからの絶対パス記述が可能

### tailwind.config.ts

TailwindCSS v3.4.1 設定。shadcn/ui カラーシステム統合済み。

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ... その他のカラーテーマ
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

**特徴**:
- CSS変数ベースのテーマシステム（`hsl(var(--background))` 形式）
- `darkMode: ["class"]` でダークモード対応準備済み
- `tailwindcss-animate` プラグインでアニメーション機能提供

### components.json

shadcn/ui の設定ファイル。コンポーネント生成時の規約を定義。

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**主要設定**:
- `style: "new-york"`: shadcn/ui の New York デザインスタイル
- `rsc: true`: React Server Components 対応
- `cssVariables: true`: CSS変数ベースのテーマシステム使用
- `aliases`: パスエイリアス設定（`@/components`, `@/lib` など）

### .env.local（環境変数）

以下の環境変数を設定する必要があります（`.env.example` 参照）：

```bash
# microCMS
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# Google Sheets API
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# Next-Auth（実装中）
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

---

## 実装済み機能詳細

### 1. Google Sheets API 統合

**ファイル**: `lib/googleapis.ts`, `lib/sheets.ts`

#### 認証設定（googleapis.ts）

サービスアカウント認証を使用し、Google Sheets へのアクセスを実現。

```typescript
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth });
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
```

#### ユーティリティ関数（sheets.ts）

主要な CRUD 操作関数を実装済み：

- `readSheet(sheetName, range?)`: シートデータ読み取り
- `appendToSheet(sheetName, values)`: 行の追記
- `updateSheet(sheetName, range, values)`: 範囲更新
- `getMemberByEmail(email)`: 会員をメールアドレスで検索
- `getMemberById(memberId)`: 会員をIDで検索
- `addMember(member)`: 新規会員追加
- `addClickLog(log)`: クリックログ記録
- `getClickLogsByMemberId(memberId)`: 会員のクリックログ取得
- `getResultsByMemberId(memberId)`: 会員の成果データ取得

#### 型定義

Google Sheets の各シートに対応する型を定義：

```typescript
export interface MemberRow {
  memberId: string;
  name: string;
  email: string;
  passwordHash: string;
  birthday?: string;
  postalCode?: string;
  phone?: string;
  registeredAt: string;
}

export interface ClickLogRow {
  timestamp: string;
  memberId: string;
  dealName: string;
  dealId: string;
}

export interface ResultRow {
  name: string;
  dealName: string;
  status: string;
  cashbackAmount: number;
  memberId: string;
  originalReward: number;
  memo?: string;
}
```

### 2. microCMS 統合

**ファイル**: `lib/microcms.ts`, `types/microcms.ts`

#### クライアント設定（microcms.ts）

```typescript
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});
```

#### API関数

3つのエンドポイント（blogs, deals, categories）に対応：

**Blogs API**:
- `getBlogs(queries?)`: 記事一覧取得
- `getBlogById(contentId, queries?)`: ID で記事取得
- `getBlogBySlug(slug)`: slug で記事取得

**Deals API**:
- `getDeals(queries?)`: 案件一覧取得
- `getDealById(contentId, queries?)`: ID で案件取得
- `getDealByDealId(dealId)`: dealId で案件取得

**Categories API**:
- `getCategories(queries?)`: カテゴリ一覧取得
- `getCategoryById(contentId, queries?)`: ID でカテゴリ取得
- `getCategoryBySlug(slug)`: slug でカテゴリ取得

#### 型定義（types/microcms.ts）

microCMS API レスポンスに対応する型定義：

```typescript
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: MicroCMSImage;
  category: Category[];
  relatedDeals: { id: string; dealName: string }[];
  isPublic: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: MicroCMSImage;
}

export interface Deal {
  id: string;
  dealId: string;
  dealName: string;
  aspName: "A8.net" | "AFB" | "もしも" | "バリュコマ";
  description: string;
  thumbnail: MicroCMSImage;
  rewardAmount: number;
  cashbackRate: number;
  category: Category[];
  affiliateUrl: string;
  isActive: boolean;
  ctaText: string;
  displayOrder: number;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isVisible: boolean;
}
```

### 3. shadcn/ui コンポーネント

**ディレクトリ**: `components/ui/`

実装済みコンポーネント：
- `button.tsx`: ボタンコンポーネント（variant: default, destructive, outline, secondary, ghost, link）
- `input.tsx`: 入力フィールド
- `card.tsx`: カードレイアウト（Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter）
- `label.tsx`: フォームラベル

すべて Radix UI primitives をベースに実装され、`class-variance-authority` で variant 管理。

### 4. ユーティリティ関数

**ファイル**: `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`cn` 関数は shadcn/ui コンポーネントで className を結合・マージするために使用。

---

## データフロー アーキテクチャ

### 三層データアーキテクチャ

```
┌─────────────────────────────────────────────────┐
│          Next.js App (フロントエンド)              │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ Server       │  │ Client       │             │
│  │ Components   │  │ Components   │             │
│  └──────┬───────┘  └──────┬───────┘             │
│         │                 │                      │
│         └─────────┬───────┘                      │
└───────────────────┼──────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────┐      ┌─────────▼────────┐
│  microCMS    │      │  Next.js API     │
│  (Content)   │      │  Routes          │
└──────────────┘      └─────────┬────────┘
                                │
                      ┌─────────▼────────┐
                      │  Google Sheets   │
                      │  API             │
                      └──────────────────┘
```

**レイヤー説明**:
1. **microCMS レイヤー**: ブログ記事・案件情報・カテゴリの管理
2. **Google Sheets レイヤー**: 会員情報・トランザクションデータ・成果データ
3. **Next.js API レイヤー**: フロントエンドとデータソース間の橋渡し

---

## Next-Auth 統合（実装中）

**バージョン**: v5.0.0-beta.29（AuthJS）

**予定される実装**:
- CredentialsProvider を使用したメールアドレス + パスワード認証
- JWT セッション管理
- セッション拡張（memberId 含む）
- 認証保護ミドルウェア

詳細は `docs/specs/spec.md` の「3.1.1 会員登録フロー」参照。

---

## 今後の実装予定

### Phase 2: 認証・会員機能
- 会員登録API（/api/register）
- Next-Auth 完全設定
- ログイン/ログアウト機能
- マイページ実装

### Phase 3: CMS連携・ブログ機能
- ブログ記事一覧ページ（ISR）
- ブログ記事詳細ページ（SSG）
- OGP 動的生成
- sitemap.xml 自動生成

### Phase 4: ASP案件・追跡機能
- 案件一覧ページ（会員限定）
- クリック追跡API（/api/track-click）
- guest:UUID 永続化ロジック
- 記事内CTA統合

詳細は `docs/specs/spec.md` の「6. 開発フェーズ」参照。

---

## 参照ドキュメント

- `../specs/spec.md`: プロジェクト要件定義書
- `../index.md`: ドキュメント索引
- `./branch.md`: Git ブランチ戦略
- `../../CLAUDE.md`: Claude Code 向けプロジェクトガイド
