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
  return buildMetadata("idoraviy-hujjatlar", { path: "/biz-haqimizda/antikorrupsiya/idoraviy-hujjatlar", locale: lang });
}

export default async function IdoraviyHujjatlarPage() {
  const lang = await getLanguage();

  const items: NavItem[] = [
    {
      title: s("anti.law_title", lang),
      description: s("anti.law_desc", lang),
      href: "https://lex.uz/docs/3088008",
      icon: "Scale",
      color: "teal",
    },
  ];

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.idoraviy_hujjatlar", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.antikorrupsiya", lang), href: `/${lang}/biz-haqimizda/antikorrupsiya` },
            { label: s("nav.idoraviy_hujjatlar", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
