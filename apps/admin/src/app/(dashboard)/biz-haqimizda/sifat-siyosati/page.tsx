import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sifat siyosati — Admin" };

export default function SifatSiyosatiPage() {
  return <StaticPageAdmin slug="sifat-siyosati" title="Sifat siyosati" description="Sifat ta'minoti siyosati va tamoyillari" />;
}
