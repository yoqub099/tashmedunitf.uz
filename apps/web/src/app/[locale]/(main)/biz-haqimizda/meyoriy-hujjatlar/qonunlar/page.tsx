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
  return buildMetadata("qonunlar", { path: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar", locale: lang });
}

function getDefaultItems(lang: "uz" | "ru" | "en"): NavItem[] {
  return [
    { title: s("doc.talim_qonuni", lang), description: s("mh.talim_qonuni_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar/talim-qonuni`, icon: "Scale", color: "teal" },
    { title: s("doc.pedagog_maqomi", lang), description: s("mh.pedagog_maqomi_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar/pedagog-maqomi`, icon: "GraduationCap", color: "blue" },
    { title: s("doc.litsenziyalash", lang), description: s("mh.litsenziyalash_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar/litsenziyalash`, icon: "FileText", color: "purple" },
  ];
}

export default async function QonunlarPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("qonunlar");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["teal", "blue", "purple", "orange", "green", "red", "indigo", "cyan", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      {/* ISFT style header */}
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.qonunlar_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.qonunlar", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
