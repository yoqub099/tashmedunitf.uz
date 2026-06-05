import FacultiesCrudAdmin from "@/components/templates/FacultiesCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Klinik ordinatura fakultetlari — Admin",
};

export default function OrdinaturaPage() {
  return (
    <FacultiesCrudAdmin
      title="Klinik ordinatura fakultetlari"
      subtitle="Klinik ordinatura darajasidagi fakultetlarni boshqarish"
      level="ordinatura"
      basePath="/abiturientlarga/ordinatura"
    />
  );
}
