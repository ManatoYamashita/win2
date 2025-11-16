"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { CtaResolver } from "../types";

interface IntroductionBoxSectionProps {
  resolveCta: CtaResolver;
}

export function IntroductionBoxSection({ resolveCta }: IntroductionBoxSectionProps) {
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
        <div className="relative rounded-[40px] border-4 border-win2-primary-orage bg-white p-8 shadow-[0_20px_50px_rgba(242,111,54,0.2)] md:p-10">
          <div className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 rotate-45 border-l-4 border-t-4 border-win2-primary-orage bg-white" />

          <div className="relative z-10 space-y-4 text-center">
            <p className="text-base leading-relaxed md:text-lg">保険・不動産・転職・エンタメなど</p>
            <p className="text-base leading-relaxed md:text-lg">
              暮らしに関わる
              <span className="font-bold text-win2-primary-orage">多彩な情報を1つのサイトでまとめて比較・検討</span>
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              できるから、「知らなかった」で損する前に、
              <span className="font-bold text-win2-primary-orage">最適な選択肢が見つかります！</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          {(() => {
            const introductionCta = resolveCta("メルマガ会員登録はこちら");
            return (
              <Link
                href={introductionCta.href}
                className="inline-block rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-12 py-4 text-base font-bold text-white shadow-lg shadow-win2-accent-rose/30 transition hover:opacity-90 md:text-lg"
              >
                {introductionCta.label}
              </Link>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
