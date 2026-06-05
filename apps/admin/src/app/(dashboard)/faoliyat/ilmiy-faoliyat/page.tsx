"use client";

import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { ChevronRight } from "lucide-react";

function AdminCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[10rem] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-200 md:p-6"
    >
      <div>
        <h5 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {title}
        </h5>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );
}

export default function IlmiyFaoliyatPage() {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle title="Ilmiy faoliyat" subtitle="Ilmiy tadqiqotlar va nashrlar" />

        {/* ═══════ Row 1: 2-column grid ═══════ */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── Left: Ilmiy tadqiqotlar ── */}
          <div className="rounded-2xl bg-gray-50 p-4 md:p-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Ilmiy tadqiqotlar
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminCard
                title="Tadqiqot"
                description="Filialda olib borilayotgan ilmiy tadqiqot ishlari va yo'nalishlari"
                href="/faoliyat/ilmiy-faoliyat/tadqiqot"
              />
              <AdminCard
                title="Ilmiy ishlar va innovatsiyalar"
                description="Ilmiy ishlanmalar, innovatsion loyihalar va ularning natijalari"
                href="/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar"
              />
            </div>
          </div>

          {/* ── Right: Nashrlar ── */}
          <div className="rounded-2xl bg-gray-50 p-4 md:p-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Nashrlar
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminCard
                title="Ilmiy jurnal"
                description="Filial ilmiy jurnali nashrlari va maqolalar to'plami"
                href="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal"
              />
              <AdminCard
                title="OAK tavsiya nashrlar"
                description="Oliy attestatsiya komissiyasi tomonidan tavsiya etilgan nashrlar"
                href="/faoliyat/ilmiy-faoliyat/oaq-tavsiya-nashrlar"
              />
            </div>
          </div>
        </div>

        {/* ═══════ Row 2: 2-column grid ═══════ */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ── Left: Doktorantura ── */}
          <div className="rounded-2xl bg-gray-50 p-4 md:p-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Doktorantura
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <AdminCard
                title="Tadqiqotchilar"
                description="Doktorantura va mustaqil tadqiqotchilar ro'yxati"
                href="/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar"
              />
              <AdminCard
                title="Imtihon dasturlari"
                description="Doktoranturaga kirish imtihon dasturlari"
                href="/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari"
              />
              <AdminCard
                title="Imtihon savollari"
                description="Doktorantura imtihon savollari to'plami"
                href="/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari"
              />
            </div>
          </div>

          {/* ── Right: Tadbirlar ── */}
          <div className="rounded-2xl bg-gray-50 p-4 md:p-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Tadbirlar
            </h4>
            <div className="mt-4 grid gap-4">
              <AdminCard
                title="Konferensiyalar"
                description="Ilmiy konferensiyalar, seminarlar va yuvarlak stollar"
                href="/faoliyat/ilmiy-faoliyat/konferensiyalar"
              />
              <AdminCard
                title="Iqtidorli talabalar"
                description="Iqtidorli talabalar ro'yxati va ma'lumotlari"
                href="/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
