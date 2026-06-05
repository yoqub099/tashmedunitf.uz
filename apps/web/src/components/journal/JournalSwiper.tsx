"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { JournalIssue } from "@/types";
import JournalCard from "./JournalCard";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import "swiper/css";

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

interface JournalSwiperProps {
  issues: JournalIssue[];
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
}

export default function JournalSwiper({ issues, title, description, linkHref, linkLabel }: JournalSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { language } = useLanguageStore();

  if (issues.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 transition-all">
      {/* Header with title + nav arrows */}
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm sm:text-base md:text-xl leading-5 sm:leading-6 text-gray-900 font-bold flex-1">
          {title}
        </h4>

        <div className="flex items-center gap-2">
          {linkHref && linkLabel && (
            <a
              href={linkHref}
              className="text-sm font-medium text-[#00575B] hover:underline hidden sm:block mr-2"
            >
              {linkLabel}
            </a>
          )}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#00575B] text-[#00575B] flex items-center justify-center hover:bg-[#00575B] hover:text-white transition-colors shrink-0"
            aria-label={s("journal.prev", language)}
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#00575B] text-[#00575B] flex items-center justify-center hover:bg-[#00575B] hover:text-white transition-colors shrink-0"
            aria-label={s("journal.next", language)}
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-base font-normal pt-4 text-gray-600 leading-relaxed text-justify">
          {description}
        </p>
      )}

      {/* Mobile link */}
      {linkHref && linkLabel && (
        <a
          href={linkHref}
          className="text-sm font-medium text-[#00575B] hover:underline sm:hidden block pt-3"
        >
          {linkLabel}
        </a>
      )}

      {/* Swiper */}
      <div className="pt-6">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          spaceBetween={16}
          slidesPerView={2}
          loop={issues.length > 5}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {issues.map((issue) => (
            <SwiperSlide key={issue.id}>
              <JournalCard issue={issue} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
