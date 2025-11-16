"use client";

import Image from "next/image";
import { meritItems } from "../landing-data";

export function MeritSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1100px] space-y-12 px-6 text-center lg:px-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-win2-accent-amber md:text-4xl">WIN×Ⅱでのメリット</h2>
          <p className="text-sm text-slate-600 md:text-base">
            暮らしを変えるヒントが一つに集まる。WIN×Ⅱだからできる 3 つのポイントをご紹介します。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {meritItems.map((item) => (
            <div
              key={item.number}
              className="group relative overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_18px_42px_rgba(244,138,60,0.22)] transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_54px_rgba(244,138,60,0.32)]"
            >
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-win2-primary-orage/10 to-win2-accent-amber/10 blur-3xl" />

              <div className="relative mb-6 flex justify-center">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gradient-to-br from-win2-primary-orage to-win2-accent-amber text-xs font-bold text-white shadow-lg shadow-win2-primary-orage/30">
                  <span className="text-[10px] tracking-wider">POINT</span>
                  <span className="text-2xl">{item.number}</span>
                </div>
              </div>

              <div className="relative mb-6 flex justify-center">
                <div className="relative h-24 w-24">
                  <Image
                    src={item.image}
                    alt={`${item.title}のアイコン`}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="relative mb-4">
                <h3 className="text-center text-lg font-bold text-win2-primary-orage md:text-xl">
                  {item.title}
                </h3>
                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-win2-primary-orage to-win2-accent-amber" />
              </div>

              <p className="relative text-center text-sm leading-relaxed text-slate-700 md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
