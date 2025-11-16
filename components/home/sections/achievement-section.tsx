"use client";

import Image from "next/image";
import { achievementImages } from "../landing-data";

export function AchievementSection() {
  return (
    <section className="bg-win2-surface-cream-50 py-24">
      <div className="mx-auto max-w-[960px] space-y-12 px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold text-win2-accent-amber md:text-4xl">実績・掲載数</h2>
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
