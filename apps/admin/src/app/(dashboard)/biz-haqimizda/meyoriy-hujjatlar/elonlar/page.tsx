import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "E'lonlar va bildirishnomalar — Admin" };

export default function ElonlarPage() {
  return (
    <StaticPageAdmin
      slug="elonlar"
      title="E'lonlar va bildirishnomalar"
      description="ISFT strategiyasi, student handbook, auditorlik hulosalari va akademik jarayonlarni tashkil etish hujjatlari"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "E'lonlar" },
      ]}
      defaultItems={[
        { title: "ISFT Institutning 2024-2028-yillarga mo'ljallangan strategiyasi tuzilmasi", description: "Strategik hujjat", color: "yellow" },
        { title: "Student handbook", description: "Talabalar uchun qo'llanma", color: "blue" },
        { title: "2022 yil uchun auditorlik hulosasi", description: "Moliyaviy hisobot", color: "green" },
        { title: "2023 yil uchun auditorlik hulosasi", description: "Moliyaviy hisobot", color: "purple" },
        { title: "Akademik jarayonlarni tashkil etish", description: "O'quv jarayoni", color: "orange" },
      ]}
    />
  );
}
