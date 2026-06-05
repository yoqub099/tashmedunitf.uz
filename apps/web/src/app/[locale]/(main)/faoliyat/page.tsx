import Link from "next/link";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  uz: {
    title: "Faoliyat",
    description: "ToshDTU Termiz filiali faoliyati — ilmiy tadqiqot, o'quv jarayoni, xalqaro hamkorlik va tadqiqot markazi.",
  },
  ru: {
    title: "Деятельность",
    description: "Деятельность Термезского филиала ТашГосМУ — научные исследования, учебный процесс, международное сотрудничество и научный центр.",
  },
  en: {
    title: "Activities",
    description: "Activities of TashSMU Termez Branch — scientific research, academic process, international cooperation and research center.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const meta = META_BY_LOCALE[lang] || META_BY_LOCALE.uz;
  return buildMetadata("faoliyat", { path: "/faoliyat", locale: lang, title: meta.title, description: meta.description });
}

/* ── Arrow icon (diagonal ↗) ── */
function ArrowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ── "Barchasini ko'rish" link ── */
function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="ml-auto flex items-center text-sm font-medium text-[#00575B] hover:underline"
    >
      <span className="mr-2">{label}</span>
      <ArrowIcon size={16} />
    </Link>
  );
}

/* ── Small inner card ── */
function MiniCard({
  title,
  description,
  href,
  badge,
}: {
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="flex flex-col gap-2 group">
      <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-[188px] flex-col bg-gray-100 text-left transition-shadow hover:shadow-md">
        {badge && (
          <div>
            <span className="rounded-full bg-linear-to-r from-[#00575B] to-[#00969D] px-2 py-1 text-xs font-extrabold text-white">
              {badge}
            </span>
          </div>
        )}
        <h4 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-auto">
          {title}
        </h4>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
}

/* ── Inner navigation card ── */
function NavCard({
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
      className="group rounded-2xl p-4 md:p-6 lg:rounded-3xl inline-flex min-h-[13rem] flex-col bg-white transition-shadow hover:shadow-md"
    >
      <h4 className="font-serif text-xl font-semibold text-gray-900">
        {title}
      </h4>
      <p className="mt-2 line-clamp-2 text-sm text-gray-500">{description}</p>
      <div className="mt-auto flex w-full items-end justify-end">
        <span className="rounded-full border border-[#00575B] bg-transparent p-1.5 text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
          <ArrowIcon size={18} />
        </span>
      </div>
    </Link>
  );
}

export default async function ActivityPage() {
  const lang = await getLanguage();

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="py-6">
        {/* ═══════ Hero: Title + Quick links ═══════ */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Breadcrumb items={[{ label: s("nav.faoliyat", lang) }]} className="mb-3" />
            <h1 className="font-serif text-[32px] font-semibold leading-tight lg:text-5xl">
              {s("nav.faoliyat", lang)}
            </h1>
            <p className="mt-4 text-gray-700">
              {s("faoliyat.hero_desc", lang)}
            </p>
          </div>

          {/* Quick links card */}
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col gap-y-2 bg-gray-100">
            <div className="space-y-2">
              <h2 className="font-serif text-xl font-semibold text-gray-900">
                {s("footer.quick_links", lang)}
              </h2>
            </div>
            <div className="mt-auto space-y-2">
              {[
                {
                  label: s("nav.ilmiy_jurnal", lang),
                  href: `/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal`,
                },
                {
                  label: s("nav.konferensiyalar", lang),
                  href: `/${lang}/faoliyat/ilmiy-faoliyat/konferensiyalar`,
                },
                {
                  label: s("nav.tadqiqod_markazi", lang),
                  href: `/${lang}/faoliyat/tadqiqod-markazi`,
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-x-2 rounded-3xl bg-white p-4 font-medium text-gray-900 transition-shadow hover:shadow-md"
                >
                  <span>{item.label}</span>
                  <span className="ml-auto flex items-center text-sm text-[#00575B]">
                    <span className="mr-2">{s("common.details", lang)}</span>
                    <ArrowIcon size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ Section: Ilmiy tadqiqot ═══════ */}
        <div className="mt-10 text-center lg:mt-20">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {s("nav.tadqiqot", lang)}
          </h2>
          <p className="mt-2 text-gray-600">
            {s("faoliyat.research_subtitle", lang)}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Tadqiqotlar column */}
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <h3 className="font-serif text-2xl font-semibold text-gray-900">
                  {s("faoliyat.tadqiqotlar", lang)}
                </h3>
                <ViewAllLink href={`/${lang}/faoliyat/ilmiy-faoliyat/tadqiqot`} label={s("common.view_all", lang)} />
              </div>
              <MiniCard
                title={s("faoliyat.klinik_tadqiqotlar", lang)}
                description={s("faoliyat.klinik_tadqiqotlar_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/tadqiqot`}
                badge={s("faoliyat.badge_tadqiqot", lang)}
              />
              <MiniCard
                title={s("faoliyat.farmatsevtik_tadqiqotlar", lang)}
                description={s("faoliyat.farmatsevtik_tadqiqotlar_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/tadqiqot`}
                badge={s("faoliyat.badge_tadqiqot", lang)}
              />
              <MiniCard
                title={s("faoliyat.jamoat_salomatligi", lang)}
                description={s("faoliyat.jamoat_salomatligi_desc", lang)}
                href={`/${lang}/faoliyat/ilmiy-faoliyat/tadqiqot`}
                badge={s("faoliyat.badge_tadqiqot", lang)}
              />
            </div>

            {/* Konferensiyalar + Innovatsiyalar (2 cols) */}
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-6 bg-gray-100 lg:col-span-2 text-left">
              <div className="flex items-center">
                <h3 className="font-serif text-2xl font-semibold text-gray-900">
                  {s("faoliyat.konferensiyalar", lang)}
                </h3>
                <ViewAllLink href={`/${lang}/faoliyat/ilmiy-faoliyat/konferensiyalar`} label={s("common.view_all", lang)} />
              </div>

              {[
                {
                  title: s("faoliyat.conf1_title", lang),
                  date: s("faoliyat.conf1_date", lang),
                },
                {
                  title: s("faoliyat.conf2_title", lang),
                  date: s("faoliyat.conf2_date", lang),
                },
                {
                  title: s("faoliyat.conf3_title", lang),
                  date: s("faoliyat.conf3_date", lang),
                },
              ].map((conf) => (
                <Link
                  key={conf.title}
                  href={`/${lang}/faoliyat/ilmiy-faoliyat/konferensiyalar`}
                  className="block rounded-2xl bg-white p-4 md:p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-linear-to-r from-[#00575B] to-[#00969D] px-2 py-1 text-xs font-extrabold text-white">
                        {s("faoliyat.badge_konferensiya", lang)}
                      </span>
                      <h4 className="mt-3 font-serif text-base font-semibold leading-tight lg:text-lg">
                        {conf.title}
                      </h4>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-500">
                        {conf.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Maqolalar / Ilmiy ishlar */}
          <div className="mt-6 rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 text-left">
            <div className="flex items-center">
              <h3 className="font-serif text-2xl font-semibold text-gray-900">
                {s("faoliyat.ilmiy_ishlar", lang)}
              </h3>
              <ViewAllLink href={`/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar`} label={s("common.view_all", lang)} />
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: s("faoliyat.innov1_title", lang),
                  desc: s("faoliyat.innov1_desc", lang),
                },
                {
                  title: s("faoliyat.innov2_title", lang),
                  desc: s("faoliyat.innov2_desc", lang),
                },
                {
                  title: s("faoliyat.innov3_title", lang),
                  desc: s("faoliyat.innov3_desc", lang),
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={`/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar`}
                  className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-white text-left transition-shadow hover:shadow-md"
                >
                  <h4 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ Section: O'quv faoliyati ═══════ */}
        <div className="mt-10 text-center lg:mt-20">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {s("nav.oquv_faoliyati", lang)}
          </h2>
          <p className="mt-2 text-gray-600">
            {s("faoliyat.oquv_subtitle", lang)}
          </p>

          <div className="mt-8 grid gap-6 text-left lg:grid-cols-2">
            {/* O'quv rejalari */}
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
              <h3 className="font-serif text-2xl font-semibold text-gray-900">
                {s("faoliyat.oquv_rejalari", lang)}
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <NavCard
                  title={s("faoliyat.bakalavriat", lang)}
                  description={s("faoliyat.bakalavriat_desc", lang)}
                  href={`/${lang}/faoliyat/oquv-faoliyati/oquv-rejalari/bakalavriat`}
                />
                <NavCard
                  title={s("faoliyat.magistratura", lang)}
                  description={s("faoliyat.magistratura_desc", lang)}
                  href={`/${lang}/faoliyat/oquv-faoliyati/oquv-rejalari/magistratura`}
                />
              </div>
            </div>

            {/* O'quv grafigi */}
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
              <h3 className="font-serif text-2xl font-semibold text-gray-900">
                {s("faoliyat.oquv_grafigi", lang)}
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <NavCard
                  title={s("faoliyat.oquv_jarayonlari", lang)}
                  description={s("faoliyat.oquv_jarayonlari_desc", lang)}
                  href={`/${lang}/faoliyat/oquv-faoliyati`}
                />
                <NavCard
                  title={s("faoliyat.elektron_jadval", lang)}
                  description={s("faoliyat.elektron_jadval_desc", lang)}
                  href={`/${lang}/faoliyat/oquv-faoliyati`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Section: Xalqaro hamkorlik ═══════ */}
        <div className="mt-10 lg:mt-20">
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
            <div className="flex items-center">
              <h3 className="font-serif text-2xl font-semibold text-gray-900">
                {s("nav.xalqaro_hamkorlik", lang)}
              </h3>
              <ViewAllLink href={`/${lang}/faoliyat/xalqaro-hamkorlik`} label={s("common.view_all", lang)} />
            </div>
            <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
              <p>
                {s("faoliyat.xalqaro_desc", lang)}
              </p>
            </div>
          </div>
        </div>

        {/* ═══════ Section: Tadqiqod markazi ═══════ */}
        <div className="mt-6">
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#00969D] text-white">
            <div className="flex items-center">
              <h3 className="font-serif text-2xl font-semibold">
                {s("nav.tadqiqod_markazi", lang)}
              </h3>
              <Link
                href={`/${lang}/faoliyat/tadqiqod-markazi`}
                className="ml-auto flex items-center text-sm font-medium text-white/90 hover:text-white"
              >
                <span className="mr-2">{s("common.view_all", lang)}</span>
                <ArrowIcon size={16} />
              </Link>
            </div>
            <p className="mt-3 text-sm text-white/80 max-w-2xl">
              {s("faoliyat.tadqiqod_desc", lang)}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
