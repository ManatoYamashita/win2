"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="relative min-h-screen" aria-busy={isLoading}>
      {/* 白いオーバーレイ - ページ遷移時の視覚的フィードバック */}
      <div
        className={`fixed inset-0 z-[70] bg-white transition-opacity duration-500 ${
          isLoading ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full items-center justify-center">
          <div
            className={`transition-all duration-300 ${
              isLoading ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <Spinner size="md" label="ページを読み込んでいます…" />
          </div>
        </div>
      </div>
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
