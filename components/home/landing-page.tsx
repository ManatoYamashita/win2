"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const heroStats = [
  {
    title: "無料掲載サービス数",
    value: "300",
    unit: "件以上",
  },
  {
    title: "掲載ジャンル数",
    value: "30",
    unit: "カテゴリ以上",
  },
  {
    title: "口コミ評価",
    value: "5",
    unit: "/5 点",
  },
];

const serviceCategories = ["各種保険", "不動産", "エンタメ", "転職"];

const serviceFeatures = [
  {
    image: "/assets/images/保険の無料相談.webp",
    alt: "保険の無料相談",
  },
  {
    image: "/assets/images/不動産査定サービス.webp",
    alt: "不動産査定サービス",
  },
  {
    image: "/assets/images/エンタメサブスク特集.webp",
    alt: "エンタメサブスク特集",
  },
  {
    image: "/assets/images/転職支援サポート.webp",
    alt: "転職支援サポート",
  },
];

const meritItems = [
  {
    number: "01",
    title: "幅広いジャンルを網羅",
    description:
      "保険・不動産・転職・エンタメ・生活サービスなど、暮らしに関わる情報を総合的にカバー。",
    icon: "📊",
  },
  {
    number: "02",
    title: "比較・検討が一目でわかる",
    description:
      "各種サービス情報をまとめて掲載。自分に合った選択肢がスムーズに見つかります。",
    icon: "🔍",
  },
  {
    number: "03",
    title: "無料で使える安心設計",
    description:
      "多くのサービスが無料で利用可能。初めての方でも安心して活用できます。",
    icon: "✨",
  },
];

const achievementImages = [
  {
    image: "/assets/images/掲載ジャンル数.webp",
    alt: "掲載ジャンル数20カテゴリー以上",
  },
  {
    image: "/assets/images/無料掲載サービス数.webp",
    alt: "無料掲載サービス数500件以上",
  },
];

const testimonials = [
  {
    age: "20代",
    gender: "女性",
    comment: "保険の見直しで年間5万円も節約できました！比較がとても簡単で助かりました。",
    rating: 5,
  },
  {
    age: "30代",
    gender: "男性",
    comment: "転職サービスの情報が充実していて、自分に合った求人が見つかりました。サポートも丁寧でした。",
    rating: 5,
  },
  {
    age: "40代",
    gender: "女性",
    comment: "不動産査定がこんなに簡単にできるとは思いませんでした。対応も迅速で信頼できました。",
    rating: 5,
  },
  {
    age: "50代",
    gender: "男性",
    comment: "エンタメサブスクの比較ができて、無駄な契約を整理できました。家計に優しいサービスです。",
    rating: 5,
  },
];

const faqItems = [
  {
    question: "掲載するのに費用はかかりますか？",
    answer:
      "掲載は完全無料です。成果が発生した場合のみ、報酬の一部を還元する仕組みです。",
  },
  {
    question: "どんなサービスが掲載されていますか？",
    answer:
      "保険・不動産・転職・エンタメなど、暮らしに役立つサービスを幅広く掲載しています。",
  },
  {
    question: "スマートフォンでも利用できますか？",
    answer:
      "はい、スマートフォン・タブレット・PC のいずれでも快適にご利用いただけます。",
  },
];

export function LandingPage() {
  return (
    <main className="bg-[#fef4ea] text-slate-900">
      <HeroSection />
      <ProblemSection />
      <IntroductionBoxSection />
      <ServiceSection />
      <MeritSection />
      <HighlightSection />
      <AchievementSection />
      <TestimonialsSection />
      <FaqSection />
      <BottomCtaSection />
    </main>
  );
}

