import { Metadata } from "next";
import { getBlogs, getCategories } from "@/lib/microcms";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/ui/pagination";
import { CategoryNav } from "@/components/blog/category-nav";

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
 * カテゴリナビゲーション追加
 */
export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * BLOGS_PER_PAGE;

  // microCMSからブログ一覧とカテゴリ一覧を取得
  const [{ contents: blogs, totalCount }, { contents: categories }] = await Promise.all([
    getBlogs({
      limit: BLOGS_PER_PAGE,
      offset,
    }),
    getCategories({ limit: 100 }),
  ]);

  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

  return (
    <div>
      {/* カテゴリナビゲーションバー */}
      <CategoryNav categories={categories} />

      {/* コンテンツ */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">All Posts</h1>
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
            {/* ブログカードの縦並び表示 */}
            <div className="flex flex-col gap-6 mb-8">
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
    </div>
  );
}
