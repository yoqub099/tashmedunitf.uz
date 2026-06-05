import PartnersCrudAdmin from "@/components/templates/PartnersCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hamkorlar — Admin",
  description: "Hamkor tashkilotlar va logolari",
};

export default function SheriklarPage() {
  return <PartnersCrudAdmin />;
}
