"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { CtaResolver } from "../types";

interface HeroSectionProps {
  resolveCta: CtaResolver;
}

export function HeroSection({ resolveCta }: HeroSectionProps) {
  const { ref } = useScrollReveal<HTMLDivElement>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  const heroReady = isMounted;
  const heroCta = resolveCta("無料メルマガ会員登録はこちら");

  const textTimeline = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.12,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: -16, letterSpacing: "0.55em" },
    visible: {
      opacity: 1,
      y: 0,
      letterSpacing: "0.35em",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.65, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
    },
  };

  const accentOrbs = [
    { className: "-top-6 -left-10 h-20 w-20 bg-win2-accent-rose/25", delay: 0 },
    { className: "top-6 -right-12 h-16 w-16 bg-win2-primary-orage/20", delay: 0.4 },
    { className: "bottom-10 -left-4 h-14 w-14 bg-win2-accent-amber/20", delay: 0.8 },
  ];

  const headlineVariants = {
    hidden: {
      transition: { staggerChildren: 0, staggerDirection: -1 },
    },
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, skewY: 3 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative -mb-32 min-h-[540px] overflow-visible bg-gradient-to-b from-win2-surface-cream-320 via-white to-win2-surface-cream-150 pb-32 md:-mb-40 md:min-h-[640px] md:pb-44">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="relative h-full w-full min-h-full"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={heroReady ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/assets/images/office-super-blur.webp"
            alt="オフィス背景"
            fill
            sizes="100vw"
            className="origin-top object-cover"
            style={{ objectFit: "cover", objectPosition: "center top" }}
            quality={75}
            priority
            loading="eager"
            draggable={false}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white/85"
          initial={{ opacity: 0 }}
          animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        />
      </div>
      <div
        ref={ref}
        className="relative z-10 mx-auto flex max-w-[1100px] flex-col gap-12 px-6 py-12 md:py-4 md:flex-row md:items-center lg:px-8"
      >
        <motion.div
          className="relative z-40 max-w-xl"
          variants={textTimeline}
          initial="hidden"
          animate={heroReady ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="space-y-3">
            <motion.p
              variants={badgeVariants}
              className="inline-flex text-sm font-semibold tracking-[0.35em] text-win2-accent-gold"
            >
              WIN×Ⅱ
            </motion.p>
            <motion.h1
              variants={headlineVariants}
              className="text-4xl font-bold leading-tight text-win2-neutral-950 md:text-5xl"
            >
              <motion.span
                variants={wordVariants}
                className="inline-block text-win2-neutral-950"
              >
                暮らしをもっと
              </motion.span>
              <motion.span
                variants={wordVariants}
                className="inline-block text-win2-primary-orage"
              >
                お得
              </motion.span>
              <motion.span
                variants={wordVariants}
                className="inline-block text-win2-neutral-950"
              >
                に
              </motion.span>
              <br />
              <motion.span
                variants={wordVariants}
                className="inline-block text-win2-neutral-950"
              >
                もっと
              </motion.span>
              <motion.span
                variants={wordVariants}
                className="inline-block text-win2-primary-orage"
              >
                スマート
              </motion.span>
              <motion.span
                variants={wordVariants}
                className="inline-block text-win2-neutral-950"
              >
                に。
              </motion.span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[15px] leading-relaxed text-slate-700">
              WIN×Ⅱは、暮らしに役立つサービスをワンストップで選べるアフィリエイトブログプラットフォームです。保険・不動産・転職・エンタメなど豊富なジャンルから、あなたにぴったりのサービスを見つけましょう。
            </motion.p>
          </motion.div>
          <motion.div
            variants={ctaVariants}
            className="relative mt-8 flex flex-wrap items-center gap-4"
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-win2-primary-orage/20 via-transparent to-win2-accent-rose/20 blur-3xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            <Link
              href={heroCta.href}
              className="rounded-full bg-win2-primary-orage px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-win2-primary-orage/25 transition hover:bg-win2-accent-amber"
            >
              {heroCta.label}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-win2-accent-rose bg-white px-10 py-3 text-sm font-semibold text-win2-accent-rose transition hover:bg-win2-surface-rose-100"
            >
              ログイン
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative z-20 mx-auto hidden w-full max-w-[420px] md:block md:max-w-[460px]"
          variants={imageVariants}
          initial="hidden"
          animate={heroReady ? "visible" : "hidden"}
        >
          <div className="relative">
            <motion.span
              aria-hidden="true"
              className="absolute -inset-6 hidden rounded-[40px] bg-gradient-to-br from-win2-primary-orage/20 via-white/10 to-win2-accent-rose/20 blur-3xl md:block"
              initial={{ opacity: 0, rotate: -6 }}
              animate={heroReady ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -6 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            />
            <Image
              src="/assets/images/woman.webp"
              alt="メインビジュアル"
              width={880}
              height={880}
              className="relative w-full object-contain"
              priority
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-win2-surface-stone-100 to-transparent"
              style={{ maskImage: "linear-gradient(to top, black, transparent)" }}
            />
          </div>
          {accentOrbs.map((orb, index) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`pointer-events-none absolute hidden rounded-full blur-2xl lg:block ${orb.className}`}
              animate={{
                y: [0, -8, 4, 0],
                scale: [1, 1.08, 0.96, 1],
                rotate: [0, 3, -2, 0],
              }}
              transition={{ duration: 8 + index * 1.5, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-win2-surface-stone-100/80 to-win2-surface-stone-100 md:h-32 md:via-win2-surface-stone-100/90" />
    </section>
  );
}
