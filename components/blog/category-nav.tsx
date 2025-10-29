"use client";

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
 * - All Posts + カテゴリ一覧を表示
 * - 現在選択中のカテゴリをハイライト
 * - 水平スクロール対応（モバイル）
 *
 * @param categories - microCMSから取得したカテゴリ一覧
 * @param currentCategoryId - 現在選択中のカテゴリID（オプション）
 */
export function CategoryNav({ categories, currentCategoryId }: CategoryNavProps) {
  const pathname = usePathname();
  const isAllPostsActive = pathname === "/blog" && !currentCategoryId;

  return (
    <nav className="bg-orange-500 shadow-md">
      <div className="container mx-auto">
        {/* 水平スクロール対応 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-1 py-3 px-4 min-w-max">
            {/* All Posts */}
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isAllPostsActive
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-white hover:bg-orange-600"
              }`}
            >
              All Posts
            </Link>

            {/* カテゴリリスト */}
            {categories.map((category) => {
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

            {/* 続きを読む（ダミーリンク、必要に応じて削除） */}
            <span className="px-4 py-2 text-white font-medium whitespace-nowrap opacity-60 cursor-not-allowed">
              続きを読む
            </span>
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
