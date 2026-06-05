import Container from "@/components/shared/Container";
import { getDepartmentBySlug, getDepartments, getFaculties } from "@/lib/services";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME_UZ, SITE_NAME_RU, SITE_NAME_EN, DEFAULT_OG_IMAGE, getDepartmentSchema } from "@/lib/seo";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLanguage();
  const path = `/biz-haqimizda/tuzilma/kafedralar/${slug}`;
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";
  const siteName = lang === "ru" ? SITE_NAME_RU : lang === "en" ? SITE_NAME_EN : SITE_NAME_UZ;
  const res = await getDepartmentBySlug(slug).catch(() => null);
  const name = t(res?.data?.name, lang) || s("meta.dept_fallback", lang);
  const description = t(res?.data?.description, lang)?.replace(/<[^>]*>/g, "").slice(0, 155) || `${name} — ${s("meta.dept_desc_fallback", lang)}`;
  const title = `${name} | TdTUTF`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages: { uz: `${SITE_URL}/uz${path}`, ru: `${SITE_URL}/ru${path}`, en: `${SITE_URL}/en${path}` } },
    openGraph: { title, description, url: `${SITE_URL}/${lang}${path}`, siteName, locale: ogLocale, alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale), type: "website", images: [{ url: res?.data?.head_photo || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [res?.data?.head_photo || DEFAULT_OG_IMAGE] },
  };
}

/* ── Icons (ISFT original) ── */
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

function PhoneIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

// Word-matching helper to group departments under faculties
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

