"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNews, useNewsDetail, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/useNews";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import type { News } from "@/types";
import {
  Briefcase, ArrowUpRight, Plus, Pencil, Trash2,
  Eye, EyeOff, ChevronRight, Clock, MapPin,
} from "lucide-react";
// Category is auto-set to CATEGORY constant — no user selection needed

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const CATEGORY = "vakansiyalar";

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const VACANCY_FIELDS: FieldConfig[] = [
  { name: "title", label: "Lavozim nomi", type: "text", translatable: true, required: true },
  { name: "excerpt", label: "Qisqa tavsif", type: "textarea", translatable: true },
  { name: "content", label: "To'liq ma'lumot", type: "richtext", translatable: true, required: true },
  { name: "cover", label: "Muqova rasm", type: "media", accept: "image/*" },
  { name: "is_published", label: "Chop etish", type: "toggle" },
  { name: "published_at", label: "Sana", type: "date" },
];

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function StatusChip({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${published ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
      {published ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
      {published ? "Chop etilgan" : "Qoralama"}
    </span>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { day: "", month: "", year: "", full: "" };
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTHS_UZ[d.getMonth()];
  const year = d.getFullYear();
  return { day, month, year, full: `${day} ${month} ${year}` };
}

/* Arrow icon — same as frontend */
function ArrowIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={20} width={20}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function VacancyBadge() {
  return (
    <span className="mt-2 inline-block rounded-full bg-linear-to-r from-[#00575B] to-[#008C8C] px-2 py-1 text-xs font-extrabold uppercase text-white">
      Vakansiya
    </span>
  );
}

function IsftDate({ dateStr, large }: { dateStr?: string; large?: boolean }) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTHS_UZ[d.getMonth()];
  const year = d.getFullYear();
  return (
    <div className="flex items-center gap-x-2">
      <h2 className={`font-serif font-semibold leading-tight text-gray-900 ${large ? "text-2xl md:text-[32px] lg:text-[40px]" : "text-2xl md:text-[32px] lg:text-[40px]"}`}>
        {day}
      </h2>
      <div className="inline-flex flex-col items-start justify-center gap-0.5">
        <span className="text-xs text-gray-500">{month}</span>
        <span className="text-xs text-gray-400">{year}</span>
      </div>
    </div>
  );
}

function AdminOverlay({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-[#00575B] shadow-sm backdrop-blur-sm transition-colors hover:bg-white" title="Tahrirlash" aria-label="Tahrirlash">
        <Pencil className="size-4" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white" title="O'chirish" aria-label="O'chirish">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function ArrowBtn({ onClick, size = 28 }: { onClick?: () => void; size?: number }) {
  return (
    <button onClick={onClick} className="rounded-full border border-[#00575B] bg-transparent p-1.5 text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white">
      <ArrowUpRight style={{ width: size, height: size }} />
    </button>
  );
}

function IsftPagination({ currentPage, lastPage, onPageChange }: { currentPage: number; lastPage: number; onPageChange: (p: number) => void }) {
  const pages: (number | "...")[] = [];
  if (lastPage <= 5) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(lastPage - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < lastPage - 2) pages.push("...");
    pages.push(lastPage);
  }
  return (
    <div className="mt-8 flex justify-center gap-2">
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="flex items-center text-gray-400">...</span>
        ) : (
          <button key={p} type="button" onClick={() => onPageChange(p)} className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${p === currentPage ? "border-[#00575B] bg-[#00575B] text-white" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}>
            {p}
          </button>
        ),
      )}
      {currentPage < lastPage && (
        <button type="button" onClick={() => onPageChange(currentPage + 1)} className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50">
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function KaryeraMarkaziAdmin() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<News | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useNews({ page, per_page: 9, category: CATEGORY });
  const { data: editDetail, isLoading: isDetailLoading } = useNewsDetail(editItem?.id ?? 0);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const handleCreate = useCallback(async (formData: FormData) => {
    formData.set("category", CATEGORY);
    await createNews.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [createNews, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    formData.set("category", CATEGORY);
    await updateNews.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetch();
  }, [editItem, updateNews, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteNews.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteNews, refetch]);

  const items = data?.data || [];
  const meta = data?.meta;
  const featured = items[0];
  const gridItems = items.slice(1);
  const sidebarItems = items.slice(0, 10);

  return (
    <section className="py-6">
      <Container>
        {/* ── Admin Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Karyera markazi</h1>
            <p className="mt-1 text-sm text-gray-500">Ish topish va karyera rivojlantirish markazi</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="size-4" />} size="lg">
            Yangi vakansiya
          </Button>
        </div>

        {/* ═══════════ Hero Section — frontend bilan bir xil ═══════════ */}
        <div className="grid gap-6 lg:row-span-1 lg:grid-cols-3">
          {/* Left — Hero Banner */}
          <div className="flex flex-col lg:col-span-2">
            <div className="shine rounded-2xl p-4 md:p-6 lg:rounded-3xl flex grow flex-col bg-[url('/images/career-hero.svg')] bg-cover bg-no-repeat text-white lg:p-11!">
              <h2 className="font-serif text-2xl font-semibold capitalize leading-tight md:text-[32px] lg:text-[40px]">
                TdTUTF Karyera Markazi
              </h2>
              <div className="mt-4">
                <p>
                  Institutning karyera markazi — bu talabalar va bitiruvchilarni kasbiy o&apos;sish va ishga
                  joylashtirish masalalarida qo&apos;llab-quvvatlash bilan shug&apos;ullanadigan ixtisoslashgan
                  bo&apos;linma. Uning maqsadi o&apos;quvchilarga mehnat bozorida o&apos;z o&apos;rnini
                  topishga yordam berish, muvaffaqiyatli karyera boshlash uchun zarur bo&apos;lgan bilim va
                  vositalarni berishdir.
                </p>
                <p className="mt-3">
                  Shuningdek, Karyera markazi karyerani rejalashtirish, ishga joylashish va stajirovka
                  o&apos;tash, rezyume va kuzatuv xatlarini tayyorlashda maslahatlar beradi, treninglar
                  va mahorat darslari tashkil etadi.
                </p>
              </div>
            </div>

            {/* Stat cards — frontend bilan bir xil */}
            <div className="mt-4 flex w-full flex-col gap-4 sm:mt-6 sm:gap-6 lg:flex-row">
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex-1 bg-gray-100">
                <h2 className="font-serif text-xl font-semibold leading-tight text-[#7B1A3F] sm:text-2xl md:text-[32px] lg:text-[40px]">
                  +150/250
                </h2>
                <h5 className="mt-2 font-serif text-lg font-semibold sm:mt-3.5 sm:text-xl">
                  Talaba ish bilan ta&apos;minlandi
                </h5>
                <div className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                  <p>TdTUTF instituti ishga tushgandan buyon talaba o&apos;z ishini topdi</p>
                </div>
              </div>
              <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex-1 bg-gray-100">
                <h2 className="font-serif text-xl font-semibold leading-tight text-[#7B1A3F] sm:text-2xl md:text-[32px] lg:text-[40px]">
                  85
                </h2>
                <h5 className="mt-2 font-serif text-lg font-semibold sm:mt-3.5 sm:text-xl">
                  Jami ish o&apos;rinlari e&apos;lon qilindi
                </h5>
                <div className="mt-1.5 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                  <p>TdTUTF instituti ishga tushgandan buyon jami ish o&apos;rinlari sayt va sotsial tarmoqlarimizda e&apos;lon qilindi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Latest Vacancies Sidebar */}
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl space-y-3 bg-gray-100 sm:space-y-4 lg:col-span-1">
            <h4 className="font-serif text-xl font-semibold sm:text-2xl">
              Yangi bo&apos;sh ish o&apos;rinlari
            </h4>

            {isLoading ? (
              <LoadingSpinner size="sm" text="Yuklanmoqda..." className="py-8" />
            ) : error ? (
              <ErrorState onRetry={() => refetch()} />
            ) : items.length > 0 ? (
              <div className="space-y-3">
                {items.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditItem(item)}
                    className="group flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left transition-all hover:shadow-sm md:p-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00575B]/10 text-[#00575B]">
                      <Briefcase className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h6 className="text-sm font-semibold text-gray-900 group-hover:text-[#00575B] line-clamp-1">
                          {item.title?.uz || "Sarlavhasiz"}
                        </h6>
                        <StatusChip published={item.is_published} />
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400">
                        <IsftDate dateStr={item.published_at || item.created_at} />
                      </div>
                    </div>
                    <ArrowIcon />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-white p-4">
                  <Briefcase className="size-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Hozircha bo&apos;sh ish o&apos;rinlari mavjud emas</p>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════ Vacancy CRUD Section (ISFT style) ═══════════ */}
        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="font-serif text-xl font-semibold text-gray-900 sm:text-2xl lg:text-[32px]">
              Barcha bo&apos;sh ish o&apos;rinlari
            </h3>
            <Button onClick={() => setIsCreateOpen(true)} variant="secondary" icon={<Plus className="size-4" />}>
              Qo&apos;shish
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
          ) : error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : items.length === 0 ? (
            <EmptyState title="Vakansiyalar topilmadi" message="Hozircha vakansiya qo'shilmagan" action={{ label: "Yangi vakansiya qo'shish", onClick: () => setIsCreateOpen(true) }} />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-3">
              {/* Left Column (2/3) */}
              <div className="flex w-full flex-col items-start gap-6 lg:col-span-2">
                {/* Featured Card */}
                {featured && (
                  <div className="news-card-shadow group relative flex w-full flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                    <AdminOverlay onEdit={() => setEditItem(featured)} onDelete={() => setDeleteId(featured.id)} />
                    <div className="absolute top-5 left-5 z-10"><StatusChip published={featured.is_published} /></div>

                    {(featured.cover || featured.cover_thumbnail) ? (
                      <div className="w-full aspect-video overflow-hidden rounded-3xl bg-gray-200">
                        <img src={featured.cover || featured.cover_thumbnail} alt={featured.title?.uz || ""} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex w-full items-center justify-center rounded-3xl bg-linear-to-br from-[#00575B]/10 to-[#008C8C]/10 aspect-video">
                        <Briefcase className="size-16 text-[#00575B]/30" />
                      </div>
                    )}

                    <div className="flex w-full items-center gap-2 pb-0.5 pt-2">
                      <VacancyBadge />
                      <div className="ml-auto flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="size-3.5" /> Termiz
                      </div>
                    </div>

                    <div className="mt-2 text-left">
                      <h4 className="font-serif text-2xl font-semibold text-gray-900">{featured.title?.uz || "Sarlavhasiz"}</h4>
                      {featured.excerpt?.uz && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2" style={{ textAlign: "justify" }}>{featured.excerpt.uz}</p>
                      )}
                    </div>

                    <div className="mt-2 flex w-full flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <IsftDate dateStr={featured.published_at || featured.created_at} large />
                      <div className="flex w-full gap-2 sm:ml-auto sm:w-auto sm:gap-4">
                        <button onClick={() => setEditItem(featured)} className="h-9 flex-1 rounded-full border border-[#00575B] px-4 text-xs font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white sm:h-10 sm:flex-initial sm:px-5 sm:text-sm">
                          Tahrirlash
                        </button>
                        <button onClick={() => setEditItem(featured)} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#00575B] px-3 text-xs font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white sm:h-10 sm:flex-initial sm:px-4 sm:text-sm">
                          <span>Batafsil</span>
                          <ArrowUpRight className="size-4 sm:size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Cards */}
                {gridItems.length > 0 && (
                  <div className="grid w-full gap-4 sm:gap-6 sm:grid-cols-2">
                    {gridItems.map((item) => (
                      <div key={item.id} className="news-card-shadow group relative flex flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                        <AdminOverlay onEdit={() => setEditItem(item)} onDelete={() => setDeleteId(item.id)} />
                        <div className="absolute top-5 left-5 z-10"><StatusChip published={item.is_published} /></div>

                        {(item.cover || item.cover_thumbnail) ? (
                          <img src={item.cover || item.cover_thumbnail} alt={item.title?.uz || ""} className="h-56 w-full rounded-3xl object-cover" />
                        ) : (
                          <div className="flex h-56 w-full items-center justify-center rounded-3xl bg-linear-to-br from-[#00575B]/10 to-[#008C8C]/10">
                            <Briefcase className="size-10 text-[#00575B]/30" />
                          </div>
                        )}

                        <VacancyBadge />
                        <h6 className="font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-2 lg:text-lg">
                          {item.title?.uz || "Sarlavhasiz"}
                        </h6>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><MapPin className="size-3" /> Termiz</span>
                          <span className="flex items-center gap-1"><Clock className="size-3" /> To&apos;liq stavka</span>
                        </div>
                        <div className="mt-auto flex w-full items-end justify-between gap-6">
                          <IsftDate dateStr={item.published_at || item.created_at} />
                          <ArrowBtn onClick={() => setEditItem(item)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {meta && meta.last_page > 1 && <IsftPagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}
              </div>

              {/* Right Sidebar (1/3) */}
              <div className="space-y-4 sm:space-y-6">
                <h4 className="font-serif text-xl font-semibold text-gray-900 sm:text-2xl">So&apos;ngi vakansiyalar</h4>
                {sidebarItems.map((item) => (
                  <div key={`sb-${item.id}`} className="news-card-shadow group relative flex flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                    <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={(e) => { e.stopPropagation(); setEditItem(item); }} className="flex size-7 items-center justify-center rounded-lg bg-white/90 text-[#00575B] shadow-sm backdrop-blur-sm transition-colors hover:bg-white"><Pencil className="size-3" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }} className="flex size-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"><Trash2 className="size-3" /></button>
                    </div>
                    <VacancyBadge />
                    <StatusChip published={item.is_published} />
                    <h6 className="font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-2 lg:text-lg">
                      {item.title?.uz || "Sarlavhasiz"}
                    </h6>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="size-3" /><span>Termiz</span>
                    </div>
                    <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                      <IsftDate dateStr={item.published_at || item.created_at} />
                      <ArrowBtn onClick={() => setEditItem(item)} size={28} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <EditModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Yangi vakansiya qo'shish" fields={VACANCY_FIELDS} initialData={{ is_published: true }} onSubmit={handleCreate} isLoading={createNews.isPending} />
        {editItem && editDetail && !isDetailLoading && (
          <EditModal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Vakansiyani tahrirlash" fields={VACANCY_FIELDS}
            initialData={{ title: editDetail.title, excerpt: editDetail.excerpt, content: editDetail.content, cover: editDetail.cover || editDetail.cover_thumbnail, is_published: editDetail.is_published, published_at: editDetail.published_at }}
            onSubmit={handleUpdate} isLoading={updateNews.isPending} />
        )}
        {editItem && isDetailLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
          </div>
        )}
        <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Vakansiyani o'chirish" message="Bu vakansiya butunlay o'chiriladi. Davom etasizmi?" isLoading={deleteNews.isPending} />
      </Container>
    </section>
  );
}
