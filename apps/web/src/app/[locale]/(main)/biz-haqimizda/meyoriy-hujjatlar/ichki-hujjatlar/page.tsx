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
  return buildMetadata("ichki-hujjatlar", { path: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar", locale: lang });
}

function getDefaultItems(lang: "uz" | "ru" | "en"): NavItem[] {
  const basePath = `/${lang}/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar`;
  return [
    { title: s("doc.odob_axloq", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/odob-axloq-kodeksi`, icon: "Shield", color: "red" },
    { title: s("doc.akademik_halollik", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/akademik-halollik`, icon: "GraduationCap", color: "blue" },
    { title: s("doc.institut_kengashi", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/institut-kengashi`, icon: "Building", color: "green" },
    { title: s("doc.tanlov_reglamenti", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/tanlov-reglamenti`, icon: "ClipboardList", color: "purple" },
    { title: s("doc.diskriminatsiya", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/diskriminatsiya-siyosati`, icon: "Scale", color: "orange" },
    { title: s("doc.tyutorlik", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/tyutorlik-nizomi`, icon: "Users", color: "teal" },
    { title: s("doc.sifat_siyosati", lang), description: s("mh.ichki_meyoriy_hujjat", lang), href: `${basePath}/sifat-siyosati`, icon: "Award", color: "indigo" },
  ];
}

export default async function IchkiHujjatlarPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("ichki-hujjatlar");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["red", "blue", "green", "purple", "orange", "teal", "indigo", "cyan", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.ichki_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.ichki_hujjatlar", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
