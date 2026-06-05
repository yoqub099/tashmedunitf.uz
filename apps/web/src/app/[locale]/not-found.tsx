import Link from "next/link";
import type { Metadata } from "next";
import { Home, Search, ArrowRight, Mail } from "lucide-react";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";
import { SITE_NAME_UZ, SITE_NAME_RU, SITE_NAME_EN } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const titles: Record<string, string> = {
    uz: "404 — Sahifa topilmadi",
    ru: "404 — Страница не найдена",
    en: "404 — Page not found",
  };
  const descriptions: Record<string, string> = {
    uz: "Siz qidirayotgan sahifa topilmadi. Bosh sahifaga qaytish yoki boshqa sahifalarni ko'rib chiqish.",
    ru: "Запрашиваемая страница не найдена. Вернитесь на главную или просмотрите другие разделы.",
    en: "The page you are looking for was not found. Return to the homepage or browse other sections.",
  };
  const siteName = lang === "ru" ? SITE_NAME_RU : lang === "en" ? SITE_NAME_EN : SITE_NAME_UZ;
  return {
    title: titles[lang] || titles.uz,
    description: descriptions[lang] || descriptions.uz,
    robots: { index: false, follow: true },
    openGraph: {
      title: titles[lang] || titles.uz,
      description: descriptions[lang] || descriptions.uz,
      siteName,
      locale: lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ",
    },
  };
}

const TRANSLATIONS: Record<string, {
  heading: string;
  subheading: string;
  desc: string;
  home: string;
  contact: string;
  popular: string;
  news: string;
  about: string;
  applicants: string;
}> = {
  uz: {
    heading: "Sahifa topilmadi",
    subheading: "Izlagan sahifangiz mavjud emas yoki ko'chirilgan",
    desc: "Manzilni tekshirib qayta urinib ko'ring yoki quyidagi havolalardan foydalaning.",
    home: "Bosh sahifa",
    contact: "Aloqa",
    popular: "Ommabop bo'limlar",
    news: "Yangiliklar",
    about: "Biz haqimizda",
    applicants: "Abiturientlarga",
  },
  ru: {
    heading: "Страница не найдена",
    subheading: "Запрашиваемая страница не существует или была перемещена",
    desc: "Проверьте адрес или воспользуйтесь ссылками ниже.",
    home: "Главная",
    contact: "Контакты",
    popular: "Популярные разделы",
    news: "Новости",
    about: "О нас",
    applicants: "Абитуриентам",
  },
  en: {
    heading: "Page not found",
    subheading: "The page you are looking for doesn't exist or has been moved",
    desc: "Check the address and try again or use the links below.",
    home: "Home",
    contact: "Contact",
    popular: "Popular sections",
    news: "News",
    about: "About us",
    applicants: "For applicants",
  },
};

export default async function NotFound() {
  const lang = await getLanguage();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/40">
      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-200/30 to-cyan-200/20 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/20 to-teal-200/20 blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Big 404 */}
        <div className="relative">
          <h1 className="text-[clamp(6rem,18vw,12rem)] font-black leading-none tracking-tighter bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 text-[clamp(6rem,18vw,12rem)] font-black leading-none tracking-tighter text-slate-900/5 blur-sm pointer-events-none">
            404
          </div>
        </div>

        <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-slate-900">
          {t.heading}
        </h2>
        <p className="mt-2 text-base text-slate-600">
          {t.subheading}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {t.desc}
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-4 h-4" />
            {t.home}
          </Link>
          <Link
            href={`/${lang}/aloqa`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Mail className="w-4 h-4" />
            {t.contact}
          </Link>
        </div>

        {/* Popular sections */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            {t.popular}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: t.news, href: `/${lang}/yangiliklar` },
              { label: t.about, href: `/${lang}/biz-haqimizda` },
              { label: t.applicants, href: `/${lang}/abiturientlarga` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between px-4 py-3 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-xl text-sm font-medium text-slate-700 hover:text-teal-700 transition-all"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
