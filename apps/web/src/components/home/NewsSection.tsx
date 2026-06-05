import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "@/types";
import { t, formatDate, stripHtml } from "@/lib/translate";
import { s, type Language } from "@/lib/i18n";

interface NewsSectionProps {
  news: NewsItem[];
  lang: Language;
}

/* ── Category badge color mapping ── */
const CATEGORY_GRADIENTS: Record<string, string> = {
  yangiliklar: "news-badge-green",
  tadbirlar: "news-badge-amber",
  konferensiyalar: "news-badge-blue",
  elonlar: "news-badge-purple",
};

function getCategoryBadge(category: string | undefined, lang: Language) {
  if (!category) return null;
  const cls = CATEGORY_GRADIENTS[category.toLowerCase()] ?? "news-badge-green";
  const label = s(`cat_label.${category.toLowerCase()}`, lang) || category;
  return (
    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase text-white ${cls}`}>
      {label}
    </span>
  );
}

/* ── Arrow link icon (↗) ── */
function ArrowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ── Date block ── */
function DateBlock({ dateStr, lang }: { dateStr: string | null; lang: Language }) {
  const { day, month, year } = formatDate(dateStr, lang);
  return (
    <div className="flex items-center gap-x-2">
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] mt-1 text-gray-900">
        {day}
      </h2>
      <div className="inline-flex flex-col items-start justify-center gap-0.5">
        <span className="text-xs">{month}</span>
        <span className="text-xs">{year}</span>
      </div>
    </div>
  );
}

export default function NewsSection({ news, lang }: NewsSectionProps) {
  if (!news || news.length === 0) return null;

  const items = news.slice(0, 5);
  const featured = items[0];
  const smallCards = items.slice(1, 3);
  const rightCards = items.slice(3, 5);

  return (
    <section className="container mx-auto px-4 mt-10 lg:mt-20">
      {/* ── Header ── */}
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] text-center">
        {s("home.news_title", lang)}
      </h2>
      <p className="mt-2 text-center text-gray-500">
        {s("home.news_subtitle", lang)}
      </p>

      {/* ── Bento Grid ── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* ─── Left Column (2/3) ─── */}
        <div className="flex flex-col items-start gap-6 lg:col-span-2">
          {/* Featured card */}
          {featured && (
            <Link href={`/${lang}/yangiliklar/${featured.slug}`} className="block w-full group/featured">
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex w-full flex-col items-start gap-2 bg-gray-100 transition-shadow hover:shadow-lg">
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-200">
                  {featured.cover ? (
                    <Image
                      src={featured.cover}
                      alt={t(featured.title, lang)}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-sm">{s("common.photo", lang)}</p>
                    </div>
                  )}
                </div>

                <div className="flex w-full items-center gap-2 pb-0.5 pt-2">
                  {getCategoryBadge(featured.category, lang)}
                </div>

                <div className="mt-2 text-left">
                  <h4 className="font-serif text-2xl font-semibold">
                    {t(featured.title, lang)}
                  </h4>
                  <p className="text-gray-500 mt-1">
                    {t(featured.excerpt, lang) || stripHtml(t(featured.content, lang)).slice(0, 120)}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-4 md:flex-row lg:items-end lg:justify-between">
                  <DateBlock dateStr={featured.published_at || featured.created_at} lang={lang} />
                  <div className="inline-flex gap-4">
                    <span className="btn btn-sm h-10 rounded-full border border-teal-700 px-4 font-medium text-teal-700 flex items-center gap-1 group-hover/featured:bg-teal-700 group-hover/featured:text-white transition-colors">
                      <span>{s("common.details", lang)}</span>
                      <ArrowIcon size={20} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Two small cards below featured */}
          {smallCards.length > 0 && (
            <div className="grid h-full w-full items-center gap-6 sm:grid-cols-2">
              {smallCards.map((item) => (
                <Link key={item.id} href={`/${lang}/yangiliklar/${item.slug}`} className="block h-full group/card">
                  <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-full flex-col items-start gap-2 bg-gray-100 transition-shadow hover:shadow-lg">
                    {getCategoryBadge(item.category, lang)}
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-2 text-left line-clamp-3">
                      {t(item.title, lang)}
                    </h6>
                    <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                      <DateBlock dateStr={item.published_at || item.created_at} lang={lang} />
                      <span className="rounded-full border border-teal-700 bg-transparent p-2 text-teal-700 group-hover/card:bg-teal-700 group-hover/card:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ─── Right Column (1/3) ─── */}
        <div className="flex flex-col items-start gap-6">
          {rightCards.map((item) => (
            <Link key={item.id} href={`/${lang}/yangiliklar/${item.slug}`} className="block w-full group/card">
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col items-start gap-2 bg-gray-100 w-full transition-shadow hover:shadow-lg">
                <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-gray-200">
                  {item.cover ? (
                    <Image
                      src={item.cover}
                      alt={t(item.title, lang)}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-sm">{s("common.photo", lang)}</p>
                    </div>
                  )}
                </div>
                {getCategoryBadge(item.category, lang)}
                <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg text-left line-clamp-3">
                  {t(item.title, lang)}
                </h6>
                <div className="flex w-full items-end justify-between gap-2 sm:gap-6">
                  <DateBlock dateStr={item.published_at || item.created_at} lang={lang} />
                  <span className="rounded-full border border-teal-700 bg-transparent p-2 text-teal-700 group-hover/card:bg-teal-700 group-hover/card:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
