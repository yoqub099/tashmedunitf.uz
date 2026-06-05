import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OAQ tavsiya nashrlar — Admin",
};

const journals = [
  {
    category: "Tibbiyot fanlari",
    items: [
      { name: "O'zbekiston tibbiyot jurnali", issn: "2181-1458", index: "Scopus, Web of Science" },
      { name: "Tibbiyotda yangi kun", issn: "2181-712X", index: "RSCI" },
      { name: "Stomatologiya", issn: "2091-5845", index: "RSCI" },
      { name: "Pediatriya (Toshkent)", issn: "2181-0443", index: "RSCI" },
      { name: "Infeksiya, immunitet va farmakologiya", issn: "2181-2985", index: "RSCI" },
      { name: "Journal of Biomedicine and Practice", issn: "2181-9300", index: "Google Scholar" },
      { name: "Central Asian Journal of Medical and Natural Sciences", issn: "2708-1028", index: "Google Scholar, SJIF" },
    ],
  },
  {
    category: "Farmatsevtika fanlari",
    items: [
      { name: "O'zbekiston farmatsevtik xabarnomasi", issn: "2181-1466", index: "RSCI" },
      { name: "Farmatsiya va farmakologiya xalqaro jurnali", issn: "2181-2799", index: "Google Scholar" },
      { name: "Kimyo va farmatsiya ilmiy xabarlari", issn: "2181-0850", index: "RSCI" },
    ],
  },
  {
    category: "Biologiya va jamoat salomatligi fanlari",
    items: [
      { name: "O'zbekiston biologiya jurnali", issn: "2181-1474", index: "RSCI" },
      { name: "Gigiyena va sanitariya", issn: "0016-9900", index: "Scopus" },
      { name: "Sog'liqni saqlashni tashkil etish va boshqarish", issn: "2181-0710", index: "Google Scholar" },
    ],
  },
];

export default function OaqTavsiyaPage() {
  return (
    <StaticPageAdmin
      slug="oaq-tavsiya-nashrlar"
      title="OAK tavsiya nashrlar"
      description="Oliy attestatsiya komissiyasi tavsiya etgan nashrlar"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "OAK tavsiya nashrlar" },
      ]}
    >
      {/* ═══════ Info ═══════ */}
      <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl mb-6">
        <h4 className="font-serif text-2xl font-semibold text-gray-900">
          Oliy attestatsiya komissiyasi tomonidan tavsiya etilgan
          ilmiy nashrlar ro&apos;yxati
        </h4>
        <div className="mt-4 text-base text-gray-700 leading-relaxed">
          <p>
            Quyida O&apos;zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi
            Oliy attestatsiya komissiyasi (OAK) tomonidan doktorlik
            dissertatsiyalari asosiy ilmiy natijalarini chop etish tavsiya
            etilgan ilmiy nashrlar ro&apos;yxati keltirilgan.
          </p>
        </div>
      </div>

      {/* ═══════ Journals by category ═══════ */}
      <div className="space-y-6">
        {journals.map((cat) => (
          <div
            key={cat.category}
            className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
          >
            <h4 className="font-serif text-2xl font-semibold text-[#00575B]">
              {cat.category}
            </h4>
            <div className="mt-6 space-y-2">
              {cat.items.map((j) => (
                <div
                  key={j.name}
                  className="rounded-[20px] bg-white p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                      {j.name}
                    </h6>
                    <p className="text-sm text-gray-500 mt-1">
                      ISSN: {j.issn}
                    </p>
                  </div>
                  <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B] whitespace-nowrap">
                    {j.index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StaticPageAdmin>
  );
}
