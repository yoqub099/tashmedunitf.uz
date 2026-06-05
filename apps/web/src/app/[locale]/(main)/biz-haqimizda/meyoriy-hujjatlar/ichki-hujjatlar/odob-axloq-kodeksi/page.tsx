import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("odob-axloq-kodeksi", { path: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar/odob-axloq-kodeksi", locale: lang });
}

export default async function OdobAxloqKodeksiPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.odob_axloq", lang)}
      breadcrumbItems={[
        { label: s("common.home", lang), href: `/${lang}` },
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.ichki_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar` },
        { label: s("doc.odob_axloq", lang) },
      ]}
      documents={[
        {
          title: s("doc.odob_axloq_full", lang),
          downloadUrl: undefined,
        },
      ]}
    />
  );
}
