import Container from "@/components/shared/Container";
import { getFaculties } from "@/lib/services";
import Link from "next/link";
import type { Faculty } from "@/types";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { t } from "@/lib/translate";
import type { Language } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("fakultetlar", { path: "/biz-haqimizda/tuzilma/fakultetlar", locale: lang });
}

function ArrowIcon() {
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

function FacultyCard({ faculty, lang = "uz" }: { faculty: Faculty; lang?: Language }) {
  const name = t(faculty.name, lang) || s("faculty.unnamed", lang);
  const directions = faculty.directions || [];

  return (
    <div className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl flex min-h-[13rem] md:h-52 justify-between bg-gray-100">
      <div className="grid w-full gap-4 md:gap-6 md:grid-cols-4">
        {/* Left — name + button */}
        <div className="flex h-auto flex-col md:col-span-2">
          <h5 className="font-serif text-lg font-semibold sm:text-xl">{name}</h5>
          <div className="mt-4 inline-flex w-full items-end justify-start md:mt-auto">
            <Link
              href={`/${lang}/biz-haqimizda/tuzilma/fakultetlar/${faculty.id}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#00575B] bg-transparent px-4 text-sm font-medium text-[#00575B] hover:bg-[#00575B] hover:text-white transition-colors"
            >
              <span>{s("applicants.view_details", lang)}</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* Right — divider + directions */}
        <div className="flex items-start md:items-center align-middle md:col-span-2">
          <div className="mx-4 h-24 w-px border-l-2 border-gray-300 align-middle hidden md:block" />
          <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2">
            {directions.map((dir) => (
              <Link
                key={dir.id}
                href={`/${lang}/abiturientlarga/${dir.level || "bakalavriat"}/${dir.id}`}
                className="min-h-[44px] flex items-center text-[#00575B] hover:underline underline-offset-2 mr-4 text-sm"
              >
                {t(dir.name, lang) || s("faculty.unnamed_direction", lang)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function FakultetlarPage() {
  const lang = await getLanguage();
  const res = await getFaculties({ per_page: 50 }).catch(() => null);
  const faculties = (res?.data || [])
    .filter((f) => f.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.fakultetlar", lang)}
        </h2>

        {/* Breadcrumbs */}
        <div className="text-sm font-medium mt-3">
          <ol className="flex flex-wrap items-center gap-1 text-gray-500">
            <li><Link href={`/${lang}`} className="hover:text-red-600 transition-colors">{s("common.home", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><Link href={`/${lang}/biz-haqimizda`} className="hover:text-red-600 transition-colors">{s("nav.biz_haqimizda", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><Link href={`/${lang}/biz-haqimizda/tuzilma`} className="hover:text-red-600 transition-colors">{s("nav.tuzilma", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><span className="text-gray-400">{s("nav.fakultetlar", lang)}</span></li>
          </ol>
        </div>

        {/* Faculty cards */}
        {faculties.length > 0 ? (
          <div className="mt-6 flex flex-col gap-6">
            {faculties.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex min-h-52 items-center justify-center rounded-2xl bg-gray-100 p-8 text-center text-gray-500">
            {s("faculty.no_faculties", lang)}
          </div>
        )}
      </Container>
    </div>
  );
}
