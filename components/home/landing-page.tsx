"use client";

import { useSession } from "next-auth/react";
import type { CategoryResponse } from "@/types/microcms";
import {
  AchievementSection,
  BottomCtaSection,
  FaqSection,
  HeroSection,
  HighlightSection,
  IntroductionBoxSection,
  LatestBlogsSection,
  MeritSection,
  ProblemSection,
  ServiceSection,
  TestimonialsSection,
} from "./sections";
import { CtaResolver } from "./types";

interface LandingPageProps {
  categories: CategoryResponse[];
}

export function LandingPage({ categories }: LandingPageProps) {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session);

  const resolveCta: CtaResolver = (defaultLabel) => ({
    href: isAuthenticated ? "/blog" : "/register",
    label: isAuthenticated ? "最新情報を見る" : defaultLabel,
  });

  return (
    <main className="bg-win2-surface-cream-100 text-slate-900">
      <HeroSection resolveCta={resolveCta} />
      <LatestBlogsSection />
      <ProblemSection />
      <IntroductionBoxSection resolveCta={resolveCta} />
      <ServiceSection />
      <MeritSection />
      <HighlightSection resolveCta={resolveCta} categories={categories} />
      <AchievementSection />
      <TestimonialsSection />
      <FaqSection />
      <BottomCtaSection resolveCta={resolveCta} />
    </main>
  );
}
