import JournalNavbar from "@/components/journal/JournalNavbar";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const seoMeta = buildMetadata("ilmiy-jurnal", {
    path: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal",
    locale: lang,
  });
  return {
    ...seoMeta,
    title: {
      template: "%s | Ilmiy jurnal | ToshDTU Termiz filiali",
      default: "Ilmiy jurnal | ToshDTU Termiz filiali",
    },
  };
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JournalNavbar />
      {children}
    </>
  );
}
