import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogs, getCategoryById } from "@/lib/microcms";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/ui/pagination";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const BLOGS_PER_PAGE = 10;

/**
 * generateMetadata: SEO/OGP対応
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    return {
      title: "カテゴリが見つかりません",
    };
  }

  return {
    title: `${category.name} | WIN×Ⅱ`,
    description: category.description || `${category.name}に関する記事一覧です。`,
    openGraph: {
      title: `${category.name} | WIN×Ⅱ`,
      description: category.description || `${category.name}に関する記事一覧です。`,
    },
  };
}

/**
 * カテゴリページ
 * 特定のカテゴリに属するブログ記事を一覧表示（ページネーション対応）
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { id } = await params;
  const searchParamsResolved = await searchParams;
  const currentPage = Number(searchParamsResolved.page) || 1;
  const offset = (currentPage - 1) * BLOGS_PER_PAGE;

  // カテゴリ情報を取得
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  // カテゴリIDでフィルタリングしてブログ一覧を取得
  // NOTE: categoryは単一参照なので、category[equals]を使用
  const { contents: blogs, totalCount } = await getBlogs({
    limit: BLOGS_PER_PAGE,
    offset,
    filters: `category[equals]${category.id}`,
  });

  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* カテゴリヘッダー */}
      <div className="mb-8">
        <div className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-orange-600 bg-orange-100 rounded">
          カテゴリ
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-gray-600 mb-2">{category.description}</p>
        )}
        <p className="text-gray-600">
          {totalCount}件の記事があります
        </p>
      </div>

      {/* ブログ記事がない場合 */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            このカテゴリの記事はまだありません
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
            basePath={`/category/${id}`}
          />
        </>
      )}
    </div>
  );
}
