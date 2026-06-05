"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import {
  useFaculties,
  useCreateFaculty,
  useUpdateFaculty,
  useDeleteFaculty,
} from "@/hooks/useFaculties";
import Container from "@/components/shared/Container";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import type { Faculty } from "@/types";
import {
  Plus,
  Building2,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Stethoscope,
  Pill,
  Microscope,
  GraduationCap,
  Phone,
  Search,
  LayoutGrid,
  List,
  BookOpen,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  Calendar,
  Hash,
  Camera,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEGREE_OPTIONS } from "@/lib/constants";
import toast from "react-hot-toast";
import {
  useSiteContents,
  useUploadSiteImage,
  useUpsertSiteContent,
  useDeleteSiteContent,
  getContentValue,
  getContentTranslatable,
} from "@/hooks/useSiteContents";
import TextEditModal from "@/components/inline-edit/TextEditModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

/* ── Level-specific meta ──────────────────────────────── */
const LEVEL_META: Record<
  string,
  {
    label: string;
    description: string;
    heroImage: string;
    promoTitle: string;
    promoText: string;
  }
> = {
  bakalavriat: {
    label: "Bakalavriat",
    description:
      "Bakalavriat bosqichida talabalar tibbiyot sohasining asosiy fanlarini o\u2018rganadilar va amaliy ko\u2018nikmalarni egalladilar. Toshkent tibbiyot akademiyasi Termiz filialida zamonaviy ta\u2018lim muhiti va tajribali professor-o\u2018qituvchilar jamoasi talabalar rivojiga xizmat qiladi.",
    heroImage: "/images/bakalavriat-hero.svg",
    promoTitle: "TdTUTF talabasi bo\u2018ling",
    promoText:
      "Toshkent tibbiyot akademiyasi Termiz filialida zamonaviy tibbiyot ta\u2018limini oling va malakali shifokor bo\u2018ling!",
  },
  ordinatura: {
    label: "Klinik ordinatura",
    description:
      "Klinik ordinatura \u2014 tibbiyot bakalavrlarini tor mutaxassisliklar bo\u2018yicha tayyorlash bosqichi. Ordinatorlar amaliy mashg\u2018ulotlar, klinik stajlar orqali chuqur bilim va ko\u2018nikmalarni egalladilar.",
    heroImage: "/images/ordinatura-hero.svg",
    promoTitle: "TdTUTF ordinatorasi bo\u2018ling",
    promoText:
      "Klinik ordinatura orqali mutaxassisligingizni chuqurlashtiring va yuqori malakali shifokor bo\u2018ling!",
  },
  magistratura: {
    label: "Magistratura",
    description:
      "Magistratura dasturi ilmiy-tadqiqot va chuqurlashtirilgan bilim olishga yo\u2018naltirilgan. Talabalar zamonaviy tadqiqot usullarini o\u2018rganadilar.",
    heroImage: "/images/magistratura-hero.svg",
    promoTitle: "TdTUTF magistranti bo\u2018ling",
    promoText:
      "Ilmiy salohiyatingizni oshiring va zamonaviy tibbiyot tadqiqotlarida o\u2018z o\u2018rningizni egallang!",
  },
};

/* ── Types ──────────────────────────────────────────── */
type ViewMode = "grid" | "table";
type StatusFilter = "all" | "active" | "inactive";

interface FacultiesCrudAdminProps {
  title: string;
  subtitle?: string;
  level?: string;
  basePath?: string;
}

/* ── Field configs ────────────────────────────────────── */
const FACULTY_FIELDS: FieldConfig[] = [
  { name: "name", label: "Fakultet nomi", type: "text", translatable: true, required: true },
  {
    name: "level",
    label: "Daraja",
    type: "select",
    required: true,
    options: DEGREE_OPTIONS.map((d) => ({ value: d.value, label: d.label })),
  },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: true },
  { name: "image", label: "Rasm", type: "media", accept: "image/*" },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol holat", type: "toggle", halfWidth: true },
];

/* ── Card accent colors ─────────────────────────────────── */
const CARD_ACCENTS = [
  { border: "border-l-blue-600", icon: "bg-blue-100 text-blue-700", tag: "bg-blue-50 text-blue-700" },
  { border: "border-l-teal-600", icon: "bg-teal-100 text-teal-700", tag: "bg-teal-50 text-teal-700" },
  { border: "border-l-emerald-600", icon: "bg-emerald-100 text-emerald-700", tag: "bg-emerald-50 text-emerald-700" },
  { border: "border-l-indigo-600", icon: "bg-indigo-100 text-indigo-700", tag: "bg-indigo-50 text-indigo-700" },
];

