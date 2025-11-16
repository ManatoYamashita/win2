"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { faqItems } from "../landing-data";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-win2-surface-cream-300 py-24">
      <div className="mx-auto max-w-[960px] space-y-10 px-6 text-center lg:px-8">
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
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-start gap-3 p-6 text-left transition-colors hover:bg-win2-surface-cream-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-win2-primary-orage to-win2-accent-amber text-base font-bold text-white shadow-md">
                    Q
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-win2-primary-orage md:text-base">
                      {item.question}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "shrink-0 text-win2-primary-orage transition-transform duration-300",
                      isOpen ? "rotate-180" : ""
                    )}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="border-t border-slate-200 bg-gradient-to-br from-[#fafafa] to-white px-6 pb-6 pt-4">
                    <div className="flex items-start gap-3">
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
