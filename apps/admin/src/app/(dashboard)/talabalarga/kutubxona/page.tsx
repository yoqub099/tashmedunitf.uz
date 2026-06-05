"use client";

import { useState, useCallback, useMemo } from "react";
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
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import type { LibraryResource } from "@/types";
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  ChevronRight, Search, ExternalLink, FolderPlus, X,
} from "lucide-react";
import toast from "react-hot-toast";

/** Convert a slug like "badiiy-adabiyotlar" to "Badiiy adabiyotlar" */
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function StatusChip({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        published
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {published ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
      {published ? "Chop etilgan" : "Qoralama"}
    </span>
  );
}

function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (p: number) => void;
}) {
  if (lastPage <= 1) return null;
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
          <span key={`dots-${i}`} className="flex items-center text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex size-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
              p === currentPage
                ? "border-[#00575B] bg-[#00575B] text-white"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
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

export default function KutubxonaPage() {
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editItem, setEditItem] = useState<LibraryResource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [tempCategories, setTempCategories] = useState<string[]>([]);

  const { data: categoriesData } = useLibraryCategories();

  /** All categories = DB categories + temporarily added ones */
  const allCategories = useMemo(() => {
    return [...new Set([...(categoriesData ?? []), ...tempCategories])];
  }, [categoriesData, tempCategories]);

  const CATEGORIES = useMemo(() => {
    const cats = allCategories.map((slug) => ({
      value: slug,
      label: slugToLabel(slug),
    }));
    return [{ value: "", label: "Barcha kitoblar" }, ...cats];
  }, [allCategories]);

  const FIELDS: FieldConfig[] = useMemo(() => [
    { name: "title", label: "Kitob nomi", type: "text", translatable: true, required: true, placeholder: "Kitob nomini kiriting" },
    { name: "description", label: "Muallif / Tavsif", type: "text", translatable: true, placeholder: "Muallif yoki qisqacha tavsif" },
    { name: "content", label: "Batafsil matn (HTML)", type: "richtext", translatable: true, placeholder: "Kitobning to'liq tafsilotlari..." },
    { name: "category", label: "Kategoriya", type: "select", required: true, options: allCategories.map((slug) => ({ value: slug, label: slugToLabel(slug) })) },
    { name: "cover", label: "Muqova rasmi", type: "media", accept: "image/*", maxSize: 5120 },
    { name: "document", label: "Fayl (PDF)", type: "media", accept: ".pdf,.doc,.docx,.epub", maxSize: 51200 },
    { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true, placeholder: "0" },
    { name: "published_at", label: "Nashr sanasi", type: "date", halfWidth: true },
    { name: "is_published", label: "Faol", type: "toggle", halfWidth: true },
  ], [allCategories]);

  const { data, isLoading, error, refetch } = useLibraryResources({
    page,
    per_page: 12,
    category: activeCategory || undefined,
    search: searchQuery || undefined,
  });
  const { data: editDetail, isLoading: isDetailLoading } =
    useLibraryResourceDetail(editItem?.id ?? 0);
  const createMutation = useCreateLibraryResource();
  const updateMutation = useUpdateLibraryResource();
  const deleteMutation = useDeleteLibraryResource();

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  /** Convert label to slug: "Kompyuter Fanlari" → "kompyuter-fanlari", handles o' and g' */
  const labelToSlug = (label: string) =>
    label
      .trim()
      .toLowerCase()
      .replace(/[''`]/g, "")  // Remove apostrophes (o'zbek: o', g')
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric except spaces and hyphens
      .replace(/\s+/g, "-")  // Spaces to hyphens
      .replace(/-+/g, "-")   // Multiple hyphens to single
      .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens

  const handleAddCategory = () => {
    const slug = labelToSlug(newCategoryInput);
    if (!slug) return;
    // Check if category already exists
    if (allCategories.includes(slug)) {
      toast.error(`"${slugToLabel(slug)}" kategoriyasi allaqachon mavjud`);
      return;
    }
    setTempCategories((prev) => [...new Set([...prev, slug])]);
    setNewCategoryInput("");
    setIsCategoryDialogOpen(false);
    toast.success(`"${slugToLabel(slug)}" kategoriyasi qo'shildi`);
    // Open book creation with new category pre-selected
    setActiveCategory(slug);
    setIsCreateOpen(true);
  };

  const handleCreate = useCallback(
    async (formData: FormData) => {
      if (!formData.has("category") || !formData.get("category")) {
        const firstCat = categoriesData?.[0] || "badiiy-adabiyotlar";
        formData.set("category", activeCategory || firstCat);
      }
      await createMutation.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createMutation, refetch, activeCategory, categoriesData]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateMutation.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateMutation, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteMutation, refetch]);

  const items = data?.data || [];
  const meta = data?.meta;

  return (
    <Container className="py-6">
      {/* Header with Add button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Kutubxona</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kutubxona resurslarini boshqarish
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCategoryDialogOpen(true)}
            icon={<FolderPlus className="size-4" />}
            size="lg"
            variant="secondary"
          >
            Yangi kategoriya
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            icon={<Plus className="size-4" />}
            size="lg"
          >
            Yangi kitob qo&apos;shish
          </Button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-[#00575B] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-4 inline-flex w-full items-center gap-2 rounded-full bg-gray-100 p-2 lg:max-w-3xl"
        >
          <input
            placeholder="Kitob nomini kiriting"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-14 w-full rounded-full bg-white px-4 py-2.5 focus:outline-none"
            type="text"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-[#00575B] px-4 font-medium text-white transition-colors hover:bg-[#004548] lg:h-14"
          >
            <Search className="size-6" />
            <span>Qidirish</span>
          </button>
        </form>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <div className="w-full mt-8">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <svg
                className="size-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Kitoblar topilmadi
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? `"${searchQuery}" bo'yicha natija topilmadi`
                : "Hozircha kitob qo'shilmagan"}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00575B] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#004548]"
            >
              <Plus className="size-4" />
              Yangi kitob qo&apos;shish
            </button>
          </div>
        ) : (
          <>
            {/* Books Grid — ISFT style */}
            <div className="mt-6 grid w-full gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl p-4! md:p-6 lg:rounded-3xl flex h-64 w-full gap-4 bg-gray-100 relative overflow-hidden"
                >
                  {/* Admin overlay */}
                  <div className="absolute top-3 left-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setEditItem(item)}
                      className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-blue-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                      title="Tahrirlash"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                      title="O'chirish"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  {/* Status chip */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <StatusChip published={item.is_published} />
                  </div>

                  {/* Cover image */}
                  {item.cover || item.cover_thumbnail ? (
                    <img
                      src={item.cover_thumbnail || item.cover}
                      alt={item.title?.uz || ""}
                      className="h-full w-full min-w-40 max-w-40 rounded-2xl object-cover object-top-left"
                    />
                  ) : (
                    <div className="flex h-full min-w-40 max-w-40 items-center justify-center rounded-2xl bg-gray-200">
                      <svg
                        className="size-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex flex-col">
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                      {item.title?.uz || "Sarlavhasiz"}
                    </h6>
                    {item.description?.uz && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {item.description.uz}
                      </p>
                    )}

                    {/* Download / Link button */}
                    <div className="mt-auto flex items-center gap-2">
                      {item.document ? (
                        <a
                          href={item.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#00575B] px-1 text-[#00575B] sm:px-2 lg:px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Yuklab olish</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15.5578 11.1104L12.0004 14.6678L8.44287 11.1104" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.0002 3.99707L12.0002 14.6685" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.0032 16.4463C20.0032 18.411 18.4105 20.0038 16.4458 20.0038H7.55406C5.58932 20.0038 3.99658 18.411 3.99658 16.4463" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      ) : item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#00575B] px-1 text-[#00575B] sm:px-2 lg:px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Ochish</span>
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* TdTUTF badge ribbon */}
                  <div className="absolute -right-6.25 top-2.5 rotate-45">
                    <div className="select-none font-bold flex items-center justify-center gap-2 bg-[#00575B] px-8 py-0.5 text-xs text-white">
                      TdTUTF
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Yangi kitob qo'shish"
        fields={FIELDS}
        initialData={{
          category: activeCategory || categoriesData?.[0] || "",
          is_published: true,
          sort_order: 0,
        }}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {editItem && editDetail && !isDetailLoading && (
        <EditModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title="Kitobni tahrirlash"
          fields={FIELDS}
          initialData={{
            title: editDetail.title,
            description: editDetail.description,
            category: editDetail.category,
            cover: editDetail.cover || editDetail.cover_thumbnail,
            document: editDetail.document,
            sort_order: editDetail.sort_order,
            is_published: editDetail.is_published,
          }}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
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
        title="Resursni o'chirish"
        message="Bu resurs butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteMutation.isPending}
      />

      {/* Category add dialog */}
      {isCategoryDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Yangi kategoriya qo&apos;shish
              </h3>
              <button
                onClick={() => {
                  setIsCategoryDialogOpen(false);
                  setNewCategoryInput("");
                }}
                className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Kategoriya nomini kiriting. Keyin shu kategoriyaga kitob qo&apos;shish oynasi ochiladi.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory();
              }}
            >
              <input
                autoFocus
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="Masalan: Informatika"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#00575B] focus:outline-none focus:ring-1 focus:ring-[#00575B]"
              />
              {newCategoryInput.trim() && (
                <p className="mt-2 text-xs text-gray-400">
                  Slug: <span className="font-mono text-gray-600">{labelToSlug(newCategoryInput)}</span>
                </p>
              )}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryDialogOpen(false);
                    setNewCategoryInput("");
                  }}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryInput.trim()}
                  className="rounded-xl bg-[#00575B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#004548] disabled:opacity-50"
                >
                  Qo&apos;shish va kitob yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}
