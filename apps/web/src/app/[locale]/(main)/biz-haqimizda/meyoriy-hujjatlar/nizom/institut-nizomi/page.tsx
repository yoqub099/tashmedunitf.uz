import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("institut-nizomi", { path: "/biz-haqimizda/meyoriy-hujjatlar/nizom/institut-nizomi", locale: lang });
}

export default async function InstitutNizomiPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.institut_nizomi", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.nizom", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/nizom` },
        { label: s("doc.institut_nizomi", lang) },
      ]}
      documents={[
        {
          title: s("doc.institut_nizomi_full", lang),
          downloadUrl: "#",
        },
      ]}
    />
  );
}
