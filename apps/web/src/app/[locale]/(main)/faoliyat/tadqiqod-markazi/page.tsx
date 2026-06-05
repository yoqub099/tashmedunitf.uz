import Link from "next/link";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { getPageBySlug } from "@/lib/services";
import { t, stripHtml } from "@/lib/translate";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("tadqiqod-markazi", { path: "/faoliyat/tadqiqod-markazi", locale: lang });
}

export default async function TadqiqodMarkaziPage() {
  const lang = await getLanguage();

  const pageRes = await getPageBySlug("tadqiqod-markazi").catch(() => ({ success: false, data: null }));
  const page = pageRes.data;
  const children = page?.children || [];

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {page ? t(page.title, lang) : s("nav.tadqiqod_markazi", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.tadqiqod_markazi", lang) },
          ]}
          className="mt-3"
        />

        {/* ISFT-style card grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.filter((child: any) => child.is_published).map((child: any) => {
            const title = t(child.title, lang);
            const content = t(child.content, lang);
            const excerpt = content ? stripHtml(content).slice(0, 200) : "";
            const image = child.images?.[0]?.url || child.images?.[0]?.original_url || null;

            return (
              <Link
                key={child.id}
                href={`/${lang}/faoliyat/tadqiqod-markazi/${child.id}`}
                className="group"
              >
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl h-full bg-gray-100 transition-shadow hover:shadow-md">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      loading="lazy"
                      className="w-full rounded-xl object-cover aspect-[362/220]"
                    />
                  ) : (
                    <div className="w-full rounded-xl bg-gradient-to-br from-[#00575B] to-[#003d40] aspect-[362/220] flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                  )}

                  <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-4 text-gray-900">
                    {title}
                  </h6>

                  <div className="mt-2 text-sm text-gray-500 line-clamp-4">
                    <p>{excerpt}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {children.length === 0 && (
          <p className="mt-8 text-center text-gray-500">
            {lang === "ru" ? "Статьи не найдены" : lang === "en" ? "No articles found" : "Maqolalar topilmadi"}
          </p>
        )}
      </Container>
    </div>
  );
}
