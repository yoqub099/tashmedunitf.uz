"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import {
  useTalentedStudents,
  useTalentedStudentDetail,
  useCreateTalentedStudent,
  useUpdateTalentedStudent,
  useDeleteTalentedStudent,
} from "@/hooks/useTalentedStudents";
import { useSiteMediaByKey, useUpdateSiteMedia } from "@/hooks/useSiteMedia";
import {
  useCareerCenterInfos,
  useCareerCenterInfoDetail,
  useCreateCareerCenterInfo,
  useUpdateCareerCenterInfo,
  useDeleteCareerCenterInfo,
} from "@/hooks/useCareerCenterInfos";
import {
  useStudentLifePhotos,
  useStudentLifePhotoDetail,
  useCreateStudentLifePhoto,
  useUpdateStudentLifePhoto,
  useDeleteStudentLifePhoto,
} from "@/hooks/useStudentLifePhotos";
import {
  useLibraryResources,
  useLibraryResourceDetail,
  useCreateLibraryResource,
  useUpdateLibraryResource,
  useDeleteLibraryResource,
  useLibraryCategories,
} from "@/hooks/useLibraryResources";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import type { TalentedStudent, CareerCenterInfo, StudentLifePhoto, LibraryResource } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
  Upload,
  Video,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-cyan-500",
];

const GALLERY_PHOTO_FIELDS: FieldConfig[] = [
  { name: "photo", label: "Rasm", type: "media", accept: "image/*", maxSize: 10240, required: true },
  { name: "title", label: "Sarlavha", type: "text", translatable: true, placeholder: "Rasm sarlavhasi" },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true, placeholder: "0" },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

const STUDENT_FIELDS: FieldConfig[] = [
  { name: "name", label: "Ism familiya", type: "text", translatable: true, required: true, placeholder: "Talaba ismini kiriting" },
  { name: "description", label: "Tavsif", type: "textarea", translatable: true, required: true, placeholder: "Talaba haqida qisqacha ma'lumot" },
  { name: "photo", label: "Rasm", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true, placeholder: "0" },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

const CAREER_CENTER_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true, placeholder: "TdTUTF karyera markazi" },
  { name: "subtitle", label: "Qo'shimcha sarlavha", type: "text", translatable: true, placeholder: "Bizning universitetimiz uchun..." },
  { name: "content", label: "Matn", type: "textarea", translatable: true, required: true, placeholder: "Karyera markazi haqida..." },
  { name: "address", label: "Manzil", type: "text", translatable: true, placeholder: "Surxondaryo viloyati, Termiz shahri..." },
  { name: "phone", label: "Telefon", type: "text", placeholder: "+998 (76) 221-00-51" },
  { name: "email", label: "Email", type: "text", placeholder: "info@TdTUTF.uz" },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true, placeholder: "0" },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

/** Convert a slug like "badiiy-adabiyotlar" to "Badiiy adabiyotlar" */
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15.5578 11.1104L12.0004 14.6678L8.44287 11.1104" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.0002 3.99707L12.0002 14.6685" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.0032 16.4463C20.0032 18.411 18.4105 20.0038 16.4458 20.0038H7.55406C5.58932 20.0038 3.99658 18.411 3.99658 16.4463" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function StatusChip({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${active ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
      {active ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
      {active ? "Faol" : "Nofaol"}
    </span>
  );
}

