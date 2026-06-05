import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ma'muriy islohotlar — Prezident qarori — Admin",
};

export default function MamuriyIslohotlarPage() {
  return (
    <DocumentDetailAdmin
      title="Ma'muriy islohotlar doirasida oliy ta'lim, fan va innovatsiyalar sohasida davlat boshqaruvini samarali tashkil qilish chora-tadbirlari"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Prezident qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari" },
        { label: "Ma'muriy islohotlar" },
      ]}
      documents={[
        {
          title: "Ma'muriy islohotlar doirasida oliy ta'lim, fan va innovatsiyalar sohasida davlat boshqaruvini samarali tashkil qilish chora-tadbirlari",
          linkText: "O'zbekiston Respublikasi Prezidentining qarori, 03.07.2023 yildagi PQ-200-son",
          linkUrl: "https://lex.uz/uz/docs/-6518515",
        },
      ]}
    />
  );
}