/* ── Helpers ──────────────────────────────────────────── */
function iconForFaculty(name: string): React.ElementType {
  const lower = (name || "").toLowerCase();
  if (lower.includes("tibbiyot")) return Stethoscope;
  if (lower.includes("farmatsiya")) return Pill;
  if (lower.includes("klinik")) return Building2;
  if (lower.includes("ilmiy") || lower.includes("tadqiqot")) return Microscope;
  return GraduationCap;
}

function PromoPattern() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-1/2 opacity-10"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="160" cy="40" r="60" fill="white" />
      <circle cx="180" cy="120" r="40" fill="white" />
      <circle cx="120" cy="160" r="30" fill="white" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════ */
export default function FacultiesCrudAdmin({
  title,
  subtitle,
  level,
  basePath,
}: FacultiesCrudAdminProps) {
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<Faculty | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, error, refetch } = useFaculties({
    page,
    per_page: 50,
    level,
  });

  const createFaculty = useCreateFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();

  /* ── Hero image upload ────────────────────────────── */
  const heroSection = `faculties_hero_${level || "bakalavriat"}`;
  const heroKey = `hero_image_${level || "bakalavriat"}`;
  const { data: heroContents } = useSiteContents(heroSection);
  const uploadHeroImage = useUploadSiteImage();
  const heroFileRef = useRef<HTMLInputElement>(null);
  const uploadedHeroUrl = getContentValue(heroContents, heroKey);

  /* ── Description editing ─────────────────────────── */
  const descSection = `faculties_desc_${level || "bakalavriat"}`;
  const descKey = `level_description_${level || "bakalavriat"}`;
  const { data: descContents } = useSiteContents(descSection);
  const upsertContent = useUpsertSiteContent();
  const deleteContent = useDeleteSiteContent();
  const [isDescEditing, setIsDescEditing] = useState(false);
  const [isDescDeleteOpen, setIsDescDeleteOpen] = useState(false);
  const descValue = getContentValue(descContents, descKey);
  const descTranslatable = getContentTranslatable(descContents, descKey);

  const handleHeroImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await uploadHeroImage.mutateAsync({ file, key: heroKey, section: heroSection });
      if (heroFileRef.current) heroFileRef.current.value = "";
    },
    [uploadHeroImage, heroKey, heroSection],
  );

  /* ── CRUD handlers ────────────────────────────────── */
  const handleCreate = useCallback(
    async (formData: FormData) => {
      if (level) formData.set("level", level);
      await createFaculty.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [level, createFaculty, refetch],
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateFaculty.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateFaculty, refetch],
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteFaculty.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteFaculty, refetch]);

  /* ── Quick toggle active/inactive ──────────────────── */
  const handleToggleActive = useCallback(
    async (faculty: Faculty) => {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("is_active", faculty.is_active ? "0" : "1");
      if (faculty.name?.uz) fd.append("name[uz]", faculty.name.uz);
      if (faculty.name?.ru) fd.append("name[ru]", faculty.name.ru);
      if (faculty.name?.en) fd.append("name[en]", faculty.name.en);
      fd.append("level", faculty.level);
      if (faculty.description?.uz) fd.append("description[uz]", faculty.description.uz);
      if (faculty.description?.ru) fd.append("description[ru]", faculty.description.ru);
      if (faculty.description?.en) fd.append("description[en]", faculty.description.en);
      fd.append("sort_order", String(faculty.sort_order ?? 0));
      try {
        await updateFaculty.mutateAsync({ id: faculty.id, formData: fd });
        toast.success(faculty.is_active ? "Fakultet nofaol qilindi" : "Fakultet faollashtildi");
        refetch();
      } catch {
        toast.error("Holatni o\u2018zgartirishda xato!");
      }
    },
    [updateFaculty, refetch],
  );

  /* ── Reorder (sort_order change) ───────────────────── */
  const handleReorder = useCallback(
    async (faculty: Faculty, direction: "up" | "down") => {
      const newOrder =
        direction === "up"
          ? Math.max(0, (faculty.sort_order ?? 0) - 1)
          : (faculty.sort_order ?? 0) + 1;
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("sort_order", String(newOrder));
      if (faculty.name?.uz) fd.append("name[uz]", faculty.name.uz);
      if (faculty.name?.ru) fd.append("name[ru]", faculty.name.ru);
      if (faculty.name?.en) fd.append("name[en]", faculty.name.en);
      fd.append("level", faculty.level);
      if (faculty.description?.uz) fd.append("description[uz]", faculty.description.uz);
      if (faculty.description?.ru) fd.append("description[ru]", faculty.description.ru);
      if (faculty.description?.en) fd.append("description[en]", faculty.description.en);
      fd.append("is_active", faculty.is_active ? "1" : "0");
      try {
        await updateFaculty.mutateAsync({ id: faculty.id, formData: fd });
        toast.success("Tartib o\u2018zgartirildi");
        refetch();
      } catch {
        toast.error("Tartibni o\u2018zgartirishda xato!");
      }
    },
    [updateFaculty, refetch],
  );

  /* ── Derived data ──────────────────────────────────── */
  const allItems = data?.data || [];
  const meta = data?.meta;
  const lvl = LEVEL_META[level || "bakalavriat"] || LEVEL_META.bakalavriat;

  /* ── Stats ─────────────────────────────────────────── */
  const stats = useMemo(() => {
    const total = allItems.length;
    const active = allItems.filter((f) => f.is_active).length;
    const inactive = total - active;
    const totalDirs = allItems.reduce(
      (sum, f) => sum + (f.directions_count ?? f.directions?.length ?? 0),
      0,
    );
    return { total, active, inactive, totalDirs };
  }, [allItems]);

  /* ── Filtered items ────────────────────────────────── */
  const items = useMemo(() => {
    let filtered = allItems;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          (f.name?.uz || "").toLowerCase().includes(q) ||
          (f.name?.ru || "").toLowerCase().includes(q) ||
          (f.name?.en || "").toLowerCase().includes(q),
      );
    }
    if (statusFilter === "active") filtered = filtered.filter((f) => f.is_active);
    if (statusFilter === "inactive") filtered = filtered.filter((f) => !f.is_active);
    return filtered.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [allItems, searchQuery, statusFilter]);

  /* ── Export to JSON ─────────────────────────────────── */
  const handleExport = useCallback(() => {
    if (!allItems.length) return;
    const exportData = allItems.map((f) => ({
      id: f.id,
      name: f.name,
      level: f.level,
      is_active: f.is_active,
      sort_order: f.sort_order,
      directions_count: f.directions_count ?? f.directions?.length ?? 0,
      directions: f.directions?.map((d) => ({ id: d.id, name: d.name, code: d.code })),
      created_at: f.created_at,
      updated_at: f.updated_at,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${level || "faculties"}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ma\u2018lumotlar eksport qilindi!");
  }, [allItems, level]);

  /* ── Status filter buttons config ──────────────────── */
  const filterButtons: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "Hammasi", count: stats.total },
    { key: "active", label: "Faol", count: stats.active },
    { key: "inactive", label: "Nofaol", count: stats.inactive },
  ];

  return (
    <section className="bg-white py-6 sm:py-8">
      <Container>
        {/* ═══ HEADER \u2014 Breadcrumb + Title + Actions ═══════ */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-400 sm:text-sm">
              <Link href="/abiturientlarga" className="transition-colors hover:text-[#00575B]">
                Abiturientlarga
              </Link>
              <span>&gt;</span>
              <span className="font-medium text-gray-700">{title}</span>
            </div>
            <h1 className="font-serif text-2xl font-semibold leading-tight capitalize sm:text-3xl lg:text-4xl">
              {lvl.label}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 sm:text-sm"
              title="Yangilash"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ═══ STATS DASHBOARD ═══════════════════════════════ */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Jami fakultetlar
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-[#00575B]/10 p-2.5">
                <Building2 className="h-5 w-5 text-[#00575B] sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Faol</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 sm:text-3xl">
                  {stats.active}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Nofaol
                </p>
                <p className="mt-1 text-2xl font-bold text-orange-500 sm:text-3xl">
                  {stats.inactive}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-2.5">
                <XCircle className="h-5 w-5 text-orange-400 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Yo&apos;nalishlar
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-600 sm:text-3xl">
                  {stats.totalDirs}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5">
                <BookOpen className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ HERO + CTA (ISFT-style) ═══════════════════════ */}
        <section className="mb-6 grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div
              className="group/hero relative cursor-pointer overflow-hidden rounded-2xl bg-gray-100 lg:rounded-3xl"
              onClick={() => heroFileRef.current?.click()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {uploadedHeroUrl ? (
                <div className="h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-2xl lg:rounded-3xl bg-gray-200">
                  <img
                    alt={lvl.label}
                    src={`${API_URL}${uploadedHeroUrl}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <Image
                  alt={lvl.label}
                  src={lvl.heroImage}
                  width={960}
                  height={460}
                  className="h-full max-h-96 w-full rounded-2xl object-cover lg:rounded-3xl"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  unoptimized
                />
              )}
              {/* Upload overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/0 transition-all group-hover/hero:bg-black/40 lg:rounded-3xl">
                <div className="flex flex-col items-center gap-2 opacity-0 transition-opacity group-hover/hero:opacity-100">
                  <div className="rounded-full bg-white/90 p-3 shadow-lg">
                    <Camera className="h-6 w-6 text-[#00575B]" />
                  </div>
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-gray-700 shadow-lg">
                    Rasmni o&apos;zgartirish
                  </span>
                </div>
              </div>
              {/* Upload loading */}
              {uploadHeroImage.isPending && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 lg:rounded-3xl">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleHeroImageUpload}
            />
          </div>
          <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-1">
            <div className="flex flex-col justify-between space-y-3 rounded-2xl bg-gray-50 p-4 sm:p-5 lg:rounded-3xl">
              <div>
                <div className="mb-2 inline-flex items-center justify-center rounded-xl bg-[#00575B]/10 p-2">
                  <Phone className="h-4 w-4 text-[#00575B]" />
                </div>
                <h5 className="font-serif text-base font-semibold sm:text-lg">
                  Hoziroq biz bilan bog&apos;laning
                </h5>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
                  O&apos;zingiz istagan savollarga javob oling va o&apos;z o&apos;rningizni band
                  qiling.
                </p>
              </div>
              <div className="text-end">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-[#00575B] shadow-sm sm:text-sm">
                  Biz bilan bog&apos;lanish <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#00575B] to-[#003d40] p-4 text-white sm:p-5 lg:rounded-3xl">
              <PromoPattern />
              <div className="relative z-10">
                <div className="mb-3 inline-flex items-center justify-center rounded-full bg-white/15 p-2.5">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h5 className="font-serif text-base font-semibold sm:text-lg">{lvl.promoTitle}</h5>
                <p className="mt-1 text-xs leading-relaxed text-white/80 sm:text-sm">
                  {lvl.promoText}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
                  Hujjat topshirish <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ DESCRIPTION SECTION ═══════════════════════════ */}
        <section className="mb-6">
          <EditableWrapper
            entityType="description"
            entityId={descKey}
            onEdit={() => setIsDescEditing(true)}
            onDelete={descValue ? () => setIsDescDeleteOpen(true) : undefined}
            label="Yo'nalish tavsifi"
          >
            <div className="rounded-2xl bg-gray-50 p-5 sm:p-6 lg:rounded-3xl">
              <h4 className="font-serif text-lg font-semibold sm:text-xl">
                Yo&apos;nalish tavsifi
              </h4>
              <div className="text-container mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                <p>{descValue || lvl.description}</p>
              </div>
            </div>
          </EditableWrapper>
        </section>

        {/* ═══ TOOLBAR \u2014 Search + Filter + View Toggle ═══════ */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 grow sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Fakultet qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-colors focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]/20"
            />
          </div>
          <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setStatusFilter(btn.key)}
                className={`cursor-pointer px-3 py-2 text-xs font-medium transition-colors first:rounded-l-xl last:rounded-r-xl sm:px-4 sm:text-sm ${
                  statusFilter === btn.key
                    ? "bg-[#00575B] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {btn.label}
                <span
                  className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                    statusFilter === btn.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer rounded-lg p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#00575B] text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Kartochka ko&apos;rinishi"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`cursor-pointer rounded-lg p-2 transition-colors ${
                viewMode === "table"
                  ? "bg-[#00575B] text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Jadval ko&apos;rinishi"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ═══ CONTENT AREA ══════════════════════════════════ */}
        <div className="rounded-2xl bg-gray-50 p-4 sm:p-5 lg:rounded-3xl lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-serif text-lg font-semibold sm:text-xl">
              Fakultet va yo&apos;nalishlar
            </h4>
            <span className="rounded-full bg-[#00575B]/10 px-3 py-1 text-xs font-medium text-[#00575B]">
              {items.length} ta fakultet
              {searchQuery && ` (${allItems.length} dan)`}
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center">
              <LoadingSpinner size="lg" text="Yuklanmoqda..." />
            </div>
          ) : error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : items.length > 0 ? (
            viewMode === "grid" ? (
              /* ── GRID VIEW ─────────────────────────────── */
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item, index) => {
                  const FIcon = iconForFaculty(item.name?.uz || "");
                  const dirCount = item.directions_count ?? item.directions?.length ?? 0;
                  const directions = item.directions || [];
                  const detailHref = basePath ? `${basePath}/fakultet/${item.id}` : undefined;
                  const plainDesc = stripHtml(item.description?.uz || "");
                  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

                  return (
                    <EditableWrapper
                      key={item.id}
                      entityType="faculty"
                      entityId={item.id}
                      onEdit={() => setEditItem(item)}
                      onDelete={() => setDeleteId(item.id)}
                      label="Fakultet"
                    >
                      <div className={`group flex h-full flex-col rounded-2xl border-l-4 ${accent.border} bg-white shadow-sm transition-shadow hover:shadow-lg`}>
                        {/* Card header with status + sort */}
                        <div className="flex items-center justify-between border-b border-gray-50 px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleActive(item);
                              }}
                              title={item.is_active ? "Nofaol qilish" : "Faollashtirish"}
                              className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                                item.is_active
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                              }`}
                            >
                              {item.is_active ? "\u25CF Faol" : "\u25CB Nofaol"}
                            </button>
                            <span className="text-[10px] text-gray-300">#{item.id}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(item, "up");
                              }}
                              className="cursor-pointer rounded p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
                              title="Yuqoriga"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-5 text-center text-[10px] text-gray-400">
                              {item.sort_order ?? 0}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(item, "down");
                              }}
                              className="cursor-pointer rounded p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
                              title="Pastga"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="flex grow flex-col gap-3 p-5">
                          {detailHref ? (
                            <Link href={detailHref} className="group/title flex items-center gap-2 font-serif text-lg font-semibold text-gray-900 transition-colors hover:text-[#00575B]">
                              <span className={`inline-flex items-center justify-center rounded-xl p-2.5 ${accent.icon}`}>
                                <FIcon className="h-5 w-5" />
                              </span>
                              <span className="line-clamp-1 underline-offset-2 group-hover/title:underline">{item.name?.uz || "Nomsiz"}</span>
                            </Link>
                          ) : (
                            <h5 className="flex items-center gap-2 font-serif text-lg font-semibold text-gray-900">
                              <span className={`inline-flex items-center justify-center rounded-xl p-2.5 ${accent.icon}`}>
                                <FIcon className="h-5 w-5" />
                              </span>
                              <span className="line-clamp-1">{item.name?.uz || "Nomsiz"}</span>
                            </h5>
                          )}

                          {plainDesc && (
                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
                              {plainDesc}
                            </p>
                          )}

                          {directions.length > 0 && (
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                              {directions.map((dir) => (
                                <span
                                  key={dir.id}
                                  className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-medium ${accent.tag}`}
                                >
                                  {dir.name?.uz || "Nomsiz"}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card footer */}
                        <div className="flex items-center justify-between border-t border-gray-50 px-5 py-3">
                          <div className="flex items-center gap-3 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> {dirCount} yo&apos;nalish
                            </span>
                            {item.created_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {formatDate(item.created_at)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {detailHref && (
                              <Link
                                href={detailHref}
                                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#00575B]/10 hover:text-[#00575B]"
                                title="Ko&apos;rish"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditItem(item);
                              }}
                              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              title="Tahrirlash"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(item.id);
                              }}
                              className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              title="O&apos;chirish"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </EditableWrapper>
                  );
                })}
              </div>
            ) : (
              /* ── TABLE VIEW ────────────────────────────── */
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-white">
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <Hash className="mr-1 inline h-3 w-3" />
                        ID
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Fakultet
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Holat
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Tartib
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <BookOpen className="mr-1 inline h-3 w-3" />
                        Yo&apos;nalishlar
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        Sana
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => {
                      const FIcon = iconForFaculty(item.name?.uz || "");
                      const dirCount = item.directions_count ?? item.directions?.length ?? 0;
                      const detailHref = basePath
                        ? `${basePath}/fakultet/${item.id}`
                        : undefined;

                      return (
                        <tr
                          key={item.id}
                          className="bg-white transition-colors hover:bg-gray-50/70"
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-400">
                            {item.id}
                          </td>
                          <td className="px-4 py-3">
                            {detailHref ? (
                              <Link href={detailHref} className="group/name flex items-center gap-3">
                                <span className="inline-flex items-center justify-center rounded-lg bg-[#00575B]/10 p-1.5">
                                  <FIcon className="h-4 w-4 text-[#00575B]" />
                                </span>
                                <div>
                                  <p className="font-semibold text-[#00575B] underline-offset-2 group-hover/name:underline">
                                    {item.name?.uz || "Nomsiz"}
                                  </p>
                                  {item.name?.ru && (
                                    <p className="text-xs text-gray-400">{item.name.ru}</p>
                                  )}
                                </div>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center justify-center rounded-lg bg-[#00575B]/10 p-1.5">
                                  <FIcon className="h-4 w-4 text-[#00575B]" />
                                </span>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {item.name?.uz || "Nomsiz"}
                                  </p>
                                  {item.name?.ru && (
                                    <p className="text-xs text-gray-400">{item.name.ru}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <button
                              onClick={() => handleToggleActive(item)}
                              className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                item.is_active
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                              }`}
                            >
                              {item.is_active ? "\u25CF Faol" : "\u25CB Nofaol"}
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleReorder(item, "up")}
                                className="cursor-pointer rounded p-0.5 text-gray-300 hover:text-[#00575B]"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <span className="min-w-5 text-center text-xs text-gray-500">
                                {item.sort_order ?? 0}
                              </span>
                              <button
                                onClick={() => handleReorder(item, "down")}
                                className="cursor-pointer rounded p-0.5 text-gray-300 hover:text-[#00575B]"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                              {dirCount} ta
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400">
                            {item.created_at ? formatDate(item.created_at) : "\u2014"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {detailHref && (
                                <Link
                                  href={detailHref}
                                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#00575B]/10 hover:text-[#00575B]"
                                  title="Ko&apos;rish"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                              )}
                              <button
                                onClick={() => setEditItem(item)}
                                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                title="Tahrirlash"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(item.id)}
                                className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                title="O&apos;chirish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center text-center">
              <GraduationCap className="mb-4 h-14 w-14 text-gray-300" />
              <p className="text-base text-gray-400">
                {searchQuery
                  ? `"${searchQuery}" bo\u2018yicha natija topilmadi`
                  : "Bu daraja bo\u2018yicha fakultetlar tez orada qo\u2018shiladi"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-[#00575B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003d40]"
                >
                  <Plus className="h-4 w-4" />
                  Birinchi fakultetni qo&apos;shish
                </button>
              )}
            </div>
          )}
        </div>

        {meta && meta.last_page > 1 && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
            className="mt-8"
          />
        )}
      </Container>

      {/* \u2500\u2500 Modals \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Yangi fakultet qo'shish"
        fields={FACULTY_FIELDS}
        initialData={
          level ? { level, is_active: true, sort_order: 0 } : { is_active: true, sort_order: 0 }
        }
        onSubmit={handleCreate}
        isLoading={createFaculty.isPending}
      />

      {editItem && (
        <EditModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title="Fakultetni tahrirlash"
          fields={FACULTY_FIELDS}
          initialData={{
            name: editItem.name,
            level: editItem.level,
            description: editItem.description,
            sort_order: editItem.sort_order,
            is_active: editItem.is_active,
          }}
          onSubmit={handleUpdate}
          isLoading={updateFaculty.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Fakultetni o'chirish"
        message="Bu fakultet va unga tegishli barcha yo'nalishlar butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteFaculty.isPending}
      />

      {/* ── Description edit/delete modals ────────────── */}
      <TextEditModal
        isOpen={isDescEditing}
        onClose={() => setIsDescEditing(false)}
        title="Yo'nalish tavsifini tahrirlash"
        contentKey={descKey}
        section={descSection}
        initialValue={descValue ? descTranslatable : { uz: lvl.description }}
        type="textarea"
        onSubmit={async (data) => {
          await upsertContent.mutateAsync(data);
        }}
        isLoading={upsertContent.isPending}
      />

      <ConfirmDialog
        isOpen={isDescDeleteOpen}
        onClose={() => setIsDescDeleteOpen(false)}
        onConfirm={async () => {
          await deleteContent.mutateAsync(descKey);
          setIsDescDeleteOpen(false);
        }}
        title="Tavsifni o'chirish"
        message="Yo'nalish tavsifi o'chiriladi va standart matn qaytariladi. Davom etasizmi?"
        isLoading={deleteContent.isPending}
      />
    </section>
  );
}
