import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sirtqi ta'limni tashkil etish tartibi — Admin",
};

export default function SirtqiTalimPage() {
  return (
    <DocumentDetailAdmin
      title="Oliy ta'lim muassasasida sirtqi (maxsus sirtqi) ta'limni tashkil etish tartibi to'g'risida nizom"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Vazirlar Mahkamasi qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi" },
        { label: "Oliy ta'lim muassasasida sirtqi (maxsus sirtqi) ta'limni tashkil etish tartibi to'g'risida nizom" },
      ]}
      documents={[
        {
          title: "Oliy ta'lim muassasasida sirtqi (maxsus sirtqi) ta'limni tashkil etish tartibi to'g'risida nizom",
          linkText: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 21.11.2017 yildagi 930-son",
          linkUrl: "https://lex.uz/docs/3420875",
        },
      ]}
    />
  );
}
