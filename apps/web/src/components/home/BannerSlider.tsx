"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "@/components/shared/LocaleLink";
import type { Banner } from "@/types";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  banners: Banner[];
}

export default function BannerSlider({ banners }: Props) {
  const { language } = useLanguageStore();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Bannerlar o'zgarganda current ni chegarada saqlash
  useEffect(() => {
    setCurrent((prev) => (banners.length > 0 ? prev % banners.length : 0));
  }, [banners.length]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered, banners.length]);

  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 to-blue-900">
        <div className="flex items-center justify-center p-6 h-48 sm:h-64 md:h-80 lg:h-[370px]">
          <p className="text-lg font-bold text-white sm:text-xl">{s("banner.no_image", language)}</p>
        </div>
      </div>
    );
  }

  const banner = banners[current];

  if (!banner) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 to-blue-900">
        <div className="flex items-center justify-center p-6 h-48 sm:h-64 md:h-80 lg:h-[370px]">
          <p className="text-lg font-bold text-white sm:text-xl">{s("banner.loading", language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden rounded-3xl">
        {banner.image ? (
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[370px] rounded-3xl overflow-hidden">
            <Image
              src={banner.image}
              alt={t(banner.title, language) || `${s("banner.slide_label", language)} ${current + 1}`}
              fill
              className="object-cover transition-transform duration-700"
              priority={current === 0}
              sizes="100vw"
            />
          </div>
        ) : (
          <div className="flex w-full items-center justify-center rounded-3xl bg-linear-to-br from-blue-700 to-blue-900 p-6 h-48 sm:h-64 md:h-80 lg:h-[370px]">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{t(banner.title, language)}</p>
              <p className="mt-2 text-white/80">{t(banner.subtitle, language)}</p>
            </div>
          </div>
        )}

        {/* Clickable overlay */}
        {banner.link && (
          <Link
            href={banner.link}
            className="absolute inset-0 z-10"
            aria-label={t(banner.title, language) || s("banner.slide_label", language)}
          />
        )}

        {/* Bottom-right badge */}
        {banner.link && (
          <span className="absolute bottom-3 right-3 z-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm sm:bottom-4 sm:right-4 sm:px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            tdtutf.uz
          </span>
        )}
      </div>

      {/* Nav arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
            aria-label={s("journal.prev", language)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
            aria-label={s("journal.next", language)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`${s("banner.go_to_slide", language)} ${idx + 1}`}
              aria-current={idx === current ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
