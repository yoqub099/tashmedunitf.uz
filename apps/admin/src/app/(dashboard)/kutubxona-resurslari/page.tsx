import LibraryResourcesCrudAdmin from "@/components/templates/LibraryResourcesCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kutubxona resurslari — Admin",
  description: "Kitoblar, jurnallar va e-resurslar boshqaruvi",
};

export default function KutubxonaResurslariPage() {
  return <LibraryResourcesCrudAdmin />;
}
