import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return {
    title: s("applicants.qabul_komissiyasi_meta", lang),
    robots: { index: false, follow: true },
  };
}

export default async function QabulKomissiyasiPage() {
  const lang = await getLanguage();
  redirect(`/${lang}/abiturientlarga`);
}
