"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useFacultyDetail, useFaculties, useUpdateFaculty, useDeleteFaculty } from "@/hooks/useFaculties";
import { useDirections, useCreateDirection, useUpdateDirection, useDeleteDirection } from "@/hooks/useDirections";
import { useSiteContents, useUpsertSiteContent, getContentValue } from "@/hooks/useSiteContents";
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@/hooks/useFaqs";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import type { Direction, Faq } from "@/types";
import { DEGREE_OPTIONS } from "@/lib/constants";
import { useState, useCallback, useMemo } from "react";
import {
  GraduationCap, Stethoscope, Baby, ShieldCheck, Pill, HeartPulse,
  Scissors, FlaskConical, BookOpen, Building2, Microscope,
  ArrowRight, Plus, Phone, ChevronRight, ImagePlus, Trash2, RefreshCw,
  ChevronDown, MessageCircleQuestion,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

/* ── Faculty icon by keyword ───────────────────────── */
function facultyIcon(name: string) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("tibbiyot")) return Stethoscope;
  if (lower.includes("farmatsiya")) return Pill;
  if (lower.includes("klinik")) return Building2;
  if (lower.includes("ilmiy") || lower.includes("tadqiqot")) return Microscope;
  return GraduationCap;
}

/* ── Icon by direction code prefix ─────────────────── */
const CODE_ICONS: Record<string, React.ElementType> = {
  "605101": Stethoscope, "605102": Baby, "605103": ShieldCheck,
  "605201": Pill, "705101": HeartPulse, "705102": Scissors, "705201": Baby,
};
const FALLBACK_ICONS = [Stethoscope, GraduationCap, BookOpen, FlaskConical];
function iconFor(code: string, idx: number) {
  return CODE_ICONS[code?.substring(0, 6)] ?? FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
}

