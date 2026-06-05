import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Prezident farmon va qarorlari — Admin" };

export default function PrezidentQarorlariPage() {
  return (
    <StaticPageAdmin
      slug="prezident-qarorlari"
      title="Prezident farmon va qarorlari"
      description="2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi, ma'muriy islohotlar va boshqa prezident qarorlari"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Prezident qarorlari" },
      ]}
      defaultItems={[
        { title: "2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi", description: "Prezident farmoni", color: "orange", href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari/taraqqiyot-strategiyasi" },
        { title: "Ma'muriy islohotlar doirasida oliy ta'lim, fan va innovatsiyalar sohasida davlat boshqaruvini samarali tashkil qilish chora-tadbirlari", description: "Prezident qarori", color: "blue", href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari/mamuriy-islohotlar" },
      ]}
    />
  );
}
