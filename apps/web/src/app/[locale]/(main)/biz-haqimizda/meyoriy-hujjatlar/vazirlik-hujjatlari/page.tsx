import NavHub from "@/components/templates/NavHub";
import type { NavItem } from "@/components/templates/NavHub";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getPageBySlug } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("vazirlik-hujjatlari", { path: "/biz-haqimizda/meyoriy-hujjatlar/vazirlik-hujjatlari", locale: lang });
}

function getDefaultItems(lang: Language): NavItem[] {
  return [
    { title: s("doc.stipendiya_buyruq", lang), description: s("mh.vazirlik_desc", lang), href: "#stipendiya-buyruq", icon: "Scale", color: "green" },
    { title: s("doc.stipendiya_reglament", lang), description: s("mh.vazirlik_desc", lang), href: "#stipendiya-reglament", icon: "FileText", color: "blue" },
  ];
}

export default async function VazirlikHujjatlariPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("vazirlik-hujjatlari");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["green", "blue", "purple", "orange", "teal", "red", "indigo", "cyan", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.vazirlik_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.vazirlik_hujjatlari", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
