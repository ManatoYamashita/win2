import { Metadata } from "next";
import { getBlogs, getCategories } from "@/lib/microcms";
import { CategoryNav } from "@/components/blog/category-nav";
import { BlogInfiniteList } from "@/components/blog/blog-infinite-list";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ISR: 60秒ごとに再検証
export const revalidate = 60;

export const metadata: Metadata = {
  title: "ブログ一覧 | WIN×Ⅱ",
  description: "会員制アフィリエイトブログWIN×Ⅱのブログ記事一覧ページです。お得な案件情報や攻略法を発信しています。",
  keywords: [
    "アフィリエイトブログ",
    "WIN×Ⅱ",
    "副業",
    "お得情報",
    "案件情報",
  ],
  openGraph: {
    title: "ブログ一覧 | WIN×Ⅱ",
    description: "会員制アフィリエイトブログWIN×Ⅱのブログ記事一覧ページです。お得な案件情報や攻略法を発信しています。",
    images: [`${appUrl}/ogp.jpg`],
    type: "website",
    url: `${appUrl}/blog`,
    siteName: "WIN×Ⅱ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "ブログ一覧 | WIN×Ⅱ",
    description: "会員制アフィリエイトブログWIN×Ⅱのブログ記事一覧ページです。お得な案件情報や攻略法を発信しています。",
    images: [`${appUrl}/ogp.jpg`],
  },
  alternates: {
    canonical: `${appUrl}/blog`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const BLOGS_PER_PAGE = 10;

/**
 * ブログ一覧ページ
 * ページネーション対応（1ページ10件表示）
 * カテゴリナビゲーション追加
 */
export default async function BlogListPage() {
  const [{ contents: initialBlogs, totalCount }, { contents: categories }] = await Promise.all([
    getBlogs({
      limit: BLOGS_PER_PAGE,
      offset: 0,
    }),
    getCategories({ limit: 100 }),
  ]);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ブログ一覧",
    description: "会員制アフィリエイトブログWIN×Ⅱのブログ記事一覧ページ",
    url: `${appUrl}/blog`,
    isPartOf: {
      "@type": "WebSite",
      name: "WIN×Ⅱ",
      url: appUrl,
    },
  };

  const itemListSchema = initialBlogs.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "WIN×Ⅱ ブログ記事一覧",
        description: "アフィリエイトに役立つブログ記事をまとめたリスト",
        itemListElement: initialBlogs.map((blog, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${appUrl}/blog/${blog.id}`,
          name: blog.title,
          image: blog.thumbnail?.url,
        })),
      }
    : null;

  const schemas = [collectionPageSchema, itemListSchema].filter(Boolean);

  return (
    <div>
      {schemas.map((schema, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      {/* カテゴリナビゲーションバー */}
      <CategoryNav categories={categories} />

      {/* コンテンツ */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">全ての投稿</h1>
        </div>

        <BlogInfiniteList
          initialBlogs={initialBlogs}
          totalCount={totalCount}
          pageSize={BLOGS_PER_PAGE}
        />
      </div>
    </div>
  );
}
