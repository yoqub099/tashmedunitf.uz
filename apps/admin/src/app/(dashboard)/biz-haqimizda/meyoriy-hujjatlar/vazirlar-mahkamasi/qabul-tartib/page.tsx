import DocumentDetailAdmin from "@/components/templates/DocumentDetailAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oliy ta'lim muassasalariga o'qishga qabul qilish tartibi — Admin",
};

export default function QabulTartibPage() {
  return (
    <DocumentDetailAdmin
      title="Oliy ta'lim muassasalariga o'qishga qabul qilish, talabalar o'qishini ko'chirish, qayta tiklash va o'qishdan chetlashtirish tartibi to'g'risidagi nizomlar"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Vazirlar Mahkamasi qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi" },
        { label: "Oliy ta'lim muassasalariga o'qishga qabul qilish, talabalar o'qishini ko'chirish, qayta tiklash va o'qishdan chetlashtirish" },
      ]}
      documents={[
        {
          title: "Oliy ta'lim muassasalariga o'qishga qabul qilish, talabalar o'qishini ko'chirish, qayta tiklash va o'qishdan chetlashtirish tartibi to'g'risidagi nizomlar",
          linkText: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 20.06.2017 yildagi 393-son",
          linkUrl: "https://lex.uz/docs/3244181",
        },
      ]}
    />
  );
}
