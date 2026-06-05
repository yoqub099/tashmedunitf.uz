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
  return buildMetadata("vazirlar-mahkamasi", { path: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi", locale: lang });
}

function getDefaultItems(lang: "uz" | "ru" | "en"): NavItem[] {
  return [
    { title: s("doc.qabul_tartib", lang), description: s("mh.vm_qarori", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/qabul-tartib`, icon: "GraduationCap", color: "purple" },
    { title: s("doc.pedagog_tanlov", lang), description: s("mh.vm_qarori", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/pedagog-tanlov`, icon: "Users", color: "blue" },
    { title: s("doc.sirtqi_talim", lang), description: s("mh.vm_qarori", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/sirtqi-talim`, icon: "BookOpen", color: "green" },
    { title: s("doc.akademik_tatil", lang), description: s("mh.vm_qarori", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/akademik-tatil`, icon: "FileText", color: "orange" },
  ];
}

export default async function VazirlarMahkamasiPage() {
  const lang = await getLanguage();
  let page;
  try {
    const res = await getPageBySlug("vazirlar-mahkamasi");
    page = res.data;
  } catch { /* fallback */ }

  const documents = page?.documents ?? [];

  const items: NavItem[] = documents.length > 0
    ? documents.map((doc, i) => ({
        title: doc.name || doc.file_name,
        description: s("mh.download_hint", lang),
        href: doc.url,
        icon: "FileText",
        color: ["purple", "blue", "green", "orange", "teal", "red", "indigo", "cyan", "yellow"][i % 9],
      }))
    : getDefaultItems(lang);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("mh.vm_title", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.meyoriy_hujjatlar", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar` },
            { label: s("nav.vazirlar_mahkamasi", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
