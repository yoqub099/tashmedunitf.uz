import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME_UZ, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { api } from "@/lib/api";
import { t } from "@/lib/translate";

async function getPage(id: string) {
  try {
    const res = await api.get<{ success: boolean; data: any }>(`/v1/pages/${id}`, { tags: ["pages"] });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lang = await getLanguage();
  const page = await getPage(id);
  if (!page) return { title: "Topilmadi" };
  const title = `${t(page.title, lang)} | ToshDTU Termiz filiali`;
  const description = t(page.content, lang)?.replace(/<[^>]*>/g, "").slice(0, 155) || title;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/faoliyat/tadqiqod-markazi/${id}` },
    openGraph: { title, description, url: `${SITE_URL}/faoliyat/tadqiqod-markazi/${id}`, siteName: SITE_NAME_UZ, locale: "uz_UZ", type: "website", images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  };
}

export default async function TadqiqodMarkaziDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lang = await getLanguage();
  const page = await getPage(id);
  if (!page) notFound();

  const title = t(page.title, lang);
  const content = t(page.content, lang);
  const sanitizedContent = content ? DOMPurify.sanitize(content) : "";
  const mainImage = page.images?.[0]?.url || page.images?.[0]?.original_url || null;
  const staffImages = page.images?.slice(1) || [];

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <div className="grid gap-6">
          {/* === Asosiy kontent blok === */}
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-4 bg-gray-100 md:col-span-2">
            {/* Markazlashgan sarlavha */}
            <h4 className="font-serif text-2xl font-semibold text-center text-gray-900">
              {title}
            </h4>

            {/* Katta rasm — fixed aspect ratio */}
            {mainImage && (
              <div className="relative w-full aspect-[788/360] overflow-hidden rounded-xl bg-gray-200">
                <img
                  src={mainImage}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Agar rasm yo'q bo'lsa gradient placeholder */}
            {!mainImage && (
              <div className="w-full rounded-xl bg-gradient-to-br from-[#00575B] to-[#003d40] aspect-[788/360] flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
            )}

            {/* Kontent matni */}
            {sanitizedContent && (
              <div
                className="text-gray-600 prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-[#00575B] prose-ul:list-disc prose-ul:pl-5"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}
          </div>

          {/* === Xodimlar / qo'shimcha rasmlar blok === */}
          {staffImages.length > 0 && (
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100 md:col-span-2">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {staffImages.map((img: any) => (
                  <div key={img.id} className="rounded-2xl p-4 md:p-6 bg-white">
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={img.url || img.original_url}
                        alt={img.name || `${title} - xodim rasmi`}
                        loading="lazy"
                        className="w-full rounded-xl object-cover aspect-[300/400]"
                      />
                      {img.name && (
                        <h2 className="text-lg font-bold text-[#00575B] text-center">
                          {img.name}
                        </h2>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === Hujjatlar === */}
          {page.documents && page.documents.length > 0 && (
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 md:col-span-2 space-y-3">
              <h4 className="font-serif text-xl font-semibold text-gray-900">
                {lang === "ru" ? "Документы" : lang === "en" ? "Documents" : "Hujjatlar"}
              </h4>
              {page.documents.map((doc: any) => (
                <a
                  key={doc.id}
                  href={doc.url || doc.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white p-4 transition-all hover:shadow-md"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{doc.name || doc.file_name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
