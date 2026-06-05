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
  return buildMetadata("elonlar", { path: "/biz-haqimizda/meyoriy-hujjatlar/elonlar", locale: lang });
}

function getDefaultItems(lang: Language): NavItem[] {
  return [
    { title: s("doc.strategiya_tuzilmasi", lang), description: s("mh.elonlar_desc", lang), href: "#strategiya-tuzilmasi", icon: "Landmark", color: "yellow" },
    { title: s("doc.student_handbook", lang), description: s("mh.elonlar_desc", lang), href: "#student-handbook", icon: "BookOpen", color: "blue" },
    { title: s("doc.audit_2022", lang), description: s("mh.elonlar_desc", lang), href: "#audit-2022", icon: "ClipboardList", color: "green" },
    { title: s("doc.audit_2023", lang), description: s("mh.elonlar_desc", lang), href: "#audit-2023", icon: "ClipboardList", color: "purple" },
    { title: s("doc.akademik_jarayonlar", lang), description: s("mh.elonlar_desc", lang), href: "#akademik-jarayonlar", icon: "GraduationCap", color: "orange" },
  ];
}

export default async function ElonlarPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("elonlar");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["yellow", "blue", "green", "purple", "orange", "teal", "red", "indigo", "cyan"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.elonlar_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.elonlar", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
