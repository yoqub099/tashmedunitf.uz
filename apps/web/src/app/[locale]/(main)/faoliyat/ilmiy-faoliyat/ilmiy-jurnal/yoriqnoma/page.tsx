import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
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

          {/* Talab bo'limlari to'liq kenglikda. (Ilgari o'ng ustunda mavjud
              bo'lmagan /imgs/journal/article-guide.jpg rasmi va mavjud
              bo'lmagan /docs/yoriqnoma.pdf tugmasi bor edi — real fayllar
              qo'shilganda shu yerga qaytarish mumkin.) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
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
