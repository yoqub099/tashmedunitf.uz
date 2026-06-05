"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { sanitizeHtml } from "@/lib/sanitize";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import type { FieldConfig } from "@/types/inline-edit";
import type { Faculty, Direction, Faq } from "@/types";
import {
  useFaculties,
  useCreateFaculty,
  useUpdateFaculty,
  useDeleteFaculty,
} from "@/hooks/useFaculties";
import {
  useDirections,
  useCreateDirection,
  useUpdateDirection,
  useDeleteDirection,
} from "@/hooks/useDirections";
import {
  useFaqs,
  useCreateFaq,
  useUpdateFaq,
  useDeleteFaq,
} from "@/hooks/useFaqs";
import { useSiteContents, useBatchUpsertSiteContent, useDeleteSiteContent } from "@/hooks/useSiteContents";
import type { SiteContentUpsertData } from "@/types";
import {
  GraduationCap,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  User,
  ChevronDown,
  BookOpen,
  Plus,
} from "lucide-react";

/* ── helpers ───────────────────────────────── */
/** Strip "O'qitiladigan fanlar" / "Karyera imkoniyatlari" lists */
function getCleanDescription(html: string): string {
  if (!html) return "";
  let clean = html;
  const patterns = [/O[''\u02bc]qitiladigan fanlar/i, /Karyera imkoniyatlari/i];
  for (const pat of patterns) {
    const idx = clean.search(pat);
    if (idx > -1) clean = clean.substring(0, idx);
  }
  clean = clean.replace(/<(p|div|br)[^>]*>\s*(<\/(p|div)>)?\s*$/gi, "").trim();
  return clean;
}

