"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "@/components/shared/LocaleLink";
import Image from "next/image";
import type { NewsItem } from "@/types";
import { t, formatDate, stripHtml } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Briefcase, MapPin, Clock, ChevronUp, ChevronRight } from "lucide-react";

function getSortOptions(lang: "uz" | "ru" | "en") {
  return [
    { value: "newest", label: s("career.sort_newest", lang) },
    { value: "oldest", label: s("career.sort_oldest", lang) },
  ];
}

type SortOrder = "newest" | "oldest";

/* ── Arrow icon ── */
function ArrowIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={20} width={20}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ── No-image placeholder ── */
function NoImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <Briefcase className="h-8 w-8 text-gray-400" />
    </div>
  );
}

/* ── Vacancy card ── */
const VacancyCard = memo(function VacancyCard({ item, lang }: { item: NewsItem; lang: "uz" | "ru" | "en" }) {
  const title = t(item.title, lang);
  const excerpt = stripHtml(t(item.excerpt, lang) || t(item.content, lang)).slice(0, 120);
  const { full } = formatDate(item.published_at);

  return (
    <Link
      href={`/yangiliklar/${item.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition-all hover:border-[#00575B]/30 hover:shadow-md sm:flex-row sm:gap-4 sm:p-4 md:p-5"
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
        {item.cover_thumbnail ? (
          <Image
            src={item.cover_thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        ) : (
          <NoImage />
        )}
      </div>
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h5 className="font-serif text-base font-semibold leading-snug text-gray-900 group-hover:text-[#00575B] sm:text-lg line-clamp-2">
            {title}
          </h5>
          {excerpt && (
            <p className="mt-1 hidden text-sm text-gray-500 sm:line-clamp-2">{excerpt}</p>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {full}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {s("career.city_termiz", lang)}
          </span>
        </div>
      </div>
      {/* Arrow */}
      <div className="hidden shrink-0 items-center text-gray-300 group-hover:text-[#00575B] sm:flex">
        <ArrowIcon />
      </div>
    </Link>
  );
});

/* ── Sidebar vacancy item ── */
const SidebarVacancy = memo(function SidebarVacancy({ item, lang }: { item: NewsItem; lang: "uz" | "ru" | "en" }) {
  const title = t(item.title, lang);
  const { day, month, year } = formatDate(item.published_at);

  return (
    <Link
      href={`/yangiliklar/${item.slug}`}
      className="group flex items-center gap-3 rounded-xl bg-white p-3 transition-all hover:shadow-sm md:p-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00575B]/10 text-[#00575B]">
        <Briefcase className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h6 className="text-sm font-semibold text-gray-900 group-hover:text-[#00575B] line-clamp-1">
          {title}
        </h6>
        <p className="mt-0.5 text-xs text-gray-400">
          {day} {month} {year}
        </p>
      </div>
      <ArrowIcon />
    </Link>
  );
});

/* ════════════════════════════════════════
   Main export
   ════════════════════════════════════════ */
interface CareerClientProps {
  vacancies: NewsItem[];
  latestVacancies: NewsItem[];
  totalVacancies: number;
}

const ITEMS_PER_PAGE = 10;

export default function CareerClient({ vacancies, latestVacancies, totalVacancies }: CareerClientProps) {
  const { language: lang } = useLanguageStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const SORT_OPTIONS = useMemo(() => getSortOptions(lang), [lang]);

  const sortedVacancies = useMemo(() => {
    const sorted = [...vacancies];
    if (sortOrder === "oldest") {
      sorted.reverse();
    }
    return sorted;
  }, [vacancies, sortOrder]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(sortedVacancies.length / ITEMS_PER_PAGE));
  const paginatedVacancies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedVacancies.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedVacancies, currentPage]);

  // Reset page when sort changes
  const handleSortChange = useCallback((value: string) => {
    setSortOrder(value as SortOrder);
    setCurrentPage(1);
  }, []);

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortOrder)?.label || s("career.sort_newest", lang);

  return (
    <>
      {/* ═══════════ Hero Section ═══════════ */}
      <section className="hero-section grid gap-6 lg:row-span-1 lg:grid-cols-3">
        {/* Left — Hero Banner */}
        <div className="flex flex-col lg:col-span-2">
          <div className="shine rounded-2xl p-4 md:p-6 lg:rounded-3xl flex grow flex-col bg-[url('/images/career-hero.svg')] bg-cover bg-no-repeat text-white lg:p-11! min-h-56 sm:min-h-0">
            <h2 className="font-serif text-lg font-semibold capitalize leading-tight sm:text-2xl md:text-[32px] lg:text-[40px]">
              {s("career.hero_title", lang)}
            </h2>
            <div className="mt-3 text-container text-sm sm:mt-4 sm:text-base">
              <p>{s("career.hero_desc_1", lang)}</p>
              <p className="mt-3">{s("career.hero_desc_2", lang)}</p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-4 flex w-full flex-col gap-4 sm:mt-6 sm:gap-6 lg:flex-row">
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex-1 bg-gray-100">
              <h2 className="font-serif text-lg font-semibold leading-tight text-[#7B1A3F] sm:text-2xl md:text-[32px] lg:text-[40px]">
                {totalVacancies}+
              </h2>
              <h5 className="mt-1.5 font-serif text-base font-semibold sm:mt-3.5 sm:text-xl">
                {s("career.stat_employed", lang)}
              </h5>
              <div className="mt-1.5 text-xs text-container text-gray-500 sm:mt-2 sm:text-sm">
                <p>{s("career.stat_employed_desc", lang)}</p>
              </div>
            </div>
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex-1 bg-gray-100">
              <h2 className="font-serif text-lg font-semibold leading-tight text-[#7B1A3F] sm:text-2xl md:text-[32px] lg:text-[40px]">
                {totalVacancies}
              </h2>
              <h5 className="mt-1.5 font-serif text-base font-semibold sm:mt-3.5 sm:text-xl">
                {s("career.stat_jobs_posted", lang)}
              </h5>
              <div className="mt-1.5 text-xs text-container text-gray-500 sm:mt-2 sm:text-sm">
                <p>{s("career.stat_jobs_posted_desc", lang)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Latest Vacancies Sidebar */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-3 bg-gray-100 sm:space-y-4 lg:col-span-1">
          <h4 className="font-serif text-xl font-semibold sm:text-2xl">
            {s("career.new_vacancies", lang)}
          </h4>
          {latestVacancies.length > 0 ? (
            <div className="space-y-3">
              {latestVacancies.slice(0, 5).map((item) => (
                <SidebarVacancy key={item.id} item={item} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 rounded-full bg-white p-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{s("career.no_vacancies", lang)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ Vacancies Section ═══════════ */}
      <section className="mt-6 sm:mt-8 lg:mt-16">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Vacancy list — full width */}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg font-semibold sm:text-2xl lg:text-[32px]">
                {s("career.all_vacancies", lang)}
              </h3>
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex cursor-pointer items-center gap-2 font-medium text-[#00575B]"
                >
                  <span className="hidden text-sm sm:inline">{currentSortLabel}</span>
                  <span className="sm:hidden text-sm">{s("career.sort_label", lang)}</span>
                  <ChevronUp className={`h-5 w-5 transition-transform ${showSortMenu ? "" : "rotate-180"}`} />
                </button>
                {showSortMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                    <ul className="absolute right-0 z-20 mt-2 w-56 rounded-xl bg-white p-2 text-base shadow-lg">
                      {SORT_OPTIONS.map((opt) => (
                        <li
                          key={opt.value}
                          onClick={() => {
                            handleSortChange(opt.value);
                            setShowSortMenu(false);
                          }}
                          className={`cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 ${
                            sortOrder === opt.value ? "bg-gray-50 font-medium text-[#00575B]" : ""
                          }`}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Vacancy cards */}
            <div className="mt-6 space-y-4">
              {paginatedVacancies.length > 0 ? (
                paginatedVacancies.map((item) => (
                  <VacancyCard key={item.id} item={item} lang={lang} />
                ))
              ) : (
                <div className="rounded-2xl bg-gray-100 p-8 lg:rounded-3xl">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-white p-6">
                      <Briefcase className="h-10 w-10 text-gray-400" />
                    </div>
                    <h5 className="font-serif text-lg font-semibold text-gray-600">
                      {s("career.no_vacancies", lang)}
                    </h5>
                    <p className="mt-2 text-sm text-gray-400">
                      {s("career.coming_soon", lang)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap justify-center gap-1.5 sm:mt-8 sm:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show: first, last, and pages around current
                  const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  const showDots = (page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2);
                  if (!show && showDots) {
                    return <span key={`dots-${page}`} className="flex items-center text-gray-400">...</span>;
                  }
                  if (!show) return null;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "border-[#00575B] bg-[#00575B] text-white"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
