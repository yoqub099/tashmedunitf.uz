import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yo'riqnoma — Ilmiy jurnal — Admin",
};

const guideSections = [
  {
    title: "Maqolani rasmiylashtirish talablari:",
    content: `Matn Microsoft Word dasturida tayyorlanishi kerak;
Qog'oz formati – A4;
Sahifa chegaralari (yuqori, pastki, chap va o'ng) – 2 sm;
Shrift – Times New Roman;
Asosiy matn shrift o'lchami – 14;
Metama'lumotlar shrift o'lchami – 14;
Satr oralig'i – 1,5;
Abzas – 1 sm;
Matn kitob uslubida rasmiylashtirilgan;
Grafik va jadvallar qora-oq variantda taqdim etilishi kerak;
Maqola sarlavhasi bosh harflar bilan, markazda yozilgan;
Muallif haqida ma'lumot kursiv bilan yozilgan;
Matn kengligi bo'yicha tekislangan.`,
  },
  {
    title: "Mualliflar taqdim etishi kerak bo'lgan ma'lumotlar:",
    content: `Familiya, ism, otasining ismi (to'liq);
Ilmiy daraja (mavjud bo'lsa);
Unvon (mavjud bo'lsa);
Ish joyi va lavozimi;
Elektron pochta manzili;
Telefon raqami (mobil yoki uy).`,
  },
  {
    title: "Maqolaga kirish",
    content: "Kirish qismida tanlangan mavzuning dolzarbligi, yangiligi, tadqiqot maqsad va vazifalari bayon etiladi.",
  },
  {
    title: "Metodologiya",
    content: "\"Metodologiya\" bo'limida maqola yozishda qo'llanilgan usullar tavsiflangan.",
  },
  {
    title: "Asosiy natijalar",
    content: "Asosiy \"Natijalar\" bo'limida erishilgan natijalar tavsiflangan. Bu jadvallar, diagrammalar va statistik tahlillarni o'z ichiga olishi mumkin.",
  },
  {
    title: "Xulosa",
    content: "Xulosa qismida yakuniy xulosalar, tavsiyalar va takliflar keltirilgan.",
  },
  {
    title: "Foydalanilgan adabiyotlar ro'yxati",
    content: `Adabiyotlar ro'yxati alifbo tartibida, 12 pt shrift bilan tuzilishi kerak.
Faqat maqolada foydalanilgan adabiyotlar ko'rsatilishi kerak.
Matndagi adabiyotlar ro'yxati: [1; 195], [3; 20, 7; 68], [4].`,
  },
];

export default function YoriqnomaAdminPage() {
  return (
    <StaticPageAdmin
      slug="ilmiy-jurnal-yoriqnoma"
      title="Yo'riqnoma"
      description="Maqola topshirish talablari va rasmiylashtirish qoidalari"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Ilmiy jurnal", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
        { label: "Yo'riqnoma" },
      ]}
    >
      <div className="rounded-2xl md:p-6 lg:rounded-3xl bg-gray-100 p-6">
        <h2 className="text-2xl md:text-[28px] leading-7 font-bold text-center md:text-left text-gray-900 mb-6">
          Ilmiy maqolaga qo&apos;yilgan talablar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Left — requirements sections */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guideSections.map((section) => (
                <div key={section.title} className="leading-6">
                  <p className="text-gray-900 font-bold mb-2 text-base">
                    {section.title}
                  </p>
                  <p className="text-justify text-xs whitespace-pre-line text-gray-700">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — guide image + download */}
          <div className="flex flex-col">
            <div className="relative w-full h-64 md:h-[500px]">
              <Image
                src="/imgs/journal/article-guide.jpg"
                alt="Maqola tuzilishi"
                fill
                className="object-contain rounded-xl border border-slate-200"
                unoptimized
              />
            </div>
            <div
              className="relative flex items-center justify-center font-semibold overflow-hidden px-6 text-base leading-5 gap-2.5 bg-[#00575B] text-white w-full mt-4 py-3"
              style={{ borderRadius: 12 }}
            >
              <span className="whitespace-nowrap">
                Yo&apos;riqnomani yuklash
              </span>
            </div>
          </div>
        </div>
      </div>
    </StaticPageAdmin>
  );
}
