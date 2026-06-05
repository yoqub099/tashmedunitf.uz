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
  return buildMetadata("akademik-hujjatlar", { path: "/biz-haqimizda/meyoriy-hujjatlar/akademik-hujjatlar", locale: lang });
}

function getDefaultItems(lang: Language): NavItem[] {
  return [
    { title: s("doc.ilmiy_uslubiy_kengash", lang), description: s("mh.akademik_desc", lang), href: "#ilmiy-uslubiy-kengash", icon: "BookOpen", color: "cyan" },
    { title: s("doc.oquv_uslubiy_kengash", lang), description: s("mh.akademik_desc", lang), href: "#oquv-uslubiy-kengash", icon: "FileText", color: "blue" },
    { title: s("doc.ilmiy_ragbatlantirish", lang), description: s("mh.akademik_desc", lang), href: "#ilmiy-ragbatlantirish", icon: "Award", color: "green" },
    { title: s("doc.talabalar_uyushmasi", lang), description: s("mh.akademik_desc", lang), href: "#talabalar-uyushmasi", icon: "Users", color: "purple" },
    { title: s("doc.bakalavr_qabul", lang), description: s("mh.akademik_desc", lang), href: "#bakalavr-qabul", icon: "GraduationCap", color: "orange" },
    { title: s("doc.magistratura_qabul", lang), description: s("mh.akademik_desc", lang), href: "#magistratura-qabul", icon: "GraduationCap", color: "teal" },
    { title: s("doc.kochirish_tiklash", lang), description: s("mh.akademik_desc", lang), href: "#kochirish-tiklash", icon: "ClipboardList", color: "red" },
    { title: s("doc.malaka_oshirish", lang), description: s("mh.akademik_desc", lang), href: "#malaka-oshirish", icon: "Scale", color: "indigo" },
    { title: s("doc.yonaltirilgan_talim", lang), description: s("mh.akademik_desc", lang), href: "#yonaltirilgan-talim", icon: "Shield", color: "yellow" },
    { title: s("doc.akademik_nazorat", lang), description: s("mh.akademik_desc", lang), href: "#akademik-nazorat", icon: "Landmark", color: "cyan" },
  ];
}

export default async function AkademikHujjatlarPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("akademik-hujjatlar");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["cyan", "blue", "green", "purple", "orange", "teal", "red", "indigo", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.akademik_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.akademik_hujjatlar", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
