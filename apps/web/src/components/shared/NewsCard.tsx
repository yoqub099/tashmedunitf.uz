"use client";

import Link from "@/components/shared/LocaleLink";
import Image from "next/image";
import { NewsItem } from "@/types";
import { t, formatDate, stripHtml } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

/* ── Category badge color mapping ── */
const CATEGORY_STYLES: Record<string, string> = {
  yangiliklar: "news-badge-green",
  tadbirlar: "news-badge-amber",
  konferensiyalar: "news-badge-blue",
  elonlar: "news-badge-purple",
};

function getCategoryBadge(category: string | undefined, lang: "uz" | "ru" | "en") {
  if (!category) return null;
  const cls = CATEGORY_STYLES[category.toLowerCase()] ?? "news-badge-green";
  const key = `cat.${category.toLowerCase()}`;
  const label = s(key, lang);
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase text-white ${cls}`}>
      {label}
    </span>
  );
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const { language } = useLanguageStore();
  const title = t(item.title, language);
  const excerpt = t(item.excerpt, language) || stripHtml(t(item.content, language)).slice(0, 150);
  const { day, month, year } = formatDate(item.published_at || item.created_at, language);

  return (
    <Link
      href={`/yangiliklar/${item.slug}`}
      className="group flex flex-col rounded-2xl bg-gray-100 overflow-hidden transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-16/10 w-full bg-gray-200 overflow-hidden rounded-t-2xl">
        {item.cover ? (
          <Image
            src={item.cover}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">{s("common.photo", language)}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-xs text-blue-600 font-medium mb-2">
          {day} {month} {year}
        </p>
        <h3 className="font-serif text-base font-semibold leading-tight lg:text-lg text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
