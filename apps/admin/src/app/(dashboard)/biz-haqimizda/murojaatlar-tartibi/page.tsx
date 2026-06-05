import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Murojaatlar tartibi — Admin" };

export default function MurojaatlarTartibiPage() {
  return <StaticPageAdmin slug="murojaatlar-tartibi" title="Murojaatlar tartibi" description="Murojaat qilish tartibi va qoidalari" />;
}
