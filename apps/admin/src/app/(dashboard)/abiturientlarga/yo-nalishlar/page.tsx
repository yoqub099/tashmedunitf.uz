import DirectionsCrudAdmin from "@/components/templates/DirectionsCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yo'nalishlar — Admin",
  description: "Barcha akademik yo'nalishlar boshqaruvi",
};

export default function YonalishlarPage() {
  return (
    <DirectionsCrudAdmin
      title="Barcha yo'nalishlar"
      subtitle="Bakalavriat, magistratura va ordinatura yo'nalishlari"
    />
  );
}
