"use client";

import { useState } from "react";
import {
  usePageBySlug,
  useCreatePage,
  useUpdatePage,
} from "@/hooks/usePages";
import { sanitizeHtml } from "@/lib/sanitize";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Button from "@/components/shared/Button";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import { parseFormData } from "@/lib/utils";
import { Plus, FileText, ImageIcon, BookOpen, Lightbulb, TrendingUp, Users, Globe, Heart, Award } from "lucide-react";

/* ═══════════════════════════════════════════
   Field Configs
   ═══════════════════════════════════════════ */

const HERO_FIELDS: FieldConfig[] = [
  {
    name: "title",
    label: "Sarlavha",
    type: "text",
    translatable: true,
    required: true,
  },
  {
    name: "content",
    label: "Missiya matni",
    type: "richtext",
    translatable: true,
    required: true,
  },
  {
    name: "images",
    label: "Hero rasm (o'ng tomon)",
    type: "media",
    accept: "image/*",
    maxSize: 10240,
  },
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
];

const SECTION_FIELDS: FieldConfig[] = [
  {
    name: "title",
    label: "Bo'lim sarlavhasi",
    type: "text",
    translatable: true,
    required: true,
  },
  {
    name: "content",
    label: "Bo'lim matni",
    type: "richtext",
    translatable: true,
    required: true,
  },
  {
    name: "images",
    label: "Bo'lim rasmi",
    type: "media",
    accept: "image/*",
    maxSize: 10240,
  },
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
];

/* ═══════════════════════════════════════════
   Section Slugs & Metadata
   ═══════════════════════════════════════════ */

interface SectionMeta {
  slug: string;
  fallbackTitle: string;
  fallbackContent: string;
}

const SECTIONS: SectionMeta[] = [
  {
    slug: "biz-haqimizda-tdtutf",
    fallbackTitle: "TdTUTF: Termiz shahridagi yetakchi tibbiyot ta'lim maskani",
    fallbackContent:
      "Toshkent davlat tibbiyot universiteti Termiz filiali — zamonaviy tibbiy ta'lim muassasasi.",
  },
  {
    slug: "biz-haqimizda-talim-muhiti",
    fallbackTitle: "Ta'lim muhiti",
    fallbackContent:
      "O'quv dasturining asosiy fanlari milliy va global miqyosdagi tadqiqotlarning ustuvor yo'nalishlarini aks ettiradi.",
  },
  {
    slug: "biz-haqimizda-oqitish-usuli",
    fallbackTitle: "O'ziga xos o'qitish usuli",
    fallbackContent:
      "TdTUTF jahon amaliy tajribasini ta'lim sohasiga singdirgan holda xalqaro darajadagi mutaxassislarni tayyorlashga intiladi.",
  },
  {
    slug: "biz-haqimizda-kichik-guruhlar",
    fallbackTitle: "Kichik guruhlar samaradorligi",
    fallbackContent:
      "Barcha talabalariga kichik guruhlarda ta'lim olish imkoniyatini taqdim qilish samaradorligi g'oyasi tarafdoridir.",
  },
  {
    slug: "biz-haqimizda-afzalliklar-bolim",
    fallbackTitle: "Bizning bitiruvchilarimizdagi afzalliklar va o'ziga xosliklar",
    fallbackContent:
      "<ul><li>O'z sohasida mukammal kompleks bilimlarga egaligi</li><li>Tanqidiy fikrlash va qo'yilgan masalalarni yechish ko'nikmasiga egaligi</li><li>Biznes savodxonligi va kirishuvchanligi</li><li>Yetakchilik sifatlari, jamoaviy ishlash va rivojlanish ko'nikmalari</li><li>Ahloqiy kompetensiyaga egaligi va xalqaro bag'rikengligi</li><li>O'z ishiga sadoqat, hissiyotni jilovlay olish va sabr-toqatli bo'lish</li></ul>",
  },
];

/* ── Advantages section (separate ISFT card grid) ── */

const ADVANTAGES_META: SectionMeta = {
  slug: "biz-haqimizda-afzalliklar",
  fallbackTitle: "Bizning bitiruvchilarimizdagi afzalliklar",
  fallbackContent:
    "O'z sohasida mukammal kompleks bilimlarga egaligi, tanqidiy fikrlash va qo'yilgan masalalarni yechish ko'nikmasiga egaligi.",
};

