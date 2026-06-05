import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("tanlov-reglamenti", { path: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/tanlov-reglamenti", locale: lang });
}

export default async function TanlovReglamentiPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.tanlov_reglamenti", lang)}
      breadcrumbItems={[
        { label: s("common.home", lang), href: `/${lang}` },
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.ichki_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar` },
        { label: s("doc.tanlov_reglamenti", lang) },
      ]}
      documents={[
        {
          title: s("doc.tanlov_reglamenti_full", lang),
          downloadUrl: undefined,
        },
      ]}
    />
  );
}
