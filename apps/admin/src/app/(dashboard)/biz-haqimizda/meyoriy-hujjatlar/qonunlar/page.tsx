import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "O'zbekiston Respublikasi Qonunlari — Admin" };

export default function QonunlarPage() {
  return (
    <StaticPageAdmin
      slug="qonunlar"
      title="O'zbekiston Respublikasi Qonunlari"
      description="Ta'lim to'g'risidagi qonun, pedagogning maqomi to'g'risida qonun va litsenziyalash tartib-taomillari to'g'risida qonun"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Qonunlar" },
      ]}
      defaultItems={[
        { title: "O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni", description: "Ta'lim sohasidagi asosiy qonun", color: "teal", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar/talim-qonuni" },
        { title: "O'zbekiston Respublikasining Qonuni Pedagogning maqomi to'g'risida", description: "Pedagoglar maqomini belgilovchi qonun", color: "blue", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar/pedagog-maqomi" },
        { title: "O'zbekiston Respublikasining Qonuni Litsenziyalash, ruxsat berish va xabardor qilish tartib-taomillari to'g'risida", description: "Litsenziyalash tartib-taomillari", color: "purple", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar/litsenziyalash" },
      ]}
    />
  );
}
