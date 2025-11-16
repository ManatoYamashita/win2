"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayState, setDisplayState] = useState<'loading' | 'visible'>('loading');
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    // 初回ロード時は即座に表示（LCP改善のため）
    if (isFirstLoadRef.current) {
      setDisplayState('visible');
      isFirstLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    // pathname 変更時のトランジション（初回ロード時はスキップ）
    if (!isFirstLoadRef.current) {
      setDisplayState('loading');
      const timer = window.setTimeout(() => setDisplayState('visible'), 450);
      return () => window.clearTimeout(timer);
    }
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
