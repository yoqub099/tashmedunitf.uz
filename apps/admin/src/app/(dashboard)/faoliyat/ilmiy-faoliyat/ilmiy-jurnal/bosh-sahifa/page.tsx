import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bosh sahifa — Ilmiy jurnal — Admin",
};

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
      {/* ═══════ Hero (preview) ═══════ */}
      <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-80 overflow-hidden rounded-2xl lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#00969D] mb-6 flex items-center justify-center">
        <h2 className="text-white text-2xl md:text-4xl font-semibold text-center px-6">
          Termiz tibbiyot ilmiy axborotnomasi
        </h2>
        <div className="absolute bottom-4 left-4 bg-black/40 text-white px-3 py-1.5 rounded-lg text-sm">
          Saytdagi hero rasm: Sahifalar → “ilmiy-jurnal” → rasmlar (1-rasm)
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

      {/* ═══════ Jurnal sonlari — real CRUD alohida sahifada ═══════ */}
      <div className="rounded-2xl p-6 lg:rounded-3xl bg-gray-100 text-center">
        <p className="text-gray-600 mb-4">
          Jurnal sonlari (muqova, PDF, sana) alohida boshqaruv sahifasida
          qo&apos;shiladi va tahrirlanadi — saytda avtomatik ko&apos;rinadi.
        </p>
        <Link
          href="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#00575B] hover:bg-[#004548] transition-all"
          style={{ borderRadius: 12 }}
        >
          Jurnal sonlarini boshqarish
        </Link>
      </div>
    </StaticPageAdmin>
  );
}
