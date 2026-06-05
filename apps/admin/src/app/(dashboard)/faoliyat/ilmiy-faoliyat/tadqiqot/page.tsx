import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tadqiqot — Admin",
};

const directions = [
  {
    title: "Klinik tadqiqotlar",
    items: [
      "Yurak-qon tomir kasalliklarining mintaqaviy epidemiologiyasi",
      "Endokrin kasalliklar diagnostikasi va davolashning zamonaviy usullari",
      "Bolalar kasalliklarining erta tashxisi va profilaktikasi",
      "Onkologik kasalliklarning erta aniqlash usullarini takomillashtirish",
    ],
  },
  {
    title: "Jamoat salomatligi",
    items: [
      "Surxondaryo viloyati aholisi salomatlik holati monitoringi",
      "Yuqumli kasalliklarning epidemiologik nazorati",
      "Onalik va bolalik muhofazasi masalalari",
      "Ekologik omillarning sog'liqqa ta'siri tadqiqotlari",
    ],
  },
  {
    title: "Farmatsevtik tadqiqotlar",
    items: [
      "Mahalliy dorivor o'simliklardan yangi preparatlar yaratish",
      "Dori vositalarining farmakokinetik xususiyatlarini o'rganish",
      "Biologik faol moddalarning sintezi va tadqiqi",
    ],
  },
];

const stats = [
  { value: "50+", label: "Ilmiy maqolalar" },
  { value: "12", label: "Ilmiy loyihalar" },
  { value: "8", label: "Xalqaro hamkorliklar" },
  { value: "30+", label: "Tadqiqotchilar" },
];

export default function TadqiqotPage() {
  return (
    <StaticPageAdmin
      slug="tadqiqot"
      title="Tadqiqot"
      description="Ilmiy tadqiqotlar va natijalar"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Tadqiqot" },
      ]}
    >
      {/* ═══════ Stats ═══════ */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-5 text-center text-white"
          >
            <p className="font-serif text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm opacity-90">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ═══════ About ═══════ */}
      <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl mb-6">
        <h4 className="font-serif text-2xl font-semibold text-gray-900">
          Ilmiy tadqiqot ishlari haqida
        </h4>
        <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
          <p>
            Toshkent davlat tibbiyot universiteti Termiz filialida ilmiy
            tadqiqot ishlari tibbiyot fanining dolzarb muammolarini hal
            qilishga yo&apos;naltirilgan.
          </p>
          <p>
            Tadqiqot ishlari mintaqaviy sog&apos;liqni saqlash tizimining
            ehtiyojlaridan kelib chiqib, aholining salomatlik holatini
            yaxshilashga xizmat qiladi.
          </p>
        </div>
      </div>

      {/* ═══════ Research directions ═══════ */}
      <div className="space-y-6">
        {directions.map((dir) => (
          <div
            key={dir.title}
            className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
          >
            <h4 className="font-serif text-2xl font-semibold text-[#00575B]">
              {dir.title}
            </h4>
            <div className="mt-6 space-y-2">
              {dir.items.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] bg-white p-4 md:p-6 flex items-center"
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
    </StaticPageAdmin>
  );
}
