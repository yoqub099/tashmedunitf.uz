import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("sirtqi-talim", { path: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/sirtqi-talim", locale: lang });
}

export default async function SirtqiTalimPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.sirtqi_talim", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.vazirlar_mahkamasi", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi` },
        { label: s("doc.sirtqi_talim", lang) },
      ]}
      documents={[
        {
          title: s("doc.sirtqi_talim_full", lang),
          linkText: s("doc.sirtqi_talim_subtitle", lang),
          linkUrl: "https://lex.uz/docs/3420875",
        },
      ]}
    />
  );
}
