import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { getNewsBySlug, getNews } from "@/lib/services";
import { t, formatDate } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShareButtons } from "./ShareButtons";
import { buildArticleMetadata, getArticleSchema } from "@/lib/seo";

/* ── Category badge styles ── */
const CAT_BADGE_CLS: Record<string, string> = {
  yangiliklar: "news-badge-green",
  tadbirlar: "bg-linear-to-r from-[#870037] to-[#C30050]",
  konferensiyalar: "bg-linear-to-r from-[#870037] to-[#C30050]",
  elonlar: "news-badge-green",
  vakansiyalar: "news-badge-blue",
};

/* ── Arrow icon ── */
function ArrowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
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

/* ── Badge component ── */
function CategoryBadge({ category, lang }: { category: string; lang: string }) {
  const cat = category?.toLowerCase() || "yangiliklar";
  const cls = CAT_BADGE_CLS[cat] ?? "news-badge-green";
  const label = s(`cat_label.${cat}`, lang as any) || category;
  return (
    <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-extrabold uppercase text-white ${cls}`}>
      {label}
    </span>
  );
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLanguage();
  try {
    const res = await getNewsBySlug(slug);
    const article = res.data;
    const title = t(article.title, lang);
    const excerpt = t(article.excerpt, lang) || t(article.content, lang)?.replace(/<[^>]*>/g, "").slice(0, 150);
    return buildArticleMetadata({
      title,
      description: excerpt || `${title} — ${s("news.meta_fallback_desc", lang)}`,
      slug: article.slug,
      image: article.cover || undefined,
      publishedAt: article.published_at || article.created_at,
      updatedAt: article.updated_at,
      category: article.category,
      locale: lang,
    });
  } catch {
    return { title: s("news.meta_fallback_title", lang) };
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const lang = await getLanguage();

  let article;
  try {
    const res = await getNewsBySlug(slug);
    article = res.data;
  } catch {
    notFound();
  }

  if (!article) notFound();

  const title = t(article.title, lang);
  const content = t(article.content, lang);
  const excerpt = t(article.excerpt, lang) || content?.replace(/<[^>]*>/g, "").slice(0, 150);
  const cat = article.category?.toLowerCase() || "yangiliklar";

  const articleSchema = getArticleSchema({
    title,
    description: excerpt || title,
    slug: article.slug,
    image: article.cover || undefined,
    publishedAt: article.published_at || article.created_at,
    updatedAt: article.updated_at,
  });

  /* Fetch latest news for sidebar */
  const latestRes = await getNews({ per_page: 10, category: cat }).catch((err) => {
    console.error("[news detail] sidebar fetch failed:", err);
    return { success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
  });
  const latestNews = latestRes.data;

  return (
    <div className="pt-20 lg:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Container as="main" className="py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ═══ Left: Article Detail ═══ */}
          <div className="flex-1">
            <div className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col gap-4 bg-gray-50">
              {/* Cover Image — fixed aspect ratio, any size image fits */}
              {article.cover ? (
                <div className="relative w-full aspect-[16/7] overflow-hidden rounded-xl bg-gray-200">
                  <Image
                    src={article.cover}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              ) : (
                <div className="flex w-full aspect-[16/7] items-center justify-center rounded-xl bg-gray-200">
                  <svg className="size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}

              {/* Title */}
              <h4 className="font-serif text-2xl font-semibold text-gray-900">{title}</h4>

              {/* Content */}
              <div
                className="prose max-w-none text-container overflow-x-auto [&_img]:max-w-full [&_table]:max-w-full [&_iframe]:max-w-full [&_pre]:overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
              />

              {/* Gallery */}
              {article.gallery && article.gallery.length > 0 && (
                <div className="mt-4">
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">{s("news.gallery", lang)}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {article.gallery.map((img) => (
                      <div key={img.id} className="relative aspect-4/3 rounded-xl overflow-hidden news-card-shadow">
                        <Image src={img.url} alt={img.name} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date + Share Buttons */}
              <div className="mt-auto flex flex-col gap-3 md:flex-row">
                <DateBlock dateStr={article.published_at || article.created_at} lang={lang} />
                <div className="flex items-center gap-3 md:ml-auto">
                  <p className="font-serif text-sm font-medium text-gray-900">{s("news.share", lang)}:</p>
                  <ShareButtons />
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Right: Sidebar ═══ */}
          <div className="w-full space-y-6 lg:max-w-105">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">{s(`sidebar.${cat}`, lang) || s("sidebar.yangiliklar", lang)}</h4>
            <div className="grid gap-6">
              {latestNews.map((item) => (
                <div key={item.id} className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-full flex-col items-start gap-2 bg-gray-50">
                  <CategoryBadge category={item.category || cat} lang={lang} />
                  <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-2 text-left text-gray-900">
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
          </div>
        </div>
      </Container>
    </div>
  );
}
