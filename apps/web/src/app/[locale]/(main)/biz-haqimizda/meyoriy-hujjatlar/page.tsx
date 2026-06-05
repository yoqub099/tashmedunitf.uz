import NavHub from "@/components/templates/NavHub";
import type { NavItem } from "@/components/templates/NavHub";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("meyoriy-hujjatlar", { path: "/biz-haqimizda/meyoriy-hujjatlar", locale: lang });
}

function getItems(lang: Language): NavItem[] {
  return [
    { title: s("nav.nizom", lang), description: s("mh.nizom_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/nizom`, icon: "ScrollText", color: "blue" },
    { title: s("nav.vazirlik_hujjatlari", lang), description: s("mh.vazirlik_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlik-hujjatlari`, icon: "Building", color: "green" },
    { title: s("nav.vazirlar_mahkamasi", lang), description: s("mh.vm_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi`, icon: "Shield", color: "purple" },
    { title: s("nav.prezident_qarorlari", lang), description: s("mh.prezident_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari`, icon: "Award", color: "orange" },
    { title: s("nav.ichki_hujjatlar", lang), description: s("mh.ichki_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar`, icon: "FileText", color: "red" },
    { title: s("nav.qonunlar", lang), description: s("mh.qonunlar_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/qonunlar`, icon: "Scale", color: "teal" },
    { title: s("nav.ishga_qabul", lang), description: s("mh.ishga_qabul_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/ishga-qabul`, icon: "Briefcase", color: "indigo" },
    { title: s("nav.akademik_hujjatlar", lang), description: s("mh.akademik_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/akademik-hujjatlar`, icon: "BookOpen", color: "cyan" },
    { title: s("nav.elonlar", lang), description: s("mh.elonlar_desc", lang), href: `/${lang}/biz-haqimizda/meyoriy-hujjatlar/elonlar`, icon: "FileText", color: "yellow" },
  ];
}

export default async function MeyoriyHujjatlarPage() {
  const lang = await getLanguage();
  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <NavHub title={s("nav.meyoriy_hujjatlar", lang)} subtitle={s("mh.subtitle", lang)} items={getItems(lang)} />
    </div>
  );
}