function AdminOverlay({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-green-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white" title="Tahrirlash">
        <Pencil className="size-4" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white" title="O'chirish">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function StudentCard({ student, color, onEdit, onDelete }: { student: TalentedStudent; color: string; onEdit: () => void; onDelete: () => void }) {
  const name = student.name?.uz || "Nomsiz";
  const description = student.description?.uz || "";
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="group relative rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl bg-[url(/images/TwoChevronUp.svg)] bg-cover bg-position-[right_-112px_top_-48px] bg-no-repeat">
      <AdminOverlay onEdit={onEdit} onDelete={onDelete} />
      <div className="absolute top-4 left-4 z-10">
        <StatusChip active={student.is_active} />
      </div>
      <h6 className="mt-6 font-serif text-base font-semibold leading-tight lg:text-lg">
        {name}
      </h6>
      <div className="flex">
        <p className="mt-2 line-clamp-5 flex-1 text-sm text-gray-500">
          {description}
        </p>
        {student.photo ? (
          <img
            src={student.photo}
            alt={name}
            width={250}
            height={200}
            className="-mb-6 -mr-6 rounded-ee-3xl"
            style={{ color: 'transparent' }}
          />
        ) : (
          <div className={`${color} -mb-6 -mr-6 flex h-50 w-62.5 items-center justify-center rounded-ee-3xl text-4xl font-bold text-white`}>
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminBookCard({ book, onEdit, onDelete }: { book: LibraryResource; onEdit: () => void; onDelete: () => void }) {
  const title = book.title?.uz || "Nomsiz";
  const description = book.description?.uz || "";

  return (
    <div className="group relative flex gap-4 rounded-2xl bg-gray-50 p-4! text-gray-900 md:p-6 lg:rounded-3xl">
      <AdminOverlay onEdit={onEdit} onDelete={onDelete} />
      <div className="absolute top-3 left-3 z-10">
        <StatusChip active={book.is_published} />
      </div>
      {book.cover_thumbnail ? (
        <img
          alt={title}
          loading="lazy"
          width={160}
          height={220}
          className="rounded-2xl object-contain object-top"
          src={book.cover_thumbnail}
          style={{ color: "transparent" }}
        />
      ) : (
        <div className="flex h-55 w-40 shrink-0 items-center justify-center rounded-2xl bg-gray-200">
          <BookOpen size={40} className="text-gray-400" />
        </div>
      )}
      <div className="flex flex-col">
        <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
          {title}
        </h6>
        <p className="mt-2 line-clamp-3 text-sm text-gray-500">{description}</p>
        <div className="mt-auto pt-3">
          {book.document ? (
            <a
              href={book.document}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#00575B] px-4 text-sm text-[#00575B] transition-colors hover:bg-[#00575B]/5"
            >
              <span>Yuklab olish</span>
              <DownloadIcon />
            </a>
          ) : (
            <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-300 px-4 text-sm text-gray-400">
              <span>Fayl yo&apos;q</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}



/* ═══════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════ */
export default function TalabalarPage() {
  const [editItem, setEditItem] = useState<TalentedStudent | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Career center state
  const [editCareer, setEditCareer] = useState<CareerCenterInfo | null>(null);
  const [deleteCareerI, setDeleteCareerId] = useState<number | null>(null);
  const [isCreateCareerOpen, setIsCreateCareerOpen] = useState(false);

  // Gallery state
  const [editGalleryItem, setEditGalleryItem] = useState<StudentLifePhoto | null>(null);
  const [deleteGalleryId, setDeleteGalleryId] = useState<number | null>(null);
  const [isCreateGalleryOpen, setIsCreateGalleryOpen] = useState(false);

  // Library state
  const [editBook, setEditBook] = useState<LibraryResource | null>(null);
  const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
  const [isCreateBookOpen, setIsCreateBookOpen] = useState(false);

  const { data, isLoading, error, refetch } = useTalentedStudents({ per_page: 100 });
  const { data: editDetail, isLoading: isDetailLoading } = useTalentedStudentDetail(editItem?.id ?? 0);
  const { data: videoMedia, isLoading: isVideoLoading } = useSiteMediaByKey("talabalar_kengashi_video");

  // Career center data
  const { data: careerData, refetch: refetchCareer } = useCareerCenterInfos({ per_page: 100 });
  const { data: editCareerDetail, isLoading: isCareerDetailLoading } = useCareerCenterInfoDetail(editCareer?.id ?? 0);

  // Gallery data
  const { data: galleryData, refetch: refetchGallery } = useStudentLifePhotos({ per_page: 100 });
  const { data: editGalleryDetail, isLoading: isGalleryDetailLoading } = useStudentLifePhotoDetail(editGalleryItem?.id ?? 0);

  // Library data
  const { data: libraryData, refetch: refetchLibrary } = useLibraryResources({ per_page: 5 });
  const { data: editBookDetail, isLoading: isBookDetailLoading } = useLibraryResourceDetail(editBook?.id ?? 0);
  const { data: categoriesData } = useLibraryCategories();

  const LIBRARY_BOOK_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "title", label: "Kitob nomi", type: "text", translatable: true, required: true, placeholder: "Kitob nomini kiriting" },
    { name: "description", label: "Muallif / Tavsif", type: "text", translatable: true, placeholder: "Muallif yoki qisqacha tavsif" },
    { name: "category", label: "Kategoriya", type: "select", required: true, options: (categoriesData ?? []).map((slug: string) => ({ value: slug, label: slugToLabel(slug) })) },
    { name: "cover", label: "Muqova rasmi", type: "media", accept: "image/*", maxSize: 5120 },
    { name: "document", label: "Fayl (PDF)", type: "media", accept: ".pdf,.doc,.docx,.epub", maxSize: 51200 },
    { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true, placeholder: "0" },
    { name: "is_published", label: "Faol", type: "toggle", halfWidth: true },
  ], [categoriesData]);

  const createStudent = useCreateTalentedStudent();
  const updateStudent = useUpdateTalentedStudent();
  const deleteStudent = useDeleteTalentedStudent();
  const updateVideo = useUpdateSiteMedia();

  // Career center mutations
  const createCareer = useCreateCareerCenterInfo();
  const updateCareer = useUpdateCareerCenterInfo();
  const deleteCareer = useDeleteCareerCenterInfo();

  // Gallery mutations
  const createGallery = useCreateStudentLifePhoto();
  const updateGallery = useUpdateStudentLifePhoto();
  const deleteGallery = useDeleteStudentLifePhoto();

  // Library mutations
  const createBook = useCreateLibraryResource();
  const updateBook = useUpdateLibraryResource();
  const deleteBook = useDeleteLibraryResource();

  const handleCreate = useCallback(async (formData: FormData) => {
    await createStudent.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [createStudent, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    await updateStudent.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetch();
  }, [editItem, updateStudent, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteStudent.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteStudent, refetch]);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !videoMedia) return;
    const formData = new FormData();
    formData.append("file", file);
    updateVideo.mutate({ id: videoMedia.id, formData });
    e.target.value = "";
  }, [videoMedia, updateVideo]);

  // Career center handlers
  const handleCreateCareer = useCallback(async (formData: FormData) => {
    await createCareer.mutateAsync(formData);
    setIsCreateCareerOpen(false);
    refetchCareer();
  }, [createCareer, refetchCareer]);

  const handleUpdateCareer = useCallback(async (formData: FormData) => {
    if (!editCareer) return;
    await updateCareer.mutateAsync({ id: editCareer.id, formData });
    setEditCareer(null);
    refetchCareer();
  }, [editCareer, updateCareer, refetchCareer]);

  const handleDeleteCareer = useCallback(async () => {
    if (deleteCareerI === null) return;
    await deleteCareer.mutateAsync(deleteCareerI);
    setDeleteCareerId(null);
    refetchCareer();
  }, [deleteCareerI, deleteCareer, refetchCareer]);

  // Gallery handlers
  const handleCreateGallery = useCallback(async (formData: FormData) => {
    await createGallery.mutateAsync(formData);
    setIsCreateGalleryOpen(false);
    refetchGallery();
  }, [createGallery, refetchGallery]);

  const handleUpdateGallery = useCallback(async (formData: FormData) => {
    if (!editGalleryItem) return;
    await updateGallery.mutateAsync({ id: editGalleryItem.id, formData });
    setEditGalleryItem(null);
    refetchGallery();
  }, [editGalleryItem, updateGallery, refetchGallery]);

  const handleDeleteGallery = useCallback(async () => {
    if (deleteGalleryId === null) return;
    await deleteGallery.mutateAsync(deleteGalleryId);
    setDeleteGalleryId(null);
    refetchGallery();
  }, [deleteGalleryId, deleteGallery, refetchGallery]);

  // Library handlers
  const handleCreateBook = useCallback(async (formData: FormData) => {
    await createBook.mutateAsync(formData);
    setIsCreateBookOpen(false);
    refetchLibrary();
  }, [createBook, refetchLibrary]);

  const handleUpdateBook = useCallback(async (formData: FormData) => {
    if (!editBook) return;
    await updateBook.mutateAsync({ id: editBook.id, formData });
    setEditBook(null);
    refetchLibrary();
  }, [editBook, updateBook, refetchLibrary]);

  const handleDeleteBook = useCallback(async () => {
    if (deleteBookId === null) return;
    await deleteBook.mutateAsync(deleteBookId);
    setDeleteBookId(null);
    refetchLibrary();
  }, [deleteBookId, deleteBook, refetchLibrary]);

  const items = data?.data || [];
  const careerItems: CareerCenterInfo[] = careerData?.data || [];
  const galleryItems: StudentLifePhoto[] = galleryData?.data || [];
  const libraryItems: LibraryResource[] = libraryData?.data || [];

  if (isLoading) return <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <Container as="section" className="py-8 sm:py-12">
        {/* ── Breadcrumb ── */}
        <nav className="text-sm font-medium mb-4">
          <ol className="flex items-center gap-1.5 text-gray-500 flex-wrap">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#00575B] transition-colors"><Home className="h-4 w-4" /></Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            </li>
            <li className="text-[#00575B] font-semibold">Talabalarga</li>
          </ol>
        </nav>

        {/* ═══ HERO: Students + Sidebar ═══ */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-[32px] font-semibold leading-tight capitalize lg:text-5xl">
                  Iqtidorli talabalarimiz
                </h1>
                <p className="mt-4 text-gray-500">
                  Bizning iqtidorli talabalarimiz va ularning yutuqlari
                </p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="size-4" />} size="lg">
                Yangi qo&apos;shish
              </Button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {items.length > 0 ? (
                items.map((s: TalentedStudent, idx: number) => (
                  <StudentCard
                    key={s.id}
                    student={s}
                    color={COLORS[idx % COLORS.length]}
                    onEdit={() => setEditItem(s)}
                    onDelete={() => setDeleteId(s.id)}
                  />
                ))
              ) : (
                <EmptyState
                  title="Talabalar topilmadi"
                  message="Hozircha iqtidorli talaba qo'shilmagan"
                  action={{ label: "Yangi qo'shish", onClick: () => setIsCreateOpen(true) }}
                />
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <h5 className="font-serif text-xl font-semibold">Talabalar Kengashi</h5>
            <p className="mt-2 text-sm text-gray-500">
              TdTUTF Talabalar Kengashi — talabalar g&apos;oyalarini rivojlantirish, o&apos;z-o&apos;zini anglash va hayotga tatbiq etish uchun maydonchadir.
            </p>

            <div className="mt-4 overflow-hidden rounded-3xl">
              <div className="group/video relative">
                {videoMedia?.file_url ? (
                  <video
                    src={videoMedia.file_url}
                    className="h-full w-full rounded-3xl object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : isVideoLoading ? (
                  <div className="flex h-96 w-full items-center justify-center rounded-3xl bg-gray-200">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="flex h-96 w-full items-center justify-center rounded-3xl bg-gray-200">
                    <div className="text-center text-gray-400">
                      <Video size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Video yuklanmagan</p>
                    </div>
                  </div>
                )}
                {/* Mute / Fullscreen buttons */}
                {videoMedia?.file_url && (
                  <div className="absolute bottom-6 right-6 flex gap-4">
                    <button className="flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white" aria-label="Ovoz">
                      <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={20} width={20}>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white" aria-label="Kengaytirish">
                      <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                        <path d="M15 1L19 1V5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 7L19 1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 19H1L1 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 13L1 19" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
                {/* Video upload overlay */}
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 opacity-0 transition-opacity group-hover/video:opacity-100">
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={updateVideo.isPending}
                    className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-sm font-medium text-gray-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white disabled:opacity-60"
                  >
                    <Upload className="size-4" />
                    {updateVideo.isPending ? "Yuklanmoqda..." : "Videoni almashtirish"}
                  </button>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: Karyera markazi ═══ */}
        <section className="mt-16 lg:mt-20">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              TdTUTF karyera markazi
            </h2>
            <p className="text-gray-500">
              Bizning universitetimiz uchun kelib tushyotgan vakansiyalarni bo&apos;limi
            </p>
            <div className="mt-4">
              <Button onClick={() => setIsCreateCareerOpen(true)} icon={<Plus className="size-4" />} size="lg">
                Yangi qo&apos;shish
              </Button>
            </div>
          </div>

          {careerItems.length > 0 ? (
            careerItems.map((ci) => (
              <div key={ci.id} className="mt-8 grid items-end gap-6 lg:grid-cols-3 group relative">
                <AdminOverlay onEdit={() => setEditCareer(ci)} onDelete={() => setDeleteCareerId(ci.id)} />

                <div className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl bg-gray-50 lg:col-span-2">
                  <div className="flex items-start justify-between mb-2">
                    <StatusChip active={ci.is_active} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-serif text-2xl font-semibold">{ci.title?.uz || "Sarlavhasiz"}</h4>
                    <p className="mt-4 whitespace-pre-line">{ci.content?.uz || ""}</p>
                    <Link href="/talabalarga/karyera-markazi" className="ml-auto mt-6 flex items-center text-sm text-[#00575B]">
                      <span className="mr-2">Barchasini ko&apos;rish</span>
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl">
                  <h4 className="font-serif text-2xl font-semibold">Aloqa</h4>
                  <div className="mb-6 mt-4 space-y-3 text-sm text-gray-500">
                    {ci.address?.uz && (
                      <p className="flex items-start gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" className="mt-0.5 shrink-0">
                          <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                        </svg>
                        <span>{ci.address.uz}</span>
                      </p>
                    )}
                    {ci.phone && (
                      <p className="flex items-center gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" className="shrink-0">
                          <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
                        </svg>
                        <span>{ci.phone}</span>
                      </p>
                    )}
                    {ci.email && (
                      <p className="flex items-center gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" className="shrink-0">
                          <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
                        </svg>
                        <span>{ci.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-8">
              <EmptyState
                title="Karyera markazi ma'lumotlari topilmadi"
                message="Hozircha karyera markazi haqida ma'lumot qo'shilmagan"
                action={{ label: "Yangi qo'shish", onClick: () => setIsCreateCareerOpen(true) }}
              />
            </div>
          )}
        </section>

        {/* ═══ SECTION 3: Talabalar hayoti ═══ */}
        <section className="mt-16 lg:mt-20">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              Talabalar hayoti
            </h2>
            <p className="mb-4 mt-2 text-gray-500 lg:mb-8">
              Talabalar hayoti bilan tanishishni istaganlar uchun bizning talabalardan qaynoq fotolar
            </p>
            <Button onClick={() => setIsCreateGalleryOpen(true)} icon={<Plus className="size-4" />} size="lg">
              Yangi rasm qo&apos;shish
            </Button>
          </div>

          {galleryItems.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {galleryItems.map((photo) => (
                <div key={photo.id} className="group relative h-72 overflow-hidden rounded-3xl bg-gray-100">
                  <AdminOverlay
                    onEdit={() => setEditGalleryItem(photo)}
                    onDelete={() => setDeleteGalleryId(photo.id)}
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <StatusChip active={photo.is_active} />
                  </div>
                  {photo.photo ? (
                    <img
                      src={photo.photo}
                      alt={photo.title?.uz || "Rasm"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <ImageIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                  {photo.title?.uz && (
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{photo.title.uz}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="Rasmlar topilmadi"
                message="Hozircha galereya rasmlari qo'shilmagan"
                action={{ label: "Yangi rasm qo'shish", onClick: () => setIsCreateGalleryOpen(true) }}
              />
            </div>
          )}
        </section>

        {/* ═══ SECTION 4: Kutubxona ═══ */}
        <section className="mt-16 lg:mt-20 pb-16">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              Kutubxona
            </h2>
            <p className="text-gray-500">
              Bizning institutimiz uchun kelib tushyotgan vakansiyalarni bo&apos;limi
            </p>
            <div className="mt-4">
              <Button onClick={() => setIsCreateBookOpen(true)} icon={<Plus className="size-4" />} size="lg">
                Yangi kitob qo&apos;shish
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {libraryItems.length > 0 ? (
              libraryItems.map((book) => (
                <AdminBookCard
                  key={book.id}
                  book={book}
                  onEdit={() => setEditBook(book)}
                  onDelete={() => setDeleteBookId(book.id)}
                />
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded-2xl bg-gray-50 p-4! text-gray-900 md:p-6 lg:rounded-3xl">
                  <div className="flex h-55 w-40 shrink-0 items-center justify-center rounded-2xl bg-gray-200">
                    <BookOpen size={40} className="text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <div className="h-5 w-32 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
                    <div className="mt-auto pt-3">
                      <span className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gray-300 px-4 text-sm text-gray-400">
                        Fayl yo&apos;q
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Barchasini ko'rish card */}
            <div className="relative flex h-63 flex-col rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl">
              <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                Barchasini ko&apos;rish
              </h6>
              <img
                alt="Kutubxona"
                loading="lazy"
                width={292}
                height={218}
                className="absolute bottom-0"
                src="/images/ebooks_img6.png"
                style={{ color: "transparent" }}
              />
              <div className="flex h-full w-full items-end justify-end">
                <Link
                  href="/talabalarga/kutubxona"
                  className="mt-auto rounded-full border border-[#00575B] bg-transparent p-4 text-[#00575B] transition-colors hover:bg-[#00575B]/5"
                >
                  <ArrowIcon size={36} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>

      {/* ═══ Modals ═══ */}
      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Yangi iqtidorli talaba qo'shish"
        fields={STUDENT_FIELDS}
        initialData={{ is_active: true, sort_order: 0 }}
        onSubmit={handleCreate}
        isLoading={createStudent.isPending}
      />

      {editItem && editDetail && !isDetailLoading && (
        <EditModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title="Iqtidorli talabani tahrirlash"
          fields={STUDENT_FIELDS}
          initialData={{
            name: editDetail.name,
            description: editDetail.description,
            photo: editDetail.photo,
            sort_order: editDetail.sort_order,
            is_active: editDetail.is_active,
          }}
          onSubmit={handleUpdate}
          isLoading={updateStudent.isPending}
        />
      )}

      {editItem && isDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Talabani o'chirish"
        message="Bu talaba butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteStudent.isPending}
      />

      {/* ═══ Career Center Modals ═══ */}
      <EditModal
        isOpen={isCreateCareerOpen}
        onClose={() => setIsCreateCareerOpen(false)}
        title="Yangi karyera markazi ma'lumoti qo'shish"
        fields={CAREER_CENTER_FIELDS}
        initialData={{ is_active: true, sort_order: 0 }}
        onSubmit={handleCreateCareer}
        isLoading={createCareer.isPending}
      />

      {editCareer && editCareerDetail && !isCareerDetailLoading && (
        <EditModal
          isOpen={!!editCareer}
          onClose={() => setEditCareer(null)}
          title="Karyera markazi ma'lumotini tahrirlash"
          fields={CAREER_CENTER_FIELDS}
          initialData={{
            title: editCareerDetail.title,
            subtitle: editCareerDetail.subtitle,
            content: editCareerDetail.content,
            address: editCareerDetail.address,
            phone: editCareerDetail.phone,
            email: editCareerDetail.email,
            sort_order: editCareerDetail.sort_order,
            is_active: editCareerDetail.is_active,
          }}
          onSubmit={handleUpdateCareer}
          isLoading={updateCareer.isPending}
        />
      )}

      {editCareer && isCareerDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteCareerI !== null}
        onClose={() => setDeleteCareerId(null)}
        onConfirm={handleDeleteCareer}
        title="Karyera markazi ma'lumotini o'chirish"
        message="Bu ma'lumot butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteCareer.isPending}
      />

      {/* ═══ Gallery Modals ═══ */}
      <EditModal
        isOpen={isCreateGalleryOpen}
        onClose={() => setIsCreateGalleryOpen(false)}
        title="Yangi galereya rasmi qo'shish"
        fields={GALLERY_PHOTO_FIELDS}
        initialData={{ is_active: true, sort_order: 0 }}
        onSubmit={handleCreateGallery}
        isLoading={createGallery.isPending}
      />

      {editGalleryItem && editGalleryDetail && !isGalleryDetailLoading && (
        <EditModal
          isOpen={!!editGalleryItem}
          onClose={() => setEditGalleryItem(null)}
          title="Galereya rasmini tahrirlash"
          fields={GALLERY_PHOTO_FIELDS}
          initialData={{
            title: editGalleryDetail.title,
            photo: editGalleryDetail.photo,
            sort_order: editGalleryDetail.sort_order,
            is_active: editGalleryDetail.is_active,
          }}
          onSubmit={handleUpdateGallery}
          isLoading={updateGallery.isPending}
        />
      )}

      {editGalleryItem && isGalleryDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteGalleryId !== null}
        onClose={() => setDeleteGalleryId(null)}
        onConfirm={handleDeleteGallery}
        title="Galereya rasmini o'chirish"
        message="Bu rasm butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteGallery.isPending}
      />

      {/* ═══ Library Modals ═══ */}
      <EditModal
        isOpen={isCreateBookOpen}
        onClose={() => setIsCreateBookOpen(false)}
        title="Yangi kitob qo'shish"
        fields={LIBRARY_BOOK_FIELDS}
        initialData={{ is_published: true, sort_order: 0, category: categoriesData?.[0] || "" }}
        onSubmit={handleCreateBook}
        isLoading={createBook.isPending}
      />

      {editBook && editBookDetail && !isBookDetailLoading && (
        <EditModal
          isOpen={!!editBook}
          onClose={() => setEditBook(null)}
          title="Kitobni tahrirlash"
          fields={LIBRARY_BOOK_FIELDS}
          initialData={{
            title: editBookDetail.title,
            description: editBookDetail.description,
            category: editBookDetail.category,
            cover: editBookDetail.cover,
            document: editBookDetail.document,
            sort_order: editBookDetail.sort_order,
            is_published: editBookDetail.is_published,
          }}
          onSubmit={handleUpdateBook}
          isLoading={updateBook.isPending}
        />
      )}

      {editBook && isBookDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteBookId !== null}
        onClose={() => setDeleteBookId(null)}
        onConfirm={handleDeleteBook}
        title="Kitobni o'chirish"
        message="Bu kitob butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteBook.isPending}
      />
    </div>
  );
}
