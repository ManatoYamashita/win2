import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogById } from "@/lib/microcms";
import { formatDate } from "@/lib/utils";
import { extractExcerpt } from "@/lib/blog-utils";
import { BlogContent } from "@/components/blog/blog-content";
import { BackToBlogLink } from "@/components/blog/back-to-blog-link";
// import { DealCTAButton } from "@/components/deal/deal-cta-button"; // 将来的にGoogle Sheets APIから案件取得時に使用

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
  const canonicalUrl = `${appUrl}/blog/${id}`;
  const primaryImage = blog.thumbnail?.url || `${appUrl}/ogp.jpg`;
  const keywordBase = ["アフィリエイト", "キャッシュバック", "WIN×Ⅱ", "お得情報"];
  const categoryKeywords = blog.category ? [`${blog.category.name} アフィリエイト`] : ["その他 アフィリエイト"];

  return {
    title: blog.title,
    description: excerpt,
    keywords: [...keywordBase, ...categoryKeywords],
    openGraph: {
      title: blog.title,
      description: excerpt,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: ["WIN×Ⅱ"],
      url: canonicalUrl,
      siteName: "WIN×Ⅱ",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: excerpt,
      images: [primaryImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
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

  const excerpt = extractExcerpt(blog.content, 120);

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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${appUrl}/blog/${blog.id}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: appUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ブログ",
        item: `${appUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${appUrl}/blog/${blog.id}`,
      },
    ],
  };

  // サムネイル画像のURL（なければplaceholder）
  const thumbnailUrl = blog.thumbnail?.url || "/ogp.jpg";

  // カテゴリ情報（なければデフォルト）
  const categoryId = blog.category?.id || "other";
  const categoryName = blog.category?.name || "その他";

  return (
    <article className="container max-w-4xl mx-auto px-4 py-8">
      {[articleSchema, breadcrumbSchema].map((schema, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      {/* サムネイル画像（常に表示、placeholderあり） */}
      <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={thumbnailUrl}
          alt={blog.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </div>

      {/* カテゴリバッジ（常に表示） */}
      <div className="flex gap-2 mb-4">
        <Link
          href={`/category/${categoryId}`}
          className="inline-block px-3 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded hover:bg-orange-200 transition-colors"
        >
          {categoryName}
        </Link>
      </div>

      {/* タイトル */}
      <h1 className="text-[2rem] font-bold mb-4 text-gray-900">{blog.title}</h1>

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

      {/* カテゴリリンク（フッター・常に表示） */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">関連カテゴリ:</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/category/${categoryId}`}
            className="inline-block px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            {categoryName}
          </Link>
        </div>
      </div>

      {/* ブログ一覧へ戻るリンク */}
      <div className="mt-12 text-center">
        <BackToBlogLink />
      </div>
    </article>
  );
}
