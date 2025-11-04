# SEO実装ガイド

## 概要

WIN×Ⅱプロジェクトにおける包括的なSEO実装のドキュメントです。Next.js 15のMetadata APIを使用し、全ページに対してメタデータ、OpenGraph Protocol（OGP）、Twitter Card、JSON-LD構造化データを実装しました。

## 実装日

2025-10-30

## 実装範囲

### Phase 1: 主要ページの基本SEO実装

1. **ホームページ** (`app/page.tsx`)
   - サーバーコンポーネント化（`useScrollReveal`フック削除）
   - Metadata API による完全なSEO設定
   - JSON-LD: Organization、WebSite スキーマ

2. **ログインページ** (`app/login/layout.tsx`)
   - クライアントコンポーネント用にlayout.tsxを作成
   - JSON-LD: WebPage スキーマ

3. **会員登録ページ** (`app/register/layout.tsx`)
   - クライアントコンポーネント用にlayout.tsxを作成
   - JSON-LD: WebPage スキーマ

### Phase 2: ブログ関連ページのSEO拡張

4. **ブログ詳細ページ** (`app/blog/[id]/page.tsx`)
   - 既存のメタデータに加えてJSON-LD Article スキーマを追加
   - 動的なメタデータ生成（記事ごとのタイトル、サムネイル、抜粋）

5. **ブログ一覧ページ** (`app/blog/page.tsx`)
   - Twitter Card メタデータ追加
   - JSON-LD: CollectionPage スキーマ追加

6. **カテゴリページ** (`app/category/[id]/page.tsx`)
   - OpenGraph の完全な実装（images, type, url, siteName, locale）
   - Twitter Card メタデータ追加
   - JSON-LD: CollectionPage スキーマ追加

### Phase 3: ルートレイアウトのSEO拡張

7. **ルートレイアウト** (`app/layout.tsx`)
   - デフォルトメタデータの充実化
   - title.template 設定（全ページに「| WIN×Ⅱ」を自動付与）
   - 包括的な OpenGraph、Twitter Card、robots 設定

## 技術仕様

### Next.js Metadata API

全ページで Next.js 15 の Metadata API を使用：

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページタイトル",
  description: "ページの説明",
  keywords: ["キーワード1", "キーワード2"],
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
  robots: { /* ... */ },
  alternates: { /* ... */ },
};
```

### サーバーコンポーネント vs クライアントコンポーネント

- **サーバーコンポーネント**: `export const metadata` で直接メタデータをエクスポート
- **クライアントコンポーネント**: `layout.tsx` を作成してメタデータを設定

### OGP画像

全ページで `/public/ogp.jpg` (1200x630px) を使用：

```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

openGraph: {
  images: [{
    url: `${appUrl}/ogp.jpg`,
    width: 1200,
    height: 630,
    alt: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
  }],
}
```

### JSON-LD 構造化データ

#### 1. Organization スキーマ (ホームページ)

```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WIN×Ⅱ",
  url: appUrl,
  logo: `${appUrl}/assets/win2/logo.webp`,
  description: "保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォーム",
  sameAs: [],
};
```

#### 2. WebSite スキーマ (ホームページ)

```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WIN×Ⅱ",
  url: appUrl,
  description: "保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォーム",
  inLanguage: "ja-JP",
};
```

#### 3. WebPage スキーマ (ログイン、会員登録)

```typescript
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ページ名",
  url: `${appUrl}/path`,
  description: "ページの説明",
  inLanguage: "ja-JP",
  isPartOf: {
    "@type": "WebSite",
    name: "WIN×Ⅱ",
    url: appUrl,
  },
};
```

#### 4. Article スキーマ (ブログ詳細)

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: blog.title,
  image: blog.thumbnail?.url || `${appUrl}/ogp.jpg`,
  datePublished: blog.publishedAt || blog.createdAt,
  dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
  author: {
    "@type": "Organization",
    name: "WIN×Ⅱ",
    url: appUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "WIN×Ⅱ",
    logo: {
      "@type": "ImageObject",
      url: `${appUrl}/assets/win2/logo.webp`,
    },
  },
  description: excerpt,
};
```

