import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("qabul-tartib", { path: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/qabul-tartib", locale: lang });
}

export default async function QabulTartibPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.qabul_tartib", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.vazirlar_mahkamasi", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi` },
        { label: s("doc.qabul_tartib", lang) },
      ]}
      documents={[
        {
          title: s("doc.qabul_tartib_full", lang),
          linkText: s("doc.qabul_tartib_subtitle", lang),
          linkUrl: "https://lex.uz/docs/3244181",
        },
      ]}
    />
  );
}
