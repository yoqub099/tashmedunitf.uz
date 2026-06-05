import FacultiesCrudAdmin from "@/components/templates/FacultiesCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magistratura fakultetlari — Admin",
};

export default function MagistraturaPage() {
  return (
    <FacultiesCrudAdmin
      title="Magistratura fakultetlari"
      subtitle="Magistratura darajasidagi fakultetlarni boshqarish"
      level="magistratura"
      basePath="/abiturientlarga/magistratura"
    />
  );
}
