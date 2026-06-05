import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("pedagog-maqomi", { path: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar/pedagog-maqomi", locale: lang });
}

export default async function PedagogMaqomiPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.pedagog_maqomi", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.qonunlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar` },
        { label: s("doc.pedagog_maqomi", lang) },
      ]}
      documents={[
        {
          title: s("doc.pedagog_maqomi_full", lang),
          linkText: s("doc.pedagog_maqomi_full", lang),
          linkUrl: "https://lex.uz/uz/docs/-6786401",
        },
      ]}
    />
  );
}
