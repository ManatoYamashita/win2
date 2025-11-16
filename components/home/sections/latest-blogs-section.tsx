"use client";

import { useEffect, useState } from "react";
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

  return (
    <section className="relative -mt-16 z-20 pb-16 md:-mt-20 md:pb-24">
      <div className="mx-auto max-w-[1100px] rounded-[36px] bg-white/80 px-6 py-12 shadow-[0_25px_65px_rgba(15,23,42,0.08)] backdrop-blur-lg lg:px-12">
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
            className="inline-flex items-center justify-center rounded-full border border-win2-primary-orage/40 bg-white px-6 py-3 text-sm font-semibold text-win2-primary-orage shadow-[0_5px_20px_rgba(244,138,60,0.25)] transition hover:-translate-y-0.5 hover:bg-win2-primary-orage hover:text-white"
          >
            すべての記事を見る
          </Link>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="h-56 animate-pulse rounded-3xl bg-slate-200/70" />
              ))}
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-red-100 bg-red-50/80 p-6 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
              まだ公開中のブログ記事がありません。
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {blogs.map((blog) => {
                const thumbnailUrl = blog.thumbnail?.url ?? "/assets/images/blog-placeholder.webp";
                return (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className="group flex flex-col gap-5 rounded-3xl border border-white/70 bg-white/95 p-5 shadow-md shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-win2-primary-orage/40 md:flex-row md:p-6"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 md:h-40 md:w-64">
                      <Image
                        src={thumbnailUrl}
                        alt={blog.title}
                        fill
                        sizes="(min-width: 1024px) 320px, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-win2-primary-orage">
                        <span>{blog.category?.name ?? "コラム"}</span>
                        <span className="text-slate-400">• {formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                      <h3 className="text-xl font-bold leading-snug text-slate-900 transition group-hover:text-win2-primary-orage">
                        {blog.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {extractExcerpt(blog.content ?? "", 140)}
                      </p>
                      <span className="inline-flex items-center text-sm font-semibold text-win2-primary-orage transition group-hover:gap-2">
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
          )}
        </div>
      </div>
    </section>
  );
}
