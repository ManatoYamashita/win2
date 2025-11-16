import { Metadata } from "next";
import { getCategories } from "@/lib/microcms";
import { CategoryNav } from "@/components/blog/category-nav";
import { CategoriesGrid } from "@/components/blog/categories-grid";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const INITIAL_LIMIT = 12;

export const metadata: Metadata = {
  title: "カテゴリ一覧 | WIN×Ⅱ",
  description: "WIN×Ⅱで公開中のカテゴリを一覧表示しています。気になるカテゴリから最新の記事にアクセスしてください。",
  openGraph: {
    title: "カテゴリ一覧 | WIN×Ⅱ",
    description: "WIN×Ⅱで公開中のカテゴリを一覧表示しています。気になるカテゴリから最新の記事にアクセスしてください。",
    images: [`${appUrl}/ogp.jpg`],
    type: "website",
    url: `${appUrl}/categories`,
    siteName: "WIN×Ⅱ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "カテゴリ一覧 | WIN×Ⅱ",
    description: "WIN×Ⅱで公開中のカテゴリを一覧表示しています。気になるカテゴリから最新の記事にアクセスしてください。",
    images: [`${appUrl}/ogp.jpg`],
  },
};

const getCategoryTimestamp = (date?: string | null) => (date ? new Date(date).getTime() : 0);
const sortCategories = <T extends { publishedAt?: string; createdAt?: string; updatedAt?: string; revisedAt?: string }>(
  categories: T[]
) =>
  [...categories].sort((a, b) => {
    const dateA =
      getCategoryTimestamp(a.publishedAt) ||
      getCategoryTimestamp(a.createdAt) ||
      getCategoryTimestamp(a.updatedAt) ||
      getCategoryTimestamp(a.revisedAt);
    const dateB =
      getCategoryTimestamp(b.publishedAt) ||
      getCategoryTimestamp(b.createdAt) ||
      getCategoryTimestamp(b.updatedAt) ||
      getCategoryTimestamp(b.revisedAt);
    return dateB - dateA;
  });

export default async function CategoriesPage() {
  const { contents: categories, totalCount } = await getCategories({
    limit: INITIAL_LIMIT,
    orders: "-publishedAt",
  });

  const sortedCategories = sortCategories(categories);
  const totalCategories = totalCount;

  return (
    <div>
      <CategoryNav categories={sortedCategories} />

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
            CATEGORY LIBRARY
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            カテゴリ一覧
          </h1>
          <p className="mt-3 text-base text-slate-600">
            最新のカテゴリを新着順に表示しています。気になるカテゴリを選んで記事をチェックしましょう（全{totalCategories}件）。
          </p>
        </div>

        <CategoriesGrid
          initialCategories={sortedCategories}
          totalCount={totalCount}
          pageSize={INITIAL_LIMIT}
        />
      </div>
    </div>
  );
}
