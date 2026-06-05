"use client";

import { useState, useCallback } from "react";
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/useNews";
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
import { NEWS_CATEGORIES } from "@/lib/constants";

/* ═══════════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════════ */
interface NewsCrudAdminProps {
  title: string;
  subtitle?: string;
  category?: string;
}

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const NEWS_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "excerpt", label: "Qisqa matn", type: "textarea", translatable: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true, required: true },
  {
    name: "category", label: "Kategoriya", type: "select", required: true,
    options: NEWS_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
  },
  { name: "cover", label: "Muqova rasm", type: "media", accept: "image/*" },
  { name: "is_published", label: "Chop etish", type: "toggle" },
  { name: "published_at", label: "Sana", type: "date" },
];

/* ═══════════════════════════════════════════
   ISFT-style sub-components
   ═══════════════════════════════════════════ */

function GreenBadge({ label }: { label: string }) {
  return (
    <span className="isft-green-badge mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-extrabold uppercase text-white">
      {label}
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
      <h2 className={`font-serif font-semibold leading-tight text-gray-900 ${
        large
          ? "text-2xl md:text-[32px] lg:text-[40px]"
          : "text-2xl md:text-[32px] lg:text-[40px]"
      }`}>
        {day}
      </h2>
      <div className="inline-flex flex-col items-start justify-center gap-0.5">
        <span className="text-xs text-gray-500">{month}</span>
        <span className="text-xs text-gray-400">{year}</span>
      </div>
    </div>
  );
}

function ArrowButton({ onClick, size = 28 }: { onClick?: () => void; size?: number }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-teal-700 bg-transparent p-1.5 text-teal-700 transition-colors hover:bg-teal-700 hover:text-white"
    >
      <ArrowUpRight style={{ width: size, height: size }} />
    </button>
  );
}

