import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogs, getCategoryById, getCategories } from "@/lib/microcms";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/ui/pagination";
import { CategoryNav } from "@/components/blog/category-nav";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const BLOGS_PER_PAGE = 10;

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ISR: 60秒ごとに再検証
export const revalidate = 60;

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
      images: [`${appUrl}/ogp.jpg`],
      type: "website",
      url: `${appUrl}/category/${id}`,
      siteName: "WIN×Ⅱ",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | WIN×Ⅱ`,
      description: category.description || `${category.name}に関する記事一覧です。`,
      images: [`${appUrl}/ogp.jpg`],
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

  // カテゴリIDでフィルタリングしてブログ一覧とカテゴリ一覧を取得
  // categoryフィールドは単一参照のため equals を使用
  const [{ contents: blogs, totalCount }, { contents: allCategories }] = await Promise.all([
    getBlogs({
      limit: BLOGS_PER_PAGE,
      offset,
      filters: `category[equals]${category.id}`,
    }),
    getCategories({ limit: 100 }),
  ]);

  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `${category.name}に関する記事一覧です。`,
    url: `${appUrl}/category/${id}`,
    isPartOf: {
      "@type": "WebSite",
      name: "WIN×Ⅱ",
      url: appUrl,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      {/* カテゴリナビゲーションバー */}
      <CategoryNav categories={allCategories} currentCategoryId={category.id} />

      {/* コンテンツ */}
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
              basePath={`/category/${id}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
