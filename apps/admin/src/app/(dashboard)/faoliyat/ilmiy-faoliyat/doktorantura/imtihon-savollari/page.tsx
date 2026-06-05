import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imtihon savollari — Admin",
};

const examSets = [
  {
    specialty: "Davolash ishi",
    code: "56.04.01",
    sections: [
      {
        subject: "Ichki kasalliklar",
        sampleQuestions: [
          "Arterial gipertenziya klassifikatsiyasi va davolash tamoyillari",
          "Bronxial astmaning zamonaviy diagnostikasi va bosqichli terapiyasi",
          "Surunkali buyrak yetishmovchiligi — etiologiyasi, klinikasi, davolash",
          "Jigar sirrozining asoratlari va ularni bartaraf etish usullari",
          "Revmatoid artritning zamonaviy davolash sxemalari",
        ],
      },
      {
        subject: "Jarrohlik kasalliklari",
        sampleQuestions: [
          "O'tkir appenditsitning diagnostik algoritmi",
          "Xolesistit va xolelitiyazning jarrohlik davolash usullari",
          "Qorin bo'shlig'i jarohatlarida tashxis qo'yish tartibi",
          "Peritonit — klassifikatsiyasi va davolash taktikasi",
        ],
      },
    ],
  },
  {
    specialty: "Pediatriya",
    code: "56.04.02",
    sections: [
      {
        subject: "Bolalar kasalliklari",
        sampleQuestions: [
          "Yangi tug'ilgan chaqaloqlarda sariqlikning differentsial diagnostikasi",
          "Bolalarda pnevmoniyalarning zamonaviy klassifikatsiyasi va davolashi",
          "Bolalarda temir tanqisligi kamqonligining profilaktikasi",
          "Bolalarda bronxial obstruksiya sindromi — tashxis va davolash",
        ],
      },
    ],
  },
  {
    specialty: "Farmatsiya",
    code: "56.04.04",
    sections: [
      {
        subject: "Farmatsevtik kimyo",
        sampleQuestions: [
          "Dori moddalarining sifat va miqdoriy tahlil usullari",
          "Antibiotiklar kimyoviy tuzilishi va faolligi o'rtasidagi bog'liqlik",
          "Dori vositalarining barqarorlik tadqiqotlari metodologiyasi",
          "GMP talablariga muvofiq sifat nazorati tizimlari",
        ],
      },
    ],
  },
];

export default function ImtihonSavollariPage() {
  return (
    <StaticPageAdmin
      slug="imtihon-savollari"
      title="Imtihon savollari"
      description="Doktorantura namuna imtihon savollari"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Doktorantura", href: "/faoliyat/ilmiy-faoliyat/doktorantura" },
        { label: "Imtihon savollari" },
      ]}
    >
      {/* ═══════ Info banner ═══════ */}
      <div className="rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-6 md:p-8 lg:rounded-3xl text-white mb-6">
        <h4 className="font-serif text-2xl font-semibold">
          Namunali imtihon savollari
        </h4>
        <p className="mt-3 text-sm opacity-90 max-w-2xl">
          Quyida doktoranturaga kirish imtihonlari uchun namunali
          savollar keltirilgan. To&apos;liq savollar to&apos;plami
          imtihon dasturlari asosida shakllantiriladi.
        </p>
      </div>

      {/* ═══════ Exam questions by specialty ═══════ */}
      <div className="space-y-6">
        {examSets.map((set) => (
          <div key={set.code}>
            {/* Specialty header */}
            <h3 className="font-serif text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-block rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B]">
                {set.code}
              </span>
              {set.specialty}
            </h3>
            <div className="space-y-4">
              {set.sections.map((section) => (
                <div
                  key={section.subject}
                  className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl"
                >
                  <h4 className="font-serif text-2xl font-semibold text-[#00575B]">
                    {section.subject}
                  </h4>
                  <div className="mt-6 space-y-2">
                    {section.sampleQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="rounded-[20px] bg-white p-4 md:p-5 flex items-start gap-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00575B]/10 text-xs font-semibold text-[#00575B]">
                          {i + 1}
                        </span>
                        <h6 className="font-serif text-base leading-tight lg:text-lg">
                          {q}
                        </h6>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StaticPageAdmin>
  );
}
