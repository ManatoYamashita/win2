'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { BlogResponse, Category } from "@/types/microcms";
import { Card } from "@/components/ui/card";
import { extractExcerpt } from "@/lib/blog-utils";

interface BlogCardProps {
  blog: BlogResponse;
}

const FALLBACK_CATEGORY: Category = {
  id: "other",
  name: "その他",
};

const PLACEHOLDER_THUMBNAIL = "/assets/images/blog-placeholder.webp";

/**
 * ブログ記事カードコンポーネント（横並びレイアウト）
 * トップページ、ブログ一覧、カテゴリページで使用
 */
export function BlogCard({ blog }: BlogCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const categories = blog.category ? [blog.category] : [FALLBACK_CATEGORY];
  const thumbnailUrl = blog.thumbnail?.url ?? PLACEHOLDER_THUMBNAIL;

  return (
    <Link
      href={`/blog/${blog.id}`}
      className="block group"
      onClick={() => setIsNavigating(true)}
      aria-busy={isNavigating}
    >
      <Card className="relative overflow-hidden transition-all hover:shadow-lg bg-orange-50 hover:bg-orange-100">
        {isNavigating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-win2-primary-orage" />
          </div>
        )}
        <div className="flex flex-col md:flex-row opacity-100 transition-opacity">
          {/* 左側: サムネイル画像 */}
          <div className="relative w-full md:w-80 h-48 md:h-auto md:self-stretch flex-shrink-0 overflow-hidden bg-gray-100">
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
            {/* カテゴリバッジ */}
            <div className="flex gap-2 mb-3">
              {categories.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-200 rounded"
                >
                  {cat.name}
                </span>
              ))}
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
