import FacultiesCrudAdmin from "@/components/templates/FacultiesCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakalavriat fakultetlari — Admin",
};

export default function BakalavriatPage() {
  return (
    <FacultiesCrudAdmin
      title="Bakalavriat fakultetlari"
      subtitle="Bakalavriat darajasidagi fakultetlarni boshqarish"
      level="bakalavriat"
      basePath="/abiturientlarga/bakalavriat"
    />
  );
}
