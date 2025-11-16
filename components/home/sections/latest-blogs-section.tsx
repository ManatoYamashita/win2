"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogResponse } from "@/types/microcms";
import { extractExcerpt } from "@/lib/blog-utils";

export function LatestBlogsSection() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;
    const LIMIT = 3;

    async function fetchLatestBlogs() {
      try {
        setIsLoading(true);
        const response = await fetch(`/blogs?limit=${LIMIT}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }

        const data = await response.json();

        if (!isActive) return;
        setBlogs(Array.isArray(data.contents) ? data.contents : []);
        setErrorMessage(null);
      } catch (error) {
        if (!isActive || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        console.error("[LandingPage] 最新ブログの取得に失敗しました", error);
        setErrorMessage("現在ブログを取得できません。時間をおいて再度お試しください。");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchLatestBlogs();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "日付未設定";
    try {
      return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(dateString));
    } catch {
      return "日付未設定";
    }
  };

  const categoryHighlights = useMemo(() => {
    const counts = blogs.reduce<
      Record<
        string,
        {
          id: string | null;
          name: string;
          count: number;
        }
      >
    >((acc, blog) => {
      const categoryId = blog.category?.id ?? "__other";
      const name = blog.category?.name ?? "その他";
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: blog.category?.id ?? null,
          name,
          count: 0,
        };
      }
      acc[categoryId].count += 1;
      return acc;
    }, {});
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [blogs]);

  const hasBlogs = !isLoading && !errorMessage && blogs.length > 0;
  const latestUpdateLabel = blogs[0]
    ? formatDate(blogs[0]?.publishedAt || blogs[0]?.createdAt)
    : "日付未設定";

  const renderBlogList = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="h-60 animate-pulse rounded-[28px] bg-slate-200/70" />
          ))}
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="rounded-[28px] border border-red-100 bg-red-50/80 p-6 text-sm text-red-700">
          {errorMessage}
        </div>
      );
    }

    if (blogs.length === 0) {
      return (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
          まだ公開中のブログ記事がありません。
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => {
          const thumbnailUrl = blog.thumbnail?.url ?? "/assets/images/blog-placeholder.webp";
          return (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-win2-primary-orage/40 hover:shadow-[0_20px_50px_rgba(244,138,60,0.15)]"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={thumbnailUrl}
                  alt={blog.title}
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  draggable={false}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-win2-primary-orage">
                  <span>{blog.category?.name ?? "コラム"}</span>
                  <span className="text-slate-400">{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-win2-primary-orage">
                  {blog.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {extractExcerpt(blog.content ?? "", 110)}
                </p>
                <span className="mt-auto inline-flex items-center text-sm font-semibold text-win2-primary-orage transition group-hover:gap-2">
                  記事を読む
                  <svg
                    className="ml-1 h-4 w-4 transition group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <section className="relative -mt-16 z-20 pb-16 md:-mt-20 md:pb-24">
      <div className="mx-auto max-w-[1140px] rounded-[36px] bg-white/90 px-6 py-12 shadow-[0_25px_65px_rgba(15,23,42,0.08)] backdrop-blur lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-win2-primary-orage">
              Latest Blog
            </p>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">最新のブログインサイト</h2>
            <p className="text-sm text-slate-600 md:text-base">
              WIN×Ⅱ編集部が厳選した最新の記事から、暮らしに役立つヒントを素早くキャッチしましょう。
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-win2-primary-orage/30 bg-white px-6 py-3 text-sm font-semibold text-win2-primary-orage shadow-[0_5px_20px_rgba(244,138,60,0.25)] transition hover:-translate-y-0.5 hover:bg-win2-primary-orage hover:text-white"
          >
            すべての記事を見る
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(280px,0.8fr)]">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">最新の投稿</h3>
              <span className="text-xs text-slate-500">更新: {latestUpdateLabel}</span>
            </div>
            {renderBlogList()}
          </div>

          <div className="rounded-[32px] border border-win2-surface-cream-260 bg-win2-surface-cream-50 p-6 shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">注目カテゴリ</h3>
              <Link href="/categories" className="text-sm font-semibold text-win2-primary-orage hover:underline">
                カテゴリ一覧へ
              </Link>
            </div>
            <p className="mt-2 text-sm text-slate-600">今読まれているジャンルをチェックしましょう。</p>
            {hasBlogs ? (
              <div className="mt-6 space-y-3">
                {categoryHighlights.map((category, index) => (
                  <Link
                    key={category.id ?? `${category.name}-${index}`}
                    href={category.id ? `/category/${category.id}` : "/categories"}
                    className="flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                    aria-label={`${category.name}のカテゴリを見る`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-win2-primary-orage/10 text-xs font-bold text-win2-primary-orage">
                        {index + 1}
                      </span>
                      {category.name}
                    </div>
                    <span className="text-xs text-slate-500">{category.count} 件</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-win2-surface-cream-260 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                カテゴリ情報は準備中です。
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
