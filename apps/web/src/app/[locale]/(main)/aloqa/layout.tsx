import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("aloqa", { path: "/aloqa", locale: lang });
}

export default function AloqaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
