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
  return buildMetadata("aloqa-kanallari", { path: "/biz-haqimizda/antikorrupsiya/aloqa-kanallari", locale: lang });
}

export default async function AloqaKanallariPage() {
  const lang = await getLanguage();

  const items: NavItem[] = [
    {
      title: s("anti.online_reception_title", lang),
      description: s("anti.online_reception_desc", lang),
      href: `/${lang}/biz-haqimizda/virtual-qabulxona`,
      icon: "MessageSquare",
      color: "teal",
    },
    {
      title: s("anti.agency_title", lang),
      description: s("anti.agency_desc", lang),
      href: "https://anticorruption.uz/uz",
      icon: "Shield",
      color: "purple",
    },
  ];

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 sm:pt-10">
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.aloqa_kanallari", lang)}
        </h1>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.antikorrupsiya", lang), href: `/${lang}/biz-haqimizda/antikorrupsiya` },
            { label: s("nav.aloqa_kanallari", lang) },
          ]}
          className="mt-3"
        />
      </Container>

      <NavHub title="" items={items} />
    </div>
  );
}
