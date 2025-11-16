"use client";

import Link from "next/link";
import { CtaResolver } from "../types";

interface BottomCtaSectionProps {
  resolveCta: CtaResolver;
}

export function BottomCtaSection({ resolveCta }: BottomCtaSectionProps) {
  return (
    <section className="bg-gradient-to-r from-win2-accent-rose to-win2-accent-amber py-16">
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-5 px-6 text-center text-white lg:px-8">
        <h2 className="text-3xl font-bold md:text-4xl">いますぐ WIN×Ⅱ をはじめましょう</h2>
        <p className="text-sm leading-relaxed text-white/90 md:text-base">
          暮らしをもっとお得に、もっとスマートに。WIN×Ⅱの無料メルマガ会員登録でキャッシュバック特典と最新情報を手に入れてください。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {(() => {
            const bottomCta = resolveCta("無料メルマガ会員登録はこちら");
            return (
              <Link
                href={bottomCta.href}
                className="rounded-full bg-white px-10 py-3 text-sm font-semibold text-win2-accent-rose transition hover:bg-white/90"
              >
                {bottomCta.label}
              </Link>
            );
          })()}
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
