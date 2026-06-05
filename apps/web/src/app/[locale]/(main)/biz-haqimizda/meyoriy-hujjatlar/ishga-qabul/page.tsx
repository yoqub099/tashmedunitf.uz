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
  return buildMetadata("ishga-qabul", { path: "/biz-haqimizda/meyoriy-hujjatlar/ishga-qabul", locale: lang });
}

function getDefaultItems(lang: Language): NavItem[] {
  return [
    { title: s("doc.ishga_qabul_nizomi", lang), description: s("mh.ishga_qabul_desc", lang), href: "#ishga-qabul-nizomi", icon: "Briefcase", color: "indigo" },
    { title: s("doc.kadrlar_siyosati", lang), description: s("mh.ishga_qabul_desc", lang), href: "#kadrlar-siyosati", icon: "Users", color: "blue" },
  ];
}

export default async function IshgaQabulPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("ishga-qabul");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["indigo", "blue", "green", "purple", "orange", "teal", "red", "cyan", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.ishga_qabul_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.ishga_qabul", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
