import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import { getStaffById } from "@/lib/services";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME_UZ, SITE_NAME_RU, SITE_NAME_EN, DEFAULT_OG_IMAGE, getPersonSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lang = await getLanguage();
  const path = `/biz-haqimizda/tuzilma/xodimlar/${id}`;
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";
  const siteName = lang === "ru" ? SITE_NAME_RU : lang === "en" ? SITE_NAME_EN : SITE_NAME_UZ;
  const staffRes = await getStaffById(Number(id)).catch(() => null);
  const staff = staffRes?.data;
  if (!staff) return { title: s("meta.staff_not_found", lang) };
  const fullName = t(staff.full_name, lang) || s("meta.staff_fallback", lang);
  const position = t(staff.position, lang) || s("meta.staff_fallback", lang);
  const title = `${fullName} — ${position}`;
  const description = `${fullName} — ${position}, ${s("meta.staff_desc_fallback", lang)}`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages: { uz: `${SITE_URL}/uz${path}`, ru: `${SITE_URL}/ru${path}`, en: `${SITE_URL}/en${path}` } },
    openGraph: { title, description, url: `${SITE_URL}/${lang}${path}`, siteName, locale: ogLocale, alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale), type: "website", images: [{ url: staff.photo || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [staff.photo || DEFAULT_OG_IMAGE] },
  };
}

// Since we receive params asynchronously in Next.js 15+ layouts/pages
export default async function XodimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLanguage();

  const staffRes = await getStaffById(Number(id)).catch(() => null);
  const staff = staffRes?.data;

  if (!staff) {
    notFound();
  }

  const fullName = t(staff.full_name, lang) || s("staff.not_found", lang);
  const position = t(staff.position, lang) || "";

  const personSchema = getPersonSchema({
    name: fullName,
    position: position,
    department: staff.department ? t(staff.department.name, lang) : undefined,
    image: staff.photo || undefined,
    email: staff.email || undefined,
    phone: staff.phone || undefined,
    url: `/biz-haqimizda/tuzilma/xodimlar/${id}`,
  });

  return (
    <main className="pt-20 lg:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Container className="py-6">
        {/* Sarlavha */}
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {fullName}
        </h2>

        {/* Breadcrumb — ISFT style */}
        <div className="text-sm font-medium mt-3">
          <ol className="flex flex-wrap items-center gap-1 text-gray-500">
            <li>
              <Link href={`/${lang}`} className="hover:text-red-600 transition-colors">
                {s("breadcrumb.home", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href={`/${lang}/biz-haqimizda`} className="hover:text-red-600 transition-colors">
                {s("breadcrumb.university", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href={`/${lang}/biz-haqimizda/tuzilma`} className="hover:text-red-600 transition-colors">
                {s("breadcrumb.structure", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href={`/${lang}/biz-haqimizda/tuzilma/xodimlar`} className="hover:text-red-600 transition-colors">
                {s("breadcrumb.staff", lang)}
              </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <span className="text-gray-400">{fullName}</span>
            </li>
          </ol>
        </div>

        {/* Outer bg-gray wrap */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
          <div className="grid gap-6 md:grid-cols-1">
            {/* White card */}
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-white">
              <div className="grid gap-6 xl:grid-cols-3">
                {/* Image */}
                {staff.photo ? (
                  <Image
                    src={staff.photo}
                    alt={fullName}
                    width={500}
                    height={600}
                    className="w-full h-[250px] sm:h-[320px] md:h-[400px] rounded-xl object-cover xl:col-span-1 border border-gray-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-[250px] sm:h-[320px] md:h-[400px] rounded-xl bg-gray-50 flex items-center justify-center xl:col-span-1 border border-gray-100">
                    <span className="text-6xl sm:text-8xl font-serif text-[#00575B]/30">
                      {fullName.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Info Text */}
                <div className="xl:col-span-2 flex flex-col pt-2 xl:pt-0">
                  <h2 className="text-[20px] sm:text-[24px] font-bold text-[#00575B] leading-tight">
                    {position}
                  </h2>
                  <p className="text-gray-500 text-lg mt-3">
                    {fullName}
                  </p>

                  {/* Container for extra details like biography, phone, emails if present */}
                  <div className="mt-8 flex flex-col gap-4 text-gray-700 text-sm md:text-base leading-relaxed">
                    {staff.department && (
                      <div>
                        <strong>{s("staff.department_label", lang)}:</strong> {t(staff.department.name, lang)}
                      </div>
                    )}
                    {staff.email && (
                      <div>
                        <strong>{s("staff.email_label", lang)}:</strong> {staff.email}
                      </div>
                    )}
                    {staff.phone && (
                      <div>
                        <strong>{s("staff.phone_label", lang)}:</strong> {staff.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
