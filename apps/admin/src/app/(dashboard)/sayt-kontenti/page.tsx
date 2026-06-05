import SiteContentsCrudAdmin from "@/components/templates/SiteContentsCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayt kontenti — Admin",
  description: "Frontend statik matnlar va HTML bloklar boshqaruvi",
};

export default function SaytKontentiPage() {
  return <SiteContentsCrudAdmin />;
}
