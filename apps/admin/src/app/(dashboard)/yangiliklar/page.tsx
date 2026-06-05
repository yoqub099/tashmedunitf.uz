"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
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
  Plus, Pencil, Trash2, ArrowUpRight,
  Newspaper, Eye, EyeOff, ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const CATEGORY = "yangiliklar";
const TITLE = "Yangiliklar";
const BADGE_LABEL = "Yangilik";
const SIDEBAR_TITLE = "So'ngi yangiliklar";

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const NEWS_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "excerpt", label: "Qisqa matn", type: "textarea", translatable: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true, required: true },
  { name: "category", label: "Kategoriya", type: "hidden" },
  { name: "cover", label: "Muqova rasm", type: "media", accept: "image/*" },
  { name: "is_published", label: "Chop etish", type: "toggle" },
  { name: "published_at", label: "Sana", type: "date" },
];

/* ═══════════════════════════════════════════
   ISFT Sub-components
   ═══════════════════════════════════════════ */
function GreenBadge() {
  return (
    <span className="isft-green-badge mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-extrabold uppercase text-white">
      {BADGE_LABEL}
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

function ArrowBtn({ href, size = 28 }: { href: string; size?: number }) {
  return (
    <Link href={href} className="inline-flex rounded-full border border-green-600 bg-transparent p-1.5 text-green-600 transition-colors hover:bg-green-600 hover:text-white">
      <ArrowUpRight style={{ width: size, height: size }} />
    </Link>
  );
}

function StatusChip({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${published ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
      {published ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
      {published ? "Chop etilgan" : "Qoralama"}
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
          <button key={p} type="button" onClick={() => onPageChange(p)} className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${p === currentPage ? "border-green-600 bg-green-600 text-white" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}>
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
   Page Component
   ═══════════════════════════════════════════ */
export default function YangiliklarPage() {
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<News | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useNews({ page, per_page: 8, category: CATEGORY });
  const { data: latestData } = useNews({ page: 1, per_page: 10, category: CATEGORY });
  const { data: editDetail, isLoading: isDetailLoading } = useNewsDetail(editItem?.id ?? 0);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const handleCreate = useCallback(async (formData: FormData) => {
    if (!formData.has("category")) formData.set("category", CATEGORY);
    await createNews.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [createNews, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
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
  const latestItems = latestData?.data || [];
  const featured = items[0];
  const gridItems = items.slice(1);

  return (
    <section className="py-6">
      <Container>
        {/* ── Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">{TITLE}</h1>
            <p className="mt-1 text-sm text-gray-500">Barcha yangiliklar va e&apos;lonlarni boshqaring</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="size-4" />} size="lg">
            Yangi qo&apos;shish
          </Button>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState title="Yangiliklar topilmadi" message="Hozircha yangilik qo'shilmagan" action={{ label: "Yangi qo'shish", onClick: () => setIsCreateOpen(true) }} />
        ) : (
          <>
          <div className="grid items-start gap-6 md:grid-cols-3">
            {/* ── Left Column (2/3) ── */}
            <div className="flex w-full flex-col items-start gap-6 md:col-span-2">
              {/* Featured Card */}
              {featured && (
                <div className="news-card-shadow group relative flex w-full flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                  <AdminOverlay onEdit={() => setEditItem(featured)} onDelete={() => setDeleteId(featured.id)} />
                  <div className="absolute top-5 left-5 z-10"><StatusChip published={featured.is_published} /></div>

                  {(featured.cover || featured.cover_thumbnail) ? (
                    <img
                      src={featured.cover || featured.cover_thumbnail}
                      alt={featured.title?.uz || ""}
                      className="w-full rounded-xl"
                      style={{ color: "transparent" }}
                    />
                  ) : (
                    <div className="flex w-full items-center justify-center rounded-xl bg-gray-200" style={{ minHeight: 200 }}>
                      <Newspaper className="size-12 text-gray-400" />
                    </div>
                  )}

                  <div className="flex w-full items-center gap-2 pb-0.5 pt-2"><GreenBadge /></div>

                  <div className="mt-2 text-left">
                    <h4 className="font-serif text-2xl font-semibold text-gray-900">{featured.title?.uz || "Sarlavhasiz"}</h4>
                    {featured.excerpt?.uz && (
                      <div className="text-gray-500 text-container mt-1">
                        <p style={{ textAlign: "justify" }}>{featured.excerpt.uz}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-4 md:flex-row lg:items-end lg:justify-between">
                    <IsftDate dateStr={featured.published_at || featured.created_at} large />
                    <div className="inline-flex gap-4">
                      <Link href={`/yangiliklar/${featured.id}`} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-green-600 px-4 text-sm font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white">
                        <span>Batafsil</span><ArrowUpRight className="size-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of cards */}
              {gridItems.length > 0 && (
                <div className="grid w-full gap-6 lg:grid-cols-2">
                  {gridItems.map((item) => (
                    <div key={item.id} className="news-card-shadow group relative flex flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                      <AdminOverlay onEdit={() => setEditItem(item)} onDelete={() => setDeleteId(item.id)} />
                      <div className="absolute top-5 left-5 z-10"><StatusChip published={item.is_published} /></div>

                      {(item.cover || item.cover_thumbnail) ? (
                        <img
                          src={item.cover || item.cover_thumbnail}
                          alt={item.title?.uz || ""}
                          className="h-56 w-full rounded-3xl object-cover"
                        />
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center rounded-3xl bg-gray-200">
                          <Newspaper className="size-8 text-gray-400" />
                        </div>
                      )}
                      <GreenBadge />
                      <h6 className="font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-2 lg:text-lg">{item.title?.uz || "Sarlavhasiz"}</h6>
                      <div className="mt-auto flex w-full items-end justify-between gap-6">
                        <IsftDate dateStr={item.published_at || item.created_at} />
                        <ArrowBtn href={`/yangiliklar/${item.id}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta && meta.last_page > 1 && <IsftPagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}
            </div>

            {/* ── Right Sidebar (1/3) ── */}
            <div className="space-y-6">
              <h4 className="font-serif text-2xl font-semibold text-gray-900">{SIDEBAR_TITLE}</h4>
              {latestItems.map((item) => (
                <div key={`sb-${item.id}`} className="news-card-shadow group relative flex h-full flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                  <GreenBadge />
                  <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg line-clamp-2 text-left text-gray-900">
                    {item.title?.uz || "Sarlavhasiz"}
                  </h6>
                  <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                    <IsftDate dateStr={item.published_at || item.created_at} />
                    <ArrowBtn href={`/yangiliklar/${item.id}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>

        )}

        {/* Modals */}
        <EditModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Yangi yangilik qo'shish" fields={NEWS_FIELDS} initialData={{ category: CATEGORY, is_published: true }} onSubmit={handleCreate} isLoading={createNews.isPending} />
        {editItem && editDetail && !isDetailLoading && (
          <EditModal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Yangilikni tahrirlash" fields={NEWS_FIELDS}
            initialData={{ title: editDetail.title, excerpt: editDetail.excerpt, content: editDetail.content, category: editDetail.category, cover: editDetail.cover || editDetail.cover_thumbnail, is_published: editDetail.is_published, published_at: editDetail.published_at }}
            onSubmit={handleUpdate} isLoading={updateNews.isPending} />
        )}
        {editItem && isDetailLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
          </div>
        )}
        <ConfirmDialog isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Yangilikni o'chirish" message="Bu yangilik butunlay o'chiriladi. Davom etasizmi?" isLoading={deleteNews.isPending} />
      </Container>
    </section>
  );
}
