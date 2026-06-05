import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("jurnal-boglanish", { path: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/boglanish", locale: lang });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
