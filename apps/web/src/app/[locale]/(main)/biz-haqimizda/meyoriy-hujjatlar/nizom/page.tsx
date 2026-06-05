import NavHub from "@/components/templates/NavHub";
import type { NavItem } from "@/components/templates/NavHub";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getPageBySlug } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("nizom", { path: "/biz-haqimizda/meyoriy-hujjatlar/nizom", locale: lang });
}

function getDefaultItems(lang: "uz" | "ru" | "en"): NavItem[] {
  return [
    { title: s("mh.institut_nizomi", lang), description: s("mh.institut_nizomi_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/nizom/institut-nizomi`, icon: "Building", color: "blue" },
    { title: s("mh.tashkiliy_tuzilma", lang), description: s("mh.tashkiliy_tuzilma_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/nizom/tashkiliy-tuzilma`, icon: "LayoutGrid", color: "green" },
  ];
}

export default async function NizomPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("nizom");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["blue", "green", "purple", "orange", "teal", "red", "indigo", "cyan", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.nizom_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.nizom", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
