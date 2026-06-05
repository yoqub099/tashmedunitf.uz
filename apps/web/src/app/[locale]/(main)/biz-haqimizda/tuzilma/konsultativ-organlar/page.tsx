import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DOMPurify from "isomorphic-dompurify";
import { getPageBySlug } from "@/lib/services";
import { t } from "@/lib/translate";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("konsultativ-organlar", { path: "/biz-haqimizda/tuzilma/konsultativ-organlar", locale: lang });
}

function buildFallbackContent(lang: Language): string {
  return `<p>${s("konsultativ.fallback_intro", lang)}</p>
<p><strong>${s("org.kuzatuv_kengashi", lang)}</strong> — ${s("konsultativ.kuzatuv_desc", lang)}</p>
<p><strong>${s("org.filial_kengashi", lang)}</strong> — ${s("konsultativ.filial_kengashi_desc", lang)}</p>`;
}

/* ── Org chart box ── */
function OrgBox({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`rounded-xl border-2 border-[#00575B] bg-white px-3 py-2.5 text-center text-xs font-semibold text-[#00575B] shadow-sm sm:px-4 sm:py-3 sm:text-sm ${className || ""}`}
    >
      {label}
    </div>
  );
}

/* ── Org chart component ── */
function OrgChart({ lang }: { lang: Language }) {
  return (
    <div className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center gap-0 overflow-x-auto">
      {/* Kuzatuv kengashi */}
      <OrgBox label={s("org.kuzatuv_kengashi", lang)} className="w-48 sm:w-64" />
      <div className="h-6 w-0.5 bg-[#00575B]" />

      {/* Filial Kengashi */}
      <OrgBox label={s("org.filial_kengashi", lang)} className="w-48 sm:w-64" />
      <div className="h-6 w-0.5 bg-[#00575B]" />

      {/* Connector line */}
      <div className="w-full max-w-xl border-t-2 border-[#00575B]" />

      {/* 2 columns on mobile (no center spacer), 3 on sm+ */}
      <div className="grid w-full max-w-xl grid-cols-2 gap-x-2 sm:grid-cols-3 sm:gap-0">
        {/* Left column */}
        <div className="flex flex-col items-center gap-0">
          <div className="h-6 w-0.5 bg-[#00575B]" />
          <OrgBox label={s("org.oquv_uslubiy_kengash", lang)} className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label={s("org.ilmiy_kengash", lang)} className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label={s("org.kafedralar_kengashi", lang)} className="w-full" />
        </div>

        {/* Center spacer — hidden on mobile */}
        <div className="hidden sm:block" />

        {/* Right column */}
        <div className="flex flex-col items-center gap-0">
          <div className="h-6 w-0.5 bg-[#00575B]" />
          <OrgBox label={s("org.direktor_maslahatchilari", lang)} className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label={s("org.talabalar_kengashi", lang)} className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label={s("org.moliya_qomitasi", lang)} className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function KonsultativOrganlariPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("konsultativ-organlar");
    page = res.data;
  } catch { /* fallback */ }

  const title = page ? t(page.title, lang) : s("nav.konsultativ_organlar", lang);
  const content = page ? t(page.content, lang) : buildFallbackContent(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.tuzilma", lang), href: `/${lang}/biz-haqimizda/tuzilma` },
            { label: s("nav.konsultativ_organlar", lang) },
          ]}
        />

        <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl flex flex-col gap-6">
          <h4 className="font-serif text-2xl font-semibold text-gray-900">
            {title}
          </h4>
          <div
            className="text-base text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_strong]:text-gray-900 [&_a]:text-[#00575B] [&_a]:underline [&_img]:mx-auto [&_img]:rounded-xl [&_img]:my-4"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />

          {!page && <OrgChart lang={lang} />}
        </div>
      </Container>
    </div>
  );
}
