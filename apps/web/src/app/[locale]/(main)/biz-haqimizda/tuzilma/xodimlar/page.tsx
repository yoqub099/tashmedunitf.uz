import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import { getStaff } from "@/lib/services";
import { t } from "@/lib/translate";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("xodimlar", { path: "/biz-haqimizda/tuzilma/xodimlar", locale: lang });
}

/* ── Arrow icon (matches ISFT) ── */
function ArrowUpRight() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export default async function XodimlarPage() {
  const lang = await getLanguage();
  const staffRes = await getStaff({ per_page: 100 }).catch(() => ({
    success: false,
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 100, total: 0 },
  }));

  const staffList = staffRes.data || [];

  return (
    <main className="pt-20 lg:pt-24">
      <Container className="py-6">
        {/* Title */}
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.xodimlar", lang)}
        </h2>

        {/* Breadcrumbs — ISFT style */}
        <div className="text-sm font-medium mt-3">
          <ol className="flex flex-wrap items-center gap-1 text-gray-500">
            <li>
              <Link href={`/${lang}`} className="hover:text-red-600 transition-colors">
                {s("common.home", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href={`/${lang}/biz-haqimizda`} className="hover:text-red-600 transition-colors">
                {s("nav.biz_haqimizda", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href={`/${lang}/biz-haqimizda/tuzilma`} className="hover:text-red-600 transition-colors">
                {s("nav.tuzilma", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <span className="text-gray-400">{s("nav.xodimlar", lang)}</span>
            </li>
          </ol>
        </div>

        {/* Employee Cards wrapper (bg-gray-100) */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
          <div className="grid gap-6 md:grid-cols-2">
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-white flex flex-col justify-between h-full"
                >
                  <div className="grid gap-6 xl:grid-cols-3">
                    {/* Photo */}
                    {staff.photo ? (
                      <Image
                        src={staff.photo}
                        alt={t(staff.full_name, lang)}
                        width={170}
                        height={170}
                        className="w-[130px] h-[130px] min-w-[130px] min-h-[130px] sm:w-[170px] sm:h-[170px] sm:min-w-[170px] sm:min-h-[170px] rounded-xl object-cover xl:col-span-1 mx-auto xl:mx-0"
                      />
                    ) : (
                      <div className="w-[130px] h-[130px] min-w-[130px] min-h-[130px] sm:w-[170px] sm:h-[170px] sm:min-w-[170px] sm:min-h-[170px] rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 xl:col-span-1 mx-auto xl:mx-0">
                        <span className="text-4xl sm:text-5xl font-serif text-[#00575B]/30">
                          {t(staff.full_name, lang)?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}

                  {/* Info */}
                  <div className="xl:col-span-2 flex flex-col text-center xl:text-left mt-4 xl:mt-0">
                    <h2 className="text-[20px] font-bold text-[#00575B] leading-tight mt-1 xl:mt-0">
                      {t(staff.position, lang) || s("staff.unnamed_position", lang)}
                    </h2>
                    <p className="text-gray-500 mt-2 flex-1">
                      {t(staff.full_name, lang)}
                    </p>
                    
                    {/* Optional extra info wrapper from ISFT */}
                    <div className="text-gray-400 mt-4 xl:mt-6 text-sm">
                       {staff.department && (
                         <p>
                           {t(staff.department.name, lang)}
                         </p>
                       )}
                    </div>
                  </div>
                </div>

                {/* Batafsil ko'rish */}
                <Link
                  href={`/${lang}/biz-haqimizda/tuzilma/xodimlar/${staff.id}`}
                  className="mt-4 flex min-h-[44px] items-center justify-end gap-1 text-sm font-medium text-[#00575B] hover:text-[#00575B]/80 transition-colors group sm:mt-6"
                >
                    <span>{s("applicants.view_details", lang)}</span>
                    <div className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight />
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-gray-500">
                {s("staff.no_staff", lang)}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
