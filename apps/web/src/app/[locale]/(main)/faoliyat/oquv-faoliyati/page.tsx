import Link from "next/link";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { api } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("oquv-faoliyati", { path: "/faoliyat/oquv-faoliyati", locale: lang });
}

/* ── Reusable arrow icon (diagonal ↗) ── */
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

/* ── Download icon ── */
function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Inner card component ── */
function ActivityCard({
  title,
  description,
  href,
  download,
  downloadLabel,
  external,
}: {
  title: string;
  description: string;
  href: string;
  download?: boolean;
  downloadLabel?: string;
  external?: boolean;
}) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...(download ? { download: true } : {})}
      {...linkProps}
      className="group flex min-h-[13rem] flex-col justify-between rounded-2xl bg-white p-4 transition-shadow hover:shadow-md md:p-6"
    >
      <div>
        <h5 className="font-serif text-lg font-semibold text-gray-900">
          {title}
        </h5>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {downloadLabel ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00575B] px-4 py-2 text-sm font-medium text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
            <DownloadIcon />
            {downloadLabel}
          </span>
        ) : (
          <span />
        )}
        {!downloadLabel && <ArrowIcon />}
      </div>
    </Link>
  );
}

export default async function OquvFaoliyatiPage() {
  const lang = await getLanguage();

  // O'quv grafigi PDF ni olish
  let grafikPdfUrl: string | null = null;
  try {
    const res = await api.get<{ success: boolean; data: { file_url?: string } }>("/v1/site-media/oquv_grafik", { tags: ["site-media"] });
    grafikPdfUrl = res.data?.file_url || null;
  } catch {
    // Hali yuklanmagan — null qoladi
  }

  return (
    <div className="pt-20 lg:pt-24">
      <Container as="section" className="py-6">
        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.oquv_faoliyati", lang) },
          ]}
        />

        <h2 className="mt-3 font-serif text-2xl font-semibold text-gray-900 md:text-[32px] lg:text-[40px]">
          {s("nav.oquv_faoliyati", lang)}
        </h2>

        {/* ═══════ 2-column grid ═══════ */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* ── Left: O'quv rejalari ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              {s("faoliyat.oquv_rejalari", lang)}
            </h4>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <ActivityCard
                title={s("faoliyat.bakalavriat", lang)}
                description={s("faoliyat.bakalavriat_desc", lang)}
                href={`/${lang}/faoliyat/oquv-faoliyati/oquv-rejalari/bakalavriat`}
              />
              <ActivityCard
                title={s("faoliyat.magistratura", lang)}
                description={s("faoliyat.magistratura_desc", lang)}
                href={`/${lang}/faoliyat/oquv-faoliyati/oquv-rejalari/magistratura`}
              />
            </div>
          </div>

          {/* ── Right: O'quv grafigi ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              {s("faoliyat.oquv_grafigi", lang)}
            </h4>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {grafikPdfUrl ? (
                <ActivityCard
                  title={s("faoliyat.oquv_jarayonlari", lang)}
                  description={s("faoliyat.oquv_jarayonlari_desc", lang)}
                  href={grafikPdfUrl}
                  download
                  downloadLabel={s("oquv.download_grafik", lang)}
                />
              ) : (
                <div className="group flex min-h-[13rem] flex-col justify-between rounded-2xl bg-gray-50 p-4 md:p-6 opacity-75 cursor-default">
                  <div>
                    <h5 className="font-serif text-lg font-semibold text-gray-900">
                      {s("faoliyat.oquv_jarayonlari", lang)}
                    </h5>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                      {s("faoliyat.oquv_jarayonlari_desc", lang)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {lang === "ru" ? "Скоро" : lang === "en" ? "Coming soon" : "Tez orada"}
                    </span>
                  </div>
                </div>
              )}
              <div className="group flex min-h-[13rem] flex-col justify-between rounded-2xl bg-gray-50 p-4 md:p-6 opacity-75 cursor-default">
                <div>
                  <h5 className="font-serif text-lg font-semibold text-gray-900">
                    {s("faoliyat.elektron_jadval", lang)}
                  </h5>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {s("faoliyat.elektron_jadval_desc", lang)}
                  </p>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {lang === "ru" ? "Скоро" : lang === "en" ? "Coming soon" : "Tez orada"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
