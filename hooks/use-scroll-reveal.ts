"use client";

import { useEffect, useRef, useState } from "react";

type UseScrollRevealOptions = IntersectionObserverInit;

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options?: UseScrollRevealOptions
) {
  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return {
    ref: elementRef,
    isVisible,
  };
}
