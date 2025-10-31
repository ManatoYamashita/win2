"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayState, setDisplayState] = useState<'loading' | 'visible'>('loading');

  useEffect(() => {
    // 初回ロード時のフェードイン
    const timer = window.setTimeout(() => setDisplayState('visible'), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // pathname 変更時のトランジション
    setDisplayState('loading');
    const timer = window.setTimeout(() => setDisplayState('visible'), 450);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const isLoading = displayState === 'loading';

  return (
    <div className="relative min-h-screen">
      {/* 白いオーバーレイ - ページ遷移時に表示 */}
      <div
        className={`pointer-events-none fixed inset-0 z-[70] bg-white transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* ページコンテンツ - ローディング中は非表示 */}
      <div
        className={`relative flex min-h-screen flex-col transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
