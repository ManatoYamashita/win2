"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., "/blog" or "/category/tech"
}

/**
 * ページネーションコンポーネント
 * ブログ一覧、カテゴリページで使用
 */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null; // ページが1つしかない場合は非表示
  }

  const pages: (number | "...")[] = [];

  // ページ番号の生成ロジック
  // 例: 1 2 3 ... 10 （現在ページが1-3の場合）
  // 例: 1 ... 5 6 7 ... 10 （現在ページが4-7の場合）
  // 例: 1 ... 8 9 10 （現在ページが8-10の場合）

  if (totalPages <= 7) {
    // 7ページ以下の場合は全て表示
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 8ページ以上の場合
    if (currentPage <= 3) {
      // 現在ページが最初の方
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      // 現在ページが最後の方
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // 現在ページが中間
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 前へボタン */}
      {prevPage ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${basePath}?page=${prevPage}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            前へ
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4 mr-1" />
          前へ
        </Button>
      )}

      {/* ページ番号 */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="sm"
              asChild={!isActive}
              disabled={isActive}
              className={isActive ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {isActive ? (
                <span>{page}</span>
              ) : (
                <Link href={`${basePath}?page=${page}`}>{page}</Link>
              )}
            </Button>
          );
        })}
      </div>

      {/* 次へボタン */}
      {nextPage ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${basePath}?page=${nextPage}`}>
            次へ
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          次へ
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
