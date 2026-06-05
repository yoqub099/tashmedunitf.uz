import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akademik ta'til berish to'g'risida nizom — Admin",
};

export default function AkademikTatilPage() {
  return (
    <DocumentDetailAdmin
      title="O'zbekiston Respublikasi oliy ta'lim muassasalari talabalariga akademik ta'til berish to'g'risida nizom"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Vazirlar Mahkamasi qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi" },
        { label: "O'zbekiston Respublikasi oliy ta'lim muassasalari talabalariga akademik ta'til berish to'g'risida nizom" },
      ]}
      documents={[
        {
          title: "O'zbekiston Respublikasi oliy ta'lim muassasalari talabalariga akademik ta'til berish to'g'risida nizom",
          linkText: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 03.06.2021 yildagi 344-son",
          linkUrl: "https://lex.uz/docs/-5443081",
        },
      ]}
    />
  );
}
