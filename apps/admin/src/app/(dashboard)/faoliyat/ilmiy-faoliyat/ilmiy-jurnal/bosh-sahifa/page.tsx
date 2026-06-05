import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bosh sahifa — Ilmiy jurnal — Admin",
};

const currentIssues = [
  {
    title: '"Termiz tibbiyot ilmiy axborotnomasi", 2026/1-son',
    date: "2026-03-15",
    cover: "/imgs/journal/2026-1.jpg",
  },
];

const previousIssues = [
  {
    title: '"Termiz tibbiyot ilmiy axborotnomasi", 2025/4-son',
    date: "2025-12-20",
    cover: "/imgs/journal/2025-4.jpg",
  },
  {
    title: '"Termiz tibbiyot ilmiy axborotnomasi", 2025/3-son',
    date: "2025-09-15",
    cover: "/imgs/journal/2025-3.jpg",
  },
  {
    title: '"Termiz tibbiyot ilmiy axborotnomasi", 2025/2-son',
    date: "2025-06-20",
    cover: "/imgs/journal/2025-2.jpg",
  },
  {
    title: '"Termiz tibbiyot ilmiy axborotnomasi", 2025/1-son',
    date: "2025-03-15",
    cover: "/imgs/journal/2025-1.jpg",
  },
];

function IssueCard({ title, date, cover }: { title: string; date: string; cover: string }) {
  return (
    <div className="p-4 lg:rounded-3xl bg-white rounded-3xl flex flex-col md:p-3 h-full w-full border border-transparent shadow-sm">
      <div className="relative w-full aspect-3/4 mb-4 overflow-hidden rounded-2xl shrink-0 bg-gray-100">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 20vw"
          unoptimized
        />
      </div>
      <div className="flex flex-col flex-1 w-full gap-2">
        <h4 className="md:text-base text-sm font-semibold leading-snug line-clamp-2">
          {title}
        </h4>
        <small className="font-medium text-[10px] text-slate-400">{date}</small>
      </div>
    </div>
  );
}

export default function BoshSahifaAdminPage() {
  return (
    <StaticPageAdmin
      slug="ilmiy-jurnal-bosh-sahifa"
      title="Bosh sahifa"
      description="Ilmiy jurnal bosh sahifasi kontenti"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Ilmiy jurnal", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
        { label: "Bosh sahifa" },
      ]}
    >
      {/* ═══════ Hero Image ═══════ */}
      <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-80 overflow-hidden rounded-2xl lg:rounded-3xl bg-slate-200 mb-6">
        <Image
          src="/imgs/journal/hero.jpg"
          alt="Termiz tibbiyot ilmiy axborotnomasi"
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm">
          Hero rasm: /imgs/journal/hero.jpg
        </div>
      </div>

      {/* ═══════ CTA Banner ═══════ */}
      <div className="rounded-2xl p-4 lg:rounded-3xl flex flex-col items-center gap-10 bg-linear-to-br from-[#00575B] to-[#00969D] text-white md:flex-row md:p-8 mb-6">
        <div className="flex-1 space-y-4">
          <h3 className="text-lg md:text-2xl leading-6 font-semibold">
            Fikrlaringiz sahifaga aylansin – maqolangizni hoziroq
            jo&apos;nating.
          </h3>
          <p className="text-base leading-6 font-normal text-white/90">
            Maqolangizni hoziroq yuboring! Jurnalimiz sizning ilmiy
            tadqiqotingiz, tahlilingiz va innovatsion yondashuvingizni
            kutmoqda.
          </p>
        </div>
        <div className="hidden lg:block w-px h-20 bg-white/30" />
        <span className="rounded-full bg-white px-5 py-2.5 text-base leading-6 text-gray-900 font-medium whitespace-nowrap">
          Maqolani yuborish
        </span>
      </div>

      {/* ═══════ Current Issues ═══════ */}
      <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 mb-6">
        <h4 className="text-base md:text-xl leading-6 text-gray-900 font-bold">
          So&apos;nggi son
        </h4>
        <div className="text-base font-normal pt-4 text-gray-600 leading-relaxed">
          <p className="text-justify">
            &quot;Termiz tibbiyot ilmiy axborotnomasi&quot; — Toshkent davlat
            tibbiyot universiteti Termiz filialining rasmiy ilmiy jurnali.
          </p>
        </div>
        <div className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentIssues.map((issue) => (
              <IssueCard key={issue.title} {...issue} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ Previous Issues ═══════ */}
      <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 mb-6">
        <h4 className="text-base md:text-xl leading-6 text-gray-900 font-bold">
          &quot;Termiz tibbiyot ilmiy axborotnomasi&quot;
        </h4>
        <div className="text-base font-normal pt-4 text-gray-600 leading-relaxed">
          <p className="text-justify">
            2024–2025-yillarda nashr etilgan sonlar. Turli ilmiy
            yo&apos;nalishlarda olib borilgan tadqiqotlar natijalari jamlangan.
          </p>
        </div>
        <div className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previousIssues.map((issue) => (
              <IssueCard key={issue.title} {...issue} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ Licenses ═══════ */}
      <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
        <h4 className="text-base md:text-xl leading-6 text-gray-900 font-bold text-center mb-6">
          Litsenziyalar va sertifikatlar
        </h4>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl p-4 lg:rounded-3xl w-full max-w-60 bg-white"
            >
              <Image
                src={`/imgs/license/${n}.jpg`}
                alt={`Litsenziya ${n}`}
                width={260}
                height={367}
                className="size-full max-h-72 max-w-52"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </StaticPageAdmin>
  );
}
