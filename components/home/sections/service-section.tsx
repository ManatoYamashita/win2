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
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldPlay(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVideoError || hasPlayed || !shouldPlay) return;

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
  }, [hasPlayed, isVideoError, shouldPlay]);

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
        <div className="grid gap-12 lg:gap-16 md:grid-cols-2 md:items-start">
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center gap-6 text-center md:items-start md:text-left">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-win2-primary-orage">
                  ONE STOP PLATFORM
                </p>
                <h2 className="mt-2 text-3xl font-bold md:text-4xl lg:text-5xl">
                  WIN×Ⅱってどんな<span className="text-win2-primary-orage">サービス</span>？
                </h2>
                <p className="mt-4 text-base text-slate-600">
                  暮らしに必要な情報をワンストップでキャッチアップ。サービス比較、キャッシュバック情報、特典を一つのダッシュボードで管理できます。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {serviceCategories.map((category) => (
                <div
                  key={category}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-win2-primary-orage shadow-[0_12px_30px_rgba(242,111,54,0.18)]"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] md:ml-auto md:max-w-[540px]">
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
                <div className="relative">
                  {!isVideoReady && (
                    <Image
                      src="/assets/images/onestop-figure.webp"
                      alt="暮らしを支える4つのカテゴリ"
                      width={720}
                      height={540}
                      className="absolute inset-0 z-10 h-full w-full object-cover"
                    />
                  )}
                  <video
                    ref={videoRef}
                    className="block w-full rounded-[28px] object-cover"
                    playsInline
                    preload="metadata"
                    muted
                    loop={false}
                    controls={false}
                    aria-label="WIN×Ⅱのサービス紹介"
                    poster="/assets/images/onestop-figure.webp"
                    onLoadedData={() => setIsVideoReady(true)}
                    onCanPlay={() => setIsVideoReady(true)}
                    onError={() => setIsVideoError(true)}
                    suppressHydrationWarning
                    style={{ opacity: isVideoReady ? 1 : 0, transition: "opacity 300ms ease" }}
                  >
                    <source src="/assets/images/what-is-win2.webm" type="video/webm" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/images/onestop-figure.webp"
                      alt="暮らしを支える4つのカテゴリ"
                      className="block w-full object-contain"
                    />
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
