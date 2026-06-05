import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("talim-qonuni", { path: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar/talim-qonuni", locale: lang });
}

export default async function TalimQonuniPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.talim_qonuni", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.qonunlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar` },
        { label: s("doc.talim_qonuni", lang) },
      ]}
      documents={[
        {
          title: s("doc.talim_qonuni_full", lang),
          linkText: s("doc.talim_qonuni_full", lang),
          linkUrl: "https://lex.uz/docs/-5013007",
        },
      ]}
    />
  );
}
