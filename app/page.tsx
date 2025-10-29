import Image from "next/image";
import Link from "next/link";

type Stat = {
  label: string;
  value: string;
  description: string;
};

type SimpleCard = {
  title: string;
  description: string;
  icon?: string;
};

type Testimonial = {
  quote: string;
  name: string;
  attribute: string;
};

type Faq = {
  question: string;
  answer: string;
};

const heroStats: Stat[] = [
  {
    label: "掲載ジャンル数",
    value: "300カテゴリ",
    description: "生活・金融・キャリアなど多彩に網羅",
  },
  {
    label: "提携ASP数",
    value: "30社+",
    description: "大手ASPと直接連携して成果管理",
  },
  {
    label: "会員登録完了まで",
    value: "最短5分",
    description: "フォーム入力だけですぐ利用開始",
  },
];

const painPoints: SimpleCard[] = [
  {
    title: "日常の固定費がかさんでいる",
    description:
      "保険や通信費の見直しに興味はあっても、比較や申込が面倒で後回しにしていませんか？",
  },
  {
    title: "副業で成果が伸びない",
    description:
      "ブログやSNSでアフィリエイトに挑戦してみたものの、成果が安定しないと感じていませんか？",
  },
  {
    title: "情報がバラバラで判断しづらい",
    description:
      "お得なキャンペーンやキャッシュバック情報を探しても、結局どれがお得かわからないままになっていませんか？",
  },
];

const servicePillars: SimpleCard[] = [
  {
    title: "各種保険",
    description: "生命・医療・車まで専門アドバイザーが比較サポート。",
    icon: "➕",
  },
  {
    title: "不動産",
    description: "賃貸・マイホーム購入まで、条件に合わせた案件を紹介。",
    icon: "🏠",
  },
  {
    title: "エンタメ",
    description: "動画配信・サブスク・旅行など日常を楽しむお得情報をピックアップ。",
    icon: "🎬",
  },
  {
    title: "転職",
    description: "キャリアアップに直結する求人を厳選。成果に応じた特典付き。",
    icon: "💼",
  },
];

const serviceHighlights: SimpleCard[] = [
  {
    title: "専門スタッフによる案件選定",
    description:
      "審査済みの優良案件だけを掲載。日々更新される最新情報も見逃しません。",
  },
  {
    title: "成果状況をリアルタイム確認",
    description:
      "成果反映をダッシュボードで可視化。承認状況やキャッシュバック額も即座に把握できます。",
  },
  {
    title: "ワンクリックで申込管理",
    description:
      "WIN×Ⅱの専用リンクから申し込むだけ。成果の紐付けと支払管理をまとめて代行します。",
  },
  {
    title: "パートナー専用サポート",
    description:
      "掲載メディアや紹介パートナー向けに、集客施策やクリエイティブの相談窓口を設置しています。",
  },
];

const achievements: SimpleCard[] = [
  {
    title: "20カテゴリー以上",
    description: "ライフイベントごとに最適なサービスを整理しています。",
  },
  {
    title: "掲載案件500件+",
    description: "キャッシュバック対象の厳選案件を継続的に追加しています。",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "複数のサービスを一度に比較できて、最適な保険が見つかりました。キャッシュバックも嬉しいです。",
    name: "30代・女性",
    attribute: "会社員",
  },
  {
    quote:
      "副業として活用していますが、アドバイスが丁寧で成果率が上がりました。情報量の多さが決め手です。",
    name: "20代・男性",
    attribute: "Web制作フリーランス",
  },
  {
    quote:
      "住み替えの相談で利用しましたが、担当者のレスポンスが非常に早く安心して任せられました。",
    name: "40代・女性",
    attribute: "自営業",
  },
];

const faqs: Faq[] = [
  {
    question: "登録すると料金は発生しますか？",
    answer:
      "すべて無料でご利用いただけます。成果報酬の一部をキャッシュバックとして還元しています。",
  },
  {
    question: "どのような案件が掲載されていますか？",
    answer:
      "保険・金融・不動産・転職・生活サービスなど、暮らしに役立つジャンルを中心に掲載しています。",
  },
  {
    question: "スマートフォンからでも利用できますか？",
    answer:
      "もちろんです。スマートフォン・タブレット・PC いずれの環境でも快適にお使いいただけます。",
  },
];

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <header className="text-center space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
        {subtitle}
      </p>
      <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h2>
    </header>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="space-y-2 rounded-2xl border border-orange-100 bg-white/90 p-6 text-center shadow-sm">
      <p className="text-sm font-semibold text-orange-500">{stat.label}</p>
      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
      <p className="text-sm text-slate-600">{stat.description}</p>
    </div>
  );
}

function PillarCard({ card }: { card: SimpleCard }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 p-6 text-center shadow-sm ring-1 ring-slate-100">
      {card.icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
          <span aria-hidden>{card.icon}</span>
        </div>
      ) : null}
      <p className="text-lg font-semibold text-slate-900">{card.title}</p>
      <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
    </div>
  );
}

function HighlightCard({ card }: { card: SimpleCard }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-lg font-semibold text-slate-900">{card.title}</p>
      <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
    </div>
  );
}

