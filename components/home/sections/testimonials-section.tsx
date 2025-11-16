"use client";

import Image from "next/image";
import { testimonials } from "../landing-data";

export function TestimonialsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1080px] space-y-10 px-6 text-center lg:px-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold md:text-4xl">ご利用者様の声</h2>
          <p className="text-sm text-slate-600 md:text-base">
            WIN×Ⅱをご利用いただいた皆さまからのお声を一部ご紹介します。
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.age}-${testimonial.gender}-${index}`}
              className="group relative rounded-[24px] bg-gradient-to-br from-win2-surface-cream-320 to-white p-6 text-left shadow-[0_12px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="absolute top-4 left-4 text-6xl font-serif text-win2-primary-orage/20">&ldquo;</div>

              <div className="relative mb-4 flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-md ring-2 ring-win2-primary-orage/20">
                  <Image
                    src={testimonial.avatar}
                    alt={`${testimonial.age} ${testimonial.gender}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="inline-block rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-accent-amber px-3 py-1 text-xs font-semibold text-white">
                    {testimonial.age} {testimonial.gender}
                  </div>
                  <div className="mt-1 text-sm">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-[#ffd700]">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="relative z-10 text-sm leading-relaxed text-slate-700 md:text-base">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
