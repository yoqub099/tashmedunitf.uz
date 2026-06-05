import Link from "next/link";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("ilmiy-faoliyat", { path: "/faoliyat/ilmiy-faoliyat", locale: lang });
}

/* ── Arrow icon (diagonal ↗) ── */
function ArrowIcon() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00575B] text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

/* ── Inner card ── */
function ScienceCard({
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
      className="group flex min-h-[13rem] flex-col justify-between rounded-2xl bg-white p-4 transition-shadow hover:shadow-md md:p-6"
    >
      <div>
        <h5 className="font-serif text-lg font-semibold text-gray-900">
          {title}
        </h5>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <ArrowIcon />
      </div>
    </Link>
  );
}

export default async function IlmiyFaoliyatPage() {
  const lang = await getLanguage();

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.ilmiy_faoliyat", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.ilmiy_faoliyat", lang) },
          ]}
          className="mt-3"
        />

        {/* ═══════ 2-column grid ═══════ */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* ── Left: Ilmiy tadqiqotlar ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              {s("sci.ilmiy_tadqiqotlar", lang)}
            </h4>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ScienceCard
                title={s("sci.tadqiqot_title", lang)}
                description={s("sci.tadqiqot_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/tadqiqot`}
              />
              <ScienceCard
                title={s("sci.ilmiy_ishlar_title", lang)}
                description={s("sci.ilmiy_ishlar_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar`}
              />
            </div>
          </div>

          {/* ── Right: Nashrlar ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              {s("sci.nashrlar", lang)}
            </h4>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ScienceCard
                title={s("sci.ilmiy_jurnal_title", lang)}
                description={s("sci.ilmiy_jurnal_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal`}
              />
              <ScienceCard
                title={s("sci.oak_nashrlar_title", lang)}
                description={s("sci.oak_nashrlar_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/oaq-tavsiya-nashrlar`}
              />
            </div>
          </div>
        </div>

        {/* ═══════ 2-column grid: row 2 ═══════ */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* ── Left: Doktorantura ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              {s("sci.doktorantura", lang)}
            </h4>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ScienceCard
                title={s("sci.tadqiqotchilar_title", lang)}
                description={s("sci.tadqiqotchilar_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar`}
              />
              <ScienceCard
                title={s("sci.imtihon_dasturlari_title", lang)}
                description={s("sci.imtihon_dasturlari_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari`}
              />
              <ScienceCard
                title={s("sci.imtihon_savollari_title", lang)}
                description={s("sci.imtihon_savollari_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari`}
              />
            </div>
          </div>

          {/* ── Right: Tadbirlar ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              {s("sci.tadbirlar", lang)}
            </h4>
            <div className="mt-6 grid gap-4 md:grid-cols-1">
              <ScienceCard
                title={s("sci.konferensiyalar_title", lang)}
                description={s("sci.konferensiyalar_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/konferensiyalar`}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
