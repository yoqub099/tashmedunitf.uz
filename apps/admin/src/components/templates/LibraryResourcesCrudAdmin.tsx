"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  useLibraryResources,
  useCreateLibraryResource,
  useUpdateLibraryResource,
  useDeleteLibraryResource,
} from "@/hooks/useLibraryResources";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import SearchInput from "@/components/shared/SearchInput";
import type { FieldConfig } from "@/types/inline-edit";
import type { LibraryResource } from "@/types";
import { Plus, BookOpen, ExternalLink, FileText, Filter } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "e-library", label: "E-Library" },
  { value: "emerald", label: "Emerald" },
  { value: "ichki-kutubxona", label: "Ichki kutubxona" },
];

const TYPE_OPTIONS = [
  { value: "kitob", label: "Kitob" },
  { value: "jurnal", label: "Jurnal" },
  { value: "maqola", label: "Maqola" },
  { value: "dissertatsiya", label: "Dissertatsiya" },
  { value: "darslik", label: "Darslik" },
  { value: "monografiya", label: "Monografiya" },
];

const LIBRARY_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "description", label: "Qisqa tavsif", type: "textarea", translatable: true },
  { name: "content", label: "Batafsil mazmun", type: "richtext", translatable: true },
  { name: "category", label: "Kategoriya", type: "select", required: true, options: CATEGORY_OPTIONS, halfWidth: true },
  { name: "type", label: "Turi", type: "select", options: [{ value: "", label: "—" }, ...TYPE_OPTIONS], halfWidth: true },
  { name: "url", label: "Tashqi havola (URL)", type: "text", placeholder: "https://..." },
  { name: "cover", label: "Muqova rasmi", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "document", label: "Hujjat (PDF)", type: "media", accept: "application/pdf", maxSize: 51200 },
  { name: "published_at", label: "Chop etilgan sana", type: "date", halfWidth: true },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_published", label: "Chop etish", type: "toggle" },
];

const CATEGORY_LABEL: Record<string, string> = {
  "e-library": "E-Library",
  "emerald": "Emerald",
  "ichki-kutubxona": "Ichki",
};

export default function LibraryResourcesCrudAdmin() {
  const [editItem, setEditItem] = useState<LibraryResource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, isLoading, error, refetch } = useLibraryResources({
    page,
    per_page: 12,
    ...(selectedCategory && { "filter[category]": selectedCategory }),
  });
  const createResource = useCreateLibraryResource();
  const updateResource = useUpdateLibraryResource();
  const deleteResource = useDeleteLibraryResource();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createResource.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createResource, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateResource.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateResource, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteResource.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteResource, refetch]);

  const items: LibraryResource[] = data?.data || [];
  const total = data?.meta?.total || 0;
  const lastPage = data?.meta?.last_page || 1;

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        (item.title?.uz || "").toLowerCase().includes(q) ||
        (item.slug || "").toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Kutubxona resurslari"
          subtitle="Kitoblar, jurnallar, maqolalar va e-resurslar boshqaruvi"
        />

        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="default">Jami: {total}</Badge>
              {selectedCategory && (
                <Badge variant="success">{CATEGORY_LABEL[selectedCategory] || selectedCategory}</Badge>
              )}
            </div>
            <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Yangi resurs
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Sarlavha yoki slug bo'yicha qidirish..."
              className="flex-1"
            />
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Hamma kategoriyalar</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Resurslar topilmadi"
            message={total === 0 ? "Hozircha kutubxona resursi qo'shilmagan." : "Filter bo'yicha hech narsa topilmadi."}
            icon={<BookOpen className="w-8 h-8 text-gray-400" />}
            action={total === 0 ? { label: "Birinchi resurs", onClick: () => setIsCreateOpen(true) } : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <EditableWrapper
                  key={item.id}
                  entityType="library-resource"
                  entityId={item.id}
                  onEdit={() => setEditItem(item)}
                  onDelete={() => setDeleteId(item.id)}
                  label={`Resurs #${index + 1}`}
                >
                  <Card padding={false}>
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
                      {(item.cover || item.cover_thumbnail) ? (
                        <Image
                          src={item.cover_thumbnail || item.cover || ""}
                          alt={item.title?.uz || "Resurs"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-emerald-300" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge variant="default" size="sm">{CATEGORY_LABEL[item.category] || item.category}</Badge>
                        {!item.is_published && <Badge variant="warning" size="sm">Qoralama</Badge>}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1" title={item.title?.uz}>
                        {item.title?.uz || "Sarlavhasiz"}
                      </h3>
                      {item.type && <p className="text-xs text-gray-500 capitalize">{item.type}</p>}
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        {item.document && (
                          <span className="inline-flex items-center gap-0.5 text-blue-600">
                            <FileText className="w-3 h-3" /> PDF
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Link
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </EditableWrapper>
              ))}
            </div>

            {lastPage > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  lastPage={lastPage}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi kutubxona resursi"
          fields={LIBRARY_FIELDS}
          initialData={{ is_published: true, sort_order: items.length + 1, category: "ichki-kutubxona" }}
          onSubmit={handleCreate}
          isLoading={createResource.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Resursni tahrirlash"
            fields={LIBRARY_FIELDS}
            initialData={{
              title: editItem.title,
              description: editItem.description,
              content: editItem.content,
              category: editItem.category,
              type: editItem.type,
              url: editItem.url,
              cover: editItem.cover,
              document: editItem.document,
              published_at: editItem.published_at?.split("T")[0],
              sort_order: editItem.sort_order,
              is_published: editItem.is_published,
            }}
            onSubmit={handleUpdate}
            isLoading={updateResource.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Resursni o'chirish"
          message="Bu kutubxona resursi butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteResource.isPending}
        />
      </Container>
    </section>
  );
}
