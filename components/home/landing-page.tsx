"use client";

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
    title: "保険の無料相談",
    description: "ライフステージに合わせた最適な保険プランをご提案します。",
    image: "/assets/images/保険の無料相談.webp",
  },
  {
    title: "不動産査定サービス",
    description: "売却・住み替えまで専門スタッフがしっかりサポートします。",
    image: "/assets/images/不動産査定サービス.webp",
  },
  {
    title: "エンタメサブスク特集",
    description: "動画配信・音楽など、お得なサブスク情報を厳選してお届け。",
    image: "/assets/images/エンタメサブスク特集.webp",
  },
  {
    title: "転職支援サポート",
    description: "キャリアアップを目指す方に最適な求人とノウハウをご紹介。",
    image: "/assets/images/転職支援サポート.webp",
  },
];

const meritImages = [
  {
    image: "/assets/images/point1.webp",
    alt: "POINT01 保険・不動産など多彩なジャンルに対応",
  },
  {
    image: "/assets/images/point2.webp",
    alt: "POINT02 成果報酬型のキャッシュバック",
  },
  {
    image: "/assets/images/point3.webp",
    alt: "POINT03 専門家によるサポート",
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
    image: "/assets/images/comment-20-woman.webp",
    alt: "20代女性の声",
  },
  {
    image: "/assets/images/comment-30-man.webp",
    alt: "30代男性の声",
  },
  {
    image: "/assets/images/comment-40-woman.webp",
    alt: "40代女性の声",
  },
  {
    image: "/assets/images/comment-50-man.webp",
    alt: "50代男性の声",
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
    <section className="relative bg-white py-24">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/problem.webp"
          alt="背景テクスチャ"
          fill
          className="object-cover opacity-90"
        />
      </div>
      <div
        ref={ref}
        className={cn(
          "relative mx-auto flex max-w-[1000px] flex-col items-center gap-8 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <Image
          src="/assets/images/problems-paragraph.webp"
          alt="こんなお悩みありませんか？"
          width={900}
          height={500}
          className="w-full max-w-[850px] object-contain"
        />
        <Link
          href="/register"
          className="rounded-full bg-[#f05972] px-12 py-3 text-sm font-semibold text-white shadow-md shadow-[#f05972]/20 transition hover:bg-[#d9475e]"
        >
          メンバー登録でお得な情報を受け取る
        </Link>
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
          "mx-auto flex max-w-[1080px] flex-col items-center gap-10 px-6 text-center lg:px-8",
          "transition-transform-opacity",
          isVisible ? "reveal-visible" : "reveal"
        )}
      >
        <Image
          src="/assets/images/win2-is-bibble.webp"
          alt="WIN×Ⅱはどんなサービス？"
          width={980}
          height={520}
          className="w-full max-w-[880px] object-contain"
        />
        <div className="flex flex-wrap justify-center gap-4">
          {serviceCategories.map((category) => (
            <div
              key={category}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#f26f36] shadow-[0_12px_30px_rgba(242,111,54,0.18)]"
            >
              {category}
            </div>
          ))}
        </div>
        <Image
          src="/assets/images/ワンストップwin2.webp"
          alt="ワンストップで暮らしをサポート"
          width={720}
          height={420}
          className="w-full max-w-[540px] object-contain"
        />
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
          {meritImages.map((item) => (
            <div
              key={item.alt}
              className="rounded-[32px] bg-[#fffaf4] p-6 shadow-[0_18px_42px_rgba(244,138,60,0.22)]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                width={420}
                height={300}
                className="mx-auto w-full max-w-[320px] object-contain"
              />
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
            <div
              key={feature.title}
              className="flex h-full flex-col rounded-[28px] bg-white/90 p-6 text-left shadow-[0_16px_34px_rgba(0,0,0,0.1)] backdrop-blur"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={320}
                height={240}
                className="mb-4 w-full object-contain"
              />
              <h3 className="text-lg font-semibold text-[#1c1c1c]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
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
              key={`${testimonial.alt}-${index}`}
              className="rounded-[24px] bg-[#f8f8f8] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
            >
              <Image
                src={testimonial.image}
                alt={testimonial.alt}
                width={780}
                height={240}
                className="w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

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
        <div className="space-y-6 text-left">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className="rounded-[24px] bg-white p-6 shadow-[0_12px_26px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start gap-3">
                <Image src="/assets/images/question.webp" alt="Q" width={40} height={40} />
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#f26f36]">
                    Q{index + 1}. {item.question}
                  </p>
                  <div className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 md:text-base">
                    <Image src="/assets/images/answer.webp" alt="A" width={32} height={32} />
                    <span>{item.answer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
