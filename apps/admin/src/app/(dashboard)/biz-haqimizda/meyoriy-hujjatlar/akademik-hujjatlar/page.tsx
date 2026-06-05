import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Akademik sohaga oid hujjatlar — Admin" };

export default function AkademikHujjatlarPage() {
  return (
    <StaticPageAdmin
      slug="akademik-hujjatlar"
      title="Akademik sohaga oid hujjatlar"
      description="Ilmiy uslubiy kengash, o'quv-uslubiy kengash, talabalar uyushmasi, bakalavr va magistratura qabul, malaka oshirish va akademik jarayonlar nizomi"
      breadcrumbItems={[
        { label: "Biz haqimizda", href: "/biz-haqimizda" },
        { label: "Me'yoriy hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar" },
        { label: "Akademik hujjatlar" },
      ]}
      defaultItems={[
        { title: "Ilmiy uslubiy kengash nizomi", description: "Akademik hujjat", color: "cyan" },
        { title: "O'quv-uslubiy kengash nizomi", description: "Akademik hujjat", color: "blue" },
        { title: "Ilmiy ishlanmalarni rag'batlantirish tartibi nizomi", description: "Akademik hujjat", color: "green" },
        { title: "Talabalar uyushmasi nizomi", description: "Akademik hujjat", color: "purple" },
        { title: "Bakalavriatga o'qishga qabul qilish nizomi", description: "Akademik hujjat", color: "orange" },
        { title: "Magistraturaga qabul qilish nizomi", description: "Akademik hujjat", color: "teal" },
        { title: "Talabalar o'qishni ko'chirish, qayta tiklash va o'qishdan chetlashtirish nizomi", description: "Akademik hujjat", color: "red" },
        { title: "Malaka oshirish to'g'risida nizom", description: "Akademik hujjat", color: "indigo" },
        { title: "Talabalarga yo'naltirilgan ta'lim to'g'risidagi nizom", description: "Akademik hujjat", color: "yellow" },
        { title: "Akademik jarayonlarni tashkil etish va talabalar bilimini nazorat qilish nizomi", description: "Akademik hujjat", color: "cyan" },
      ]}
    />
  );
}
