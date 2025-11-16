"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryResponse } from "@/types/microcms";

interface CategoryNavProps {
  categories: CategoryResponse[];
  currentCategoryId?: string;
}

/**
 * カテゴリナビゲーションバーコンポーネント
 *
 * 機能:
 * - オレンジ色の水平ナビゲーションバー
 * - 全ての投稿 + カテゴリ一覧を表示
 * - 現在選択中のカテゴリをハイライト
 * - 水平スクロール対応（モバイル）
 *
 * @param categories - microCMSから取得したカテゴリ一覧
 * @param currentCategoryId - 現在選択中のカテゴリID（オプション）
 */
export function CategoryNav({ categories, currentCategoryId }: CategoryNavProps) {
  const pathname = usePathname();
  const isAllPostsActive = pathname === "/blog" && !currentCategoryId;
  const latestCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    const getTimestamp = (category: CategoryResponse) => {
      const fallbackDate =
        category.publishedAt ||
        category.createdAt ||
        category.updatedAt ||
        category.revisedAt;
      return fallbackDate ? new Date(fallbackDate).getTime() : 0;
    };
    return [...categories]
      .sort((a, b) => getTimestamp(b) - getTimestamp(a))
      .slice(0, 5);
  }, [categories]);

  return (
    <nav className="bg-orange-500 shadow-md">
      <div className="container mx-auto">
        {/* 水平スクロール対応 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-1 py-3 px-4 min-w-max">
            {/* 全ての投稿 */}
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isAllPostsActive
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-white hover:bg-orange-600"
              }`}
            >
              全ての投稿
            </Link>

            {/* カテゴリリスト */}
            {latestCategories.map((category) => {
              const isActive = currentCategoryId === category.id;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-orange-600 text-white shadow-md"
                      : "text-white hover:bg-orange-600"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}

            {/* 全カテゴリリンク */}
            <Link
              href="/categories"
              className="px-4 py-2 rounded-lg font-medium whitespace-nowrap text-white/90 transition hover:bg-orange-600 hover:text-white"
            >
              全てのカテゴリへ
            </Link>
          </div>
        </div>
      </div>

      {/* スクロールバー非表示のためのCSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
