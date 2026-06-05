import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getNews } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import CareerClient from "./CareerClient";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("karyera-markazi", { path: "/talabalarga/karyera-markazi", locale: lang });
}

const VACANCY_CATEGORY = "vakansiyalar";

export default async function CareerCenterPage() {
  const lang = await getLanguage();

  const mainRes = await getNews({ per_page: 100, category: VACANCY_CATEGORY }).catch(() => ({
    success: false,
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
  }));

  const vacancies = mainRes.data;
  const latestVacancies = vacancies.slice(0, 5);
  const totalVacancies = mainRes.meta?.total ?? vacancies.length;

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.talabalarga", lang), href: `/${lang}/talabalarga` },
            { label: s("nav.karyera_markazi", lang) },
          ]}
        />

        <CareerClient vacancies={vacancies} latestVacancies={latestVacancies} totalVacancies={totalVacancies} />
      </Container>
    </div>
  );
}