function StatusChip({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
      published
        ? "bg-emerald-500/90 text-white"
        : "bg-amber-500/90 text-white"
    }`}>
      {published ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
      {published ? "Chop etilgan" : "Qoralama"}
    </span>
  );
}

function AdminOverlay({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-blue-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        title="Tahrirlash"
      >
        <Pencil className="size-4" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        title="O'chirish"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ISFT Pagination
   ═══════════════════════════════════════════ */
function IsftPagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (p: number) => void;
}) {
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
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
              p === currentPage
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ),
      )}
      {currentPage < lastPage && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function NewsCrudAdmin({ title, subtitle, category }: NewsCrudAdminProps) {
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<News | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useNews({
    page,
    per_page: 9,
    category: category || undefined,
  });

  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const handleCreate = useCallback(async (formData: FormData) => {
    if (category && !formData.has("category")) {
      formData.set("category", category);
    }
    await createNews.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [category, createNews, refetch]);

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
  const featured = items[0];
  const gridItems = items.slice(1);
  const badgeLabel = title.slice(0, -3) + "k"; // Yangiliklar → Yangilik, etc.
  const sidebarTitle = `So'ngi ${title.toLowerCase()}`;

  return (
    <section className="py-6">
      <Container>
        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
            <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="size-4" />} size="lg">
              Yangi qo&apos;shish
            </Button>
          </div>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Yangiliklar topilmadi"
            message="Hozircha yangilik qo'shilmagan"
            action={{ label: "Yangi qo'shish", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid items-start gap-6 md:grid-cols-3">
            {/* ═══ Left Column (2/3) ═══ */}
            <div className="flex size-full flex-col items-start gap-6 md:col-span-2">

              {/* ── Featured Card ── */}
              {featured && (
                <div className="isft-card group relative flex w-full flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
                  {/* Admin overlays */}
                  <AdminOverlay onEdit={() => setEditItem(featured)} onDelete={() => setDeleteId(featured.id)} />
                  <div className="absolute top-5 left-5 z-10">
                    <StatusChip published={featured.is_published} />
                  </div>

                  {/* Cover image — fixed height container */}
                  {featured.cover || featured.cover_thumbnail ? (
                    <div className="h-56 sm:h-72 lg:h-90 w-full overflow-hidden rounded-xl bg-gray-200">
                      <img
                        src={featured.cover || featured.cover_thumbnail}
                        alt={featured.title?.uz || ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 sm:h-72 lg:h-90 w-full items-center justify-center rounded-xl bg-gray-200">
                      <Newspaper className="size-12 text-gray-400" />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="flex w-full items-center gap-2 pb-0.5 pt-2">
                    <GreenBadge label={badgeLabel} />
                  </div>

                  {/* Title + excerpt */}
                  <div className="mt-2 text-left">
                    <h4 className="font-serif text-2xl font-semibold text-gray-900">
                      {featured.title?.uz || "Sarlavhasiz"}
                    </h4>
                    {featured.excerpt?.uz && (
                      <div className="mt-1 text-gray-500">
                        <p className="line-clamp-2 text-sm" style={{ textAlign: "justify" }}>
                          {featured.excerpt.uz}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Date + Batafsil */}
                  <div className="mt-2 flex w-full flex-col gap-4 md:flex-row lg:items-end lg:justify-between">
                    <IsftDate dateStr={featured.published_at || featured.created_at} large />
                    <div className="inline-flex gap-4">
                      <button
                        onClick={() => setEditItem(featured)}
                        className="flex h-10 items-center gap-1.5 rounded-full border border-teal-700 px-4 font-medium text-teal-700 transition-colors hover:bg-teal-700 hover:text-white"
                      >
                        <span>Batafsil</span>
                        <ArrowUpRight className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Grid Cards (2 cols) ── */}
              {gridItems.length > 0 && (
                <div className="grid w-full gap-6 lg:grid-cols-2">
                  {gridItems.map((item) => (
                    <div
                      key={item.id}
                      className="isft-card group relative flex flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl"
                    >
                      {/* Admin overlays */}
                      <AdminOverlay onEdit={() => setEditItem(item)} onDelete={() => setDeleteId(item.id)} />
                      <div className="absolute top-5 left-5 z-10">
                        <StatusChip published={item.is_published} />
                      </div>

                      {/* Cover — fixed height container */}
                      {item.cover || item.cover_thumbnail ? (
                        <div className="h-56 w-full overflow-hidden rounded-3xl bg-gray-200">
                          <img
                            src={item.cover || item.cover_thumbnail}
                            alt={item.title?.uz || ""}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center rounded-3xl bg-gray-200">
                          <Newspaper className="size-8 text-gray-400" />
                        </div>
                      )}

                      {/* Badge */}
                      <GreenBadge label={badgeLabel} />

                      {/* Title */}
                      <h6 className="font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-2 lg:text-lg">
                        {item.title?.uz || "Sarlavhasiz"}
                      </h6>

                      {/* Date + arrow */}
                      <div className="mt-auto flex w-full items-end justify-between gap-6">
                        <IsftDate dateStr={item.published_at || item.created_at} />
                        <ArrowButton onClick={() => setEditItem(item)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Pagination ── */}
              {meta && meta.last_page > 1 && (
                <IsftPagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  onPageChange={setPage}
                />
              )}
            </div>

            {/* ═══ Right Sidebar (1/3) ═══ */}
            <div className="space-y-6">
              <h4 className="font-serif text-2xl font-semibold text-gray-900">{sidebarTitle}</h4>

              {items.slice(0, 10).map((item) => (
                <div
                  key={`sidebar-${item.id}`}
                  className="isft-card group relative flex h-full flex-col items-start gap-2 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl"
                >
                  {/* Admin edit overlay (compact) */}
                  <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditItem(item); }}
                      className="flex size-7 items-center justify-center rounded-lg bg-white/90 text-blue-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      className="flex size-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>

                  {/* Badge */}
                  <GreenBadge label={badgeLabel} />

                  {/* Status */}
                  <StatusChip published={item.is_published} />

                  {/* Title */}
                  <h6 className="font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-2 lg:text-lg">
                    {item.title?.uz || "Sarlavhasiz"}
                  </h6>

                  {/* Date + arrow */}
                  <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                    <IsftDate dateStr={item.published_at || item.created_at} />
                    <ArrowButton onClick={() => setEditItem(item)} size={28} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Create Modal ── */}
        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi yangilik qo'shish"
          fields={NEWS_FIELDS}
          initialData={category ? { category, is_published: true } : { is_published: true }}
          onSubmit={handleCreate}
          isLoading={createNews.isPending}
        />

        {/* ── Edit Modal ── */}
        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Yangilikni tahrirlash"
            fields={NEWS_FIELDS}
            initialData={{
              title: editItem.title,
              excerpt: editItem.excerpt,
              content: editItem.content,
              category: editItem.category,
              is_published: editItem.is_published,
              published_at: editItem.published_at,
            }}
            onSubmit={handleUpdate}
            isLoading={updateNews.isPending}
          />
        )}

        {/* ── Delete Confirm ── */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Yangilikni o'chirish"
          message="Bu yangilik butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteNews.isPending}
        />
      </Container>
    </section>
  );
}
