import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("taraqqiyot-strategiyasi", { path: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari/taraqqiyot-strategiyasi", locale: lang });
}

export default async function TaraqqiyotStrategiyasiPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.taraqqiyot", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.prezident_qarorlari", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari` },
        { label: s("doc.taraqqiyot", lang) },
      ]}
      documents={[
        {
          title: s("doc.taraqqiyot_full", lang),
          linkText: s("doc.taraqqiyot_subtitle", lang),
          linkUrl: "https://lex.uz/ru/docs/-5841063",
        },
      ]}
    />
  );
}
