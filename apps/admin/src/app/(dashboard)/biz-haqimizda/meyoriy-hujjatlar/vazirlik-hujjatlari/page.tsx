import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vazirlik buyruq va qarorlari — Admin" };

export default function VazirlikHujjatlariPage() {
  return (
    <StaticPageAdmin
      slug="vazirlik-hujjatlari"
      title="Vazirlik buyruq va qarorlari"
      description="Prezident va nomli davlat stipendiyalari tanlovlarida ishtirok etish uchun onlayn ariza yuborish buyrug'i va reglamenti"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Vazirlik hujjatlari" },
      ]}
      defaultItems={[
        { title: "O'zbekiston Respublikasi Prezidenti va nomli davlat stipendiyalari tanlovlarida ishtirok etish uchun onlayn ariza yuborish axborot tizimidan foydalanish reglamentini tasdiqlash to'g'risida BUYRUQ", description: "Vazirlik buyrug'i", color: "green" },
        { title: "O'zbekiston Respublikasi Prezidenti va nomli davlat stipendiyalari tanlovlarida ishtirok etish uchun onlayn ariza yuborish axborot tizimidan foydalanish bo'yicha REGLAMENT", description: "Vazirlik reglamenti", color: "blue" },
      ]}
    />
  );
}
