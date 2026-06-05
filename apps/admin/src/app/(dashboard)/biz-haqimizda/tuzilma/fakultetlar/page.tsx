import FacultiesCrudAdmin from "@/components/templates/FacultiesCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fakultetlar — Admin" };

export default function FakultetlarPage() {
  return (
    <FacultiesCrudAdmin
      title="Barcha fakultetlar"
      subtitle="Universitet fakultetlarini boshqarish — qo'shish, tahrirlash, o'chirish"
      basePath="/biz-haqimizda/tuzilma/fakultetlar"
    />
  );
}
