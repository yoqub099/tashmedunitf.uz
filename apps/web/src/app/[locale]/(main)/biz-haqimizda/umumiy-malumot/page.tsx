import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DOMPurify from "isomorphic-dompurify";
import { getPageBySlug } from "@/lib/services";
import { t } from "@/lib/translate";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("umumiy-malumot", { path: "/biz-haqimizda/umumiy-malumot", locale: lang });
}

export default async function UmumiyMalumotPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("umumiy-malumot");
    page = res.data;
  } catch { /* fallback */ }

  const title = page ? t(page.title, lang) : s("nav.umumiy_malumot", lang);
  const content = page ? t(page.content, lang) : `<p>${s("umumiy.fallback_content", lang)}</p>`;

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">{title}</h2>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.umumiy_malumot", lang) },
          ]}
          className="mt-3"
        />
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 space-y-6 bg-gray-100">
          <div>
            <h5 className="font-serif text-xl font-semibold">{title}</h5>
            <div
              className="mt-2 space-y-4 text-base text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_strong]:text-gray-900 [&_a]:text-[#00575B] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
