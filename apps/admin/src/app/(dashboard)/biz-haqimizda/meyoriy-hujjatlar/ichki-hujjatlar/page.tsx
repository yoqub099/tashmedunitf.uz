import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ichki me'yoriy hujjatlar — Admin" };

export default function IchkiHujjatlarPage() {
  return (
    <StaticPageAdmin
      slug="ichki-hujjatlar"
      title="Ichki me'yoriy hujjatlar"
      description="Odob-axloq kodeksi, akademik halollik, institut kengashi nizomi, tanlov reglamenti, diskriminatsiyaga yo'l qo'ymaslik siyosati, tyutorlik nizomi va sifat siyosati"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Ichki hujjatlar" },
      ]}
      defaultItems={[
        { title: "Odob-axloq kodeksi", description: "Ichki me'yoriy hujjat", color: "red" },
        { title: "Akademik halollik va ilmiy-tadqiqot etikasi", description: "Ichki me'yoriy hujjat", color: "blue" },
        { title: "Institut Kengashi nizomi", description: "Ichki me'yoriy hujjat", color: "green" },
        { title: "ISFT instituti o'qituvchilari uchun tanlov o'tkazish reglamenti", description: "Ichki me'yoriy hujjat", color: "purple" },
        { title: "ISFT diskriminatsiyaga yo'l qo'ymaslik siyosati", description: "Ichki me'yoriy hujjat", color: "orange" },
        { title: "\"ISFT\" institutida tyutorlik faoliyatini tashkil etish nizomi", description: "Ichki me'yoriy hujjat", color: "teal" },
        { title: "\"ISFT\" institutining sifatni ta'minlash siyosati", description: "Ichki me'yoriy hujjat", color: "indigo" },
      ]}
    />
  );
}
