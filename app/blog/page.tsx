import { Metadata } from "next";
import { getBlogs } from "@/lib/microcms";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "ブログ一覧 | WIN×Ⅱ",
  description: "会員制アフィリエイトブログWIN×Ⅱのブログ記事一覧ページです。お得な案件情報や攻略法を発信しています。",
  openGraph: {
    title: "ブログ一覧 | WIN×Ⅱ",
    description: "会員制アフィリエイトブログWIN×Ⅱのブログ記事一覧ページです。お得な案件情報や攻略法を発信しています。",
  },
};

interface BlogListPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const BLOGS_PER_PAGE = 10;

/**
 * ブログ一覧ページ
 * ページネーション対応（1ページ10件表示）
 */
export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * BLOGS_PER_PAGE;

  // microCMSからブログ一覧を取得
  const { contents: blogs, totalCount } = await getBlogs({
    limit: BLOGS_PER_PAGE,
    offset,
  });

  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">ブログ一覧</h1>
        <p className="text-gray-600">
          お得な案件情報や攻略法を発信しています
        </p>
      </div>

      {/* ブログ記事がない場合 */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            まだブログ記事がありません
          </p>
        </div>
      ) : (
        <>
          {/* ブログカードのグリッド表示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* ページネーション */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </>
      )}
    </div>
  );
}
