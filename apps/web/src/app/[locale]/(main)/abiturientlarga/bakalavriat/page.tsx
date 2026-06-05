import FacultyLevelPage from "@/components/directions/FacultyLevelPage";
import { getFaculties, getSiteContents } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("bakalavriat", { path: "/abiturientlarga/bakalavriat", locale: lang });
}

export default async function BakalaviatPage() {
  const lang = await getLanguage();
  const [res, heroRes, descRes] = await Promise.all([
    getFaculties({ per_page: 50, level: "bakalavriat" }).catch(
      () => ({ success: false, data: [], meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 } }),
    ),
    getSiteContents("faculties_hero_bakalavriat").catch(() => ({ data: [] })),
    getSiteContents("faculties_desc_bakalavriat").catch(() => ({ data: [] })),
  ]);
  return <FacultyLevelPage level="bakalavriat" faculties={res.data} heroContents={heroRes.data} descContents={descRes.data} lang={lang} />;
}
