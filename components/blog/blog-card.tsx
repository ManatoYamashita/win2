import Link from "next/link";
import Image from "next/image";
import type { BlogResponse } from "@/types/microcms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { extractExcerpt } from "@/lib/blog-utils";

interface BlogCardProps {
  blog: BlogResponse;
}

/**
 * ブログ記事カードコンポーネント
 * トップページ、ブログ一覧、カテゴリページで使用
 */
export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* サムネイル画像 */}
        {blog.thumbnail && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={blog.thumbnail.url}
              alt={blog.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader>
          {/* カテゴリバッジ */}
          {blog.category && (
            <div className="flex gap-2 mb-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded">
                {blog.category.name}
              </span>
            </div>
          )}

          {/* タイトル */}
          <CardTitle className="line-clamp-2 group-hover:text-orange-600 transition-colors">
            {blog.title}
          </CardTitle>

          {/* 公開日時 */}
          <CardDescription className="text-sm text-gray-500">
            {formatDate(blog.publishedAt || blog.createdAt)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 抜粋（contentから自動生成） */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {extractExcerpt(blog.content, 150)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
