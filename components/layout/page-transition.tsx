"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(true);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowOverlay(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    setShowOverlay(true);
    const timer = window.setTimeout(() => setShowOverlay(false), 450);
    return () => window.clearTimeout(timer);
  }, [pathname, isInitialRender]);

  return (
    <div className="relative min-h-screen">
      <div
        className={`pointer-events-none fixed inset-0 z-[70] bg-white transition-opacity duration-500 ${
          showOverlay ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative flex min-h-screen flex-col transition-opacity duration-500 ${
          showOverlay ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
