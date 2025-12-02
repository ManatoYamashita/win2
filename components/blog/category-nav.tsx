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
  const isCategoriesPage = pathname === "/categories";
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
      .filter((category) => Boolean(category.name));
  }, [categories]);

  return (
    <nav className="bg-orange-500 shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* アクションリンクをコンパクトにまとめてスクロール領域を確保 */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              isAllPostsActive
                ? "bg-orange-600 text-white shadow-md"
                : "text-white hover:bg-orange-600"
            }`}
            aria-current={isAllPostsActive ? "page" : undefined}
          >
            全ての投稿へ
          </Link>
          <Link
            href="/categories"
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              isCategoriesPage
                ? "bg-orange-600 text-white shadow-md"
                : "text-white/90 hover:bg-orange-600 hover:text-white"
            }`}
            aria-current={isCategoriesPage ? "page" : undefined}
          >
            カテゴリ一覧へ
          </Link>
        </div>

        {/* カテゴリリスト（横スクロール領域を広く確保） */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-orange-500 to-transparent sm:w-8" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-orange-500 to-transparent sm:w-8" />

          <div className="overflow-x-auto scrollbar-thin pr-6 sm:pr-8">
            <div className="flex items-center gap-2 py-1">
              {latestCategories.map((category) => {
                const isActive = currentCategoryId === category.id;
                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-white hover:bg-orange-600"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* スクロールバーのスタイリング */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 3px;
          transition: background 0.2s;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </nav>
  );
}
