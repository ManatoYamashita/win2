import Link from "next/link";
import Image from "next/image";
import type { BlogResponse } from "@/types/microcms";
import { Card } from "@/components/ui/card";
import { extractExcerpt } from "@/lib/blog-utils";

interface BlogCardProps {
  blog: BlogResponse;
}

/**
 * ブログ記事カードコンポーネント（横並びレイアウト）
 * トップページ、ブログ一覧、カテゴリページで使用
 */
export function BlogCard({ blog }: BlogCardProps) {
  // サムネイル画像のURL（なければplaceholder）
  const thumbnailUrl = blog.thumbnail?.url || "/ogp.jpg";

  // カテゴリ名（なければ「その他」）
  const categoryName = blog.category?.name || "その他";

  return (
    <Link href={`/blog/${blog.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg bg-orange-50 hover:bg-orange-100">
        <div className="flex flex-col md:flex-row">
          {/* 左側: サムネイル画像（常に表示、placeholderあり） */}
          <div className="relative w-full md:w-80 aspect-[4/3] flex-shrink-0 overflow-hidden bg-gray-100">
            <Image
              src={thumbnailUrl}
              alt={blog.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>

          {/* 右側: コンテンツ */}
          <div className="flex-1 p-6">
            {/* カテゴリバッジ（常に表示） */}
            <div className="flex gap-2 mb-3">
              <span
                className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-200 rounded"
              >
                {categoryName}
              </span>
            </div>

            {/* タイトル */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {blog.title}
            </h3>

            {/* 抜粋（contentから自動生成） */}
            <p className="text-sm md:text-base text-gray-700 line-clamp-3 mb-4">
              {extractExcerpt(blog.content, 150)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