const FALLBACK_ADVANTAGES = [
  "O'z sohasida mukammal kompleks bilimlarga egaligi",
  "Tanqidiy fikrlash va qo'yilgan masalalarni yechish ko'nikmasiga egaligi",
  "Biznes savodxonligi va kirishuvchanligi",
  "Yetakchilik sifatlari, jamoaviy ishlash va rivojlanish ko'nikmalari",
  "Ahloqiy kompetensiyaga egaligi va xalqaro bag'rikengligi",
  "O'z ishiga sadoqat, hissiyotni jilovlay olish va sabr-toqatli bo'lish",
];

const ADVANTAGE_ICONS = [
  BookOpen,
  Lightbulb,
  TrendingUp,
  Users,
  Globe,
  Heart,
];

/* ── Licenses section metadata ── */

const LICENSES_META: SectionMeta = {
  slug: "biz-haqimizda-litsenziyalar",
  fallbackTitle: "Litsenziya va sertifikatlar",
  fallbackContent: "Universitet litsenziyalari va sertifikatlari.",
};

const LICENSES_FIELDS: FieldConfig[] = [
  {
    name: "title",
    label: "Sarlavha",
    type: "text",
    translatable: true,
    required: true,
  },
  {
    name: "content",
    label: "Tavsif (ixtiyoriy)",
    type: "richtext",
    translatable: true,
  },
  {
    name: "images",
    label: "Litsenziya rasmlari (bir nechta)",
    type: "media",
    accept: "image/*",
    maxSize: 10240,
    multiple: true,
  },
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
];

/** Parse <li> items from HTML */
function parseListItems(html: string): string[] {
  const matches = html.match(/<li[^>]*>(.*?)<\/li>/g);
  if (!matches || matches.length === 0) return [];
  return matches.map((m) => m.replace(/<[^>]*>/g, "").trim());
}

/* ═══════════════════════════════════════════
   Section Card Component — ISFT layout
   ═══════════════════════════════════════════ */

