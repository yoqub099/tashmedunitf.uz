"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDirectionDetail, useDirections, useUpdateDirection, useDeleteDirection } from "@/hooks/useDirections";
import { useFaculties } from "@/hooks/useFaculties";
import { useSiteContents, useUpsertSiteContent, getContentValue } from "@/hooks/useSiteContents";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import type { Direction, Translatable } from "@/types";
import { DEGREE_OPTIONS } from "@/lib/constants";
import { useState, useCallback, useMemo } from "react";
import {
  GraduationCap, Stethoscope, Baby, ShieldCheck, Pill, HeartPulse,
  Scissors, FlaskConical, BookOpen, ArrowRight, ArrowUpRight, Phone,
  RefreshCw, Trash2, ImagePlus, FileText,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

const LEVEL_LABELS: Record<string, string> = {
  bakalavriat: "Bakalavriat",
  ordinatura: "Klinik ordinatura",
  magistratura: "Magistratura",
};

const CODE_ICONS: Record<string, React.ElementType> = {
  "605101": Stethoscope, "605102": Baby, "605103": ShieldCheck,
  "605201": Pill, "705101": HeartPulse, "705102": Scissors, "705201": Baby,
};
function iconFor(code: string) {
  return CODE_ICONS[code?.substring(0, 6)] ?? Stethoscope;
}

function parseDescription(html: string | undefined): { mainText: string } {
  if (!html) return { mainText: "" };
  const cleaned = html
    .replace(/<h3>[\s\S]*$/i, "")
    .replace(/<p>\s*<strong>[^<]*[Kk]aryera[^<]*<\/strong>\s*<\/p>[\s\S]*/i, "")
    .trim();
  return { mainText: cleaned };
}

function cleanDescription(desc: Translatable | undefined): Translatable | undefined {
  if (!desc) return desc;
  const cleaned = { ...desc };
  for (const lang of ['uz', 'ru', 'en'] as const) {
    const html = desc[lang];
    if (typeof html !== "string") continue;
    (cleaned as Record<string, string>)[lang] = html
      .replace(/<h3>[^<]*[Ff]anlar[^<]*<\/h3>\s*<ul>[\s\S]*?<\/ul>/gi, "")
      .replace(/<p>\s*<strong>[^<]*[Kk]aryera[^<]*<\/strong>\s*<\/p>[\s\S]*/gi, "")
      .replace(/<h3>[^<]*[Kk]aryera[^<]*<\/h3>[\s\S]*/gi, "")
      .trim();
  }
  return cleaned;
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.748 3.496V6.998" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.252 3.496V6.998" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.665 24.504H6.997c-1.934 0-3.502-1.567-3.502-3.501V8.748c0-1.934 1.568-3.502 3.502-3.502h14.006c1.934 0 3.502 1.568 3.502 3.502v2.917" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.127 17.482v2.052l1.613.984" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19.252" cy="19.252" r="5.252" stroke="#00575B" strokeWidth="1.5" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 24.5H4.667A1.167 1.167 0 013.5 23.333v-7a1.167 1.167 0 011.167-1.166H7A1.167 1.167 0 018.167 16.333v7A1.167 1.167 0 017 24.5z" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.167 19.833h2.721c.505 0 .997-.163 1.4-.466l2.82-2.114a1.75 1.75 0 012.31.165 1.75 1.75 0 010 2.499l-2.42 2.418a3.5 3.5 0 01-2.384 1.276l-3.42.684a3.5 3.5 0 01-2.046-.149l-3.092-.772a3.5 3.5 0 00-1.13-.16H8.166" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10.5" y="2.333" width="14" height="9.333" rx="1.944" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="7" r="1.75" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DegreeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.32 4.777L4.117 8.779c-1.514.841-1.514 3.018 0 3.86l7.203 4.001a7 7 0 006.36 0l7.203-4.002c1.514-.841 1.514-3.018 0-3.859L17.68 4.777a7 7 0 00-6.36 0z" stroke="#00575B" strokeWidth="1.419" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.99 14.233v4.578a3.5 3.5 0 001.474 2.752l1.875 1.248a7 7 0 007.321 0l1.875-1.248a3.5 3.5 0 001.475-2.752v-4.578" stroke="#00575B" strokeWidth="1.417" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Section-specific field groups ──────────────────── */
type EditSection = "title" | "image" | "info" | "description";

const SECTION_META: Record<EditSection, { title: string; fieldNames: string[] }> = {
  title: {
    title: "Yo'nalish ma'lumotlari",
    fieldNames: ["name", "code", "sort_order", "is_active"],
  },
  image: {
    title: "Yo'nalish rasmi",
    fieldNames: ["image"],
  },
  info: {
    title: "O'qish muddati va narxlar",
    fieldNames: ["duration", "price_daytime", "price_remote", "exam_subjects"],
  },
  description: {
    title: "Yo'nalish tavsifi",
    fieldNames: ["description"],
  },
};

const ALL_FIELDS: FieldConfig[] = [
  { name: "name", label: "Yo'nalish nomi", type: "text", translatable: true, required: true },
  { name: "code", label: "Kod", type: "text", required: true, placeholder: "60110300" },
  { name: "level", label: "Daraja", type: "select", required: true, options: DEGREE_OPTIONS.map((d) => ({ value: d.value, label: d.label })) },
  { name: "faculty_id", label: "Fakultet", type: "select", options: [] },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: true },
  { name: "duration", label: "O'qish muddati", type: "text", placeholder: "2 yil" },
  { name: "price_daytime", label: "Kunduzgi ta'lim narxi (so'm)", type: "number", placeholder: "17250000" },
  { name: "price_remote", label: "Masofaviy ta'lim narxi (so'm)", type: "number", placeholder: "9375000" },
  { name: "exam_subjects", label: "Imtihon fanlari", type: "tags", placeholder: "Biologiya, Kimyo" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*" },
  { name: "sort_order", label: "Tartib", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
];

function formatPrice(value: number | null | undefined): string {
  if (!value) return "—";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function OrdinaturaDirectionDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: directionData, isLoading, refetch } = useDirectionDetail(id);
  const { data: siblingsData } = useDirections({ per_page: 50, degree: "ordinatura" });
  const { data: facultiesData } = useFaculties({ per_page: 50 });

  const [editSection, setEditSection] = useState<EditSection | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteImageConfirm, setDeleteImageConfirm] = useState(false);
  const [editingCard, setEditingCard] = useState<"contact" | "cta" | null>(null);

  const updateDirection = useUpdateDirection();
  const deleteDirection = useDeleteDirection();
  const { data: siteContents } = useSiteContents("faculty_detail");
  const upsertSiteContent = useUpsertSiteContent();

  const ENRICHED_FIELDS = useMemo<FieldConfig[]>(() => {
    const opts = (facultiesData?.data || []).map((f) => ({ value: String(f.id), label: f.name?.uz || "Nomsiz" }));
    return ALL_FIELDS.map((field) => field.name === "faculty_id" ? { ...field, options: opts, required: true } : field);
  }, [facultiesData]);

  const activeFields = useMemo<FieldConfig[]>(() => {
    if (!editSection) return [];
    const names = SECTION_META[editSection].fieldNames;
    return ENRICHED_FIELDS.filter((f) => names.includes(f.name));
  }, [editSection, ENRICHED_FIELDS]);

  const activeTitle = editSection ? SECTION_META[editSection].title : "";

  const openSection = useCallback((section: EditSection) => {
    setEditSection(section);
  }, []);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editSection || !directionData) return;
    formData.set("level", "ordinatura");
    if (directionData.faculty_id) formData.set("faculty_id", String(directionData.faculty_id));
    await updateDirection.mutateAsync({ id: directionData.id, formData });
    setEditSection(null);
    refetch();
  }, [editSection, directionData, updateDirection, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteDirection.mutateAsync(deleteId);
    setDeleteId(null);
    window.history.back();
  }, [deleteId, deleteDirection]);

  const handleDeleteImage = useCallback(async () => {
    if (!directionData) return;
    const formData = new FormData();
    formData.append("remove_image", "1");
    await updateDirection.mutateAsync({ id: directionData.id, formData });
    setDeleteImageConfirm(false);
    refetch();
  }, [directionData, updateDirection, refetch]);

  /* ── Card edit fields ─────────────────── */
  const CARD_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
    { name: "text", label: "Matn", type: "textarea", translatable: true, required: true },
    { name: "button", label: "Tugma matni", type: "text", translatable: true, required: true },
  ], []);

  const handleCardUpdate = useCallback(async (formData: FormData) => {
    if (!editingCard) return;
    const prefix = `faculty_detail_${editingCard}`;
    const titleUz = formData.get("title[uz]") as string;
    const titleRu = formData.get("title[ru]") as string;
    const titleEn = formData.get("title[en]") as string;
    const textUz = formData.get("text[uz]") as string;
    const textRu = formData.get("text[ru]") as string;
    const textEn = formData.get("text[en]") as string;
    const buttonUz = formData.get("button[uz]") as string;
    const buttonRu = formData.get("button[ru]") as string;
    const buttonEn = formData.get("button[en]") as string;
    await upsertSiteContent.mutateAsync({ key: `${prefix}_title`, section: "faculty_detail", value: { uz: titleUz || "", ru: titleRu || "", en: titleEn || "" }, type: "text" });
    await upsertSiteContent.mutateAsync({ key: `${prefix}_text`, section: "faculty_detail", value: { uz: textUz || "", ru: textRu || "", en: textEn || "" }, type: "textarea" });
    await upsertSiteContent.mutateAsync({ key: `${prefix}_button`, section: "faculty_detail", value: { uz: buttonUz || "", ru: buttonRu || "", en: buttonEn || "" }, type: "text" });
    setEditingCard(null);
  }, [editingCard, upsertSiteContent]);

  if (isLoading) return <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-32" />;

  const direction = directionData;
  if (!direction) return <div className="py-32 text-center text-gray-400">Yo&apos;nalish topilmadi</div>;

  const name = direction.name?.uz || "Nomsiz";
  const levelLabel = LEVEL_LABELS[direction.level] || direction.level;
  const Icon = iconFor(direction.code);
  const { mainText } = parseDescription(direction.description?.uz || "");

  const otherDirections = (siblingsData?.data || [])
    .filter((d) => d.id !== direction.id && d.is_active !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div>
      <Container className="py-6">
        {/* ═══════════ Section 1 — Hero Grid (ISFT style) ═══════════ */}
        <section className="grid gap-6 p-0 lg:row-span-1 lg:grid-cols-3">
          <div className="flex flex-col lg:col-span-2">
            {/* Title — editable */}
            <EditableWrapper entityType="direction" entityId={direction.id} onEdit={() => openSection("title")} onDelete={() => setDeleteId(direction.id)} label="Yo'nalish">
              <h1 className="font-serif text-[32px] font-semibold leading-tight lg:text-5xl capitalize">{name}</h1>
            </EditableWrapper>
            <p className="my-4">{levelLabel}</p>

            {/* Image — editable with hover overlay */}
            {direction.image ? (
              <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-100 group/img h-full min-h-70">
                <img src={direction.image} alt={name} className="h-full w-full rounded-3xl object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all duration-300 rounded-2xl lg:rounded-3xl flex items-center justify-center gap-2 sm:gap-3 opacity-0 group-hover/img:opacity-100 z-10">
                  <button
                    onClick={() => openSection("image")}
                    className="rounded-full bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Rasmni almashtirish</span>
                    <span className="sm:hidden">Almashtirish</span>
                  </button>
                  <button
                    onClick={() => setDeleteImageConfirm(true)}
                    className="rounded-full bg-red-500 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-red-600 shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Rasmni o&apos;chirish</span>
                    <span className="sm:hidden">O&apos;chirish</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => openSection("image")}
                className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#00575B] hover:bg-[#00575B]/5 transition-all cursor-pointer group aspect-video flex flex-col items-center justify-center gap-2 sm:gap-3"
              >
                <div className="rounded-full bg-white p-3 sm:p-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-[#00575B] transition-colors" />
                </div>
                <div className="text-center px-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-[#00575B] transition-colors">Yo&apos;nalish rasmini yuklang</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">ISFT uslubida chiroyli rasm qo&apos;shing</p>
                </div>
              </div>
            )}

            {/* Info Cards — editable */}
            <EditableWrapper entityType="direction" entityId={direction.id} onEdit={() => openSection("info")} label="Ma'lumotlar">
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                  <div className="size-13 rounded-full bg-[#DCE6E8] p-3"><CalendarIcon /></div>
                  <p className="mb-1 mt-4 text-sm text-[#4B4A4A]">O&apos;quv dasturi davomiyligi</p>
                  <h4 className="font-semibold text-[#0D0D0D]">{direction.duration || "—"}</h4>
                </div>
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                  <div className="size-13 rounded-full bg-[#DCE6E8] p-3"><PaymentIcon /></div>
                  <p className="mb-1 mt-4 text-sm text-[#4B4A4A]">Bir o&apos;quv yili uchun to&apos;lov miqdori</p>
                  <div className="mt-1 space-y-0.5">
                    <h4 className="font-semibold text-[#0D0D0D] text-sm">Kunduzgi <span className="text-[#4B4A4A] font-normal">..........{formatPrice(direction.price_daytime)} so&apos;m</span></h4>
                    <h4 className="font-semibold text-[#0D0D0D] text-sm">Masofaviy <span className="text-[#4B4A4A] font-normal">..........{formatPrice(direction.price_remote)} so&apos;m</span></h4>
                  </div>
                </div>
                <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                  <div className="size-13 rounded-full bg-[#DCE6E8] p-3"><DegreeIcon /></div>
                  <p className="mb-1 mt-4 text-sm text-[#4B4A4A]">Daraja</p>
                  <h4 className="font-semibold text-[#0D0D0D]">{levelLabel}</h4>
                </div>
              </div>
            </EditableWrapper>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-1">
            <EditableWrapper entityType="site-content" entityId="contact" onEdit={() => setEditingCard("contact")} label="Aloqa kard">
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:rounded-3xl bg-gray-100 flex flex-col justify-between space-y-4 sm:space-y-6 flex-1">
                <div>
                  <div className="inline-flex items-center justify-center rounded-full bg-white w-9 h-9 sm:w-11 sm:h-11 shadow-sm mb-3 sm:mb-4">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#00575B]" />
                  </div>
                  <h5 className="font-serif text-base sm:text-xl font-semibold">
                    {getContentValue(siteContents, "faculty_detail_contact_title") || "Hoziroq biz bilan bog\u2018laning"}
                  </h5>
                  <p className="mt-1.5 sm:mt-2 text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {getContentValue(siteContents, "faculty_detail_contact_text") || "O\u2018zingiz istagan savollarga 5 daqiqa ichida javob oling va o\u2018z o\u2018rningizni band qiling."}
                  </p>
                </div>
                <div className="text-end">
                  <Link href="/aloqa" className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-[#00575B] shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    {getContentValue(siteContents, "faculty_detail_contact_button") || "Biz bilan bog\u2018lanish"}
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </EditableWrapper>
            <EditableWrapper entityType="site-content" entityId="cta" onEdit={() => setEditingCard("cta")} label="CTA kard">
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#003d40] relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5"></div>
                <div className="relative z-10">
                  <div className="rounded-full bg-white/15 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="mt-3 sm:mt-5 text-white">
                    <h5 className="font-serif text-base sm:text-xl font-semibold">
                      {getContentValue(siteContents, "faculty_detail_cta_title") || "TdTUTF talabasi bo\u2018ling"}
                    </h5>
                    <p className="mt-1.5 sm:mt-2 text-white/75 text-xs sm:text-sm leading-relaxed">
                      {getContentValue(siteContents, "faculty_detail_cta_text") || "va ushbu yo\u2018nalishda bilim oling, kelajagingizni bugun boshlang"}
                    </p>
                  </div>
                  <span className="mt-3 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-white/25 transition-all cursor-pointer group">
                    {getContentValue(siteContents, "faculty_detail_cta_button") || "Hujjat topshirish"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </EditableWrapper>
          </div>
        </section>

        {/* ═══════════ Section 2 — Yo'nalish tavsifi (Editable) ═══════════ */}
        <EditableWrapper entityType="direction" entityId={direction.id} onEdit={() => openSection("description")} label="Yo'nalish tavsifi">
          {mainText ? (
            <section className="py-6">
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
                <h4 className="font-serif text-2xl font-semibold">Yo&apos;nalish tavsifi</h4>
                <div className="mt-6 prose prose-base max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(mainText) }} />
              </div>
            </section>
          ) : (
            <section className="py-6">
              <div
                onClick={() => openSection("description")}
                className="rounded-2xl p-6 md:p-8 lg:rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#00575B] hover:bg-[#00575B]/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-30"
              >
                <div className="rounded-full bg-white p-3 shadow-sm">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Yo&apos;nalish tavsifini qo&apos;shing</p>
                  <p className="text-xs text-gray-400 mt-1">Tavsif, karyera imkoniyatlari va fanlar ro&apos;yxatini kiriting</p>
                </div>
              </div>
            </section>
          )}
        </EditableWrapper>

        {otherDirections.length > 0 && (
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
            <h4 className="font-serif text-2xl font-semibold mb-6">Boshqa klinik ordinatura yo&apos;nalishlari</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {otherDirections.map((d) => {
                const DIcon = iconFor(d.code);
                return (
                  <Link key={d.id} href={`/abiturientlarga/ordinatura/${d.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-4 sm:p-5 hover:shadow-md transition-shadow duration-300 group">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#DCE6E8] p-3 shrink-0"><DIcon className="h-5 w-5 text-[#00575B]" /></span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#00575B] transition-colors line-clamp-2">{d.name?.uz || "Nomsiz"}</span>
                      {d.code && <p className="text-xs text-gray-400 mt-0.5">{d.code}</p>}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#00575B] transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>

      {editSection && direction && (
        <EditModal
          isOpen={!!editSection}
          onClose={() => setEditSection(null)}
          title={activeTitle}
          fields={activeFields}
          initialData={{
            name: direction.name, code: direction.code, level: direction.level,
            faculty_id: direction.faculty_id ? String(direction.faculty_id) : undefined,
            description: direction.description, duration: direction.duration,
            price_daytime: direction.price_daytime, price_remote: direction.price_remote,
            exam_subjects: direction.exam_subjects ?? [],
            image: direction.image ?? undefined,
            sort_order: direction.sort_order, is_active: direction.is_active,
          }}
          onSubmit={handleUpdate}
          isLoading={updateDirection.isPending}
        />
      )}
      <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Yo'nalishni o'chirish" message="Bu yo'nalish butunlay o'chiriladi. Davom etasizmi?" isLoading={deleteDirection.isPending} />
      <ConfirmDialog isOpen={deleteImageConfirm} onClose={() => setDeleteImageConfirm(false)} onConfirm={handleDeleteImage} title="Rasmni o'chirish" message="Yo'nalish rasmi o'chiriladi. Davom etasizmi?" isLoading={updateDirection.isPending} />

      {/* ═══════════ Card Content Edit Modal ═══════════ */}
      {editingCard && (
        <EditModal
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          title={editingCard === "contact" ? "Aloqa kartasini tahrirlash" : "CTA kartasini tahrirlash"}
          fields={CARD_FIELDS}
          initialData={{
            title: siteContents?.find((c) => c.key === `faculty_detail_${editingCard}_title`)?.value || { uz: "" },
            text: siteContents?.find((c) => c.key === `faculty_detail_${editingCard}_text`)?.value || { uz: "" },
            button: siteContents?.find((c) => c.key === `faculty_detail_${editingCard}_button`)?.value || { uz: "" },
          }}
          onSubmit={handleCardUpdate}
          isLoading={upsertSiteContent.isPending}
        />
      )}
    </div>
  );
}