const BASE_DIRECTION_FIELDS: FieldConfig[] = [
  { name: "name", label: "Yo'nalish nomi", type: "text", translatable: true, required: true },
  { name: "code", label: "Kod", type: "text", required: true, placeholder: "60110300" },
  { name: "level", label: "Daraja", type: "select", required: true, options: DEGREE_OPTIONS.map((d) => ({ value: d.value, label: d.label })) },
  { name: "faculty_id", label: "Fakultet", type: "select", options: [] },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: true },
  { name: "duration", label: "O'qish muddati", type: "text", halfWidth: true, placeholder: "2 yil" },
  { name: "price_daytime", label: "Kunduzgi narx (so'm)", type: "number", halfWidth: true, placeholder: "0" },
  { name: "price_remote", label: "Sirtqi narx (so'm)", type: "number", halfWidth: true, placeholder: "0" },
  { name: "exam_subjects", label: "Imtihon fanlari", type: "tags", placeholder: "Biologiya, Kimyo" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*" },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function OrdinaturaFacultyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { data: faculty, isLoading: fLoading } = useFacultyDetail(id);
  const { data: directionsData, isLoading: dLoading, error: dError, refetch: refetchDirections } = useDirections({ per_page: 50, degree: "ordinatura", faculty_id: id });
  const { data: facultiesData } = useFaculties({ per_page: 50 });
  const { data: siteContents } = useSiteContents("faculty_detail");
  const { data: faqsData, isLoading: faqsLoading, refetch: refetchFaqs } = useFaqs({ "filter[faculty_id]": id, "filter[category]": "faculty", per_page: 50 });

  const [editItem, setEditItem] = useState<Direction | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFacultyEditOpen, setIsFacultyEditOpen] = useState(false);
  const [deleteFacultyConfirm, setDeleteFacultyConfirm] = useState(false);
  const [deleteImageConfirm, setDeleteImageConfirm] = useState(false);
  const [editingCard, setEditingCard] = useState<"contact" | "cta" | null>(null);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [deleteFaqId, setDeleteFaqId] = useState<number | null>(null);
  const [isCreateFaqOpen, setIsCreateFaqOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const createDirection = useCreateDirection();
  const updateDirection = useUpdateDirection();
  const deleteDirection = useDeleteDirection();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();
  const upsertSiteContent = useUpsertSiteContent();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const DIRECTION_FIELDS = useMemo<FieldConfig[]>(() => {
    const opts = (facultiesData?.data || []).map((f) => ({ value: String(f.id), label: f.name?.uz || "Nomsiz" }));
    return BASE_DIRECTION_FIELDS.map((field) => field.name === "faculty_id" ? { ...field, options: opts, required: true } : field);
  }, [facultiesData]);

  /* ── Faculty edit fields ─────────────────── */
  const FACULTY_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "name", label: "Fakultet nomi", type: "text", translatable: true, required: true },
    { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: false },
    { name: "image", label: "Rasm", type: "media", accept: "image/*" },
    { name: "sort_order", label: "Tartib", type: "number" },
    { name: "is_active", label: "Faol", type: "toggle" },
  ], []);

  /* ── Card edit fields ─────────────────── */
  const CARD_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
    { name: "text", label: "Matn", type: "textarea", translatable: true, required: true },
    { name: "button", label: "Tugma matni", type: "text", translatable: true, required: true },
  ], []);

  /* ── Faculty update handler ─────────────────── */
  const handleFacultyUpdate = useCallback(async (formData: FormData) => {
    await updateFaculty.mutateAsync({ id, formData });
    setIsFacultyEditOpen(false);
  }, [id, updateFaculty]);

  /* ── Faculty image delete handler ─────────────────── */
  const handleDeleteImage = useCallback(async () => {
    const formData = new FormData();
    formData.append("remove_image", "1");
    await updateFaculty.mutateAsync({ id, formData });
    setDeleteImageConfirm(false);
  }, [id, updateFaculty]);

  /* ── Card content update handler ─────────────────── */
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

  /* ── FAQ fields ─────────────────── */
  const FAQ_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "question", label: "Savol", type: "text", translatable: true, required: true },
    { name: "answer", label: "Javob", type: "richtext", translatable: true, required: true },
    { name: "sort_order", label: "Tartib", type: "number" },
    { name: "is_active", label: "Faol", type: "toggle" },
  ], []);

  const handleCreateFaq = useCallback(async (formData: FormData) => {
    const questionUz = formData.get("question[uz]") as string;
    const questionRu = formData.get("question[ru]") as string;
    const questionEn = formData.get("question[en]") as string;
    const answerUz = formData.get("answer[uz]") as string;
    const answerRu = formData.get("answer[ru]") as string;
    const answerEn = formData.get("answer[en]") as string;
    const sortOrder = Number(formData.get("sort_order") || 0);
    const isActive = formData.get("is_active") === "true" || formData.get("is_active") === "1";
    await createFaq.mutateAsync({ question: { uz: questionUz || "", ru: questionRu || "", en: questionEn || "" }, answer: { uz: answerUz || "", ru: answerRu || "", en: answerEn || "" }, category: "faculty", faculty_id: id, sort_order: sortOrder, is_active: isActive });
    setIsCreateFaqOpen(false);
    refetchFaqs();
  }, [createFaq, refetchFaqs]);

  const handleUpdateFaq = useCallback(async (formData: FormData) => {
    if (!editFaq) return;
    const questionUz = formData.get("question[uz]") as string;
    const questionRu = formData.get("question[ru]") as string;
    const questionEn = formData.get("question[en]") as string;
    const answerUz = formData.get("answer[uz]") as string;
    const answerRu = formData.get("answer[ru]") as string;
    const answerEn = formData.get("answer[en]") as string;
    const sortOrder = Number(formData.get("sort_order") || 0);
    const isActive = formData.get("is_active") === "true" || formData.get("is_active") === "1";
    await updateFaq.mutateAsync({ id: editFaq.id, data: { question: { uz: questionUz || "", ru: questionRu || "", en: questionEn || "" }, answer: { uz: answerUz || "", ru: answerRu || "", en: answerEn || "" }, category: "faculty", faculty_id: id, sort_order: sortOrder, is_active: isActive } });
    setEditFaq(null);
    refetchFaqs();
  }, [editFaq, updateFaq, refetchFaqs]);

  const handleDeleteFaq = useCallback(async () => {
    if (deleteFaqId === null) return;
    await deleteFaq.mutateAsync(deleteFaqId);
    setDeleteFaqId(null);
    refetchFaqs();
  }, [deleteFaqId, deleteFaq, refetchFaqs]);

  const handleCreate = useCallback(async (formData: FormData) => {
    formData.set("level", "ordinatura");
    formData.set("faculty_id", String(id));
    await createDirection.mutateAsync(formData);
    setIsCreateOpen(false);
    refetchDirections();
  }, [id, createDirection, refetchDirections]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    formData.set("level", "ordinatura");
    formData.set("faculty_id", String(id));
    await updateDirection.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetchDirections();
  }, [id, editItem, updateDirection, refetchDirections]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteDirection.mutateAsync(deleteId);
    setDeleteId(null);
    refetchDirections();
  }, [deleteId, deleteDirection, refetchDirections]);

  if (fLoading) return <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-32" />;
  if (!faculty) return (
    <Container className="py-32 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Fakultet topilmadi</h2>
      <p className="text-gray-500 mb-6">ID: {id} bo&apos;yicha fakultet mavjud emas</p>
      <Link href="/abiturientlarga" className="text-[#00575B] hover:underline font-medium">← Abiturientlarga sahifasiga qaytish</Link>
    </Container>
  );

  const facultyName = faculty?.name?.uz || "Fakultet";
  const description = faculty?.description?.uz || "";
  const FacultyIcon = facultyIcon(facultyName);
  const directions = (directionsData?.data || []).filter((d) => d.is_active !== false).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const faqs = (faqsData?.data || []).sort((a: Faq, b: Faq) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="space-y-6 pb-16">
      {/* ═══════════ Section 1 — Hero Grid ═══════════ */}
      <Container className="pt-8">
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Left – Title + Hero Image (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
              <Link href="/abiturientlarga" className="hover:text-[#00575B] transition-colors">Abiturientlarga</Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <Link href="/abiturientlarga/ordinatura" className="hover:text-[#00575B] transition-colors">Klinik ordinatura</Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-64">{facultyName}</span>
            </nav>

            <div className="flex items-start justify-between gap-3">
              <EditableWrapper entityType="faculty" entityId={id} onEdit={() => setIsFacultyEditOpen(true)} label="Fakultet">
                <h1 className="font-serif text-[28px] font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                  {facultyName}
                </h1>
              </EditableWrapper>
              <button
                type="button"
                onClick={() => setDeleteFacultyConfirm(true)}
                aria-label="Fakultetni o'chirish"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="size-3.5" />
                Fakultetni o&apos;chirish
              </button>
            </div>

              {faculty?.image ? (
                <div className="mt-6 relative overflow-hidden rounded-2xl lg:rounded-3xl group/img">
                  <img
                    src={faculty.image}
                    alt={facultyName}
                    className="w-full h-auto rounded-2xl lg:rounded-3xl object-cover aspect-video"
                  />
                  {/* Image controls overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all duration-300 rounded-2xl lg:rounded-3xl flex items-center justify-center gap-3 opacity-0 group-hover/img:opacity-100">
                    <button
                      onClick={() => setIsFacultyEditOpen(true)}
                      className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Rasmni almashtirish
                    </button>
                    <button
                      onClick={() => setDeleteImageConfirm(true)}
                      className="rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Rasmni o&apos;chirish
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsFacultyEditOpen(true)}
                  className="mt-6 relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#00575B] hover:bg-[#00575B]/5 transition-all cursor-pointer group aspect-video flex flex-col items-center justify-center gap-3"
                >
                  <div className="rounded-full bg-white p-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <ImagePlus className="h-8 w-8 text-gray-400 group-hover:text-[#00575B] transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 group-hover:text-[#00575B] transition-colors">Fakultet rasmini yuklang</p>
                    <p className="text-xs text-gray-400 mt-1">ISFT uslubida chiroyli rasm qo&apos;shing</p>
                  </div>
                </div>
              )}
          </div>

          {/* Right – Sidebar cards (1 col) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Contact card */}
            <EditableWrapper entityType="site-content" entityId="contact" onEdit={() => setEditingCard("contact")} label="Aloqa kard">
              <div className="rounded-2xl p-6 lg:rounded-3xl bg-gray-100 flex flex-col justify-between space-y-6 flex-1">
                <div>
                  <div className="inline-flex items-center justify-center rounded-full bg-white w-11 h-11 shadow-sm mb-4">
                    <Phone className="h-5 w-5 text-[#00575B]" />
                  </div>
                  <h5 className="font-serif text-xl font-semibold">
                    {getContentValue(siteContents, "faculty_detail_contact_title") || "Hoziroq biz bilan bog\u2018laning"}
                  </h5>
                  <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                    {getContentValue(siteContents, "faculty_detail_contact_text") || "O\u2018zingiz istagan savollarga 5 daqiqa ichida javob oling va o\u2018z o\u2018rningizni band qiling."}
                  </p>
                </div>
                <div className="text-end">
                  <Link href="/aloqa" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#00575B] shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    {getContentValue(siteContents, "faculty_detail_contact_button") || "Biz bilan bog\u2018lanish"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </EditableWrapper>

            {/* CTA card */}
            <EditableWrapper entityType="site-content" entityId="cta" onEdit={() => setEditingCard("cta")} label="CTA kard">
              <div className="rounded-2xl p-6 lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#003d40] relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="rounded-full bg-white/15 w-12 h-12 flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div className="mt-5 text-white">
                    <h5 className="font-serif text-xl font-semibold">
                      {getContentValue(siteContents, "faculty_detail_cta_title") || "TdTUTF talabasi bo\u2018ling"}
                    </h5>
                    <p className="mt-2 text-white/75 text-sm leading-relaxed">
                      {getContentValue(siteContents, "faculty_detail_cta_text") || "va ushbu yo\u2018nalishda bilim oling, kelajagingizni bugun boshlang"}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-white/25 transition-all cursor-pointer group">
                    {getContentValue(siteContents, "faculty_detail_cta_button") || "Hujjat topshirish"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </EditableWrapper>
          </div>
        </section>
      </Container>

      {/* ═══════════ Section 2 — Fakultet tavsifi ═══════════ */}
      {description && (
        <Container>
          <div className="rounded-2xl p-6 md:p-8 lg:rounded-3xl bg-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-xl bg-[#00575B]/10 p-2.5">
                <FacultyIcon className="h-5 w-5 text-[#00575B]" />
              </div>
              <h2 className="font-serif text-2xl font-semibold">Fakultet tavsifi</h2>
            </div>
            <div
              className="prose prose-gray max-w-none text-gray-600 leading-relaxed prose-headings:font-serif prose-headings:text-gray-900 prose-a:text-[#00575B]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          </div>
        </Container>
      )}

      {/* ═══════════ Section 3 — Yo'nalishlar ═══════════ */}
      <Container>
        <div className="rounded-2xl p-6 md:p-8 lg:rounded-3xl bg-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#00575B]/10 p-2.5">
                <BookOpen className="h-5 w-5 text-[#00575B]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold">Yo&apos;nalishlar</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {directions.length > 0
                    ? `${directions.length} ta yo'nalish mavjud`
                    : "Tez orada qo'shiladi"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#00575B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#004a4e] transition-colors cursor-pointer shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Yo&apos;nalish qo&apos;shish
            </button>
          </div>

          {dLoading ? (
            <div className="flex items-center justify-center min-h-60"><LoadingSpinner size="lg" text="Yuklanmoqda..." /></div>
          ) : dError ? (
            <ErrorState onRetry={() => refetchDirections()} />
          ) : directions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {directions.map((dir, idx) => {
                const Icon = iconFor(dir.code, idx);
                return (
                  <EditableWrapper key={dir.id} entityType="direction" entityId={dir.id} onEdit={() => setEditItem(dir)} onDelete={() => setDeleteId(dir.id)} label="Yo'nalish">
                    <div onClick={() => router.push(`/abiturientlarga/ordinatura/${dir.id}`)} className="rounded-2xl p-5 md:p-6 bg-white flex flex-col gap-3 h-full shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group">
                      {/* Icon + Title */}
                      <h5 className="font-serif text-lg font-semibold flex items-start gap-3 text-[#00575B]">
                        <span className="inline-flex items-center justify-center rounded-xl bg-[#00575B]/10 p-2.5 shrink-0 mt-0.5">
                          <Icon className="h-5 w-5 text-[#00575B]" />
                        </span>
                        <span className="group-hover:underline underline-offset-2 decoration-[#00575B]/30">
                          {dir.name?.uz || "Nomsiz"}
                        </span>
                      </h5>

                      {/* Description */}
                      {dir.description?.uz && (
                        <div className="text-sm text-gray-500 leading-relaxed line-clamp-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(dir.description.uz) }} />
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-1">
                        {dir.code && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 font-medium">
                            {dir.code}
                          </span>
                        )}
                        {dir.duration && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 font-medium">
                            {dir.duration}
                          </span>
                        )}
                      </div>

                      {/* Batafsil link */}
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00575B] group-hover:gap-2.5 transition-all w-fit">
                        Batafsil
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </EditableWrapper>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-60 text-center">
              <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg">Bu fakultetda yo&apos;nalishlar tez orada qo&apos;shiladi</p>
            </div>
          )}
        </div>
      </Container>

      {/* ═══════════ Section 4 — FAQ ═══════════ */}
      <Container>
        <div className="rounded-2xl p-6 md:p-8 lg:rounded-3xl bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#00575B]/10 p-2.5">
                <MessageCircleQuestion className="h-5 w-5 text-[#00575B]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold">FAQ</h2>
                <p className="text-sm text-gray-500 mt-0.5">{faqs.length > 0 ? `${faqs.length} ta savol mavjud` : "Tez orada qo'shiladi"}</p>
              </div>
            </div>
            <button onClick={() => setIsCreateFaqOpen(true)} className="flex items-center gap-1.5 rounded-full bg-[#00575B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#004a4e] transition-colors cursor-pointer shadow-sm hover:shadow-md">
              <Plus className="h-4 w-4" />
              Savol qo&apos;shish
            </button>
          </div>
          {faqsLoading ? (
            <div className="flex items-center justify-center min-h-40">
              <LoadingSpinner size="md" text="FAQ yuklanmoqda..." />
            </div>
          ) : faqs.length > 0 ? (
            <div className="space-y-2">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <EditableWrapper key={faq.id} entityType="faq" entityId={faq.id} onEdit={() => setEditFaq(faq)} onDelete={() => setDeleteFaqId(faq.id)} label="FAQ">
                    <div className="rounded-2xl bg-white transition-shadow duration-300 hover:shadow-sm">
                      <button onClick={() => setOpenFaqId(isOpen ? null : faq.id)} className="flex w-full items-center justify-between px-6 py-5 text-left gap-3">
                        <h6 className="text-base font-semibold leading-tight text-gray-900 lg:text-lg">{faq.question?.uz || "Savol"}</h6>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#00575B]" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5">
                          <div className="text-base text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer?.uz) }} />
                        </div>
                      )}
                    </div>
                  </EditableWrapper>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-40 text-center">
              <MessageCircleQuestion className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg">FAQ savollari tez orada qo&apos;shiladi</p>
            </div>
          )}
        </div>
      </Container>

      <EditModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Yangi yo'nalish qo'shish" fields={DIRECTION_FIELDS} initialData={{ level: "ordinatura", faculty_id: String(id), is_active: true, sort_order: 0 }} onSubmit={handleCreate} isLoading={createDirection.isPending} />
      {editItem && <EditModal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Yo'nalishni tahrirlash" fields={DIRECTION_FIELDS} initialData={{ name: editItem.name, code: editItem.code, level: editItem.level, faculty_id: editItem.faculty_id ? String(editItem.faculty_id) : undefined, description: editItem.description, duration: editItem.duration, price_daytime: editItem.price_daytime, price_remote: editItem.price_remote, exam_subjects: editItem.exam_subjects ?? [], image: editItem.image ?? undefined, sort_order: editItem.sort_order, is_active: editItem.is_active }} onSubmit={handleUpdate} isLoading={updateDirection.isPending} />}
      <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Yo'nalishni o'chirish" message="Bu yo'nalish butunlay o'chiriladi. Davom etasizmi?" isLoading={deleteDirection.isPending} />
      <ConfirmDialog isOpen={deleteImageConfirm} onClose={() => setDeleteImageConfirm(false)} onConfirm={handleDeleteImage} title="Rasmni o'chirish" message="Fakultet rasmi o'chiriladi. Fakultet o'zi o'chirilmaydi. Davom etasizmi?" isLoading={updateFaculty.isPending} />
      <ConfirmDialog
        isOpen={deleteFacultyConfirm}
        onClose={() => setDeleteFacultyConfirm(false)}
        onConfirm={async () => {
          await deleteFaculty.mutateAsync(id);
          router.push("/abiturientlarga/ordinatura");
        }}
        title="Fakultetni o'chirish"
        message={`"${facultyName}" fakulteti o'chiriladi. Barcha bog'liq yo'nalishlar faculty_id qiymatsiz qoladi. Davom etasizmi?`}
        isLoading={deleteFaculty.isPending}
      />

      {/* ═══════════ FAQ Modals ═══════════ */}
      <EditModal isOpen={isCreateFaqOpen} onClose={() => setIsCreateFaqOpen(false)} title="Yangi FAQ qo'shish" fields={FAQ_FIELDS} initialData={{ is_active: true, sort_order: 0 }} onSubmit={handleCreateFaq} isLoading={createFaq.isPending} />
      {editFaq && <EditModal isOpen={!!editFaq} onClose={() => setEditFaq(null)} title="FAQ tahrirlash" fields={FAQ_FIELDS} initialData={{ question: editFaq.question, answer: editFaq.answer, sort_order: editFaq.sort_order, is_active: editFaq.is_active }} onSubmit={handleUpdateFaq} isLoading={updateFaq.isPending} />}
      <ConfirmDialog isOpen={deleteFaqId !== null} onClose={() => setDeleteFaqId(null)} onConfirm={handleDeleteFaq} title="FAQ o'chirish" message="Bu savol butunlay o'chiriladi. Davom etasizmi?" isLoading={deleteFaq.isPending} />

      {/* ═══════════ Faculty Edit Modal ═══════════ */}
      {faculty && (
        <EditModal
          isOpen={isFacultyEditOpen}
          onClose={() => setIsFacultyEditOpen(false)}
          title="Fakultetni tahrirlash"
          fields={FACULTY_FIELDS}
          initialData={{
            name: faculty.name,
            description: faculty.description,
            image: faculty.image,
            sort_order: faculty.sort_order,
            is_active: faculty.is_active,
          }}
          onSubmit={handleFacultyUpdate}
          isLoading={updateFaculty.isPending}
        />
      )}

      {/* ═══════════ Card Content Edit Modal ═══════════ */}
      {editingCard && (
        <EditModal
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          title={
            editingCard === "contact" ? "Aloqa kartasini tahrirlash" :
            "CTA kartasini tahrirlash"
          }
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