function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff7f2] via-white to-[#ffeade]">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/office-super-blur.webp"
          alt="オフィス背景"
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>
      <div
        ref={ref}
        className={cn(
          "relative mx-auto flex max-w-[1100px] flex-col-reverse gap-12 px-6 pb-20 pt-24 md:flex-row md:items-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="max-w-xl space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.35em] text-[#f5a623]">WIN×Ⅱ</p>
            <h1 className="text-4xl font-bold leading-tight text-[#1c1c1c] md:text-5xl">
              暮らしを
              <span className="text-[#f26f36]">もっとお得に</span>
              <br />
              もっとスマートに。
            </h1>
            <p className="text-[15px] leading-relaxed text-slate-700">
              WIN×Ⅱは、暮らしに役立つサービスをワンストップで選べるキャッシュバック付きプラットフォームです。保険・不動産・転職・エンタメなど豊富なジャンルから、あなたにぴったりのサービスを見つけましょう。
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.title}
                className="flex min-w-[160px] flex-1 flex-col items-center rounded-[28px] bg-white/90 px-5 py-4 text-center shadow-[0_10px_22px_rgba(240,130,90,0.18)] backdrop-blur"
              >
                <p className="text-xs font-semibold text-[#f26f36]">{stat.title}</p>
                <p className="mt-2 text-2xl font-bold text-[#1c1c1c]">
                  {stat.value}
                  <span className="ml-1 text-base font-semibold text-slate-600">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#f05972] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f05972]/25 transition hover:bg-[#d9475e]"
            >
              メンバー登録（無料）はこちら
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#f05972] px-10 py-3 text-sm font-semibold text-[#f05972] transition hover:bg-[#fff0f3]"
            >
              ログイン
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[420px] md:max-w-[460px]">
          <Image
            src="/assets/images/woman.webp"
            alt="メインビジュアル"
            width={880}
            height={880}
            className="w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative bg-[#f5f1ed] py-16">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1200px] px-6",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        {/* 見出し */}
        <div className="mb-12 text-center">
          <h2 className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold md:text-3xl lg:text-4xl">
            <span className="inline-block rounded-full border-2 border-[#f26f36] bg-white px-4 py-1 text-[#f26f36]">
              日常で
            </span>
            <span>こんな</span>
            <span className="text-[#f26f36]">お悩み</span>
            <span>、ありませんか？</span>
          </h2>
        </div>

        {/* 3カラムレイアウト */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[180px_1fr_180px] lg:grid-cols-[220px_1fr_220px]">
          {/* 左：悩む人の画像 */}
          <div className="flex justify-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full md:h-44 md:w-44 lg:h-52 lg:w-52">
              <Image
                src="/assets/images/problem.webp"
                alt="悩む人"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>

          {/* 中央：お悩みリスト */}
          <div className="space-y-3 text-left text-sm md:text-base">
            <p className="leading-relaxed">
              • 保険料高い気がするけど、
              <span className="font-semibold text-[#f26f36]">どこをどう見直せばいいか分からない</span>
            </p>
            <p className="leading-relaxed">
              • 不動産の価値を知りたいけど、
              <span className="font-semibold text-[#f26f36]">査定って難しそう</span>
              で不安
            </p>
            <p className="leading-relaxed">
              • <span className="font-semibold text-[#f26f36]">転職したい</span>
              けど、どのサービスが自分に合っているのか分からない
            </p>
            <p className="leading-relaxed">
              • サブスクやキャンペーンが多すぎて、
              <span className="font-semibold text-[#f26f36]">どれがお得か比べられない</span>
            </p>
            <p className="leading-relaxed">
              • <span className="font-semibold text-[#f26f36]">生活費をもっと節約したい</span>
              けど、何から始めればいいか迷ってる
            </p>
          </div>

          {/* 右：女性画像 */}
          <div className="flex justify-center">
            <div className="relative h-56 w-40 md:h-64 md:w-44 lg:h-80 lg:w-52">
              <Image
                src="/assets/images/woman.webp"
                alt="案内スタッフ"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* 下部オレンジ帯 */}
        <div className="relative -mx-6 mt-12 overflow-hidden bg-gradient-to-r from-[#f05972] to-[#f48a3c] py-6 text-center md:-mx-0 md:rounded-2xl">
          <p className="text-lg font-bold text-white md:text-xl">そんな時こそ</p>
          <p className="mt-1 text-2xl font-bold md:text-3xl">
            <span className="text-[#fff44f]">WIN×Ⅱ</span>
            <span className="text-white">の出番です！</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function IntroductionBoxSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-white py-16">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[900px] px-6",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        {/* 吹き出しボックス */}
        <div className="relative rounded-[40px] border-4 border-[#f26f36] bg-white p-8 shadow-[0_20px_50px_rgba(242,111,54,0.2)] md:p-10">
          {/* 上部三角形（オレンジ帯からの矢印効果） */}
          <div className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 rotate-45 border-l-4 border-t-4 border-[#f26f36] bg-white" />

          <div className="relative z-10 space-y-4 text-center">
            <p className="text-base leading-relaxed md:text-lg">保険・不動産・転職・エンタメなど</p>
            <p className="text-base leading-relaxed md:text-lg">
              暮らしに関わる
              <span className="font-bold text-[#f26f36]">多彩な情報を1つのサイトでまとめて比較・検討</span>
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              できるから、「知らなかった」で損する前に、
              <span className="font-bold text-[#f26f36]">最適な選択肢が見つかります！</span>
            </p>
          </div>
        </div>

        {/* CTAボタン */}
        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-block rounded-full bg-gradient-to-r from-[#f05972] to-[#f26f36] px-12 py-4 text-base font-bold text-white shadow-lg shadow-[#f05972]/30 transition hover:opacity-90 md:text-lg"
          >
            メルマガ会員登録はこちら
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-[#fffaf4] py-24">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1080px] px-6 lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        {/* 見出し：WIN×Ⅱは どんなサービス？ */}
        <div className="mb-12 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-4">
          <Image
            src="/assets/images/win2-is-bibble.webp"
            alt="WIN×Ⅱは"
            width={180}
            height={180}
            className="h-28 w-28 shrink-0 object-contain md:h-32 md:w-32 lg:h-36 lg:w-36"
            priority
          />
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            どんな<span className="text-[#f26f36]">サービス</span>？
          </h2>
        </div>

        {/* カテゴリボタン */}
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {serviceCategories.map((category) => (
            <div
              key={category}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#f26f36] shadow-[0_12px_30px_rgba(242,111,54,0.18)]"
            >
              {category}
            </div>
          ))}
        </div>
        <div className="relative mx-auto w-full max-w-[560px] pt-20">
          <Image
            src="/assets/images/onestop-circle-text.webp"
            alt="WIN×Ⅱはワンストップで暮らしを支える"
            width={360}
            height={360}
            className="absolute left-1/2 top-0 w-48 -translate-x-1/2 -translate-y-1/2 object-contain md:w-56 lg:w-64"
          />
          <Image
            src="/assets/images/onestop-figure.webp"
            alt="暮らしを支える4つのカテゴリ"
            width={720}
            height={540}
            className="w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function MeritSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-white py-24">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1100px] space-y-12 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-[#f48a3c] md:text-4xl">WIN×Ⅱでのメリット</h2>
          <p className="text-sm text-slate-600 md:text-base">
            暮らしを変えるヒントが一つに集まる。WIN×Ⅱだからできる 3 つのポイントをご紹介します。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {meritItems.map((item) => (
            <div
              key={item.number}
              className="group rounded-[32px] bg-gradient-to-br from-white to-[#fffaf4] p-6 shadow-[0_18px_42px_rgba(244,138,60,0.22)] transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_54px_rgba(244,138,60,0.32)]"
            >
              {/* POINT バッジ */}
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd700] to-[#ffb300] text-sm font-bold text-[#2563eb] shadow-lg">
                  POINT
                  <br />
                  {item.number}
                </div>
              </div>

              {/* アイコン */}
              <div className="mb-3 text-4xl">{item.icon}</div>

              {/* タイトルバー */}
              <div className="relative mb-4 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] py-3 px-4">
                <h3 className="text-base font-bold text-white md:text-lg">{item.title}</h3>
              </div>

              {/* 説明文 */}
              <p className="text-sm leading-relaxed text-slate-700 md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative bg-[#f0f6fb] py-24">
      {/* City background image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/city.webp"
          alt="都市背景"
          fill
          className="object-cover opacity-30"
        />
      </div>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0f6fb]/80 to-[#f0f6fb]/90" />

      <div
        ref={ref}
        className={cn(
          "relative mx-auto max-w-[1100px] space-y-12 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f26f36]">
            掲載サービス・活用シーン
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">暮らしを変える多彩なサービス</h2>
          <p className="text-sm text-slate-600 md:text-base">
            家計のお悩みからライフイベントまで、WIN×Ⅱなら幅広いカテゴリをワンストップでチェックできます。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {serviceFeatures.map((feature) => (
            <div key={feature.alt} className="overflow-hidden rounded-[28px] shadow-[0_16px_34px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105">
              <Image
                src={feature.image}
                alt={feature.alt}
                width={320}
                height={240}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-[#f05972] px-12 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f05972]/25 transition hover:bg-[#d9475e]"
        >
          無料メンバー登録で最新情報を受け取る
        </Link>
      </div>
    </section>
  );
}

function AchievementSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-[#fffaf4] py-24">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[960px] space-y-12 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <h2 className="text-3xl font-bold text-[#f48a3c] md:text-4xl">実績・掲載数</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {achievementImages.map((achievement) => (
            <div
              key={achievement.alt}
              className="rounded-[32px] bg-white px-6 py-10 shadow-[0_20px_45px_rgba(244,138,60,0.2)]"
            >
              <Image
                src={achievement.image}
                alt={achievement.alt}
                width={420}
                height={320}
                className="mx-auto w-full max-w-[320px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-white py-24">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[1080px] space-y-10 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold md:text-4xl">ご利用者様の声</h2>
          <p className="text-sm text-slate-600 md:text-base">
            WIN×Ⅱをご利用いただいた皆さまからのお声を一部ご紹介します。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.age}-${testimonial.gender}-${index}`}
              className="group relative rounded-[24px] bg-gradient-to-br from-[#fff7f2] to-white p-6 text-left shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            >
              {/* 引用符デザイン */}
              <div className="absolute top-4 left-4 text-6xl font-serif text-[#f26f36]/20">&ldquo;</div>

              {/* ユーザー情報 */}
              <div className="relative mb-4 flex items-center gap-3">
                {/* アバター */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f26f36] to-[#f48a3c] text-2xl shadow-md">
                  {testimonial.gender === "女性" ? "👩" : "👨"}
                </div>
                <div>
                  {/* 年齢・性別バッジ */}
                  <div className="inline-block rounded-full bg-gradient-to-r from-[#f05972] to-[#f48a3c] px-3 py-1 text-xs font-semibold text-white">
                    {testimonial.age} {testimonial.gender}
                  </div>
                  {/* 星評価 */}
                  <div className="mt-1 text-sm">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-[#ffd700]">⭐</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* コメント */}
              <p className="relative z-10 text-sm leading-relaxed text-slate-700 md:text-base">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#fff7f0] py-24">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-[960px] space-y-10 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold md:text-4xl">よくあるご質問</h2>
          <p className="text-sm text-slate-600 md:text-base">
            ご不明な点があれば、お気軽にお問い合わせください。
          </p>
        </div>
        <div className="space-y-4 text-left">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_26px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_18px_36px_rgba(0,0,0,0.14)]"
              >
                {/* 質問部分（クリック可能） */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-start gap-3 p-6 text-left transition-colors hover:bg-[#fff7f0]"
                >
                  {/* Qバッジ */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f26f36] to-[#f48a3c] text-base font-bold text-white shadow-md">
                    Q
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#f26f36] md:text-base">
                      {item.question}
                    </p>
                  </div>
                  {/* 開閉アイコン */}
                  <div
                    className={cn(
                      "shrink-0 text-[#f26f36] transition-transform duration-300",
                      isOpen ? "rotate-180" : ""
                    )}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* 回答部分（アコーディオン） */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="border-t border-slate-200 bg-gradient-to-br from-[#fafafa] to-white px-6 pb-6 pt-4">
                    <div className="flex items-start gap-3">
                      {/* Aバッジ */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-sm font-bold text-white shadow-md">
                        A
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-slate-700 md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BottomCtaSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-gradient-to-r from-[#f05972] to-[#f48a3c] py-16">
      <div
        ref={ref}
        className={cn(
          "mx-auto flex max-w-[860px] flex-col items-center gap-5 px-6 text-center text-white lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <h2 className="text-3xl font-bold md:text-4xl">いますぐ WIN×Ⅱ をはじめましょう</h2>
        <p className="text-sm leading-relaxed text-white/90 md:text-base">
          暮らしをもっとお得に、もっとスマートに。WIN×Ⅱの無料登録でキャッシュバック特典と最新情報を手に入れてください。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-white px-10 py-3 text-sm font-semibold text-[#f05972] transition hover:bg-white/90"
          >
            無料メンバー登録はこちら
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-white/80 px-10 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ブログで最新情報を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
