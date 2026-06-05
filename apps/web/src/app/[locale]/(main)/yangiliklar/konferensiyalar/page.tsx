import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/services";
import { t, formatDate, stripHtml } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CountdownTimer, ParticipateButton } from "./ConferenceClient";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("konferensiyalar", { path: "/yangiliklar/konferensiyalar", locale: lang });
}

/* ── Constants ── */
const CATEGORY = "konferensiyalar";

/* ── Badge — ISFT crimson gradient ── */
function Badge({ lang }: { lang: string }) {
  return (
    <span className="inline-block rounded-full bg-linear-to-r from-[#870037] to-[#C30050] px-2 py-1 text-xs font-extrabold uppercase text-white">
      {s("cat_label.konferensiyalar", lang as any)}
    </span>
  );
}

/* ── Arrow icon ── */
function ArrowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ── Right arrow (pagination) ── */
function RightArrow() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 256 256" height={20} width={20}>
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

/* ── Date block ── */
function DateBlock({ dateStr, lang }: { dateStr: string | null; lang: string }) {
  const { day, month, year } = formatDate(dateStr, lang);
  return (
    <div className="flex items-center gap-x-2">
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] mt-1 text-gray-900">
        {day}
      </h2>
      <div className="inline-flex flex-col items-start justify-center gap-0.5">
        <span className="text-xs text-gray-500">{month}</span>
        <span className="text-xs text-gray-400">{year}</span>
      </div>
    </div>
  );
}

/* ── No-image placeholder ── */
function NoImage({ size = "size-12" }: { size?: string }) {
  return (
    <svg className={`${size} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export default async function KonferensiyalarPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const lang = await getLanguage();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const [mainRes, latestRes] = await Promise.all([
    getNews({ per_page: 8, page: currentPage, category: CATEGORY }).catch((err) => {
      console.error("[konferensiyalar] main fetch failed:", err);
      return { success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 8, total: 0 } };
    }),
    getNews({ per_page: 10, category: CATEGORY }).catch((err) => {
      console.error("[konferensiyalar] sidebar fetch failed:", err);
      return { success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
    }),
  ]);

  const news = mainRes.data;
  const latestNews = latestRes.data;
  const totalPages = mainRes.meta.last_page;

  const featured = news[0];
  const gridItems = news.slice(1);

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.yangiliklar", lang), href: `/${lang}/yangiliklar` },
            { label: s("nav.konferensiyalar", lang) },
          ]}
        />

        {/* ── Page Header ── */}
        <div className="mt-4 mb-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">{s("conf.title", lang)}</h1>
          <p className="mt-1 text-sm text-gray-500">{s("conf.subtitle", lang)}</p>
        </div>

        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <NoImage />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{s("conf.not_found", lang)}</h3>
            <p className="mt-1 text-sm text-gray-500">{s("conf.empty", lang)}</p>
          </div>
        ) : (
        <div className="grid items-start gap-6 md:grid-cols-3">
          {/* ═══ Left Column (2/3) ═══ */}
          <div className="flex w-full flex-col items-start gap-6 md:col-span-2">

            {/* ── Featured Card ── */}
            {featured && (
              <div className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex w-full flex-col items-start gap-2 bg-gray-50">
                {featured.cover ? (
                  <div className="relative w-full aspect-video overflow-hidden rounded-3xl bg-gray-200">
                    <Image
                      src={featured.cover}
                      alt={t(featured.title, lang)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-center rounded-3xl bg-gray-200 aspect-video">
                    <NoImage />
                  </div>
                )}

                <div className="flex w-full items-center gap-2 pb-0.5 pt-2">
                  <Badge lang={lang} />
                  <CountdownTimer date={featured.published_at || featured.created_at} />
                </div>

                <div className="mt-2 text-left">
                  <h4 className="font-serif text-2xl font-semibold text-gray-900">{t(featured.title, lang)}</h4>
                  <div className="text-gray-500 text-container mt-1">
                    {t(featured.excerpt, lang) || stripHtml(t(featured.content, lang)).slice(0, 160)}
                  </div>
                </div>

                <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <DateBlock dateStr={featured.published_at || featured.created_at} lang={lang} />
                  <div className="inline-flex flex-wrap gap-3 sm:gap-4">
                    <ParticipateButton newsId={featured.id} />
                    <Link
                      href={`/${lang}/yangiliklar/${featured.slug}`}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-green-600 px-4 text-sm font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                    >
                      <span>{s("common.details", lang)}</span>
                      <ArrowIcon size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── Grid Cards ── */}
            {gridItems.length > 0 && (
              <div className="grid w-full gap-6 lg:grid-cols-2">
                {gridItems.map((item) => (
                  <div key={item.id} className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col items-start gap-2 bg-gray-50">
                    {item.cover ? (
                      <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-gray-200">
                        <Image
                          src={item.cover}
                          alt={t(item.title, lang)}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center rounded-3xl bg-gray-200">
                        <NoImage size="size-8" />
                      </div>
                    )}
                    <Badge lang={lang} />
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg line-clamp-2 text-left text-gray-900">
                      {t(item.title, lang)}
                    </h6>
                    <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                      <DateBlock dateStr={item.published_at || item.created_at} lang={lang} />
                      <Link
                        href={`/${lang}/yangiliklar/${item.slug}`}
                        className="rounded-full border border-green-600 bg-transparent p-2 text-green-600 transition-colors hover:bg-green-600 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <ArrowIcon />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination (smart ellipsis — all pages navigable) ── */}
            {totalPages > 1 && (() => {
              const pages: (number | "...")[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("...");
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }
              return (
                <div className="mt-8 flex w-full justify-center gap-2">
                  {pages.map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="flex items-center text-gray-400">...</span>
                    ) : (
                      <Link
                        key={p}
                        href={`/${lang}/yangiliklar/konferensiyalar?page=${p}`}
                        className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                          currentPage === p
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </Link>
                    ),
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/${lang}/yangiliklar/konferensiyalar?page=${currentPage + 1}`}
                      className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
                    >
                      <RightArrow />
                    </Link>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ═══ Right Sidebar (1/3) ═══ */}
          <div className="space-y-6">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">{s("sidebar.konferensiyalar", lang)}</h4>
            {latestNews.map((item) => (
              <div key={item.id} className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col items-start gap-2 bg-gray-50">
                <Badge lang={lang} />
                <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg line-clamp-2 text-left text-gray-900">
                  {t(item.title, lang)}
                </h6>
                <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                  <DateBlock dateStr={item.published_at || item.created_at} lang={lang} />
                  <Link
                    href={`/${lang}/yangiliklar/${item.slug}`}
                    className="rounded-full border border-green-600 bg-transparent p-1.5 text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                  >
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </Container>
    </div>
  );
}
