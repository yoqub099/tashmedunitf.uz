import Container from "@/components/shared/Container";
import Link from "next/link";
import { getDepartments, getFaculties } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { t } from "@/lib/translate";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("kafedralar", { path: "/biz-haqimizda/tuzilma/kafedralar", locale: lang });
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

/* ── Word-matching helper ── */
const stopWords = ["va", "ishi", "fanlar", "davlat", "uchun", "bo'yicha"];
function normalize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/kafedrasi|kafedra/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\d+/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.includes(w));
}
function namesMatch(a: string, b: string): boolean {
  const wa = normalize(a);
  const wb = normalize(b);
  if (!wa.length || !wb.length) return false;
  const shorter = wa.length <= wb.length ? wa : wb;
  const longer  = wa.length <= wb.length ? wb : wa;
  const primary = shorter.reduce((x, y) => (x.length >= y.length ? x : y), "");
  const found   = longer.some((w) => w.includes(primary) || primary.includes(w));
  if (!found) return false;
  const shared  = shorter.filter((w) => longer.some((lw) => lw.includes(w) || w.includes(lw)));
  return shared.length >= Math.max(1, Math.ceil(shorter.length * 0.5));
}

export default async function KafedraListPage() {
  const lang = await getLanguage();
  const [deptsRes, facultiesRes] = await Promise.all([
    getDepartments({ per_page: 50 }).catch(() => null),
    getFaculties({ per_page: 50 }).catch(() => null),
  ]);

  const allDepts = (deptsRes?.data || [])
    .filter((d) => d.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const faculties = (facultiesRes?.data || [])
    .filter((f) => f.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Group departments under each faculty via word-match on directions
  type FacultyGroup = {
    id: number;
    name: string;
    depts: typeof allDepts;
  };
  const groups: FacultyGroup[] = [];
  const assignedDeptIds = new Set<number>();

  for (const fac of faculties) {
    const dirs = fac.directions || [];
    const matched = allDepts.filter((d) =>
      dirs.some((dir) => namesMatch(t(d.name, "uz") || "", t(dir.name, "uz") || ""))
    );
    groups.push({
      id: fac.id,
      name: t(fac.name, lang) || s("dept.other", lang),
      depts: matched,
    });
    matched.forEach((d) => assignedDeptIds.add(d.id));
  }

  // Remaining unmatched departments as a separate group
  const unmatched = allDepts.filter((d) => !assignedDeptIds.has(d.id));
  if (unmatched.length > 0) {
    groups.push({ id: 0, name: s("faculty.other_departments", lang), depts: unmatched });
  }

  return (
    <div className="pt-20 lg:pt-24">
      <Container className="py-6">
        {/* Title */}
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.kafedralar", lang)}
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
              <span className="text-gray-400">{s("nav.kafedralar", lang)}</span>
            </li>
          </ol>
        </div>

        {/* Faculty cards — ISFT exact layout */}
        <div className="mt-6 flex flex-col gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl flex min-h-[13rem] md:h-52 justify-between bg-gray-100"
            >
              <div className="grid w-full gap-4 md:gap-6 md:grid-cols-4">
                {/* Left — Faculty name + "Batafsil ko'rish" button */}
                <div className="flex h-auto flex-col md:col-span-2">
                  <h5 className="font-serif text-lg font-semibold sm:text-xl">{group.name}</h5>
                  <div className="mt-4 inline-flex w-full items-end justify-start md:mt-auto">
                    <Link
                      href={`/${lang}/biz-haqimizda/tuzilma/fakultetlar`}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-[#00575B] bg-transparent px-4 text-[#00575B] text-sm font-medium hover:bg-[#00575B]/5 transition-colors"
                    >
                      <span>{s("applicants.view_details", lang)}</span>
                      <ArrowUpRight />
                    </Link>
                  </div>
                </div>

                {/* Right — Vertical divider + kafedra links */}
                <div className="flex items-start md:items-center align-middle md:col-span-2">
                  <div className="mx-4 h-24 w-px border-l-2 hidden md:block" />
                  <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2">
                    {group.depts.map((dept) => (
                      <Link
                        key={dept.id}
                        href={`/${lang}/biz-haqimizda/tuzilma/kafedralar/${dept.slug}`}
                        className="mr-4 min-h-[44px] flex items-center text-sm text-[#00575B] hover:underline"
                      >
                        {t(dept.name, lang) || s("dept.unnamed", lang)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
