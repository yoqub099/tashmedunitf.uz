import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import { getLibraryResources, getLibraryCategories } from "@/lib/services";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 1800; // 30 daqiqa ISR

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("kutubxona", { path: "/talabalarga/kutubxona", locale: lang });
}

/** Convert a slug like "badiiy-adabiyotlar" to "Badiiy adabiyotlar" */
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Pagination({
  currentPage,
  totalPages,
  category,
  search,
  lang,
}: {
  currentPage: number;
  totalPages: number;
  category: string;
  search: string;
  lang: string;
}) {
  if (totalPages <= 1) return null;

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

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const qs = params.toString();
    return `/${lang}/talabalarga/kutubxona${qs ? `?${qs}` : ""}`;
  }

  return (
    <nav aria-label="Sahifalarni ko'rish" className="mt-8 flex justify-center gap-2">
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} aria-hidden="true" className="flex items-center text-gray-400">...</span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-label={`Sahifa ${p}`}
            aria-current={currentPage === p ? "page" : undefined}
            className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#00575B] focus:ring-offset-1 ${
              currentPage === p
                ? "border-[#00575B] bg-[#00575B] text-white"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          aria-label="Keyingi sahifa"
          className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00575B] focus:ring-offset-1"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </nav>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15.5578 11.1104L12.0004 14.6678L8.44287 11.1104" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.0002 3.99707L12.0002 14.6685" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.0032 16.4463C20.0032 18.411 18.4105 20.0038 16.4458 20.0038H7.55406C5.58932 20.0038 3.99658 18.411 3.99658 16.4463" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function KutubxonaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const lang = await getLanguage();
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const activeCategory = params.category || "";
  const searchQuery = params.search || "";

  const res = await getLibraryResources({
    per_page: 12,
    page: currentPage,
    category: activeCategory || undefined,
    search: searchQuery || undefined,
  }).catch((err) => {
    console.error("[kutubxona] list fetch failed:", err);
    return { success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } };
  });

  const catRes = await getLibraryCategories().catch((err) => {
    console.error("[kutubxona] categories fetch failed:", err);
    return { success: false, data: [] as string[] };
  });

  const CATEGORIES = [
    { value: "", label: s("lib.all_books", lang) },
    ...(catRes.data ?? []).map((slug: string) => ({
      value: slug,
      label: slugToLabel(slug),
    })),
  ];

  const items = res.data;
  const totalPages = res.meta.last_page;

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        {/* Category filter tabs */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              const catParams = new URLSearchParams();
              if (cat.value) catParams.set("category", cat.value);
              if (searchQuery) catParams.set("search", searchQuery);
              const href = `/${lang}/talabalarga/kutubxona${catParams.toString() ? `?${catParams.toString()}` : ""}`;

              return (
                <Link
                  key={cat.value}
                  href={href}
                  className={`rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#00575B] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Search bar */}
          <form
            action={`/${lang}/talabalarga/kutubxona`}
            method="GET"
            className="mt-4 inline-flex w-full items-center gap-1.5 sm:gap-2 rounded-full bg-gray-100 p-1.5 sm:p-2 lg:max-w-3xl"
          >
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
            <label htmlFor="kutubxona-search" className="sr-only">
              {s("lib.search_placeholder", lang)}
            </label>
            <input
              id="kutubxona-search"
              name="search"
              placeholder={s("lib.search_placeholder", lang)}
              defaultValue={searchQuery}
              className="h-10 sm:h-14 w-full rounded-full bg-white px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#00575B]"
              type="text"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-[#00575B] px-4 py-3 sm:py-2.5 font-medium text-white transition-colors hover:bg-[#004548] lg:h-14 shrink-0"
            >
              <svg className="size-5 sm:size-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
              </svg>
              <span className="hidden sm:inline">{s("common.search", lang)}</span>
            </button>
          </form>

          {/* Books Grid */}
          {items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6">
                <svg className="size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{s("lib.no_books", lang)}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? `"${searchQuery}" ${s("lib.no_results", lang)}`
                  : s("lib.no_books_added", lang)}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid w-full gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex h-auto min-h-52 sm:h-64 w-full gap-3 sm:gap-4 overflow-hidden rounded-2xl bg-gray-50 p-3 sm:p-4!"
                  >
                    {/* Cover image */}
                    {item.cover || item.cover_thumbnail ? (
                      <Image
                        src={item.cover_thumbnail || item.cover}
                        alt={t(item.title, lang)}
                        width={160}
                        height={220}
                        className="h-full w-full min-w-28 max-w-28 sm:min-w-40 sm:max-w-40 rounded-2xl object-cover object-top-left"
                      />
                    ) : (
                      <div className="flex h-full min-w-28 max-w-28 sm:min-w-40 sm:max-w-40 items-center justify-center rounded-2xl bg-gray-200">
                        <svg className="size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex flex-col overflow-hidden">
                      <h3 className="font-serif text-base font-semibold leading-tight text-gray-900 line-clamp-2 lg:text-lg">
                        {t(item.title, lang)}
                      </h3>
                      {t(item.description, lang) && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {t(item.description, lang)}
                        </p>
                      )}

                      {/* Download / Link button */}
                      <div className="mt-auto">
                        {item.document ? (
                          <a
                            href={item.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#00575B] px-4 text-sm font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white"
                          >
                            <span>{s("common.download", lang)}</span>
                            <DownloadIcon />
                          </a>
                        ) : item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#00575B] px-4 text-sm font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white"
                          >
                            <span>{s("lib.open", lang)}</span>
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : null}
                      </div>
                    </div>

                    {/* TdTUTF badge ribbon */}
                    <div className="absolute -right-6.25 top-2.5 rotate-45">
                      <div className="flex select-none items-center justify-center gap-2 bg-[#00575B] px-8 py-0.5 text-xs font-bold text-white">
                        TdTUTF
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                category={activeCategory}
                search={searchQuery}
                lang={lang}
              />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
