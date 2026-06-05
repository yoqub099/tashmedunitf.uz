import { getFaculties, getDirections, getFaqs, getSiteContents } from "@/lib/services";
import type { Faculty, Direction, FAQItem, SiteContent } from "@/types";
import ApplicantsPageClient from "@/components/directions/ApplicantsPageClient";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("abiturientlarga", { path: "/abiturientlarga", locale: lang });
}

const empty = <T,>(fallback: T) => () => fallback;

export default async function ApplicantsPage() {
  const lang = await getLanguage();
  const [facultiesRes, directionsRes, faqsRes, siteContentsRes] = await Promise.all([
    getFaculties({ per_page: 50 }).catch(empty({ data: [] as Faculty[], meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 } })),
    getDirections({ per_page: 100 }).catch(empty({ data: [] as Direction[], meta: { current_page: 1, last_page: 1, per_page: 100, total: 0 } })),
    getFaqs({ per_page: 50 }).catch(empty({ data: [] as FAQItem[], meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 } })),
    getSiteContents("applicants").catch(empty({ data: [] as SiteContent[] })),
  ]);

  const faculties = (facultiesRes.data || []).filter((f) => f.is_active !== false);
  const directions = (directionsRes.data || []).filter((d) => d.is_active !== false);
  const faqs = (faqsRes.data || []).filter((f) => f.is_active !== false);
  const siteContents = siteContentsRes.data || [];

  return (
    <ApplicantsPageClient
      faculties={faculties}
      directions={directions}
      faqs={faqs}
      siteContents={siteContents}
      lang={lang}
    />
  );
}