/** Convert FormData to plain object (for FAQ JSON API) */
function formDataToObject(fd: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  fd.forEach((value, key) => {
    // Handle translatable fields like question[uz]
    const match = key.match(/^(\w+)\[(\w+)\]$/);
    if (match) {
      const [, field, lang] = match;
      if (!obj[field]) obj[field] = {};
      (obj[field] as Record<string, unknown>)[lang] = value;
    } else if (key === "is_active") {
      obj[key] = value === "1";
    } else if (key === "sort_order") {
      obj[key] = Number(value);
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

/* ── Tab config ────────────────────────────── */
const DEGREE_TABS = [
  { key: "bakalavriat", label: "Bakalavriat" },
  { key: "ordinatura", label: "Klinik ordinatura" },
  { key: "magistratura", label: "Magistratura" },
] as const;

/* ── SVG Icons ─────────────────────────────── */
function FacultyGlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 24.5C8.2005 24.5 3.5 19.7995 3.5 14C3.5 8.2005 8.2005 3.5 14 3.5C19.7995 3.5 24.5 8.2005 24.5 14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 10.5H23.7766" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 17.5H14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.6667 14C18.6667 10.7753 17.8232 7.55062 16.1386 4.73662C15.1504 3.08812 12.8497 3.08812 11.8627 4.73662C8.49107 10.3658 8.49107 17.6353 11.8627 23.2645C12.3562 24.0881 13.1787 24.5011 14.0012 24.5011" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.3649 22.365L25.2874 21.196C25.8019 20.9907 25.7902 20.258 25.2699 20.0678L18.3095 17.5373C17.8289 17.3623 17.3634 17.829 17.5372 18.3097L20.0677 25.27C20.2567 25.7915 20.9894 25.802 21.1959 25.2875L22.3649 22.365Z" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DirectionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M13.9 3L1 25.2H4.8L13.9 9.2L23.2 25.2H26.8L13.9 3Z" fill="#00575B" />
      <path d="M14 15.6L8.4 25.2H12.2L14 21.8L16.1 25.2H19.7L14 15.6Z" fill="#00575B" />
    </svg>
  );
}

/* ── Admission Items (defaults) ─────────────── */
const ADMISSION_DEFAULTS = [
  { key: "adm_website", icon: Globe, label: "Onlayn qabul sahifasi", defaultValue: "admission.TdTUTF.uz", linkPrefix: "https://" },
  { key: "adm_secretary", icon: User, label: "Mas'ul kotib", defaultValue: "Qabul komissiyasi" },
  { key: "adm_phone", icon: Phone, label: "Telefon", defaultValue: "+998 76 223-14-50", linkPrefix: "tel:" },
  { key: "adm_email", icon: Mail, label: "Email", defaultValue: "info@TdTUTF.uz", linkPrefix: "mailto:" },
  { key: "adm_address", icon: MapPin, label: "Manzil", defaultValue: "Termiz sh., Al-Xorazmiy ko'chasi, 7-uy" },
  { key: "adm_schedule", icon: Clock, label: "Ish grafigi", defaultValue: "Dushanba – Shanba 9:00–18:00" },
];

/* ── Field configs ─────────────────────────── */
const FACULTY_FIELDS: FieldConfig[] = [
  { name: "name", label: "Nomi", type: "text", translatable: true, required: true },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true },
  {
    name: "level",
    label: "Daraja",
    type: "select",
    required: true,
    options: [
      { value: "bakalavriat", label: "Bakalavriat" },
      { value: "ordinatura", label: "Klinik ordinatura" },
      { value: "magistratura", label: "Magistratura" },
    ],
  },
  { name: "sort_order", label: "Tartib", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*", maxSize: 5120 },
];

const DIRECTION_FIELDS: FieldConfig[] = [
  { name: "name", label: "Nomi", type: "text", translatable: true, required: true },
  { name: "code", label: "Kodi", type: "text", required: true, halfWidth: true },
  {
    name: "level",
    label: "Daraja",
    type: "select",
    required: true,
    halfWidth: true,
    options: [
      { value: "bakalavriat", label: "Bakalavriat" },
      { value: "ordinatura", label: "Klinik ordinatura" },
      { value: "magistratura", label: "Magistratura" },
    ],
  },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true },
  { name: "duration", label: "Davomiyligi", type: "text", halfWidth: true },
  { name: "price_daytime", label: "Kunduzgi narx", type: "number", halfWidth: true },
  { name: "price_remote", label: "Sirtqi narx", type: "number", halfWidth: true },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*", maxSize: 5120 },
];

const FAQ_FIELDS: FieldConfig[] = [
  { name: "question", label: "Savol", type: "text", translatable: true, required: true },
  { name: "answer", label: "Javob", type: "richtext", translatable: true, required: true },
  {
    name: "category",
    label: "Kategoriya",
    type: "select",
    options: [
      { value: "qabul", label: "Qabul" },
      { value: "talabalar", label: "Talabalar" },
      { value: "umumiy", label: "Umumiy" },
    ],
  },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle" },
];

const HERO_FIELDS: FieldConfig[] = [
  { name: "hero_title", label: "Hero sarlavha", type: "text", translatable: true, required: true },
  { name: "hero_text", label: "Hero matni", type: "richtext", translatable: true },
];

const TRANSFER_FIELDS: FieldConfig[] = [
  { name: "transfer_title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "transfer_text", label: "Matn", type: "richtext", translatable: true },
];

const ADMISSION_FIELDS: FieldConfig[] = [
  { name: "adm_website", label: "Onlayn qabul sahifasi", type: "text", translatable: true, required: true },
  { name: "adm_secretary", label: "Mas'ul kotib", type: "text", translatable: true, required: true },
  { name: "adm_phone", label: "Telefon", type: "text", translatable: false, required: true },
  { name: "adm_email", label: "Email", type: "text", translatable: false, required: true },
  { name: "adm_address", label: "Manzil", type: "text", translatable: true, required: true },
  { name: "adm_schedule", label: "Ish grafigi", type: "text", translatable: true, required: true },
];

/* ════════════════════════════════════════════════════════════════════════════ */

export default function AbiturientlargaAdminPage() {
  /* ── Data fetching ───────────────────────── */
  const { data: facultiesData, isLoading: loadingF, error: errorF } = useFaculties({ per_page: 100 });
  const { data: directionsData, isLoading: loadingD, error: errorD } = useDirections({ per_page: 200 });
  const { data: faqsData, isLoading: loadingQ, error: errorQ } = useFaqs({ per_page: 100 });
  const { data: siteContents = [] } = useSiteContents("applicants");

  const faculties = useMemo<Faculty[]>(() => facultiesData?.data ?? [], [facultiesData]);
  const directions = useMemo<Direction[]>(() => directionsData?.data ?? [], [directionsData]);
  const faqs = useMemo<Faq[]>(() => faqsData?.data ?? [], [faqsData]);

  /* ── Mutations ───────────────────────────── */
  const createFaculty = useCreateFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();

  const createDirection = useCreateDirection();
  const updateDirection = useUpdateDirection();
  const deleteDirection = useDeleteDirection();

  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const batchUpsert = useBatchUpsertSiteContent();
  const deleteSiteContent = useDeleteSiteContent();

  /* ── State: degree tabs ──────────────────── */
  const [activeDegree, setActiveDegree] = useState<string>("bakalavriat");
  const [activeFacultyId, setActiveFacultyId] = useState<number | null>(null);

  /* ── State: CRUD modals ──────────────────── */
  const [isCreateFacultyOpen, setIsCreateFacultyOpen] = useState(false);
  const [editFaculty, setEditFaculty] = useState<Faculty | null>(null);
  const [deleteFacultyId, setDeleteFacultyId] = useState<number | null>(null);

  const [isCreateDirectionOpen, setIsCreateDirectionOpen] = useState(false);
  const [editDirection, setEditDirection] = useState<Direction | null>(null);
  const [deleteDirectionId, setDeleteDirectionId] = useState<number | null>(null);
  const [createDirFacultyId, setCreateDirFacultyId] = useState<number | null>(null);

  const [isCreateFaqOpen, setIsCreateFaqOpen] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [deleteFaqId, setDeleteFaqId] = useState<number | null>(null);

  /* ── State: Site content editing ─────────── */
  const [isHeroEditOpen, setIsHeroEditOpen] = useState(false);
  const [isTransferEditOpen, setIsTransferEditOpen] = useState(false);
  const [isDeleteHeroOpen, setIsDeleteHeroOpen] = useState(false);
  const [isDeleteTransferOpen, setIsDeleteTransferOpen] = useState(false);
  const [isAdmissionEditOpen, setIsAdmissionEditOpen] = useState(false);
  const [isDeleteAdmissionOpen, setIsDeleteAdmissionOpen] = useState(false);

  /* ── State: FAQ accordion ────────────────── */
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const faqRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [faqHeights, setFaqHeights] = useState<Record<number, number>>({});

  useEffect(() => {
    if (faqs.length === 0) return;
    const measured: Record<number, number> = {};
    faqs.forEach((f) => {
      const el = faqRefs.current[f.id];
      if (el) measured[f.id] = el.scrollHeight;
    });
    setFaqHeights((prev) => {
      const changed = faqs.some((f) => prev[f.id] !== measured[f.id]);
      return changed ? measured : prev;
    });
  }, [faqs]);

  /* ── Computed ─────────────────────────────── */
  const degreeFaculties = useMemo(
    () =>
      faculties
        .filter((f) => f.level === activeDegree)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [faculties, activeDegree]
  );

  useEffect(() => {
    setActiveFacultyId((prev) => {
      // Keep current selection if still valid in the new list
      if (prev !== null && degreeFaculties.some((f) => f.id === prev)) return prev;
      return degreeFaculties.length > 0 ? degreeFaculties[0].id : null;
    });
  }, [degreeFaculties]);

  const activeFac = degreeFaculties.find((f) => f.id === activeFacultyId) || null;

  const facultyDirections = useMemo(
    () =>
      directions
        .filter((d) => d.faculty_id === activeFacultyId && d.level === activeDegree)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [directions, activeFacultyId, activeDegree]
  );

  /* ── Site content helpers ────────────────── */
  /* helpers to find content item */
  const findContent = (key: string) => siteContents.find((c: { key: string }) => c.key === key);
  const heroTitleContent = findContent("applicants_hero_title");
  const heroTextContent = findContent("applicants_hero_text");
  const transferTitleContent = findContent("applicants_transfer_title");
  const transferTextContent = findContent("applicants_transfer_text");

  const heroTitle = heroTitleContent?.value?.uz || "2025\u20132026 o'quv yili uchun qabul";
  const heroText = heroTextContent?.value?.uz || "<p>Toshkent tibbiyot akademiyasi Termiz filialiga hujjat qabul qilish boshlandi!</p><p><strong>Qabul boshlandi!</strong></p>";
  const transferTitle = transferTitleContent?.value?.uz || "O'qishni ko'chirish va tiklash";
  const transferText = transferTextContent?.value?.uz || "<p>Talabalar o'qishni ko'chirish bo'yicha arizalarni topshirish va ko'rib chiqish quyidagicha amalga oshiriladi.</p>";

  /* Admission items resolved from site contents */
  const admissionItems = useMemo(
    () =>
      ADMISSION_DEFAULTS.map((def) => {
        const content = findContent(`applicants_${def.key}`);
        const value = content?.value?.uz || def.defaultValue;
        let link: string | undefined;
        if (def.linkPrefix) {
          const raw = value.replace(/[\s-]/g, "");
          link = def.linkPrefix.startsWith("http") ? `${def.linkPrefix}${value}` : `${def.linkPrefix}${raw}`;
        }
        return { ...def, value, link };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteContents]
  );

  /* ── CRUD handlers ───────────────────────── */
  const handleCreateFaculty = async (fd: FormData) => {
    if (!fd.has("level")) fd.append("level", activeDegree);
    await createFaculty.mutateAsync(fd);
    setIsCreateFacultyOpen(false);
  };

  const handleUpdateFaculty = async (fd: FormData) => {
    if (!editFaculty) return;
    fd.append("_method", "PUT");
    await updateFaculty.mutateAsync({ id: editFaculty.id, formData: fd });
    setEditFaculty(null);
  };

  const handleDeleteFaculty = async () => {
    if (deleteFacultyId === null) return;
    await deleteFaculty.mutateAsync(deleteFacultyId);
    setDeleteFacultyId(null);
  };

  const handleCreateDirection = async (fd: FormData) => {
    if (createDirFacultyId) fd.append("faculty_id", String(createDirFacultyId));
    if (!fd.has("level")) fd.append("level", activeDegree);
    await createDirection.mutateAsync(fd);
    setIsCreateDirectionOpen(false);
  };

  const handleUpdateDirection = async (fd: FormData) => {
    if (!editDirection) return;
    fd.append("_method", "PUT");
    await updateDirection.mutateAsync({ id: editDirection.id, formData: fd });
    setEditDirection(null);
  };

  const handleDeleteDirection = async () => {
    if (deleteDirectionId === null) return;
    await deleteDirection.mutateAsync(deleteDirectionId);
    setDeleteDirectionId(null);
  };

  const handleCreateFaq = async (fd: FormData) => {
    const obj = formDataToObject(fd);
    await createFaq.mutateAsync(obj);
    setIsCreateFaqOpen(false);
  };

  const handleUpdateFaq = async (fd: FormData) => {
    if (!editFaq) return;
    const obj = formDataToObject(fd);
    await updateFaq.mutateAsync({ id: editFaq.id, data: obj });
    setEditFaq(null);
  };

  const handleDeleteFaq = async () => {
    if (deleteFaqId === null) return;
    await deleteFaq.mutateAsync(deleteFaqId);
    setDeleteFaqId(null);
  };

  /* ── Site content handlers ───────────────── */
  const handleHeroSave = async (fd: FormData) => {
    const items: SiteContentUpsertData[] = [];
    const titleVal: Record<string, string> = {};
    const textVal: Record<string, string> = {};
    fd.forEach((v, k) => {
      const m = k.match(/^hero_title\[(\w+)\]$/);
      if (m) { titleVal[m[1]] = String(v); return; }
      const m2 = k.match(/^hero_text\[(\w+)\]$/);
      if (m2) { textVal[m2[1]] = String(v); }
    });
    if (Object.keys(titleVal).length > 0) {
      items.push({ key: "applicants_hero_title", section: "applicants", value: { uz: titleVal.uz || "", ru: titleVal.ru, en: titleVal.en }, type: "text" });
    }
    if (Object.keys(textVal).length > 0) {
      items.push({ key: "applicants_hero_text", section: "applicants", value: { uz: textVal.uz || "", ru: textVal.ru, en: textVal.en }, type: "html" });
    }
    if (items.length > 0) await batchUpsert.mutateAsync(items);
    setIsHeroEditOpen(false);
  };

  const handleTransferSave = async (fd: FormData) => {
    const items: SiteContentUpsertData[] = [];
    const titleVal: Record<string, string> = {};
    const textVal: Record<string, string> = {};
    fd.forEach((v, k) => {
      const m = k.match(/^transfer_title\[(\w+)\]$/);
      if (m) { titleVal[m[1]] = String(v); return; }
      const m2 = k.match(/^transfer_text\[(\w+)\]$/);
      if (m2) { textVal[m2[1]] = String(v); }
    });
    if (Object.keys(titleVal).length > 0) {
      items.push({ key: "applicants_transfer_title", section: "applicants", value: { uz: titleVal.uz || "", ru: titleVal.ru, en: titleVal.en }, type: "text" });
    }
    if (Object.keys(textVal).length > 0) {
      items.push({ key: "applicants_transfer_text", section: "applicants", value: { uz: textVal.uz || "", ru: textVal.ru, en: textVal.en }, type: "html" });
    }
    if (items.length > 0) await batchUpsert.mutateAsync(items);
    setIsTransferEditOpen(false);
  };

  const handleDeleteHeroContent = async () => {
    await Promise.all([
      deleteSiteContent.mutateAsync("applicants_hero_title"),
      deleteSiteContent.mutateAsync("applicants_hero_text"),
    ]).catch(() => {});
    setIsDeleteHeroOpen(false);
  };

  const handleDeleteTransferContent = async () => {
    await Promise.all([
      deleteSiteContent.mutateAsync("applicants_transfer_title"),
      deleteSiteContent.mutateAsync("applicants_transfer_text"),
    ]).catch(() => {});
    setIsDeleteTransferOpen(false);
  };

  /* ── Admission handlers ──────────────────── */
  const handleAdmissionSave = async (fd: FormData) => {
    const items: SiteContentUpsertData[] = [];
    for (const def of ADMISSION_DEFAULTS) {
      const fieldConfig = ADMISSION_FIELDS.find((f) => f.name === def.key);
      if (!fieldConfig) continue;
      if (fieldConfig.translatable) {
        const valObj: Record<string, string> = {};
        fd.forEach((v, k) => {
          const m = k.match(new RegExp(`^${def.key}\\[(\\w+)\\]$`));
          if (m) valObj[m[1]] = String(v);
        });
        if (Object.keys(valObj).length > 0) {
          items.push({ key: `applicants_${def.key}`, section: "applicants", value: { uz: valObj.uz || "", ru: valObj.ru, en: valObj.en }, type: "text" });
        }
      } else {
        const val = fd.get(def.key);
        if (val) {
          items.push({ key: `applicants_${def.key}`, section: "applicants", value: { uz: String(val) }, type: "text" });
        }
      }
    }
    if (items.length > 0) await batchUpsert.mutateAsync(items);
    setIsAdmissionEditOpen(false);
  };

  const handleDeleteAdmissionContent = async () => {
    await Promise.all(
      ADMISSION_DEFAULTS.map((def) =>
        deleteSiteContent.mutateAsync(`applicants_${def.key}`).catch(() => {})
      )
    );
    setIsDeleteAdmissionOpen(false);
  };

  /* ── Loading / Error ─────────────────────── */
  if (loadingF || loadingD || loadingQ) return <LoadingSpinner />;
  if (errorF || errorD || errorQ) return <ErrorState message="Ma'lumotlarni yuklashda xatolik" />;

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <Container as="main" className="py-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Abiturientlarga</h1>
      </div>

      {/* ═══════════ Section 1 — Hero Grid ═══════════ */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Left — Hero Banner */}
        <div className="flex flex-col lg:col-span-2">
          <EditableWrapper
            entityType="site-content"
            entityId="hero"
            onEdit={() => setIsHeroEditOpen(true)}
            onDelete={() => setIsDeleteHeroOpen(true)}
            onAdd={() => setIsHeroEditOpen(true)}
            label="Hero bo'limi"
          >
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col justify-center bg-[url('/images/applicants-hero.svg')] bg-cover bg-no-repeat bg-center text-white lg:p-11 min-h-80 md:min-h-105 lg:min-h-125">
              <h2 className="font-serif text-2xl font-semibold capitalize leading-tight md:text-[32px] lg:text-[40px]">
                {heroTitle}
              </h2>
              <div
                className="mt-4 text-lg leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(heroText) }}
              />
            </div>
          </EditableWrapper>
        </div>

        {/* Right — Faculty List Sidebar */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-5 bg-gray-100 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              Bakalavriat
            </h2>
            <button
              onClick={() => {
                setCreateDirFacultyId(null);
                setIsCreateFacultyOpen(true);
              }}
              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors"
              title="Fakultet qo'shish"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-5">
            {faculties
              .filter((f) => f.level === "bakalavriat")
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((faculty) => (
                <EditableWrapper
                  key={faculty.id}
                  entityType="faculty"
                  entityId={faculty.id}
                  onEdit={() => setEditFaculty(faculty)}
                  onDelete={() => setDeleteFacultyId(faculty.id)}
                  onAdd={() => setIsCreateFacultyOpen(true)}
                  label="Fakultet"
                >
                  <div className="rounded-[20px] p-4 md:p-6 flex flex-col gap-3 bg-white">
                    <h5 className="font-serif text-xl font-semibold flex gap-2 text-[#00575B]">
                      <span className="flex-none">
                        <FacultyGlobeIcon />
                      </span>
                      <span>{faculty.name?.uz || "Nomsiz"}</span>
                    </h5>
                    <div className="flex w-full justify-end">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00575B]">
                        Batafsil ko&apos;rish
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    {!faculty.is_active && (
                      <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700 font-medium w-fit">
                        Nofaol
                      </span>
                    )}
                  </div>
                </EditableWrapper>
              ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Section 2 — Qabul komissiyasi ═══════════ */}
      <EditableWrapper
        entityType="site-content"
        entityId="admission"
        onEdit={() => setIsAdmissionEditOpen(true)}
        onDelete={() => setIsDeleteAdmissionOpen(true)}
        onAdd={() => setIsAdmissionEditOpen(true)}
        label="Qabul komissiyasi"
      >
        <section className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
          <h4 className="font-serif text-2xl font-semibold">Qabul komissiyasi</h4>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {admissionItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.key}
                  className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex items-center gap-4 bg-white"
                >
                  <div className="shrink-0 flex items-center justify-center rounded-full bg-[#00575B]/10 w-10 h-10">
                    <IconComp className="h-5 w-5 text-[#00575B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">{item.label}:</p>
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-1 line-clamp-2 text-[#00575B]">
                      {item.link ? (
                        <a
                          href={item.link}
                          className="hover:underline"
                          target={item.link.startsWith("http") ? "_blank" : undefined}
                          rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </h6>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </EditableWrapper>

      {/* ═══════════ Section 3 — Degree Tabs + Directions ═══════════ */}
      <section className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
        {/* Degree tabs */}
        <div className="flex overflow-x-auto">
          {DEGREE_TABS.map((tab) => {
            const isActive = activeDegree === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveDegree(tab.key)}
                className={`mr-6 whitespace-nowrap px-0 font-serif text-2xl font-semibold transition-colors cursor-pointer ${
                  isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="pt-6">
          {/* Degree description */}
          {activeDegree === "bakalavriat" && (
            <p className="text-base text-gray-600 leading-relaxed">
              TdTUTF bakalavr dasturlari tibbiyot va farmatsevtika sohasida malakali kadrlar tayyorlashga qaratilgan.
            </p>
          )}
          {activeDegree === "ordinatura" && (
            <p className="text-base text-gray-600 leading-relaxed">
              Klinik ordinatura — amaliy tibbiyot sohasida chuqur ixtisoslashuvni ta&apos;minlovchi dastur.
            </p>
          )}
          {activeDegree === "magistratura" && (
            <p className="text-base text-gray-600 leading-relaxed">
              Magistratura dasturlari ilmiy-tadqiqot va pedagogik kadrlar tayyorlashga yo&apos;naltirilgan.
            </p>
          )}

          {/* Faculty sub-tabs (pill buttons) */}
          {degreeFaculties.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {degreeFaculties.map((fac) => {
                const isActive = activeFacultyId === fac.id;
                return (
                  <EditableWrapper
                    key={fac.id}
                    entityType="faculty"
                    entityId={fac.id}
                    onEdit={() => setEditFaculty(fac)}
                    onDelete={() => setDeleteFacultyId(fac.id)}
                    onAdd={() => {
                      setCreateDirFacultyId(fac.id);
                      setIsCreateDirectionOpen(true);
                    }}
                    label="Fakultet"
                    className="inline-block"
                  >
                    <button
                      onClick={() => setActiveFacultyId(fac.id)}
                      className={`h-12 text-wrap rounded-full px-4 text-xs md:text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#00575B] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {fac.name?.uz || "Nomsiz"}
                    </button>
                  </EditableWrapper>
                );
              })}
              {/* Add faculty button */}
              <button
                onClick={() => setIsCreateFacultyOpen(true)}
                className="h-12 rounded-full px-4 text-sm font-medium border-2 border-dashed border-gray-300 text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Fakultet
              </button>
            </div>
          )}

          {/* Directions grid */}
          <div className="mt-6">
            {facultyDirections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {facultyDirections.map((dir) => (
                  <EditableWrapper
                    key={dir.id}
                    entityType="direction"
                    entityId={dir.id}
                    onEdit={() => setEditDirection(dir)}
                    onDelete={() => setDeleteDirectionId(dir.id)}
                    onAdd={() => {
                      setCreateDirFacultyId(activeFacultyId);
                      setIsCreateDirectionOpen(true);
                    }}
                    label="Yo'nalish"
                  >
                    <div className="rounded-[20px] p-4 md:p-6 lg:rounded-3xl flex flex-col gap-3 bg-white">
                      <h5 className="font-serif text-xl font-semibold flex items-end gap-2 text-[#00575B]">
                        <DirectionIcon />
                        <span>{dir.name?.uz || "Nomsiz"}</span>
                      </h5>
                      {dir.description?.uz && (() => {
                        const cleanDesc = getCleanDescription(dir.description.uz);
                        return cleanDesc ? (
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {cleanDesc.replace(/<[^>]*>/g, "")}
                          </p>
                        ) : null;
                      })()}
                      {!dir.is_active && (
                        <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700 font-medium w-fit">
                          Nofaol
                        </span>
                      )}
                    </div>
                  </EditableWrapper>
                ))}
                {/* Add direction card */}
                <button
                  onClick={() => {
                    setCreateDirFacultyId(activeFacultyId);
                    setIsCreateDirectionOpen(true);
                  }}
                  className="rounded-[20px] p-4 md:p-6 lg:rounded-3xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-green-400 text-gray-400 hover:text-green-500 transition-colors cursor-pointer min-h-32"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm font-medium">Yo&apos;nalish qo&apos;shish</span>
                </button>
              </div>
            ) : degreeFaculties.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-40 text-center py-10">
                <GraduationCap className="h-16 w-16 text-gray-300 mb-3" />
                <p className="text-gray-400 text-lg">
                  Bu daraja bo&apos;yicha fakultetlar yo&apos;q
                </p>
                <button
                  onClick={() => setIsCreateFacultyOpen(true)}
                  className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  + Fakultet qo&apos;shish
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-40 text-center py-10">
                <BookOpen className="h-16 w-16 text-gray-300 mb-3" />
                <p className="text-gray-400 text-lg">
                  Bu fakultetda yo&apos;nalishlar yo&apos;q
                </p>
                <button
                  onClick={() => {
                    setCreateDirFacultyId(activeFacultyId);
                    setIsCreateDirectionOpen(true);
                  }}
                  className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  + Yo&apos;nalish qo&apos;shish
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ Section 4 — O'qishni ko'chirish ═══════════ */}
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <EditableWrapper
          entityType="site-content"
          entityId="transfer"
          onEdit={() => setIsTransferEditOpen(true)}
          onDelete={() => setIsDeleteTransferOpen(true)}
          onAdd={() => setIsTransferEditOpen(true)}
          label="Ko'chirish bo'limi"
          className="flex-1"
        >
          <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:rounded-3xl bg-gray-100">
            <h4 className="font-serif text-xl sm:text-2xl font-semibold">{transferTitle}</h4>
            <div
              className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(transferText) }}
            />
          </div>
        </EditableWrapper>
      </div>

      {/* ═══════════ Section 5 — FAQ ═══════════ */}
      <section className="rounded-2xl p-4 md:p-6 lg:rounded-3xl mt-6 bg-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-2xl font-semibold">FAQ</h4>
          <button
            onClick={() => setIsCreateFaqOpen(true)}
            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors"
            title="FAQ qo'shish"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {faqs.length > 0 ? (
          <div className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white lg:rounded-3xl">
            {faqs
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((faq) => {
                const question = faq.question?.uz || "Savolsiz";
                const answer = faq.answer?.uz || "Javob kiritilmagan";
                const isOpen = openFaqId === faq.id;

                return (
                  <EditableWrapper
                    key={faq.id}
                    entityType="faq"
                    entityId={faq.id}
                    onEdit={() => setEditFaq(faq)}
                    onDelete={() => setDeleteFaqId(faq.id)}
                    onAdd={() => setIsCreateFaqOpen(true)}
                    label={`FAQ`}
                  >
                    <div>
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="flex w-full items-center justify-between px-4 py-4 md:px-6 md:py-5 text-left gap-3 cursor-pointer"
                      >
                        <h6 className="text-sm font-semibold leading-tight text-gray-900 md:text-base">
                          {question}
                        </h6>
                        <div className="flex items-center gap-2 shrink-0">
                          {!faq.is_active && (
                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-700 font-medium">
                              Nofaol
                            </span>
                          )}
                          <ChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-[#00575B]" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        ref={(el) => {
                          faqRefs.current[faq.id] = el;
                        }}
                        className="overflow-hidden transition-all duration-400 ease-out"
                        style={{
                          maxHeight: isOpen ? `${(faqHeights[faq.id] ?? 0) + 16}px` : "0px",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <div className="px-4 pb-4 md:px-6 md:pb-5">
                          <div
                            className="text-sm text-gray-600 leading-relaxed md:text-base [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-gray-800"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }}
                          />
                        </div>
                      </div>
                    </div>
                  </EditableWrapper>
                );
              })}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center min-h-40 text-center py-10 bg-white rounded-2xl">
            <p className="text-gray-400 text-lg">FAQ hali kiritilmagan</p>
            <button
              onClick={() => setIsCreateFaqOpen(true)}
              className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              + FAQ qo&apos;shish
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ MODALS ═══════════ */}

      {/* Faculty Create */}
      <EditModal
        isOpen={isCreateFacultyOpen}
        onClose={() => setIsCreateFacultyOpen(false)}
        title="Yangi fakultet"
        fields={FACULTY_FIELDS}
        initialData={{ level: activeDegree, sort_order: degreeFaculties.length + 1, is_active: true }}
        onSubmit={handleCreateFaculty}
        isLoading={createFaculty.isPending}
      />

      {/* Faculty Edit */}
      <EditModal
        isOpen={!!editFaculty}
        onClose={() => setEditFaculty(null)}
        title="Fakultetni tahrirlash"
        fields={FACULTY_FIELDS}
        initialData={
          editFaculty
            ? {
                name: editFaculty.name,
                description: editFaculty.description,
                level: editFaculty.level,
                sort_order: editFaculty.sort_order,
                is_active: editFaculty.is_active,
              }
            : undefined
        }
        onSubmit={handleUpdateFaculty}
        isLoading={updateFaculty.isPending}
      />

      {/* Faculty Delete */}
      <ConfirmDialog
        isOpen={deleteFacultyId !== null}
        onClose={() => setDeleteFacultyId(null)}
        onConfirm={handleDeleteFaculty}
        title="Fakultetni o'chirish"
        message="Ushbu fakultet va unga tegishli yo'nalishlar o'chiriladi. Davom etasizmi?"
        isLoading={deleteFaculty.isPending}
      />

      {/* Direction Create */}
      <EditModal
        isOpen={isCreateDirectionOpen}
        onClose={() => setIsCreateDirectionOpen(false)}
        title="Yangi yo'nalish"
        fields={DIRECTION_FIELDS}
        initialData={{
          level: activeDegree,
          faculty_id: createDirFacultyId ?? undefined,
          sort_order: facultyDirections.length + 1,
          is_active: true,
        }}
        onSubmit={handleCreateDirection}
        isLoading={createDirection.isPending}
      />

      {/* Direction Edit */}
      <EditModal
        isOpen={!!editDirection}
        onClose={() => setEditDirection(null)}
        title="Yo'nalishni tahrirlash"
        fields={DIRECTION_FIELDS}
        initialData={
          editDirection
            ? {
                name: editDirection.name,
                code: editDirection.code,
                level: editDirection.level,
                description: editDirection.description,
                duration: editDirection.duration,
                price_daytime: editDirection.price_daytime,
                price_remote: editDirection.price_remote,
                sort_order: editDirection.sort_order,
                is_active: editDirection.is_active,
              }
            : undefined
        }
        onSubmit={handleUpdateDirection}
        isLoading={updateDirection.isPending}
      />

      {/* Direction Delete */}
      <ConfirmDialog
        isOpen={deleteDirectionId !== null}
        onClose={() => setDeleteDirectionId(null)}
        onConfirm={handleDeleteDirection}
        title="Yo'nalishni o'chirish"
        message="Ushbu yo'nalish o'chiriladi. Davom etasizmi?"
        isLoading={deleteDirection.isPending}
      />

      {/* FAQ Create */}
      <EditModal
        isOpen={isCreateFaqOpen}
        onClose={() => setIsCreateFaqOpen(false)}
        title="Yangi FAQ"
        fields={FAQ_FIELDS}
        initialData={{ category: "qabul", sort_order: faqs.length + 1, is_active: true }}
        onSubmit={handleCreateFaq}
        isLoading={createFaq.isPending}
      />

      {/* FAQ Edit */}
      <EditModal
        isOpen={!!editFaq}
        onClose={() => setEditFaq(null)}
        title="FAQ tahrirlash"
        fields={FAQ_FIELDS}
        initialData={
          editFaq
            ? {
                question: editFaq.question,
                answer: editFaq.answer,
                category: editFaq.category || "umumiy",
                sort_order: editFaq.sort_order,
                is_active: editFaq.is_active,
              }
            : undefined
        }
        onSubmit={handleUpdateFaq}
        isLoading={updateFaq.isPending}
      />

      {/* FAQ Delete */}
      <ConfirmDialog
        isOpen={deleteFaqId !== null}
        onClose={() => setDeleteFaqId(null)}
        onConfirm={handleDeleteFaq}
        title="FAQ o'chirish"
        message="Ushbu FAQ o'chiriladi. Davom etasizmi?"
        isLoading={deleteFaq.isPending}
      />

      {/* Hero Edit */}
      <EditModal
        isOpen={isHeroEditOpen}
        onClose={() => setIsHeroEditOpen(false)}
        title="Hero bo'limini tahrirlash"
        fields={HERO_FIELDS}
        initialData={{
          hero_title: heroTitleContent?.value || { uz: heroTitle },
          hero_text: heroTextContent?.value || { uz: heroText },
        }}
        onSubmit={handleHeroSave}
        isLoading={batchUpsert.isPending}
      />

      {/* Transfer Edit */}
      <EditModal
        isOpen={isTransferEditOpen}
        onClose={() => setIsTransferEditOpen(false)}
        title="Ko'chirish bo'limini tahrirlash"
        fields={TRANSFER_FIELDS}
        initialData={{
          transfer_title: transferTitleContent?.value || { uz: transferTitle },
          transfer_text: transferTextContent?.value || { uz: transferText },
        }}
        onSubmit={handleTransferSave}
        isLoading={batchUpsert.isPending}
      />

      {/* Hero Delete */}
      <ConfirmDialog
        isOpen={isDeleteHeroOpen}
        onClose={() => setIsDeleteHeroOpen(false)}
        onConfirm={handleDeleteHeroContent}
        title="Hero kontentni tozalash"
        message="Hero sarlavha va matn tozalanadi. Sahifada standart matn ko'rinadi. Davom etasizmi?"
        isLoading={deleteSiteContent.isPending}
      />

      {/* Transfer Delete */}
      <ConfirmDialog
        isOpen={isDeleteTransferOpen}
        onClose={() => setIsDeleteTransferOpen(false)}
        onConfirm={handleDeleteTransferContent}
        title="Ko'chirish kontentni tozalash"
        message="Ko'chirish bo'limi sarlavha va matn tozalanadi. Standart matn ko'rinadi. Davom etasizmi?"
        isLoading={deleteSiteContent.isPending}
      />

      {/* Admission Edit */}
      <EditModal
        isOpen={isAdmissionEditOpen}
        onClose={() => setIsAdmissionEditOpen(false)}
        title="Qabul komissiyasi ma'lumotlarini tahrirlash"
        fields={ADMISSION_FIELDS}
        initialData={{
          adm_website: findContent("applicants_adm_website")?.value || { uz: "admission.TdTUTF.uz" },
          adm_secretary: findContent("applicants_adm_secretary")?.value || { uz: "Qabul komissiyasi" },
          adm_phone: findContent("applicants_adm_phone")?.value?.uz || "+998 76 223-14-50",
          adm_email: findContent("applicants_adm_email")?.value?.uz || "info@TdTUTF.uz",
          adm_address: findContent("applicants_adm_address")?.value || { uz: "Termiz sh., Al-Xorazmiy ko'chasi, 7-uy" },
          adm_schedule: findContent("applicants_adm_schedule")?.value || { uz: "Dushanba \u2013 Shanba 9:00\u201318:00" },
        }}
        onSubmit={handleAdmissionSave}
        isLoading={batchUpsert.isPending}
      />

      {/* Admission Delete */}
      <ConfirmDialog
        isOpen={isDeleteAdmissionOpen}
        onClose={() => setIsDeleteAdmissionOpen(false)}
        onConfirm={handleDeleteAdmissionContent}
        title="Qabul komissiyasi ma'lumotlarini tozalash"
        message="Barcha qabul komissiyasi ma'lumotlari tozalanadi. Standart qiymatlar ko'rinadi. Davom etasizmi?"
        isLoading={deleteSiteContent.isPending}
      />
    </Container>
  );
}
