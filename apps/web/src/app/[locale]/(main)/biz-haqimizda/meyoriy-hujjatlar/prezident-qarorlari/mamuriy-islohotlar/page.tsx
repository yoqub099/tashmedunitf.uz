import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("mamuriy-islohotlar", { path: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari/mamuriy-islohotlar", locale: lang });
}

export default async function MamuriyIslohotlarPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.mamuriy_islohotlar", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.prezident_qarorlari", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari` },
        { label: s("doc.mamuriy_islohotlar", lang) },
      ]}
      documents={[
        {
          title: s("doc.mamuriy_islohotlar_full", lang),
          linkText: s("doc.mamuriy_islohotlar_subtitle", lang),
          linkUrl: "https://lex.uz/uz/docs/-6518515",
        },
      ]}
    />
  );
}
