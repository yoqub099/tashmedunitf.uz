import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getStaff } from "@/lib/services";
import { t } from "@/lib/translate";
import type { Staff } from "@/types";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("rektorat", { path: "/biz-haqimizda/tuzilma/rektorat", locale: lang });
}

/* ── Calendar + Clock SVG (ISFT original) ── */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.24887 2.49805V4.99909" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7518 2.49805V4.99909" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.33283 17.5038H4.99811C3.61682 17.5038 2.49707 16.384 2.49707 15.0027V6.24909C2.49707 4.8678 3.61682 3.74805 4.99811 3.74805H15.0023C16.3836 3.74805 17.5033 4.8678 17.5033 6.24909V8.33329" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6631 12.4863V13.9519L14.8152 14.6547" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7516 17.5031C12.7566 17.5031 11.8023 17.108 11.0987 16.4044C10.3952 15.7008 10 14.7466 10 13.7516C10.0308 11.6912 11.6945 10.029 13.7549 10C15.0952 10.0006 16.3334 10.7162 17.003 11.8772C17.6726 13.0383 17.672 14.4683 17.0013 15.6288C16.3307 16.7892 15.0919 17.5037 13.7516 17.5031" stroke="#4B4A4A" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Phone SVG (Phosphor icons) ── */
function PhoneIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
    </svg>
  );
}

/* ── Email SVG (Phosphor icons) ── */
function EmailIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

/* ── Staff card (ISFT structure) ── */
function StaffCard({ staff, lang = "uz" }: { staff: Staff; lang?: Language }) {
  const fullName = t(staff.full_name, lang);
  const position = t(staff.position, lang);

  const receptionHours: Record<number, string> = {
    1: s("rektorat.reception_1", lang),
    2: s("rektorat.reception_2", lang),
    3: s("rektorat.reception_3", lang),
    4: s("rektorat.reception_4", lang),
  };

  const telegramHandles: Record<number, string> = {
    1: "@ttatf_director",
  };

  return (
    <div className="rounded-2xl bg-white p-4 md:p-6 lg:rounded-3xl">
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Photo (or placeholder when none) */}
        <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#00575B] to-[#008B8B] xl:col-span-1">
          {staff.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={staff.photo_medium || staff.photo}
              alt={fullName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <svg className="h-20 w-20 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="mt-2 text-lg font-bold text-white/90">
                {fullName}
              </span>
            </>
          )}
        </div>

        {/* Info */}
        <div className="xl:col-span-2">
          <h2 className="text-[20px] font-bold text-[#00575B]">{position}</h2>
          <p className="text-gray-500">{fullName}</p>

          <div className="mt-4 flex flex-col gap-2 sm:mt-8">
            {/* Qabul vaqti */}
            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                <CalendarIcon />
                <span className="text-[14px]">{s("rektorat.reception_hours", lang)}</span>
              </div>
              <div className="mx-2 mb-1 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
              <span className="text-[14px] sm:text-right">
                {receptionHours[staff.sort_order] || s("rektorat.reception_default", lang)}
              </span>
            </div>

            {/* Telefon */}
            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                <PhoneIcon />
                <span className="text-[14px]">{s("rektorat.phone", lang)}</span>
              </div>
              <div className="mx-2 mb-1 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
              <span className="text-[14px] sm:text-right">{staff.phone || ""}</span>
            </div>

            {/* E-mail */}
            <div className="flex w-full flex-col sm:flex-row sm:justify-between">
              <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                <EmailIcon />
                <span className="text-[14px]">{s("rektorat.email", lang)}</span>
              </div>
              <div className="mx-2 mb-1 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
              <span className="break-all text-[14px] sm:text-right">{staff.email || ""}</span>
            </div>

            {/* Telegram */}
            {telegramHandles[staff.sort_order] && (
              <div className="flex w-full flex-col sm:flex-row sm:justify-between">
                <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  <span className="text-[14px]">{s("rektorat.telegram", lang)}</span>
                </div>
                <div className="mx-2 mb-1 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
                <span className="text-[14px] sm:text-right">{telegramHandles[staff.sort_order]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function RektoratPage() {
  const lang = await getLanguage();
  const res = await getStaff({ per_page: 50 }).catch(() => ({
    success: false,
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 },
  }));

  const leadership = res.data
    .filter((st) => st.sort_order <= 4)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container as="main" className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.rahbariyat", lang)}
        </h2>
        <Breadcrumb
          items={[
            { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
            { label: s("nav.tuzilma", lang), href: `/${lang}/biz-haqimizda/tuzilma` },
            { label: s("nav.rahbariyat", lang) },
          ]}
          className="mt-3"
        />

        <div className="mt-6 rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
          {leadership.length === 0 ? (
            <p className="text-gray-500">{s("rektorat.no_data", lang)}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {leadership.map((staff) => (
                <StaffCard key={staff.id} staff={staff} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
