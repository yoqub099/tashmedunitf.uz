import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("institut-kengashi", { path: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/institut-kengashi", locale: lang });
}

export default async function InstitutKengashiPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.institut_kengashi", lang)}
      breadcrumbItems={[
        { label: s("common.home", lang), href: `/${lang}` },
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.ichki_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar` },
        { label: s("doc.institut_kengashi", lang) },
      ]}
      documents={[
        {
          title: s("doc.institut_kengashi_full", lang),
          downloadUrl: undefined,
        },
      ]}
    />
  );
}
