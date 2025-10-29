import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
  description:
    "WIN×Ⅱは、保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォームです。300件以上の厳選サービスから最適な選択をサポートします。",
  keywords: [
    "キャッシュバック",
    "アフィリエイト",
    "保険相談",
    "不動産査定",
    "転職支援",
    "サブスクリプション",
    "お得",
    "WIN×Ⅱ",
  ],
  openGraph: {
    title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    description:
      "保険・不動産・転職・エンタメなど、300件以上の厳選サービスをご紹介。成果に応じたキャッシュバック付きの会員制プラットフォーム。",
    images: [
      {
        url: `${appUrl}/ogp.jpg`,
        width: 1200,
        height: 630,
        alt: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
      },
    ],
    type: "website",
    url: appUrl,
    siteName: "WIN×Ⅱ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    description:
      "保険・不動産・転職・エンタメなど、300件以上の厳選サービスをご紹介。成果に応じたキャッシュバック付き。",
    images: [`${appUrl}/ogp.jpg`],
  },
  alternates: {
    canonical: appUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

type ServiceFeature = {
  title: string;
  description: string;
  image: string;
};

type MeritPoint = {
  image: string;
  alt: string;
};

type AchievementCard = {
  image: string;
  alt: string;
};

type Testimonial = {
  image: string;
  name: string;
  description: string;
};

type Faq = {
  question: string;
  answer: string;
};

const serviceFeatures: ServiceFeature[] = [
  {
    title: "保険の無料相談",
    description: "ライフステージに合わせた最適な保険選びを無料でサポート。",
    image: "/assets/images/保険の無料相談.webp",
  },
  {
    title: "不動産査定サービス",
    description: "売却査定から住み替えまで、専門スタッフが丁寧に対応。",
    image: "/assets/images/不動産査定サービス.webp",
  },
  {
    title: "エンタメサブスク特集",
    description: "お得なサブスクリプション情報を厳選してご紹介。",
    image: "/assets/images/エンタメサブスク特集.webp",
  },
  {
    title: "転職支援サポート",
    description: "キャリアアップを目指す方に最適な転職支援サービスを提供。",
    image: "/assets/images/転職支援サポート.webp",
  },
];

const meritPoints: MeritPoint[] = [
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

const achievementCards: AchievementCard[] = [
  {
    image: "/assets/images/掲載ジャンル数.webp",
    alt: "掲載ジャンル数 20カテゴリー以上",
  },
  {
    image: "/assets/images/無料掲載サービス数.webp",
    alt: "無料掲載サービス数 500件以上",
  },
];

const testimonials: Testimonial[] = [
  {
    image: "/assets/images/comment-20-woman.webp",
    name: "20代・女性（会社員）",
    description:
      "複数のサービスを一度に比較できて、最適な保険が見つかりました。キャッシュバックも嬉しいです。",
  },
  {
    image: "/assets/images/comment-30-man.webp",
    name: "30代・男性（会社員）",
    description:
      "副業として活用していますが、アドバイスが丁寧で成果率が上がりました。情報量の多さが決め手です。",
  },
  {
    image: "/assets/images/comment-40-woman.webp",
    name: "40代・女性（自営業）",
    description:
      "住み替え相談で利用しましたが、担当者のレスポンスが非常に早く安心して任せられました。",
  },
  {
    image: "/assets/images/comment-50-man.webp",
    name: "50代・男性（自営業）",
    description:
      "いろんなサービスを検討できて、ここだけで完結できるのが便利！",
  },
];

const faqList: Faq[] = [
  {
    question: "掲載するのに費用はかかりますか？",
    answer: "はい、掲載は完全無料です。安心してサービスをご利用ください。",
  },
  {
    question: "どんなサービスが掲載されていますか？",
    answer:
      "保険・不動産・エンタメ・転職など、暮らしのお悩みを解決する多彩なジャンルのサービスを掲載しています。",
  },
  {
    question: "スマートフォンでも利用できますか？",
    answer:
      "もちろんです。PC・スマートフォン・タブレットのすべてに最適化されています。",
  },
];

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WIN×Ⅱ",
    url: appUrl,
    logo: `${appUrl}/assets/win2/logo.webp`,
    description:
      "保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォーム",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["Japanese"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WIN×Ⅱ",
    url: appUrl,
    description:
      "キャッシュバック付きアフィリエイトブログプラットフォーム",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${appUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <main className="bg-[#f8f5f2] text-slate-900">
        <HeroSection />
        <ProblemSection />
        <ServiceIntroSection />
        <MeritSection />
        <HighlightSection />
        <AchievementSection />
        <FreeSection />
        <TestimonialsSection />
        <FaqSection />
        <BottomCtaSection />
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#fff7f2] to-[#fdeee3] py-20">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/office-super-blur.webp"
          alt="背景イメージ"
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col-reverse gap-12 px-4 md:flex-row md:items-center md:px-6 lg:px-8">
        <div className="max-w-xl space-y-8">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-orange-500">WIN×Ⅱ</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              暮らしをもっとお得に、
              <br />
              もっとスマートに。
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
              WIN×Ⅱは暮らしを支えるサービスをワンストップで選べるキャッシュバック付きプラットフォームです。掲載ジャンルは保険・不動産・エンタメ・転職など多彩。専門スタッフがあなたの暮らしをアップデートします。
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <StatPill image="/assets/images/掲載ジャンル数30以上.webp" alt="掲載ジャンル数30以上" />
            <StatPill image="/assets/images/無料掲載サービス数.webp" alt="無料掲載サービス数500以上" />
            <StatPill image="/assets/images/win2-is-.webp" alt="最短5日で成果反映" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#f05972] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f05972]/30 transition hover:bg-[#d44760]"
            >
              メンバー登録を無料ではじめる
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#f05972] px-8 py-3 text-sm font-semibold text-[#f05972] transition hover:bg-[#fef0f3]"
            >
              ログイン
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <Image
            src="/assets/images/woman.webp"
            alt="メインビジュアル"
            width={520}
            height={600}
            className="w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function StatPill({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="flex h-24 min-w-[140px] flex-1 items-center justify-center rounded-full bg-white/80 px-6 shadow-md">
      <Image src={image} alt={alt} width={160} height={80} className="h-16 w-auto object-contain" />
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="relative bg-white py-24">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/problem-opacity-white.webp"
          alt="背景"
          fill
          className="object-cover opacity-80"
        />
      </div>
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 px-4 text-center md:px-6 lg:px-8">
        <Image
          src="/assets/images/problems.webp"
          alt="こんなお悩みありませんか？"
          width={760}
          height={360}
          className="w-full max-w-3xl object-contain"
        />
        <div className="rounded-full bg-[#f05972] px-10 py-3 text-sm font-semibold text-white shadow-md">
          そんな時こそ WIN×Ⅱ の出番です！
        </div>
        <Link
          href="/register"
          className="rounded-full bg-[#f05972] px-12 py-3 text-sm font-semibold text-white shadow-md shadow-[#f05972]/20 transition hover:bg-[#d44760]"
        >
          メンバー登録でお得な情報を受け取る
        </Link>
      </div>
    </section>
  );
}

function ServiceIntroSection() {
  return (
    <section className="bg-[#fffaf4] py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-4 text-center md:px-6 lg:px-8">
        <Image
          src="/assets/images/win2-is.webp"
          alt="WIN×Ⅱはどんなサービス？"
          width={720}
          height={420}
          className="w-full max-w-4xl object-contain"
        />
        <div className="grid gap-6 md:grid-cols-4">
          {["各種保険", "不動産", "エンタメ", "転職"].map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-orange-500 shadow-[0_10px_25px_rgba(255,165,118,0.25)]"
            >
              {item}
            </div>
          ))}
        </div>
        <Image
          src="/assets/images/ワンストップwin2.webp"
          alt="ワンストップ"
          width={720}
          height={340}
          className="w-full max-w-3xl object-contain"
        />
      </div>
    </section>
  );
}

function MeritSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#f48a3c] md:text-4xl">WIN×Ⅱでのメリット</h2>
          <p className="mt-4 text-sm text-slate-600 md:text-base">
            暮らしを変えるヒントが一つに集まる。WIN×Ⅱだからできる3つのポイントをご紹介します。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {meritPoints.map((point) => (
            <div
              key={point.alt}
              className="rounded-[32px] bg-gradient-to-b from-white to-[#fdf5ef] p-6 shadow-[0_12px_30px_rgba(255,180,140,0.2)]"
            >
              <Image
                src={point.image}
                alt={point.alt}
                width={280}
                height={320}
                className="mx-auto w-full max-w-[240px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightSection() {
  return (
    <section className="bg-[#f0f6fb] py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">
            掲載サービス・活用シーン
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">暮らしを変える多彩なサービス</h2>
          <p className="mt-4 text-sm text-slate-600 md:text-base">
            生活のあらゆるシーンで活用できるサービスを厳選して掲載。WIN×Ⅱなら、お得な情報が一目で見つかります。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {serviceFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex h-full flex-col rounded-[32px] bg-white/70 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.08)] backdrop-blur"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={320}
                height={220}
                className="mb-5 w-full object-contain"
              />
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-[#f05972] px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f05972]/20 transition hover:bg-[#d44760]"
          >
            メンバー登録で最新情報を受け取る
          </Link>
        </div>
      </div>
    </section>
  );
}

function AchievementSection() {
  return (
    <section className="bg-[#fffaf4] py-24">
      <div className="mx-auto max-w-5xl space-y-12 px-4 text-center md:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#f48a3c] md:text-4xl">実績・掲載数</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {achievementCards.map((card) => (
            <div
              key={card.alt}
              className="rounded-[32px] bg-white px-6 py-10 shadow-[0_15px_35px_rgba(255,180,140,0.25)]"
            >
              <Image
                src={card.image}
                alt={card.alt}
                width={320}
                height={280}
                className="mx-auto w-full max-w-[260px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FreeSection() {
  return (
    <section className="bg-gradient-to-b from-[#f9f9f9] via-white to-[#f9f9f9] py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center md:px-6">
        <h2 className="text-2xl font-bold text-[#f05972] md:text-3xl">ご利用料金はすべて無料！</h2>
        <p className="text-sm leading-relaxed text-slate-600 md:text-base">
          WIN×Ⅱは、紹介するサービスの成果報酬の一部を還元することで、掲載企業・利用者ともにメリットある仕組みを提供しています。ご利用に際して追加の費用は一切発生いたしません。
        </p>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">ご利用者様の声</h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            WIN×Ⅱをご利用いただいた皆さまから、たくさんのお喜びの声をいただいています。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex gap-4 rounded-[24px] bg-[#f6f6f6] p-6 shadow-[0_10px_25px_rgba(0,0,0,0.05)]"
            >
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={80}
                height={80}
                className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
              />
              <div className="space-y-2 text-left">
                <p className="text-sm leading-relaxed text-slate-700">{testimonial.description}</p>
                <p className="text-xs font-semibold text-slate-500">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="bg-[#fff7f0] py-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">よくあるご質問</h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            WIN×Ⅱに寄せられるご質問を Q&A 形式でまとめました。ご不明点があればお気軽にお問い合わせください。
          </p>
        </div>
        <div className="space-y-6">
          {faqList.map((faq, index) => (
            <div
              key={faq.question}
              className="flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.05)] md:flex-row md:items-start"
            >
              <div className="flex items-start gap-3">
                <Image src="/assets/images/q.webp" alt="Q" width={36} height={36} />
                <div>
                  <p className="font-semibold text-slate-900">{faq.question}</p>
                  <div className="mt-3 flex items-start gap-3 text-sm text-slate-600 md:text-base">
                    <Image src="/assets/win2/icon.webp" alt="A" width={32} height={32} />
                    <span>{faq.answer}</span>
                  </div>
                </div>
              </div>
              <div className="hidden h-full w-px bg-slate-100 md:block" />
              <span className="mt-2 self-start rounded-full bg-[#fef3eb] px-4 py-1 text-xs font-semibold text-orange-500 md:mt-0">
                Q{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCtaSection() {
  return (
    <section className="bg-gradient-to-r from-[#f05972] to-[#f48a3c] py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center text-white md:px-6">
        <h2 className="text-3xl font-bold md:text-4xl">いますぐ WIN×Ⅱ をはじめましょう</h2>
        <p className="text-sm leading-relaxed text-white/90 md:text-base">
          暮らしをもっとお得に、もっとスマートに。WIN×Ⅱの無料メンバー登録で最新情報とキャッシュバック特典を手に入れてください。
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
            className="rounded-full border border-white/70 px-10 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ブログで最新情報を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
