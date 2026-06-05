import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedagog xodimlarni tanlov asosida ishga qabul qilish — Admin",
};

export default function PedagogTanlovPage() {
  return (
    <DocumentDetailAdmin
      title="Oliy ta'lim muassasalariga pedagog xodimlarni tanlov asosida ishga qabul qilish tartibi to'g'risida nizom"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Vazirlar Mahkamasi qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi" },
        { label: "Oliy ta'lim muassasalariga pedagog xodimlarni tanlov asosida ishga qabul qilish tartibi to'g'risida nizom" },
      ]}
      documents={[
        {
          title: "Oliy ta'lim muassasalariga pedagog xodimlarni tanlov asosida ishga qabul qilish tartibi to'g'risida nizom",
          linkText: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 10.02.2006 yildagi 20-son",
          linkUrl: "https://lex.uz/docs/-973497",
        },
      ]}
    />
  );
}
