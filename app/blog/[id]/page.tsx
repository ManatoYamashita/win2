import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogById } from "@/lib/microcms";
import { formatDate } from "@/lib/utils";
import { extractExcerpt } from "@/lib/blog-utils";
import { BlogContent } from "@/components/blog/blog-content";
// import { DealCTAButton } from "@/components/deal/deal-cta-button"; // 将来的にGoogle Sheets APIから案件取得時に使用

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * generateMetadata: SEO/OGP対応
 */
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    return {
      title: "記事が見つかりません",
    };
  }

  // contentから自動生成した抜粋を使用
  const excerpt = extractExcerpt(blog.content, 120);

  return {
    title: blog.title,
    description: excerpt,
    openGraph: {
      title: blog.title,
      description: excerpt,
      images: blog.thumbnail ? [blog.thumbnail.url] : [],
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: ["WIN×Ⅱ"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: excerpt,
      images: blog.thumbnail ? [blog.thumbnail.url] : [],
    },
  };
}

/**
 * ブログ詳細ページ
 */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <article className="container max-w-4xl mx-auto px-4 py-8">
      {/* サムネイル画像 */}
      {blog.thumbnail && (
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={blog.thumbnail.url}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      {/* カテゴリバッジ */}
      {blog.category && blog.category.length > 0 && (
        <div className="flex gap-2 mb-4">
          {blog.category.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="inline-block px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded hover:bg-orange-200 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* タイトル */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>

      {/* 公開日時 */}
      <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
        <time dateTime={blog.publishedAt || blog.createdAt}>
          {formatDate(blog.publishedAt || blog.createdAt)}
        </time>
        {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
          <span className="text-gray-500">
            更新: {formatDate(blog.updatedAt)}
          </span>
        )}
      </div>

      {/* 記事本文（CTAショートコード変換対応） */}
      <BlogContent content={blog.content} />

      {/* 関連案件（relatedDeals）*/}
      {/* NOTE: 現在は削除。将来的にGoogle Sheets APIから案件を取得する実装を追加予定 */}
      {/*
      {blog.relatedDeals && blog.relatedDeals.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            この記事で紹介している案件
          </h2>
          <div className="space-y-6">
            {blog.relatedDeals.map((deal) => (
              <div key={deal.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                ...
              </div>
            ))}
          </div>
        </section>
      )}
      */}

      {/* カテゴリリンク（フッター） */}
      {blog.category && blog.category.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">関連カテゴリ:</p>
          <div className="flex flex-wrap gap-2">
            {blog.category.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="inline-block px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ブログ一覧へ戻るリンク */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-block px-6 py-3 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
        >
          ブログ一覧へ戻る
        </Link>
      </div>
    </article>
  );
}
