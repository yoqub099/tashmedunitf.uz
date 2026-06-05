import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("litsenziyalash", { path: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar/litsenziyalash", locale: lang });
}

export default async function LitsenziyalashPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.litsenziyalash", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.qonunlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar` },
        { label: s("doc.litsenziyalash", lang) },
      ]}
      documents={[
        {
          title: s("doc.litsenziyalash_full", lang),
          linkText: s("doc.litsenziyalash_full", lang),
          linkUrl: "https://lex.uz/docs/-5511879",
        },
      ]}
    />
  );
}
