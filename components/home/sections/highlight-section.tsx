"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import type { CategoryResponse } from "@/types/microcms";
import { CtaResolver } from "../types";

interface HighlightSectionProps {
  resolveCta: CtaResolver;
  categories: CategoryResponse[];
}

export function HighlightSection({ resolveCta, categories }: HighlightSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const node = carouselRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const scrollByDirection = useCallback((direction: "left" | "right") => {
    const node = carouselRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8 * (direction === "left" ? -1 : 1);
    node.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    updateScrollState();
    node.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      node.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState, categories]);

  return (
    <section className="relative bg-win2-surface-sky-50 py-24">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/city.webp"
          alt="都市背景"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          quality={70}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-win2-surface-sky-50/80 to-win2-surface-sky-50/90" />

      <div
        ref={ref}
        className={cn(
          "relative space-y-12",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="mx-auto max-w-[1100px] space-y-3 px-6 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-win2-primary-orage">
            掲載サービス・活用シーン
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">暮らしを変える多彩なサービス</h2>
          <p className="text-sm text-slate-600 md:text-base">
            家計のお悩みからライフイベントまで、WIN×Ⅱなら幅広いカテゴリをワンストップでチェックできます。
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-win2-surface-sky-50 via-win2-surface-sky-50/80 to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-win2-surface-sky-50 via-win2-surface-sky-50/80 to-transparent md:w-32" />

          <div
            ref={carouselRef}
            className="hide-scrollbar relative flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 pt-1 md:gap-8 md:px-8 lg:px-12"
            aria-roledescription="horizontal carousel"
          >
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                aria-label={`${category.name}の特集を見る`}
                className={cn(
                  "group relative isolate flex w-[85vw] min-h-[420px] min-w-[280px] max-w-[360px] flex-col justify-between overflow-hidden rounded-2xl bg-slate-900 text-left text-white shadow-md transition-all duration-300 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-win2-accent-amber/50",
                  "sm:w-[420px] sm:min-w-[380px] md:w-[460px] lg:w-[500px] lg:min-h-[560px]",
                  "snap-start hover:shadow-lg focus-visible:shadow-lg"
                )}
              >
                <Image
                  src={category.image?.url || "/assets/images/city.webp"}
                  alt={category.image?.alt || category.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 85vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  priority={index === 0}
                />
                <span className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

                <div className="relative flex flex-col gap-4 p-6 sm:p-8">
                  <div className="space-y-3">
                    <span className="inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                      {category.name}
                    </span>
                    <h3 className="text-2xl font-bold leading-tight sm:text-3xl">{category.name}</h3>
                    <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                      {category.description || "カテゴリの詳細をご覧ください"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center md:left-6">
            <button
              type="button"
              onClick={() => scrollByDirection("left")}
              disabled={!canScrollLeft}
              className={cn(
                "pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage text-white shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-win2-accent-rose/50",
                !canScrollLeft && "opacity-40"
              )}
              aria-label="前のカテゴリを見る"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center md:right-6">
            <button
              type="button"
              onClick={() => scrollByDirection("right")}
              disabled={!canScrollRight}
              className={cn(
                "pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage text-white shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-win2-accent-rose/50",
                !canScrollRight && "opacity-40"
              )}
              aria-label="次のカテゴリを見る"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1100px] px-6 text-center lg:px-8">
          {(() => {
            const highlightCta = resolveCta("無料メルマガ会員登録で最新情報を受け取る");
            return (
              <Link
                href={highlightCta.href}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-12 py-3 text-base font-semibold text-white shadow-lg shadow-win2-accent-rose/30 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-win2-accent-rose/40"
              >
                {highlightCta.label}
              </Link>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