export default async function KafedraDetailPage({ params }: Props) {
  const { slug } = await params;
  const lang = await getLanguage();

  const [deptRes, allDeptsRes, facultiesRes] = await Promise.all([
    getDepartmentBySlug(slug).catch(() => null),
    getDepartments({ per_page: 50 }).catch(() => null),
    getFaculties({ per_page: 50 }).catch(() => null),
  ]);

  const dept = deptRes?.data;
  if (!dept) return notFound();

  const name      = t(dept.name, lang);
  const description = t(dept.description, lang);
  const headName  = t(dept.head_name, lang);
  const headTitle = t(dept.head_title, lang) || s("dept.head", lang);
  const allDepts  = (allDeptsRes?.data || []).filter((d) => d.is_active).sort((a, b) => a.sort_order - b.sort_order);
  const faculties = (facultiesRes?.data || []).filter((f) => f.is_active).sort((a, b) => a.sort_order - b.sort_order);

  const departmentSchema = getDepartmentSchema({
    name: name,
    description: description?.replace(/<[^>]*>/g, '').slice(0, 200) || undefined,
    head: headName || undefined,
    phone: dept.phone || undefined,
    email: dept.email || undefined,
    url: `/biz-haqimizda/tuzilma/kafedralar/${slug}`,
  });

  // Group departments under each faculty via word-match on directions
  type Group = { facultyName: string; depts: typeof allDepts };
  const groups: Group[] = [];
  const assignedDeptIds = new Set<number>();

  for (const fac of faculties) {
    const dirs = fac.directions || [];
    const matched = allDepts.filter((d) =>
      dirs.some((dir) => namesMatch(t(d.name, "uz") || "", t(dir.name, "uz") || ""))
    );
    if (matched.length > 0) {
      groups.push({ facultyName: t(fac.name, lang), depts: matched });
      matched.forEach((d) => assignedDeptIds.add(d.id));
    }
  }
  // Remaining unmatched departments
  const unmatched = allDepts.filter((d) => !assignedDeptIds.has(d.id));
  if (unmatched.length > 0) {
    groups.push({ facultyName: s("faculty.other_departments", lang), depts: unmatched });
  }

  return (
    <div className="pt-20 lg:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(departmentSchema) }}
      />
      <Container className="py-6">
        {/* Title */}
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {name}
        </h2>

        {/* Breadcrumbs — ISFT style */}
        <div className="text-sm font-medium mt-3">
          <ol className="flex flex-wrap items-center gap-1 text-gray-500">
            <li><Link href={`/${lang}`} className="hover:text-red-600 transition-colors">{s("breadcrumb.home", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><Link href={`/${lang}/biz-haqimizda`} className="hover:text-red-600 transition-colors">{s("breadcrumb.university", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><Link href={`/${lang}/biz-haqimizda/tuzilma`} className="hover:text-red-600 transition-colors">{s("breadcrumb.structure", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><Link href={`/${lang}/biz-haqimizda/tuzilma/kafedralar`} className="hover:text-red-600 transition-colors">{s("breadcrumb.departments", lang)}</Link></li>
            <li className="text-gray-400">&gt;</li>
            <li><span className="text-gray-400">{name}</span></li>
          </ol>
        </div>

        {/* ── ISFT exact grid layout: 3 cols, left=2, right=1 ── */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* ══ LEFT — col-span-2 ══ */}
          <div className="flex flex-col gap-6 mt-6 md:col-span-2">

            {/* Head card — ISFT style */}
            <div className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl bg-gray-100">
              <div className="grid gap-6 md:grid-cols-4">
                {/* Photo */}
                {dept.head_photo ? (
                  <Image
                    alt={headName}
                    loading="lazy"
                    width={400}
                    height={400}
                    className="h-full w-full rounded-xl object-cover md:col-span-1"
                    src={dept.head_photo}
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gray-200 md:col-span-1">
                    <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="md:col-span-3">
                  <h2 className="text-[20px] font-bold text-[#00575B]">{headName}</h2>
                  <p className="text-gray-500">{headTitle}</p>

                  <div className="mt-4 flex flex-col gap-2 sm:mt-8">
                    {/* Qabul vaqti */}
                    <div className="flex w-full flex-col sm:flex-row sm:justify-between">
                      <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                        <CalendarIcon />
                        <div>{s("dept.reception", lang)}:</div>
                      </div>
                      <div className="mx-2 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
                      <div className="text-[14px] sm:text-right">{s("dept.reception_default", lang)}</div>
                    </div>
                    {/* Telefon */}
                    <div className="flex w-full flex-col sm:flex-row sm:justify-between">
                      <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                        <PhoneIcon />
                        <div>{s("dept.phone", lang)}:</div>
                      </div>
                      <div className="mx-2 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
                      <div className="text-[14px] sm:text-right">{dept.phone || ""}</div>
                    </div>
                    {/* E-mail */}
                    <div className="flex w-full flex-col sm:flex-row sm:justify-between">
                      <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                        <EmailIcon />
                        <div>{s("dept.email", lang)}:</div>
                      </div>
                      <div className="mx-2 hidden flex-grow border-b border-dashed border-gray-300 sm:block" />
                      <div className="break-all text-[14px] sm:text-right">{dept.email || ""}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description — ISFT style */}
            {description && (
              <div className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl w-full max-w-full bg-gray-100">
                <div className="text-gray-600 text-container leading-relaxed text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}
          </div>

          {/* ══ RIGHT — col-span-1 sidebar ══ */}
          <div className="md:col-span-1">
            <div className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
              <h4 className="font-serif text-2xl font-semibold">{s("nav.kafedralar", lang)}</h4>

              <div className="mt-6 flex flex-col gap-y-6">
                {groups.map((group) => (
                  <div key={group.facultyName} className="flex flex-col gap-3">
                    <h5 className="font-semibold text-gray-800">{group.facultyName}</h5>
                    <div className="flex flex-col gap-3">
                      {group.depts.map((d) => {
                        const isActive = d.slug === slug;
                        return (
                          <Link
                            key={d.id}
                            href={`/${lang}/biz-haqimizda/tuzilma/kafedralar/${d.slug}`}
                            className={`rounded-3xl p-3 sm:p-4 min-h-[44px] flex items-center text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-[#00575B] text-white"
                                : "bg-white text-[#00575B] hover:bg-[#00575B]/10"
                            }`}
                          >
                            {t(d.name, lang)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
