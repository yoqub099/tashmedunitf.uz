import DocumentDetail from "@/components/templates/DocumentDetail";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("pedagog-tanlov", { path: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/pedagog-tanlov", locale: lang });
}

export default async function PedagogTanlovPage() {
  const lang = await getLanguage();
  return (
    <DocumentDetail
      lang={lang}
      title={s("doc.pedagog_tanlov", lang)}
      breadcrumbItems={[
        { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
        { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
        { label: s("nav.vazirlar_mahkamasi", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi` },
        { label: s("doc.pedagog_tanlov", lang) },
      ]}
      documents={[
        {
          title: s("doc.pedagog_tanlov_full", lang),
          linkText: s("doc.pedagog_tanlov_subtitle", lang),
          linkUrl: "https://lex.uz/docs/-973497",
        },
      ]}
    />
  );
}
