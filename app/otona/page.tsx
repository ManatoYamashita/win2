import { Metadata } from "next";
import { getBlogs } from "@/lib/microcms";
import { verifyAge, getAccessDeniedError } from "@/lib/age-verification";
import AccessDeniedMessage from "@/components/age-verification/access-denied-message";
import { BlogCard } from "@/components/blog/blog-card";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// 常にサーバーサイドレンダリング（年齢検証のため）
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "大人のコンテンツ | WIN×Ⅱ",
  description: "20歳以上の会員限定コンテンツです。",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "大人のコンテンツ | WIN×Ⅱ",
    description: "20歳以上の会員限定コンテンツです。",
    images: [`${appUrl}/ogp.jpg`],
    type: "website",
    url: `${appUrl}/otona`,
    siteName: "WIN×Ⅱ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "大人のコンテンツ | WIN×Ⅱ",
    description: "20歳以上の会員限定コンテンツです。",
    images: [`${appUrl}/ogp.jpg`],
  },
  alternates: {
    canonical: `${appUrl}/otona`,
  },
};

const BLOGS_PER_PAGE = 10;

/**
 * 大人のコンテンツ一覧ページ（20歳以上限定）
 *
 * 年齢検証を行い、20歳以上の成人ユーザーのみアクセス可能。
 * restricted=true のブログ記事のみを表示。
 */
export default async function OtonaPage() {
  // 年齢検証
  const ageVerification = await verifyAge();
  const accessError = getAccessDeniedError(ageVerification);

  // アクセス拒否の場合
  if (accessError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">大人のコンテンツ</h1>
        <AccessDeniedMessage error={accessError} />
      </div>
    );
  }

  // 成人の場合: restricted=true のブログを取得
  const { contents: blogs, totalCount } = await getBlogs({
    limit: BLOGS_PER_PAGE,
    offset: 0,
    filters: "restricted[equals]true",
    fields: "id,title,content,thumbnail,category.id,category.name,restricted,createdAt,publishedAt",
  });

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">大人のコンテンツ</h1>
        <p className="text-gray-600">20歳以上の会員限定コンテンツ</p>
        {totalCount > 0 && (
          <p className="text-sm text-gray-500 mt-2">全 {totalCount} 件</p>
        )}
      </div>

      {/* ブログ一覧 */}
      {blogs.length > 0 ? (
        <div className="space-y-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">現在、公開中のコンテンツはありません。</p>
        </div>
      )}

      {/* ページネーション（将来的に実装予定） */}
      {/*
      {totalCount > BLOGS_PER_PAGE && (
        <div className="mt-12">
          <Pagination totalCount={totalCount} pageSize={BLOGS_PER_PAGE} />
        </div>
      )}
      */}
    </div>
  );
}
