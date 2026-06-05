import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { getPageBySlug } from "@/lib/services";
import { t } from "@/lib/translate";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("xalqaro-hamkorlik", { path: "/faoliyat/xalqaro-hamkorlik", locale: lang });
}

export default async function XalqaroHamkorlikPage() {
  const lang = await getLanguage();

  const pageRes = await getPageBySlug("xalqaro-hamkorlik").catch(() => ({ success: false, data: null }));
  const page = pageRes.data;

  const content = page ? t(page.content, lang) : "";
  const sanitizedContent = content ? DOMPurify.sanitize(content) : "";

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {page ? t(page.title, lang) : s("nav.xalqaro_hamkorlik", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.xalqaro_hamkorlik", lang) },
          ]}
          className="mt-3"
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-1">
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
            {sanitizedContent ? (
              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-[#00575B] prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ul:pl-5"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            ) : (
              <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                <p>{s("xalqaro.bolim_p1", lang)}</p>
                <p>{s("xalqaro.bolim_p2", lang)}</p>
                <p className="font-semibold text-gray-900">{s("xalqaro.goals_title", lang)}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{s("xalqaro.goal1", lang)}</li>
                  <li>{s("xalqaro.goal2", lang)}</li>
                  <li>{s("xalqaro.goal3", lang)}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Rasmlar */}
          {page?.images && page.images.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.images.map((img: any) => (
                <div key={img.id} className="h-48 overflow-hidden rounded-2xl bg-gray-200">
                  <img
                    src={img.url || img.original_url}
                    alt={img.name || "Xalqaro hamkorlik"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Hujjatlar */}
          {page?.documents && page.documents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-semibold text-gray-900">
                {lang === "ru" ? "Документы" : lang === "en" ? "Documents" : "Hujjatlar"}
              </h3>
              {page.documents.map((doc: any) => (
                <a
                  key={doc.id}
                  href={doc.url || doc.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-[#00575B] hover:shadow-md"
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
