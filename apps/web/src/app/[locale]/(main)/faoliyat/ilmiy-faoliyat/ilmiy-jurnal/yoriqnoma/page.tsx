import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Image from "next/image";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("jurnal-yoriqnoma", {
    path: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/yoriqnoma",
    locale: lang,
    title: "Yo'riqnoma",
  });
}

export default async function YoriqnomaPage() {
  const lang = await getLanguage();

  const guideSections = [
    { title: s("jp.guide_s1_title", lang), content: s("jp.guide_s1_content", lang) },
    { title: s("jp.guide_s2_title", lang), content: s("jp.guide_s2_content", lang) },
    { title: s("jp.guide_s3_title", lang), content: s("jp.guide_s3_content", lang) },
    { title: s("jp.guide_s4_title", lang), content: s("jp.guide_s4_content", lang) },
    { title: s("jp.guide_s5_title", lang), content: s("jp.guide_s5_content", lang) },
    { title: s("jp.guide_s6_title", lang), content: s("jp.guide_s6_content", lang) },
    { title: s("jp.guide_s7_title", lang), content: s("jp.guide_s7_content", lang) },
  ];

  return (
    <div className="space-y-16 md:space-y-20 pt-16 md:pt-20">
      <Container>
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
          <h2 className="text-2xl sm:text-3xl leading-tight font-bold text-center md:text-left md:text-[32px] text-gray-900 mb-6">
            {s("jp.guide_main_title", lang)}
          </h2>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">
            {/* Left column — requirements sections */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {guideSections.map((section) => (
                  <div key={section.title} className="leading-6">
                    <p className="text-gray-900 font-bold mb-2 text-lg">
                      {section.title}
                    </p>
                    <div className="text-gray-900 prose prose-slate max-w-none">
                      <p className="text-justify text-xs whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — guide image + download button */}
            <div className="flex flex-col">
              <div className="relative w-full aspect-[3/4] md:h-152 md:aspect-auto">
                <Image
                  src="/imgs/journal/article-guide.jpg"
                  alt={s("jp.guide_img_alt", lang)}
                  fill
                  className="object-contain rounded-xl border border-slate-200"
                  unoptimized
                />
              </div>
              <a
                href="/docs/yoriqnoma.pdf"
                target="_blank"
                className="relative inline-flex items-center justify-center select-none transition-all duration-300 active:scale-[0.98] font-semibold overflow-hidden px-6 text-lg leading-5 gap-2.5 bg-[#00575B] text-white shadow-md shadow-[#00575B]/20 hover:bg-[#004548] w-full mt-4 py-3"
                style={{ borderRadius: 12 }}
              >
                <span className="whitespace-nowrap">
                  {s("jp.guide_download", lang)}
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>

      <Breadcrumb
        items={[
          { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
          { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
          {
            label: s("nav.ilmiy_jurnal", lang),
            href: `/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal`,
          },
          { label: s("jp.breadcrumb_yoriqnoma", lang) },
        ]}
        className="hidden"
      />
    </div>
  );
}
