import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { getFaculties } from "@/lib/services";
import { t } from "@/lib/translate";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("oquv-rejalari-bakalavriat", { path: "/faoliyat/oquv-faoliyati/oquv-rejalari/bakalavriat", locale: lang });
}

function GlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M14 24.5C8.2005 24.5 3.5 19.7995 3.5 14C3.5 8.2005 8.2005 3.5 14 3.5C19.7995 3.5 24.5 8.2005 24.5 14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 10.5H23.7766" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 17.5H14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.6667 14C18.6667 10.7753 17.8232 7.55062 16.1386 4.73662C15.1504 3.08812 12.8497 3.08812 11.8627 4.73662C8.49107 10.3658 8.49107 17.6353 11.8627 23.2645C12.3562 24.0881 13.1787 24.5011 14.0012 24.5011" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.3649 22.365L25.2874 21.196C25.8019 20.9907 25.7902 20.258 25.2699 20.0678L18.3095 17.5373C17.8289 17.3623 17.3634 17.829 17.5372 18.3097L20.0677 25.27C20.2567 25.7915 20.9894 25.802 21.1959 25.2875L22.3649 22.365Z" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function BakalavriатOquvRejalariPage() {
  const lang = await getLanguage();

  const facultiesRes = await getFaculties({ per_page: 50, level: "bakalavriat" }).catch(() => ({ success: false, data: [] }));
  const faculties = facultiesRes.data || [];

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.oquv_rejalari", lang)}
        </h2>

        <Breadcrumb
          items={[
            { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
            { label: s("nav.oquv_faoliyati", lang), href: `/${lang}/faoliyat/oquv-faoliyati` },
            { label: s("nav.bakalavriat", lang) },
          ]}
          className="mt-3"
        />

        <div className="mt-6 space-y-6">
          {faculties.map((faculty: any) => (
            <div key={faculty.id} className="rounded-2xl p-4 md:p-6 lg:rounded-3xl w-full bg-gray-100">
              <h4 className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                <GlobeIcon />
                <span>{t(faculty.name, lang)}</span>
              </h4>
              <div className="mt-6 space-y-2">
                {(faculty.directions || []).map((direction: any) => (
                  <div key={direction.id} className="rounded-[20px] bg-white p-4 md:p-6 flex items-center justify-between">
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                      {t(direction.name, lang)}
                    </h6>
                    {direction.code && (
                      <span className="text-sm text-gray-400">{direction.code}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
