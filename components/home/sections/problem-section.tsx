"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

export function ProblemSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative z-20 bg-win2-surface-stone-100 pb-16 pt-40 md:pt-48">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="mb-12 text-center">
          <h2 className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold md:text-3xl lg:text-4xl">
            <span className="inline-block rounded-full border-2 border-win2-primary-orage bg-white px-4 py-1 text-win2-primary-orage">
              日常で
            </span>
            <span>こんな</span>
            <span className="text-win2-primary-orage">お悩み</span>
            <span>、ありませんか？</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[180px_1fr_180px] lg:grid-cols-[220px_1fr_220px]">
          <div className="flex justify-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full md:h-44 md:w-44 lg:h-52 lg:w-52">
              <Image
                src="/assets/images/problem.webp"
                alt="悩む人"
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 176px, 208px"
                className="object-cover grayscale"
              />
            </div>
          </div>

          <div className="space-y-3 text-left text-sm md:text-base">
            <p className="leading-relaxed">
              • 保険料高い気がするけど、
              <span className="font-semibold text-win2-primary-orage">どこをどう見直せばいいか分からない</span>
            </p>
            <p className="leading-relaxed">
              • 不動産の価値を知りたいけど、
              <span className="font-semibold text-win2-primary-orage">査定って難しそう</span>
              で不安
            </p>
            <p className="leading-relaxed">
              • <span className="font-semibold text-win2-primary-orage">転職したい</span>
              けど、どのサービスが自分に合っているのか分からない
            </p>
            <p className="leading-relaxed">
              • サブスクやキャンペーンが多すぎて、
              <span className="font-semibold text-win2-primary-orage">どれがお得か比べられない</span>
            </p>
            <p className="leading-relaxed">
              • <span className="font-semibold text-win2-primary-orage">生活費をもっと節約したい</span>
              けど、何から始めればいいか迷ってる
            </p>
          </div>

          <div className="flex justify-center hidden md:block">
            <div className="relative h-56 w-40 md:h-64 md:w-44 lg:h-80 lg:w-52">
              <Image
                src="/assets/images/woman.webp"
                alt="案内スタッフ"
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 176px, 208px"
                className="object-contain"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-win2-surface-stone-100" />
            </div>
          </div>
        </div>

        <div className="relative -mx-6 mt-12 overflow-hidden bg-gradient-to-r from-win2-accent-rose to-win2-accent-amber py-6 text-center md:-mx-0 md:rounded-2xl">
          <p className="text-lg font-bold text-white md:text-xl">そんな時こそ</p>
          <p className="mt-1 text-2xl font-bold md:text-3xl">
            <span className="text-win2-accent-sun">WIN×Ⅱ</span>
            <span className="text-white">の出番です！</span>
          </p>
        </div>
      </div>
    </section>
  );
}
