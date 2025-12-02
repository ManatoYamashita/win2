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
      .filter((category) => Boolean(category.name));
  }, [categories]);

  return (
    <nav className="bg-orange-500 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col gap-2 py-3 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-4">
          {/* 左右の固定リンク */}
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-2">
            <div className="sm:sticky sm:left-0 sm:z-10 sm:bg-orange-500 sm:pr-2">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isAllPostsActive
                    ? "bg-orange-600 text-white shadow-md"
                    : "text-white hover:bg-orange-600"
                }`}
              >
                全ての投稿へ
              </Link>
            </div>
            <div className="sm:sticky sm:right-0 sm:z-10 sm:bg-orange-500 sm:pl-2">
              <Link
                href="/categories"
                className="px-4 py-2 rounded-lg font-medium whitespace-nowrap text-white/90 transition hover:bg-orange-600 hover:text-white"
              >
                カテゴリ一覧へ
              </Link>
            </div>
          </div>

          {/* カテゴリリスト（横スクロール領域を確保） */}
          <div className="relative -mx-4 sm:mx-0">
            {/* 左側のグラデーション（スクロールヒント） */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-orange-500 to-transparent sm:w-12" />

            {/* 右側のグラデーション（スクロールヒント） */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-orange-500 to-transparent sm:w-12" />

            {/* スクロール可能エリア */}
            <div className="overflow-x-auto scrollbar-thin px-4 sm:px-0">
              <div className="flex items-center gap-2 min-w-max">
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
              </div>
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
