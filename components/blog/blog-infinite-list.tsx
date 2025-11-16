"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlogResponse } from "@/types/microcms";
import { BlogCard } from "./blog-card";

interface BlogInfiniteListProps {
  initialBlogs: BlogResponse[];
  totalCount: number;
  pageSize?: number;
}

export function BlogInfiniteList({
  initialBlogs,
  totalCount,
  pageSize = 10,
}: BlogInfiniteListProps) {
  const [blogs, setBlogs] = useState<BlogResponse[]>(initialBlogs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(initialBlogs.length);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = blogs.length < totalCount;

  useEffect(() => {
    setBlogs(initialBlogs);
    offsetRef.current = initialBlogs.length;
  }, [initialBlogs]);

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
      const res = await fetch(`/api/blogs?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Failed to load blogs: ${res.status}`);
      }
      const data = (await res.json()) as { contents: BlogResponse[] };
      const newBlogs = Array.isArray(data.contents) ? data.contents : [];
      setBlogs((prev) => [...prev, ...newBlogs]);
      offsetRef.current += newBlogs.length;
    } catch (err) {
      console.error("[BlogInfiniteList] loadMore error", err);
      setError("記事の読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }
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
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">まだブログ記事がありません</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 mb-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <div ref={sentinelRef} className="flex flex-col items-center gap-2 py-8 text-sm text-slate-500">
        {isLoading && (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
            読み込み中...
          </div>
        )}
        {!hasMore && <span>すべての記事を読み込みました</span>}
        {error && (
          <button
            type="button"
            onClick={loadMore}
            className="rounded-full border border-orange-500 px-4 py-2 text-orange-600 transition hover:bg-orange-50"
          >
            再読み込み
          </button>
        )}
      </div>
    </>
  );
}