#### 5. CollectionPage スキーマ (ブログ一覧、カテゴリ)

```typescript
const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "コレクション名",
  description: "コレクションの説明",
  url: `${appUrl}/path`,
  isPartOf: {
    "@type": "WebSite",
    name: "WIN×Ⅱ",
    url: appUrl,
  },
};
```

### JSON-LD の埋め込み方法

```typescript
return (
  <div>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
    {/* ページコンテンツ */}
  </div>
);
```

## メタデータの優先順位

Next.js のメタデータは、より具体的なページで定義されたものが優先されます：

1. **ページレベル** (`page.tsx` の `metadata` または `generateMetadata`)
2. **レイアウトレベル** (`layout.tsx` の `metadata`)
3. **ルートレイアウト** (`app/layout.tsx` の `metadata`)

例：
- `app/blog/[id]/page.tsx` で定義された `title` は、`app/layout.tsx` の `title.template` を使用して「記事タイトル | WIN×Ⅱ」となる
- `app/layout.tsx` で定義された `openGraph.images` は、個別ページで上書きしない限り全ページで使用される

## robots.txt とクローラビリティ

### robots 設定 (app/layout.tsx)

```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
}
```

### Canonical URL

各ページで適切な canonical URL を設定：

```typescript
alternates: {
  canonical: `${appUrl}/current-path`,
}
```

## 環境変数

SEO実装で使用する環境変数：

```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://yourdomain.com  # 本番環境のURL
```

開発環境では `http://localhost:3000` がデフォルトとして使用されます。

## 検証方法

### 1. メタデータの確認

```bash
# 開発サーバー起動
npm run dev

# ブラウザで各ページにアクセスし、デベロッパーツールで <head> を確認
```

### 2. OGP 検証ツール

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### 3. JSON-LD 検証

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/

### 4. Lighthouse SEO監査

```bash
# 本番ビルドを作成
npm run build
npm run start

# Chrome DevTools > Lighthouse > SEO監査を実行
```

目標スコア: 90+

## 今後の改善案

1. **構造化データの拡張**
   - BreadcrumbList スキーマの追加（パンくずリスト）
   - FAQPage スキーマの追加（よくある質問ページ）
   - HowTo スキーマの追加（チュートリアルページ）

2. **サイトマップの生成**
   - `app/sitemap.ts` で動的サイトマップを生成
   - microCMS からブログ記事を取得して自動更新

3. **RSS フィードの提供**
   - `app/feed.xml/route.ts` で RSS フィード生成
   - ブログ更新をRSSで配信

4. **パフォーマンス最適化**
   - 画像の最適化（Next.js Image コンポーネント）
   - コードスプリッティングと動的インポート
   - キャッシュ戦略の見直し

5. **国際化（i18n）対応**
   - 英語版ページの追加
   - hreflang タグの設定

## 参考リンク

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs)

## 変更履歴

| 日付 | 変更内容 | 担当者 |
|------|---------|--------|
| 2025-10-30 | 初版作成。全ページのSEO実装完了 | Claude Code |

## コミット履歴

```bash
# SEO実装のコミット
git add .
git commit -m "SEO: 全ページに包括的なメタデータ、OGP、Twitter Card、JSON-LD構造化データを実装"
```

## まとめ

本実装により、WIN×Ⅱプロジェクトの全ページに対して以下のSEO要素が適用されました：

- ✅ メタデータ（title, description, keywords）
- ✅ OpenGraph Protocol（OGP）
- ✅ Twitter Card
- ✅ JSON-LD 構造化データ
- ✅ robots.txt 設定
- ✅ Canonical URL
- ✅ 動的メタデータ生成（ブログ、カテゴリ）

これにより、検索エンジンのクローラビリティが向上し、ソーシャルメディアでのシェア時の表示も最適化されました。