function AchievementCard({ card }: { card: SimpleCard }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
      <p className="text-3xl font-bold text-orange-500">{card.title}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <blockquote className="text-sm leading-relaxed text-slate-700">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-4 text-right text-xs font-medium text-slate-500">
        {testimonial.name}（{testimonial.attribute}）
      </figcaption>
    </figure>
  );
}

function FaqCard({ faq }: { faq: Faq }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm font-semibold text-orange-500">Q. {faq.question}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">A. {faq.answer}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 md:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6 py-14 shadow-lg md:px-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-orange-500 shadow-sm">
                Win×Ⅱ Official
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                暮らしをもっとお得に、もっとスマートに。
              </h1>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                WIN×Ⅱは生活を豊かにするサービスをワンストップで選べるキャッシュバック型プラットフォームです。提携ASPと連携した成果管理で、あなたの暮らしをアップデートします。
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                >
                  無料メンバー登録をはじめる
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-orange-400 px-6 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
                >
                  ログイン
                </Link>
              </div>
              <div className="grid gap-4 pt-6 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </div>
            </div>
            <div className="relative mx-auto max-w-md rounded-[32px] bg-white/70 p-6 shadow-xl backdrop-blur">
              <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 to-orange-200">
                <Image
                  src="/assets/win2/icon.webp"
                  alt="WIN×Ⅱロゴ"
                  width={280}
                  height={280}
                  className="h-36 w-36 md:h-48 md:w-48"
                />
              </div>
              <p className="mt-4 text-center text-sm text-slate-500">
                ※ 画像はイメージです。正式なビジュアルは順次追加予定です。
              </p>
            </div>
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <SectionTitle subtitle="Challenges" title="こんなお悩み、ありませんか？" />
          <div className="grid gap-6 md:grid-cols-3">
            {painPoints.map((card) => (
              <div key={card.title} className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <p className="text-lg font-semibold text-slate-900">{card.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-10 text-center text-white shadow-lg md:px-12">
            <h3 className="text-2xl font-semibold md:text-3xl">その悩み、WIN×Ⅱが解決します！</h3>
            <p className="mt-3 text-sm md:text-base">
              キャッシュバック・情報提供・専門家サポートを組み合わせた新しい暮らし支援サービスです。
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-100"
            >
              メンバー登録で特典を受け取る
            </Link>
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <SectionTitle subtitle="Services" title="WIN×Ⅱはこんなサービスです" />
          <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-slate-600 md:text-base">
            保険・不動産・エンタメ・転職の4カテゴリを中心に、生活をアップデートする情報をワンストップでご提供します。各カテゴリで専任スタッフが案件を厳選し、成果につながる導線を設計しています。
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {servicePillars.map((pillar) => (
              <PillarCard key={pillar.title} card={pillar} />
            ))}
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <SectionTitle subtitle="Merits" title="暮らしを変える多彩なメリット" />
          <div className="grid gap-6 md:grid-cols-2">
            {serviceHighlights.map((highlight) => (
              <HighlightCard key={highlight.title} card={highlight} />
            ))}
          </div>
          <div className="rounded-3xl bg-orange-50 px-6 py-10 text-center md:px-12">
            <p className="text-lg font-semibold text-orange-500 md:text-xl">
              掲載サービス・活用シーンは今後も拡大予定！
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              WIN×Ⅱなら暮らしに必要な情報をまとめてチェックし、成果とキャッシュバックを逃しません。
            </p>
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <SectionTitle subtitle="Achievements" title="WIN×Ⅱの実績" />
          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((item) => (
              <AchievementCard key={item.title} card={item} />
            ))}
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-10 text-center text-white md:px-12">
            <p className="text-lg font-semibold md:text-xl">
              ご利用料金はすべて無料。成果が発生した際も追加費用は一切かかりません。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              成果報酬のうち一定割合をキャッシュバックとして還元。安心して継続利用いただけます。
            </p>
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <SectionTitle subtitle="Voices" title="ご利用者様の声" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <TestimonialCard key={`${item.name}-${index}`} testimonial={item} />
            ))}
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <SectionTitle subtitle="FAQ" title="よくある質問" />
          <div className="grid gap-6 md:grid-cols-3">
            {faqs.map((faq, index) => (
              <FaqCard key={`${faq.question}-${index}`} faq={faq} />
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-500 px-6 py-12 text-center text-white shadow-lg md:px-12">
          <h2 className="text-3xl font-bold md:text-4xl">いますぐ、暮らしをアップデートしませんか？</h2>
          <p className="mt-4 text-sm leading-relaxed md:text-base">
            WIN×Ⅱの会員登録は無料。提携ASPとの連携で安心・安全に成果とキャッシュバックを受け取れます。
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-500 transition hover:bg-orange-100"
            >
              無料メンバー登録はこちら
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ログイン
            </Link>
          </div>
        </section>
      </div>
      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-center text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} WIN×Ⅱ. All rights reserved.</p>
          <nav className="flex flex-wrap justify-center gap-4">
            <Link href="/blog" className="transition hover:text-orange-500">
              ブログ
            </Link>
            <Link href="/register" className="transition hover:text-orange-500">
              新規登録
            </Link>
            <Link href="/login" className="transition hover:text-orange-500">
              ログイン
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
