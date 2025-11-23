"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "WIN×Ⅱとは何ですか？",
    answer:
      "WIN×Ⅱは、保険・不動産・転職・エンタメなど、暮らしに役立つサービスをワンストップで選べるアフィリエイトブログプラットフォームです。300件以上のサービスをご紹介しています。",
  },
  {
    question: "掲載するのに費用はかかりますか？",
    answer:
      "掲載は完全無料です。会員登録も無料で、登録後すぐに豊富なジャンルから、あなたにぴったりのサービスを見つけることができます。",
  },
  {
    question: "どんなサービスが掲載されていますか？",
    answer:
      "保険相談、不動産査定、転職支援、エンタメ（動画配信、音楽配信）、サブスクリプションサービスなど、暮らしに役立つサービスを幅広く掲載しています。すべてのサービスは厳選されており、信頼できる企業のものです。",
  },
  {
    question: "スマートフォンでも利用できますか？",
    answer:
      "はい、WIN×Ⅱはレスポンシブデザインに対応しており、スマートフォン・タブレット・PC のいずれでも快適にご利用いただけます。外出先でも簡単にサービスを比較・検討できます。",
  },
  {
    question: "会員登録に必要な情報は何ですか？",
    answer:
      "会員登録には、メールアドレス、パスワード、お名前、生年月日、郵便番号、電話番号が必要です。すべて無料で登録でき、わずか3分で完了します。",
  },
  {
    question: "退会はできますか？",
    answer:
      "はい、いつでも退会いただけます。マイページの設定から退会手続きを行うことができます。退会後も、過去の申込履歴は一定期間保持されます。",
  },
  {
    question: "個人情報は安全ですか？",
    answer:
      "WIN×Ⅱでは、お客様の個人情報を厳重に管理しています。SSL暗号化通信を使用し、プライバシーポリシーに基づいて適切に取り扱っています。第三者に無断で提供することは一切ありません。",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQPage JSON-LD schema for rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD structured data for SEO rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-win2-surface-cream-50 via-white to-win2-surface-cream-100 py-16">
        <div className="mx-auto max-w-[960px] space-y-12 px-6 lg:px-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold text-win2-neutral-950 md:text-5xl">
              よくある質問
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              WIN×Ⅱのサービスに関するよくある質問と回答をまとめています。
              <br />
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_26px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_18px_36px_rgba(0,0,0,0.14)]"
                >
                  {/* Question (clickable) */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-start gap-3 p-6 text-left transition-colors hover:bg-win2-surface-cream-50"
                    aria-expanded={isOpen ? "true" : "false"}
                    aria-controls={`faq-answer-${index}`}
                  >
                    {/* Q Badge */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-win2-primary-orage to-win2-accent-amber text-base font-bold text-white shadow-md">
                      Q
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-win2-primary-orage md:text-base">
                        {item.question}
                      </p>
                    </div>
                    {/* Toggle icon */}
                    <div
                      className={cn(
                        "shrink-0 text-win2-primary-orage transition-transform duration-300",
                        isOpen ? "rotate-180" : ""
                      )}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Answer (accordion) */}
                  <div
                    id={`faq-answer-${index}`}
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="border-t border-slate-200 bg-gradient-to-br from-[#fafafa] to-white px-6 pb-6 pt-4">
                      <div className="flex items-start gap-3">
                        {/* A Badge */}
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

          {/* CTA Section */}
          <div className="mt-16 space-y-6 rounded-[32px] bg-gradient-to-r from-win2-accent-rose to-win2-accent-amber p-8 text-center text-white shadow-[0_20px_50px_rgba(242,111,54,0.25)] md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">
              まだ解決しない問題がありますか？
            </h2>
            <p className="text-sm leading-relaxed text-white/90 md:text-base">
              お気軽にお問い合わせください。WIN×Ⅱサポートチームが丁寧にお答えいたします。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-10 py-3 text-sm font-semibold text-win2-accent-rose transition hover:bg-white/90"
              >
                無料メルマガ会員登録
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-white/80 px-10 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                ブログで情報を見る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
