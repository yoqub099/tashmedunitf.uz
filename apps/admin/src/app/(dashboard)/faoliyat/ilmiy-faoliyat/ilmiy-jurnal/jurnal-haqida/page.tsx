import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jurnal haqida — Ilmiy jurnal — Admin",
};

/** "prof./dots." kabi unvon prefikslarisiz ism bosh harflari (foto o'rnida avatar) */
function initialsOf(name: string): string {
  return name
    .replace(/^(prof\.|dots\.|akad\.)\s*/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const faqItems = [
  {
    question: "Agar tahririyat tomonidan maqola nashr uchun tavsiya etilmasa nima qilish mumkin?",
    answer: "Taqrizchi tomonidan maqola mazmuni va formati maqbul deb topilmasa, muallifga kamchiliklarni tuzatish uchun qayta yuboriladi.",
  },
  {
    question: "Jurnalning bitta soniga ikki yoki undan ko'p maqola berish mumkinmi?",
    answer: "Bitta son uchun bitta eng dolzarb maqola berish tavsiya etiladi.",
  },
  {
    question: "Jurnalga kimlar maqola berishi mumkin?",
    answer: "Jurnal barcha uchun ochiq, bu bo'yicha hech qanday cheklovlar yo'q.",
  },
  {
    question: "Maqolani topshirish muddati qachongacha?",
    answer: "Har chorakda maqolalar yangi sonlar uchun qabul qilinadi.",
  },
  {
    question: "Maqola topshirish pullikmi?",
    answer: "Maqolani chop etish bepul amalga oshiriladi.",
  },
  {
    question: "Maqolani qabul qilish bo'yicha qanday talablar mavjud?",
    answer: "Maqola IMRAD talablari asosida qabul qilinadi. Batafsil ma'lumot uchun Yo'riqnoma sahifasiga qarang.",
  },
];

const editorialBoard = [
  { name: "prof. Rahimov S.T.", role: "Bosh muharrir", description: "Ichki kasalliklar kafedrasi mudiri, tibbiyot fanlari doktori" },
  { name: "prof. Nazarov M.X.", role: "Bosh muharrir o'rinbosari", description: "Pediatriya kafedrasi professori, tibbiyot fanlari doktori" },
  { name: "dots. Alimova G.R.", role: "Mas'ul muharrir", description: "Jamoat salomatligi kafedrasi dotsenti" },
  { name: "dots. Toshmatov A.K.", role: "Texnik muharrir", description: "Ilmiy tadqiqotlar bo'limi bosh mutaxassisi" },
];

const editorialMembers = [
  { name: "prof. Sultonov B.A.", field: "Farmatsiya fanlari doktori, professor", country: "O'zbekiston" },
  { name: "prof. Karimova N.D.", field: "Tibbiyot fanlari doktori, professor", country: "O'zbekiston" },
  { name: "dots. Ergashev M.R.", field: "Tibbiyot fanlari nomzodi, dotsent", country: "O'zbekiston" },
  { name: "prof. Xolmatov A.I.", field: "Tibbiyot fanlari doktori, professor", country: "O'zbekiston" },
  { name: "dots. Qodirov U.B.", field: "Tibbiyot fanlari nomzodi, dotsent", country: "O'zbekiston" },
  { name: "prof. Ruziyeva R.X.", field: "Biologiya fanlari doktori, professor", country: "O'zbekiston" },
];

export default function JurnalHaqidaAdminPage() {
  return (
    <StaticPageAdmin
      slug="ilmiy-jurnal-haqida"
      title="Jurnal haqida"
      description="Jurnal tavsifi, tahririyat hay'ati va ko'p beriladigan savollar"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Ilmiy jurnal", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
        { label: "Jurnal haqida" },
      ]}
    >
      {/* ═══════ Two-column layout ═══════ */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Left — Journal description */}
        <div className="flex-1">
          <h3 className="md:text-2xl text-[#00575B] text-xl font-bold">
            &quot;Termiz tibbiyot ilmiy axborotnomasi&quot;
          </h3>
          <div className="rounded-2xl p-4 lg:rounded-3xl md:p-4 mt-6 bg-gray-100 space-y-4 text-base leading-7">
            <p className="text-justify">
              <strong>&quot;Termiz tibbiyot ilmiy axborotnomasi&quot;</strong>{" "}
              — Toshkent davlat tibbiyot universiteti Termiz filialining
              rasmiy ilmiy jurnali bo&apos;lib, tibbiyot sohasidagi
              fundamental va amaliy tadqiqot natijalarini nashr etishga
              ixtisoslashgan.
            </p>
            <p className="text-justify">
              Jurnalda filial professor-o&apos;qituvchilari, doktorantlar,
              magistrantlar va talabalarning ilmiy maqolalari chop etiladi.
              Barcha maqolalar ikki tomonlama ko&apos;r taqrizdan
              (double-blind peer review) o&apos;tkaziladi.
            </p>
            <p className="text-justify">
              <strong>ISSN: XXXX-XXXX</strong> (Seriyali nashrlarning
              xalqaro standart raqami)
            </p>
            <p className="text-justify">
              <strong>Jurnalning davriyligi</strong> — har chorakda bir
              marta. Maqolalar IMRAD talablari asosida o&apos;zbek, rus va
              ingliz tillarida nashr etiladi.
            </p>
            <p className="text-justify">
              <strong>Muassis:</strong> Toshkent davlat tibbiyot
              universiteti Termiz filiali.
            </p>
          </div>
        </div>

        {/* Right — FAQ */}
        <div className="w-full md:w-96 space-y-6">
          <h3 className="md:text-2xl text-gray-900 text-xl font-bold">
            Ko&apos;p beriladigan savollar
          </h3>
          <div className="rounded-2xl p-4 md:p-4 lg:rounded-3xl bg-gray-100">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border-b border-[#00000015] last:border-none py-3 px-2"
              >
                <p className="text-sm font-semibold text-[#00575B]">
                  {item.question}
                </p>
                <p className="text-xs text-slate-600 mt-1">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ Editorial board ═══════ */}
      <div className="mb-6">
        <h2 className="font-bold text-xl text-[#00575B] mb-4">
          Tahririyat hay&apos;ati
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {editorialBoard.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl p-4 lg:rounded-3xl bg-gray-100 space-y-2"
            >
              <div className="relative aspect-[261/288] w-full overflow-hidden rounded-[20px] bg-linear-to-br from-[#00575B] to-[#00969D] flex items-center justify-center">
                <span className="text-white/90 text-4xl font-semibold select-none">
                  {initialsOf(member.name)}
                </span>
              </div>
              <h4 className="text-sm md:text-base font-semibold text-[#101828] pt-1 line-clamp-1">
                {member.name}
              </h4>
              <p className="font-normal text-[#4A5565] text-xs line-clamp-2">
                {member.role}
              </p>
              <p className="font-normal text-[#4A5565] text-xs line-clamp-2">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ Editorial members table ═══════ */}
      <div>
        <h2 className="font-bold text-xl text-[#00575B] mb-4">
          Tahririyat a&apos;zolari ro&apos;yxati
        </h2>
        <div className="rounded-2xl p-4 lg:rounded-3xl bg-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[500px] w-full">
              <div className="grid grid-cols-[1fr_1fr_200px] border-b border-[#DFE4EA] pb-2">
                <small className="text-sm px-4 py-2 font-bold text-[#6C6E70]">Ism, familiya</small>
                <small className="text-sm px-4 py-2 font-bold text-[#6C6E70] text-center">Soha</small>
                <small className="text-sm px-4 py-2 font-bold text-[#6C6E70] text-center">Mamlakat</small>
              </div>
              <div className="divide-y divide-[#DFE4EA]">
                {editorialMembers.map((member) => (
                  <div
                    key={member.name}
                    className="grid grid-cols-[1fr_1fr_200px] hover:bg-slate-50/50 transition-colors items-center"
                  >
                    <small className="text-sm px-4 py-3 font-medium truncate">{member.name}</small>
                    <small className="text-sm font-medium px-4 py-3 text-center text-slate-500">{member.field}</small>
                    <small className="text-sm font-medium px-4 py-3 text-center text-slate-500">{member.country}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageAdmin>
  );
}
