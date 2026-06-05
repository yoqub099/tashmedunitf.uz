import FacultyLevelPage from "@/components/directions/FacultyLevelPage";
import { getFaculties, getSiteContents } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("magistratura", { path: "/abiturientlarga/magistratura", locale: lang });
}

export default async function MagistraturaPage() {
  const lang = await getLanguage();
  const [res, heroRes, descRes] = await Promise.all([
    getFaculties({ per_page: 50, level: "magistratura" }).catch(
      () => ({ success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 } }),
    ),
    getSiteContents("faculties_hero_magistratura").catch(() => ({ data: [] })),
    getSiteContents("faculties_desc_magistratura").catch(() => ({ data: [] })),
  ]);
  return <FacultyLevelPage level="magistratura" faculties={res.data} heroContents={heroRes.data} descContents={descRes.data} lang={lang} />;
}
