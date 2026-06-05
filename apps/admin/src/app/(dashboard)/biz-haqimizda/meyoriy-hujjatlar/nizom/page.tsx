import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Filial nizomi va ustavi — Admin" };

export default function NizomPage() {
  return (
    <StaticPageAdmin
      slug="nizom"
      title="Filial nizomi va ustavi"
      description="Institut nizomi va tashkiliy tuzilma hujjatlari"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Nizom" },
      ]}
      defaultItems={[
        { title: "Institut nizomi", description: "Asosiy hujjat", color: "blue", href: "/biz-haqimizda/meyoriy-hujjatlar/nizom/institut-nizomi" },
        { title: "Tashkiliy tuzilma", description: "Institut tuzilmasi", color: "green", href: "/biz-haqimizda/meyoriy-hujjatlar/nizom/tashkiliy-tuzilma" },
      ]}
    />
  );
}