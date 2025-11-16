"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { serviceCategories } from "../landing-data";

export function ServiceSection() {
  const { ref: videoContainerRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  useEffect(() => {
    if (isVideoError || hasPlayed || !isVisible) return;

    const videoNode = videoRef.current;
    if (!videoNode) return;

    void videoNode
      .play()
      .then(() => setHasPlayed(true))
      .catch(() => {
        const fallbackTime = Number.isFinite(videoNode.duration) ? videoNode.duration : 0;
        videoNode.currentTime = fallbackTime;
        setHasPlayed(true);
      });
  }, [hasPlayed, isVideoError, isVisible]);

  useEffect(() => {
    if (isVideoError) return;

    const videoNode = videoRef.current;
    if (!videoNode) return;

    const handleEnded = () => {
      videoNode.pause();
      const endTime = Number.isFinite(videoNode.duration) ? videoNode.duration : 0;
      videoNode.currentTime = endTime;
    };

    videoNode.addEventListener("ended", handleEnded);
    return () => {
      videoNode.removeEventListener("ended", handleEnded);
    };
  }, [isVideoError]);

  return (
    <section className="bg-win2-surface-cream-50 py-24">
      <div className="mx-auto max-w-[1080px] px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-4">
          <Image
            src="/assets/images/win2-is-bubble.webp"
            alt="WIN×Ⅱは"
            width={180}
            height={180}
            className="h-28 w-28 shrink-0 object-contain md:h-32 md:w-32 lg:h-36 lg:w-36"
            priority
          />
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            どんな<span className="text-win2-primary-orage">サービス</span>？
          </h2>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {serviceCategories.map((category) => (
            <div
              key={category}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-win2-primary-orage shadow-[0_12px_30px_rgba(242,111,54,0.18)]"
            >
              {category}
            </div>
          ))}
        </div>
        <div className="relative mx-auto w-full max-w-[900px] pt-16 sm:pt-20 lg:pt-24">
          <div
            ref={videoContainerRef}
            className="overflow-hidden rounded-[32px] bg-win2-surface-cream-50"
          >
            {isVideoError ? (
              <Image
                src="/assets/images/onestop-figure.webp"
                alt="暮らしを支える4つのカテゴリ"
                width={720}
                height={540}
                className="w-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                className="block w-full object-cover min-h-[220px] sm:min-h-[320px] md:min-h-[520px]"
                playsInline
                preload="metadata"
                muted
                loop={false}
                controls={false}
                aria-label="WIN×Ⅱのサービス紹介"
                poster="/assets/images/onestop-figure.webp"
                onError={() => setIsVideoError(true)}
                suppressHydrationWarning
              >
                <source src="/assets/images/what-is-win2.webm" type="video/webm" />
                <img
                  src="/assets/images/onestop-figure.webp"
                  alt="暮らしを支える4つのカテゴリ"
                  className="block w-full object-contain"
                />
              </video>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
