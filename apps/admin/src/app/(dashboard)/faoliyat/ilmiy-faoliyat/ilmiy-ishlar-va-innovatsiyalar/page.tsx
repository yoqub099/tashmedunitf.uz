import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ilmiy ishlar va innovatsiyalar — Admin",
};

const innovations = [
  {
    title: "Tibbiy diagnostika innovatsiyalari",
    items: [
      "Sun'iy intellektga asoslangan rentgen tasvirlarini tahlil qilish tizimi",
      "Mobil ilovalar orqali bemorlarni masofadan monitoring qilish",
      "Laboratoriya tekshiruvlarini avtomatlashtirish texnologiyalari",
    ],
  },
  {
    title: "Farmatsevtik ishlanmalar",
    items: [
      "Surxondaryo viloyati dorivor o'simliklaridan fitopreparatlar ishlab chiqish",
      "Nanofarmatsevtika sohasidagi tadqiqotlar",
      "Biologik faol qo'shimchalar yaratish bo'yicha loyihalar",
    ],
  },
  {
    title: "Tibbiyot ta'limida innovatsiyalar",
    items: [
      "Simulyatsion ta'lim markazining faoliyati",
      "Virtual reallik texnologiyalari yordamida anatomiya o'qitish",
      "Masofaviy ta'lim platformalarini joriy etish",
      "Interaktiv klinik keys-studiyalar bazasini yaratish",
    ],
  },
];

const patents = [
  { number: "IAP 07XXX", title: "Dorivor o'simliklar asosida yangi antiseptik vosita", year: "2025" },
  { number: "IAP 07XXX", title: "Bemorlarni masofadan monitoring qilish tizimi", year: "2025" },
  { number: "IAP 07XXX", title: "Tibbiy ma'lumotlarni tahlil qilish algoritmi", year: "2024" },
];

export default function IlmiyIshlarPage() {
  return (
    <StaticPageAdmin
      slug="ilmiy-ishlar-va-innovatsiyalar"
      title="Ilmiy ishlar va innovatsiyalar"
      description="Ilmiy tadqiqot ishlari va innovatsion loyihalar"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Ilmiy ishlar va innovatsiyalar" },
      ]}
    >
      {/* ═══════ Intro ═══════ */}
      <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl mb-6">
        <h4 className="font-serif text-2xl font-semibold text-gray-900">
          Umumiy ma&apos;lumot
        </h4>
        <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
          <p>
            Toshkent davlat tibbiyot universiteti Termiz filialida ilmiy
            ishlanmalar va innovatsion loyihalar faol olib borilmoqda.
            Filial olimlari tomonidan tibbiyot amaliyotini
            takomillashtirishga qaratilgan bir qancha muhim loyihalar
            amalga oshirilmoqda.
          </p>
          <p>
            Innovatsion faoliyat natijasida olingan ixtirolar va foydali
            modellar patentlangan bo&apos;lib, ular amaliyotga joriy
            etilmoqda.
          </p>
        </div>
      </div>

      {/* ═══════ Innovation directions ═══════ */}
      <div className="space-y-6 mb-6">
        {innovations.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
          >
            <h4 className="font-serif text-2xl font-semibold text-[#00575B]">
              {section.title}
            </h4>
            <div className="mt-6 space-y-2">
              {section.items.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] bg-white p-4 md:p-5 flex items-center"
                >
                  <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                    {item}
                  </h6>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ Patents table ═══════ */}
      <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
        <h4 className="font-serif text-2xl font-semibold text-gray-900">
          Patentlar va guvohnamalar
        </h4>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="pb-3 font-semibold text-gray-900">Raqami</th>
                <th className="pb-3 font-semibold text-gray-900">Nomi</th>
                <th className="pb-3 font-semibold text-gray-900">Yili</th>
              </tr>
            </thead>
            <tbody>
              {patents.map((p, i) => (
                <tr key={i} className="border-b border-gray-200 last:border-0">
                  <td className="py-3 text-gray-600 whitespace-nowrap">{p.number}</td>
                  <td className="py-3 text-gray-700">{p.title}</td>
                  <td className="py-3 text-gray-600">{p.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaticPageAdmin>
  );
}
