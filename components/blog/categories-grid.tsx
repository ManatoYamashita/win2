"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryResponse } from "@/types/microcms";

interface CategoriesGridProps {
  initialCategories: CategoryResponse[];
  totalCount: number;
  pageSize: number;
}

const FALLBACK_IMAGE = "/assets/images/blog-placeholder.webp";

export function CategoriesGrid({
  initialCategories,
  totalCount,
  pageSize,
}: CategoriesGridProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(initialCategories.length);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = useMemo(() => categories.length < totalCount, [categories.length, totalCount]);

  useEffect(() => {
    setCategories(initialCategories);
    offsetRef.current = initialCategories.length;
  }, [initialCategories]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offsetRef.current),
        orders: "-publishedAt",
      });
      const response = await fetch(`/api/categories?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.status}`);
      }
      const data = (await response.json()) as {
        contents: CategoryResponse[];
        totalCount: number;
      };
      const newItems = Array.isArray(data.contents) ? data.contents : [];
      setCategories((prev) => [...prev, ...newItems]);
      offsetRef.current += newItems.length;
    } catch (err) {
      console.error("[CategoriesGrid] loadMore error", err);
      setError("カテゴリの読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, pageSize]);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
        現在、表示できるカテゴリがありません。
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const imageSrc = category.image?.url || FALLBACK_IMAGE;
          const labelDate = category.publishedAt || category.createdAt || category.updatedAt;
          const displayDate = labelDate
            ? new Date(labelDate).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "公開日不明";
          return (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <Image
                  src={imageSrc}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-orange-600 shadow">
                  カテゴリ
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">
                  {displayDate}
                </div>
                <h2 className="mt-1 text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600">
                  {category.name}
                </h2>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {category.description || "詳細説明は準備中です。"}
                </p>
                <div className="mt-3 inline-flex items-center text-xs font-semibold text-orange-600">
                  詳しく見る
                  <svg
                    className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div ref={sentinelRef} className="mt-6 flex flex-col items-center justify-center gap-2 py-6 text-sm text-slate-500">
        {isLoading && <span>読み込み中...</span>}
        {!hasMore && <span>すべてのカテゴリを読み込みました</span>}
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </>
  );
}
