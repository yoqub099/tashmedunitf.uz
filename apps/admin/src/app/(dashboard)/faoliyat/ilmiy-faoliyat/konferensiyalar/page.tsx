import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konferensiyalar — Admin",
};

const conferences = [
  {
    title: "\"Zamonaviy tibbiyotning dolzarb muammolari\" xalqaro ilmiy-amaliy konferensiya",
    date: "2026-yil, aprel",
    location: "ToshDTU Termiz filiali",
    status: "Rejalashtirilgan",
    statusColor: "bg-blue-100 text-blue-700",
    topics: [
      "Klinik tibbiyotdagi zamonaviy yondashuvlar",
      "Jamoat salomatligi va profilaktik tibbiyot",
      "Farmatsevtika sohasidagi innovatsiyalar",
      "Tibbiyot ta'limida raqamli texnologiyalar",
    ],
  },
  {
    title: "\"Yosh olimlar va talabalar\" respublika ilmiy konferensiyasi",
    date: "2026-yil, may",
    location: "ToshDTU Termiz filiali",
    status: "Rejalashtirilgan",
    statusColor: "bg-blue-100 text-blue-700",
    topics: [
      "Talabalar ilmiy tadqiqot ishlari",
      "Magistrlik dissertatsiyalari natijalari",
      "Innovatsion tibbiy texnologiyalar",
    ],
  },
  {
    title: "\"Surxondaryo mintaqasi aholisi salomatligi\" ilmiy-amaliy seminar",
    date: "2025-yil, noyabr",
    location: "ToshDTU Termiz filiali",
    status: "O'tkazildi",
    statusColor: "bg-green-100 text-green-700",
    topics: [
      "Mintaqaviy epidemiologik holat tahlili",
      "Yuqumli kasalliklarning oldini olish",
      "Sog'lom turmush tarzi targ'iboti",
    ],
  },
];

export default function KonferensiyalarPage() {
  return (
    <StaticPageAdmin
      slug="ilmiy-konferensiyalar"
      title="Konferensiyalar"
      description="Ilmiy konferensiyalar va seminarlar"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Konferensiyalar" },
      ]}
    >
      {/* ═══════ Conference cards ═══════ */}
      <div className="space-y-6">
        {conferences.map((conf) => (
          <div
            key={conf.title}
            className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="font-serif text-xl font-semibold text-gray-900 md:text-2xl max-w-2xl">
                {conf.title}
              </h4>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${conf.statusColor}`}>
                {conf.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                {conf.date}
              </span>
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {conf.location}
              </span>
            </div>
            <div className="mt-6 space-y-2">
              {conf.topics.map((topic) => (
                <div
                  key={topic}
                  className="rounded-[20px] bg-white p-4 md:p-5 flex items-center"
                >
                  <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                    {topic}
                  </h6>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StaticPageAdmin>
  );
}
