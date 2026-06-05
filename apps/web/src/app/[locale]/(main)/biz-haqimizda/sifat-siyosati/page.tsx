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
  return buildMetadata("sifat-siyosati", { path: "/biz-haqimizda/sifat-siyosati", locale: lang });
}

export default async function SifatSiyosatiPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("sifat-siyosati");
    page = res.data;
  } catch {
    // fallback
  }

  const title = page ? t(page.title, lang) : s("nav.sifat_siyosati", lang);
  const content = page ? t(page.content, lang) : `<p>${s("sifat.fallback_content", lang)}</p>`;
  const downloadUrl = page?.documents?.[0]?.url ?? null;

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {title}
        </h2>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.sifat_siyosati", lang) },
          ]}
          className="mt-3"
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-1">
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col gap-6 bg-gray-100">
            <h4 className="font-serif text-2xl font-semibold">{title}</h4>
            <div
              className="text-base text-gray-700 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_strong]:text-gray-900 [&_a]:text-[#00575B] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
            {downloadUrl && (
              <a
                download
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-sm font-medium text-[#00575B] hover:underline"
                href={downloadUrl}
              >
                <span>{s("common.download", lang)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15.5578 11.1104L12.0004 14.6678L8.44287 11.1104" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.0002 3.99707L12.0002 14.6685" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.0032 16.4463C20.0032 18.411 18.4105 20.0038 16.4458 20.0038H7.55406C5.58932 20.0038 3.99658 18.411 3.99658 16.4463" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
