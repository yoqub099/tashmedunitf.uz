import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("akademik-tatil", { path: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/akademik-tatil", locale: lang });
}

export default async function AkademikTatilPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.akademik_tatil", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.vazirlar_mahkamasi", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi` },
        { label: s("doc.akademik_tatil", lang) },
      ]}
      documents={[
        {
          title: s("doc.akademik_tatil_full", lang),
          linkText: s("doc.akademik_tatil_subtitle", lang),
          linkUrl: "https://lex.uz/docs/-5443081",
        },
      ]}
    />
  );
}
