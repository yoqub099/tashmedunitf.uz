import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Vazirlar Mahkamasi qarorlari — Admin" };

export default function VazirlarMahkamasiPage() {
  return (
    <StaticPageAdmin
      slug="vazirlar-mahkamasi"
      title="Vazirlar Mahkamasi qarorlari"
      description="Oliy ta'lim muassasalariga qabul qilish, pedagog xodimlar tanlov tartibi, sirtqi ta'lim va akademik ta'til to'g'risidagi nizomlar"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Vazirlar Mahkamasi" },
      ]}
      defaultItems={[
        { title: "Oliy ta'lim muassasalariga o'qishga qabul qilish, talabalar o'qishini ko'chirish, qayta tiklash va o'qishdan chetlashtirish tartibi to'g'risidagi nizomlar", description: "Vazirlar Mahkamasi qarori", color: "purple", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/qabul-tartib" },
        { title: "Oliy ta'lim muassasalariga pedagog xodimlarni tanlov asosida ishga qabul qilish tartibi to'g'risida nizom", description: "Vazirlar Mahkamasi qarori", color: "blue", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/pedagog-tanlov" },
        { title: "Oliy ta'lim muassasasida sirtqi (maxsus sirtqi) ta'limni tashkil etish tartibi to'g'risida nizom", description: "Vazirlar Mahkamasi qarori", color: "green", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/sirtqi-talim" },
        { title: "O'zbekiston Respublikasi oliy ta'lim muassasalari talabalariga akademik ta'til berish to'g'risida nizom", description: "Vazirlar Mahkamasi qarori", color: "orange", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi/akademik-tatil" },
      ]}
    />
  );
}