function SectionCard({
  meta,
  index,
}: {
  meta: SectionMeta;
  index: number;
}) {
  const { data: page, refetch } = usePageBySlug(meta.slug);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = page?.title?.uz || meta.fallbackTitle;
  const content = page?.content?.uz || meta.fallbackContent;
  const image = page?.images?.[0]?.url;
  const isReversed = index % 2 !== 0;

  const handleSubmit = async (formData: FormData) => {
    const data = parseFormData(formData);
    if (page) {
      await updatePage.mutateAsync({
        id: page.id,
        data,
      });
    } else {
      data.slug = meta.slug;
      await createPage.mutateAsync(data);
    }
    setIsModalOpen(false);
    refetch();
  };

  return (
    <>
      <EditableWrapper
        entityType="page"
        entityId={page?.id}
        onEdit={() => setIsModalOpen(true)}
        label={`Bo'lim ${index + 1}`}
      >
        <div
          className={`flex flex-col gap-6 ${
            isReversed ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {/* Text card — ISFT style */}
          <div className="rounded-2xl bg-gray-100 p-4 text-gray-800 md:w-1/2 md:p-14! lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold">{title}</h4>
            <div
              className="mt-6 text-container leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(content),
              }}
            />
          </div>
          {/* Image card — ISFT style (fixed height, object-cover) */}
          <div className="md:w-1/2 overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-200 min-h-70">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full min-h-70 object-cover"
              />
            ) : (
              <div className="flex h-full min-h-70 items-center justify-center bg-linear-to-br from-blue-800 via-blue-700 to-blue-900">
                <div className="text-center text-white/60">
                  <ImageIcon className="mx-auto mb-2 h-10 w-10 opacity-40" />
                  <p className="text-xs">Rasm admin paneldan qo&apos;shiladi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </EditableWrapper>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${title} — ${page ? "Tahrirlash" : "Yangi sahifa"}`}
        fields={SECTION_FIELDS}
        initialData={
          page
            ? {
                title: page.title,
                content: page.content,
                is_published: page.is_published,
                images: page.images?.[0]?.url,
              }
            : {
                title: { uz: meta.fallbackTitle },
                content: { uz: meta.fallbackContent },
                is_published: true,
              }
        }
        onSubmit={handleSubmit}
        isLoading={createPage.isPending || updatePage.isPending}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   Advantages Card — ISFT card grid style
   ═══════════════════════════════════════════ */

function AdvantagesCard() {
  const { data: page, refetch } = usePageBySlug(ADVANTAGES_META.slug);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = page?.title?.uz || ADVANTAGES_META.fallbackTitle;
  const content = page?.content?.uz || ADVANTAGES_META.fallbackContent;

  // Parse <li> items from content, fallback to static list
  const parsedItems = parseListItems(content);
  const items = parsedItems.length > 0 ? parsedItems : FALLBACK_ADVANTAGES;

  const handleSubmit = async (formData: FormData) => {
    const data = parseFormData(formData);
    if (page) {
      await updatePage.mutateAsync({
        id: page.id,
        data,
      });
    } else {
      data.slug = ADVANTAGES_META.slug;
      await createPage.mutateAsync(data);
    }
    setIsModalOpen(false);
    refetch();
  };

  return (
    <>
      <EditableWrapper
        entityType="page"
        entityId={page?.id}
        onEdit={() => setIsModalOpen(true)}
        label="Afzalliklar"
      >
        <div className="mt-20">
          <h2 className="text-center font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {title}
          </h2>
          <div className="mt-8 grid gap-4 rounded-2xl bg-gray-100 p-6 md:grid-cols-2 lg:rounded-3xl">
            {items.map((item, i) => {
              const Icon = ADVANTAGE_ICONS[i % ADVANTAGE_ICONS.length];
              return (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-2xl bg-white p-6 md:h-46"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00575B] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h5 className="mt-4 font-serif text-xl font-semibold text-[#00575B] md:mt-0 md:text-[22px]">
                    {item}
                  </h5>
                </div>
              );
            })}
          </div>
        </div>
      </EditableWrapper>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${title} — ${page ? "Tahrirlash" : "Yangi sahifa"}`}
        fields={SECTION_FIELDS}
        initialData={
          page
            ? {
                title: page.title,
                content: page.content,
                is_published: page.is_published,
                images: page.images?.[0]?.url,
              }
            : {
                title: { uz: ADVANTAGES_META.fallbackTitle },
                content: {
                  uz: `<ul>${FALLBACK_ADVANTAGES.map((a) => `<li>${a}</li>`).join("")}</ul>`,
                },
                is_published: true,
              }
        }
        onSubmit={handleSubmit}
        isLoading={createPage.isPending || updatePage.isPending}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   Licenses Card — ISFT certificate gallery
   ═══════════════════════════════════════════ */

function LicensesCard() {
  const { data: page, refetch } = usePageBySlug(LICENSES_META.slug);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = page?.title?.uz || LICENSES_META.fallbackTitle;
  const images = page?.images || [];

  const handleSubmit = async (formData: FormData) => {
    const data = parseFormData(formData);
    if (page) {
      await updatePage.mutateAsync({
        id: page.id,
        data,
      });
    } else {
      data.slug = LICENSES_META.slug;
      await createPage.mutateAsync(data);
    }
    setIsModalOpen(false);
    refetch();
  };

  return (
    <>
      <EditableWrapper
        entityType="page"
        entityId={page?.id}
        onEdit={() => setIsModalOpen(true)}
        label="Litsenziyalar"
      >
        <div className="mt-20 text-center">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {title}
          </h2>
          <div className="mt-8 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {images.length > 0 ? (
              images.map((img: { url: string; name?: string }, i: number) => (
                <div
                  key={i}
                  className="w-full cursor-pointer rounded-2xl bg-gray-100 p-6 lg:rounded-3xl"
                >
                  <img
                    src={img.url}
                    alt={img.name || `Litsenziya ${i + 1}`}
                    className="mx-auto max-h-96 w-auto"
                  />
                </div>
              ))
            ) : (
              /* Placeholder — 6 slots like ISFT */
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full items-center justify-center rounded-2xl bg-gray-100 p-6 lg:rounded-3xl"
                  style={{ minHeight: 280 }}
                >
                  <div className="text-center text-gray-400">
                    <Award className="mx-auto mb-2 h-10 w-10 opacity-40" />
                    <p className="text-xs">Litsenziya {i + 1}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {!page && (
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="h-4 w-4" />}
              className="mt-4"
            >
              Litsenziya sahifasi yaratish
            </Button>
          )}
        </div>
      </EditableWrapper>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${title} — ${page ? "Tahrirlash" : "Yangi sahifa"}`}
        fields={LICENSES_FIELDS}
        initialData={
          page
            ? {
                title: page.title,
                content: page.content,
                is_published: page.is_published,
                images: page.images || [],
              }
            : {
                title: { uz: LICENSES_META.fallbackTitle },
                content: { uz: LICENSES_META.fallbackContent },
                is_published: true,
              }
        }
        onSubmit={handleSubmit}
        isLoading={createPage.isPending || updatePage.isPending}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════ */

export default function BizHaqimizdaPage() {
  const {
    data: heroPage,
    isLoading,
    refetch: refetchHero,
  } = usePageBySlug("biz-haqimizda");
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  const heroTitle = heroPage?.title?.uz || "Biz haqimizda";
  const heroContent =
    heroPage?.content?.uz ||
    "Bizning vazifamiz - talabalarda kelajakdagi karyera o'sishi uchun asosiy ko'nikmalarni shakllantirish.";
  const heroImage = heroPage?.images?.[0]?.url;

  const handleHeroSubmit = async (formData: FormData) => {
    const data = parseFormData(formData);
    if (heroPage) {
      await updatePage.mutateAsync({
        id: heroPage.id,
        data,
      });
    } else {
      data.slug = "biz-haqimizda";
      await createPage.mutateAsync(data);
    }
    setIsHeroModalOpen(false);
    refetchHero();
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        <LoadingSpinner size="lg" text="Yuklanmoqda..." />
      </Container>
    );
  }

  return (
    <section className="py-6 sm:py-10">
      <Container>
        {/* ═══ Hero Preview — ISFT style ═══ */}
        <EditableWrapper
          entityType="page"
          entityId={heroPage?.id}
          onEdit={() => setIsHeroModalOpen(true)}
          label="Hero banner"
          className="mt-6"
        >
          <div className="rounded-2xl bg-[url(/images/Head.svg)] bg-cover bg-no-repeat p-4 text-white md:p-6 lg:rounded-3xl lg:p-12">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
                  {heroTitle}
                </h2>
                <div
                  className="mt-4 text-container"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                      `<p>${heroContent.replace(/<[^>]*>/g, "")}</p>`
                    ),
                  }}
                />
              </div>
              {heroImage && (
                <div className="space-x-8">
                  <img
                    src={heroImage}
                    alt={heroTitle}
                    className="float-right mt-10 rounded-2xl"
                    width={456}
                    height={240}
                  />
                </div>
              )}
            </div>
            {!heroPage && (
              <Button
                onClick={() => setIsHeroModalOpen(true)}
                icon={<Plus className="h-4 w-4" />}
                className="mt-4"
              >
                Hero sahifa yaratish
              </Button>
            )}
          </div>
        </EditableWrapper>

        <EditModal
          isOpen={isHeroModalOpen}
          onClose={() => setIsHeroModalOpen(false)}
          title={`Hero banner — ${heroPage ? "Tahrirlash" : "Yaratish"}`}
          fields={HERO_FIELDS}
          initialData={
            heroPage
              ? {
                  title: heroPage.title,
                  content: heroPage.content,
                  is_published: heroPage.is_published,
                  images: heroPage.images?.[0]?.url,
                }
              : {
                  title: { uz: "Biz haqimizda" },
                  is_published: true,
                }
          }
          onSubmit={handleHeroSubmit}
          isLoading={createPage.isPending || updatePage.isPending}
        />

        {/* ═══ Content Sections — ISFT style ═══ */}
        <div className="mt-8">
          <div className="flex flex-col gap-6">
            {SECTIONS.map((meta, index) => (
              <SectionCard key={meta.slug} meta={meta} index={index} />
            ))}
          </div>
        </div>

        {/* ═══ Advantages Section — ISFT card grid ═══ */}
        <AdvantagesCard />

        {/* ═══ Rektor bilan bog'laning Preview ═══ */}
        <div className="mt-16 flex flex-col items-center gap-8 rounded-2xl bg-linear-to-br from-[#00575B] to-[#00969D] p-8 text-white md:flex-row md:p-12 lg:rounded-3xl">
          <div className="flex-1 space-y-3">
            <h3 className="font-serif text-2xl font-semibold lg:text-[32px]">
              Rektor bilan bog&apos;laning
            </h3>
            <p className="leading-relaxed opacity-90">
              Rektor uchun taklif yoki shikoyatlaringiz bo&apos;lsa tugmani
              bosish orqali rektor bilan bog&apos;lanishingiz va o&apos;z
              taklif, shikoyat, e&apos;tirozlaringizni bildirishingiz mumkin
            </p>
          </div>
          <div className="hidden h-16 w-px bg-white/20 lg:block" />
          <div className="shrink-0">
            <span className="inline-block whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-[#00575B]">
              Elektron qabulxona
            </span>
          </div>
        </div>

        {/* ═══ Litsenziya va sertifikatlar — ISFT gallery ═══ */}
        <LicensesCard />
      </Container>
    </section>
  );
}
