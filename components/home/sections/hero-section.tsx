"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { CtaResolver } from "../types";
import { heroStats } from "../landing-data";

interface HeroSectionProps {
  resolveCta: CtaResolver;
}

export function HeroSection({ resolveCta }: HeroSectionProps) {
  const { ref } = useScrollReveal<HTMLDivElement>();
  const [isMounted, setIsMounted] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    setPlayKey((prev) => prev + 1);
  }, [isMounted]);

  return (
    <section className="relative -mb-32 min-h-[540px] overflow-visible bg-gradient-to-b from-win2-surface-cream-320 via-white to-win2-surface-cream-150 pb-32 md:-mb-40 md:min-h-[640px] md:pb-44">
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full min-h-full">
          <Image
            src="/assets/images/office-super-blur.webp"
            alt="オフィス背景"
            fill
            sizes="100vw"
            className={cn(
              "origin-top opacity-0 blur-[14px] object-cover",
              isMounted && playKey ? "animate-hero-background" : "animate-none"
            )}
            style={{ objectFit: "cover", objectPosition: "center top" }}
            quality={75}
            priority
            loading="eager"
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white/85 opacity-0",
            isMounted && playKey ? "animate-hero-overlay" : "animate-none"
          )}
        />
      </div>
      <div
        ref={ref}
        className="relative z-10 mx-auto flex max-w-[1100px] flex-col gap-12 px-6 pt-12 md:flex-row md:items-center lg:px-8"
      >
        <div className="relative z-40 max-w-xl space-y-8">
          <div className="space-y-3">
            <p
              className={cn(
                "text-sm font-semibold tracking-[0.35em] text-win2-accent-gold opacity-0",
                isMounted && playKey ? "animate-hero-badge" : "animate-none"
              )}
            >
              WIN×Ⅱ
            </p>
            <h1
              ref={headlineRef}
              className={cn(
                "text-4xl font-bold leading-tight text-win2-neutral-950 opacity-0 md:text-5xl",
                isMounted && playKey ? "animate-hero-headline" : "animate-none"
              )}
            >
              暮らしを
              <span className="text-win2-primary-orage whitespace-nowrap">もっとお得に</span>
              <br />
              <span className="text-win2-primary-orage whitespace-nowrap">もっとスマートに。</span>
            </h1>
            <p
              className={cn(
                "text-[15px] leading-relaxed text-slate-700 opacity-0",
                isMounted && playKey ? "animate-hero-subtext" : "animate-none"
              )}
            >
              WIN×Ⅱは、暮らしに役立つサービスをワンストップで選べるアフィリエイトブログプラットフォームです。保険・不動産・転職・エンタメなど豊富なジャンルから、あなたにぴったりのサービスを見つけましょう。
            </p>
          </div>
          <div
            ref={statsRef}
            className={cn(
              "flex flex-wrap gap-4 opacity-0",
              isMounted && playKey ? "animate-hero-stats" : "animate-none"
            )}
          >
            {heroStats.map((stat) => (
              <div
                key={stat.title}
                className="flex min-w-[160px] flex-1 flex-col items-center rounded-[28px] bg-white/90 px-5 py-4 text-center shadow-[0_10px_22px_rgba(240,130,90,0.18)] backdrop-blur"
              >
                <p className="text-xs font-semibold text-win2-primary-orage">{stat.title}</p>
                <p className="mt-2 text-2xl font-bold text-win2-neutral-950">
                  {stat.value}
                  <span className="ml-1 text-base font-semibold text-slate-600 whitespace-nowrap">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <div
            ref={ctaRef}
            className={cn(
              "flex flex-wrap items-center gap-4 opacity-0",
              isMounted && playKey ? "animate-hero-cta" : "animate-none"
            )}
          >
            {(() => {
              const heroCta = resolveCta("無料メルマガ会員登録はこちら");
              return (
                <Link
                  href={heroCta.href}
                  className="rounded-full bg-win2-primary-orage px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-win2-primary-orage/25 transition hover:bg-win2-accent-amber"
                >
                  {heroCta.label}
                </Link>
              );
            })()}
            <Link
              href="/login"
              className="rounded-full border border-win2-accent-rose bg-white px-10 py-3 text-sm font-semibold text-win2-accent-rose transition hover:bg-win2-surface-rose-100"
            >
              ログイン
            </Link>
          </div>
        </div>
        <div
          ref={imageRef}
          className={cn(
            "relative z-20 mx-auto w-full max-w-[420px] opacity-0 md:max-w-[460px]",
            isMounted && playKey ? "animate-hero-image" : "animate-none"
          )}
        >
          <div className="relative">
            <Image
              src="/assets/images/woman.webp"
              alt="メインビジュアル"
              width={880}
              height={880}
              className="w-full object-contain"
              priority
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-win2-surface-stone-100 to-transparent"
              style={{ maskImage: "linear-gradient(to top, black, transparent)" }}
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-win2-surface-stone-100/80 to-win2-surface-stone-100 md:h-32 md:via-win2-surface-stone-100/90" />
    </section>
  );
}
