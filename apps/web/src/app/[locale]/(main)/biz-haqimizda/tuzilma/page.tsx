import NavHub from "@/components/templates/NavHub";
import type { NavItem } from "@/components/templates/NavHub";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("tuzilma", { path: "/biz-haqimizda/tuzilma", locale: lang });
}

function getItems(lang: string): NavItem[] {
  const l = lang as "uz" | "ru" | "en";
  return [
    { title: s("nav.rektorat", l), description: s("tuzilma.rektorat_desc", l), href: `/${l}/biz-haqimizda/tuzilma/rektorat`, icon: "Crown", color: "blue" },
    { title: s("nav.xodimlar", l), description: s("tuzilma.xodimlar_desc", l), href: `/${l}/biz-haqimizda/tuzilma/xodimlar`, icon: "Users", color: "green" },
    { title: s("nav.kafedralar", l), description: s("tuzilma.kafedralar_desc", l), href: `/${l}/biz-haqimizda/tuzilma/kafedralar`, icon: "Building2", color: "purple" },
    { title: s("nav.fakultetlar", l), description: s("tuzilma.fakultetlar_desc", l), href: `/${l}/biz-haqimizda/tuzilma/fakultetlar`, icon: "GraduationCap", color: "orange" },
    { title: s("nav.konsultativ_organlar", l), description: s("tuzilma.konsultativ_desc", l), href: `/${l}/biz-haqimizda/tuzilma/konsultativ-organlar`, icon: "Landmark", color: "teal" },
    { title: s("nav.filiallar", l), description: s("tuzilma.filiallar_desc", l), href: `/${l}/biz-haqimizda/tuzilma/filiallar`, icon: "GitBranch", color: "indigo" },
  ];
}

export default async function TuzilmaPage() {
  const lang = await getLanguage();
  return (
    <div className="pt-20 lg:pt-24">
      <Container as="section" className="py-6">
        <h2 className="font-serif text-2xl font-semibold text-gray-900 md:text-[32px] lg:text-[40px]">
          {s("nav.tuzilma", lang)}
        </h2>
        <Breadcrumb
          className="mt-3"
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.tuzilma", lang) },
          ]}
        />
      </Container>
      <NavHub title="" items={getItems(lang)} />
    </div>
  );
}
