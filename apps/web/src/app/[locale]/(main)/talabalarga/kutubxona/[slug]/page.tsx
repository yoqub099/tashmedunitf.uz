import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { getLibraryResourceBySlug, getLibraryResources } from "@/lib/services";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { BookOpen, Download, FileText, ExternalLink } from "lucide-react";

export const revalidate = 3600; // 1 soat ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLanguage();
  try {
    const res = await getLibraryResourceBySlug(slug);
    const book = res.data;
    const title = t(book.title, lang);
    const description = t(book.description, lang) || `${title} — TdTUTF kutubxonasi`;
    return buildMetadata("kutubxona", {
      path: `/talabalarga/kutubxona/${slug}`,
      locale: lang,
      title,
      description,
      image: book.cover || undefined,
    });
  } catch {
    return buildMetadata("kutubxona", { path: "/talabalarga/kutubxona", locale: lang });
  }
}

export default async function LibraryDetailPage({ params }: Props) {
  const { slug } = await params;
  const lang = await getLanguage();

  let book;
  try {
    const res = await getLibraryResourceBySlug(slug);
    book = res.data;
  } catch (err) {
    console.error("[library detail] fetch failed:", err);
    notFound();
  }
  if (!book) notFound();

  const title = t(book.title, lang);
  const description = t(book.description, lang);
  const content = t(book.content, lang);

  // Related books from the same category
  const relatedRes = await getLibraryResources({
    per_page: 4,
    category: book.category,
  }).catch((err) => {
    console.error("[library detail] related fetch failed:", err);
    return { success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 4, total: 0 } };
  });
  const relatedBooks = (relatedRes.data || []).filter((b) => b.id !== book.id).slice(0, 3);

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.talabalarga", lang), href: `/${lang}/talabalarga` },
            { label: s("nav.kutubxona", lang), href: `/${lang}/talabalarga/kutubxona` },
            { label: title },
          ]}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ═══ Left: Book Detail ═══ */}
          <div className="flex-1">
            <div className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col gap-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Cover */}
                <div className="relative w-full sm:w-48 aspect-[3/4] overflow-hidden rounded-xl bg-gray-200 flex-shrink-0">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 192px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="size-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Title + Meta */}
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-semibold text-[#00575B] uppercase">
                      {book.category?.replace(/-/g, " ") || "Kutubxona"}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl font-semibold text-gray-900 lg:text-3xl">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-base text-gray-600 leading-relaxed">{description}</p>
                  )}

                  {/* Download / Read online */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {book.document && (
                      <a
                        href={book.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#00575B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004548]"
                      >
                        <Download className="size-4" />
                        {s("lib.download", lang)}
                      </a>
                    )}
                    {book.url && (
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#00575B] bg-white px-5 py-2.5 text-sm font-semibold text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white"
                      >
                        <ExternalLink className="size-4" />
                        {s("lib.open", lang)}
                      </a>
                    )}
                    {!book.document && !book.url && (
                      <span className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm text-gray-500">
                        <FileText className="size-4" />
                        {s("lib.no_file", lang)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Full content */}
              {content && (
                <div className="mt-4 border-t border-gray-200 pt-6">
                  <div
                    className="prose max-w-none text-container [&_img]:max-w-full [&_table]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                  />
                </div>
              )}

              {/* PDF Preview (iframe) */}
              {book.document && /\.pdf(\?.*)?$/i.test(book.document) && (
                <div className="mt-4 border-t border-gray-200 pt-6">
                  <h3 className="mb-3 font-serif text-lg font-semibold text-gray-900">
                    {s("lib.preview", lang)}
                  </h3>
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-200">
                    <iframe
                      src={book.document}
                      className="h-full w-full"
                      title={title}
                      loading="lazy"
                      sandbox="allow-scripts allow-popups"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══ Right Sidebar: Related Books ═══ */}
          <div className="w-full space-y-4 lg:max-w-[320px]">
            <h3 className="font-serif text-xl font-semibold text-gray-900">
              {s("lib.related", lang)}
            </h3>
            {relatedBooks.length === 0 ? (
              <p className="text-sm text-gray-400">{s("lib.no_other_books", lang)}</p>
            ) : (
              <div className="space-y-4">
                {relatedBooks.map((b) => (
                  <Link
                    key={b.id}
                    href={`/${lang}/talabalarga/kutubxona/${b.slug}`}
                    className="block rounded-2xl bg-gray-50 p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                        {b.cover ? (
                          <Image src={b.cover} alt={t(b.title, lang)} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="size-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {t(b.title, lang)}
                        </h4>
                        {b.description && (
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                            {t(b.description, lang)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={`/${lang}/talabalarga/kutubxona`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00575B] hover:underline"
            >
              ← {s("nav.kutubxona", lang)}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
