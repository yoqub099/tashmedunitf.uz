"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  useJournalIssues,
  useCreateJournalIssue,
  useUpdateJournalIssue,
  useDeleteJournalIssue,
} from "@/hooks/useJournalIssues";
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
import type { FieldConfig } from "@/types/inline-edit";
import type { JournalIssue } from "@/types";
import { Plus, BookOpenCheck, FileText, Calendar } from "lucide-react";

const JOURNAL_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "description", label: "Tavsif", type: "textarea", translatable: true },
  { name: "year", label: "Yili", type: "number", required: true, halfWidth: true },
  { name: "issue_number", label: "Son raqami", type: "number", required: true, halfWidth: true },
  { name: "date", label: "Chop etilgan sanasi", type: "date", required: true },
  { name: "cover", label: "Muqova rasmi", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "file", label: "Jurnal PDF fayli", type: "media", accept: "application/pdf", maxSize: 102400 },
  { name: "is_current", label: "Joriy son", type: "toggle", halfWidth: true },
  { name: "is_published", label: "Chop etish", type: "toggle", halfWidth: true },
  { name: "sort_order", label: "Tartib", type: "number" },
];

export default function JournalIssuesCrudAdmin() {
  const [editItem, setEditItem] = useState<JournalIssue | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useJournalIssues({ page, per_page: 12 });
  const createIssue = useCreateJournalIssue();
  const updateIssue = useUpdateJournalIssue();
  const deleteIssue = useDeleteJournalIssue();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createIssue.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createIssue, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateIssue.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateIssue, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteIssue.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteIssue, refetch]);

  const items: JournalIssue[] = data?.data || [];
  const total = data?.meta?.total || 0;
  const lastPage = data?.meta?.last_page || 1;

  const stats = useMemo(
    () => ({
      total,
      current: items.find((i) => i.is_current),
      published: items.filter((i) => i.is_published).length,
      draft: items.filter((i) => !i.is_published).length,
    }),
    [items, total]
  );

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Ilmiy jurnal nashrlari"
          subtitle="Jurnal sonlari, PDF fayllari va muqovalar boshqaruvi"
        />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="default">Jami: {stats.total}</Badge>
            {stats.current && (
              <Badge variant="success">Joriy: №{stats.current.issue_number}/{stats.current.year}</Badge>
            )}
            <Badge variant="success">Chop etilgan: {stats.published}</Badge>
            {stats.draft > 0 && <Badge variant="warning">Qoralama: {stats.draft}</Badge>}
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi son
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Jurnal sonlari topilmadi"
            message="Hozircha hech qanday jurnal soni qo'shilmagan."
            icon={<BookOpenCheck className="w-8 h-8 text-gray-400" />}
            action={{ label: "Birinchi son", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item, index) => (
                <EditableWrapper
                  key={item.id}
                  entityType="journal-issue"
                  entityId={item.id}
                  onEdit={() => setEditItem(item)}
                  onDelete={() => setDeleteId(item.id)}
                  label={`Son #${index + 1}`}
                >
                  <Card padding={false}>
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
                      {(item.cover || item.cover_thumbnail) ? (
                        <Image
                          src={item.cover_thumbnail || item.cover || ""}
                          alt={item.title?.uz || "Jurnal"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400">
                          <BookOpenCheck className="w-16 h-16 mb-2" />
                          <span className="text-2xl font-bold">№{item.issue_number}</span>
                          <span className="text-sm text-purple-500/70">{item.year}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {item.is_current && <Badge variant="success" size="sm">Joriy</Badge>}
                        {!item.is_published && <Badge variant="warning" size="sm">Qoralama</Badge>}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <div className="bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 inline-block text-xs font-bold">
                          №{item.issue_number} / {item.year}
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5" title={item.title?.uz}>
                        {item.title?.uz || "Sarlavhasiz"}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString("uz-UZ")}
                        </span>
                        {item.file_url && (
                          <span className="inline-flex items-center gap-0.5 text-purple-600">
                            <FileText className="w-3 h-3" /> PDF
                          </span>
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
          title="Yangi jurnal soni"
          fields={JOURNAL_FIELDS}
          initialData={{
            is_published: true,
            is_current: false,
            sort_order: items.length + 1,
            year: new Date().getFullYear(),
            date: new Date().toISOString().split("T")[0],
          }}
          onSubmit={handleCreate}
          isLoading={createIssue.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Jurnal sonini tahrirlash"
            fields={JOURNAL_FIELDS}
            initialData={{
              title: editItem.title,
              description: editItem.description,
              year: editItem.year,
              issue_number: editItem.issue_number,
              date: editItem.date?.split("T")[0],
              cover: editItem.cover,
              file: editItem.file_url,
              is_current: editItem.is_current,
              is_published: editItem.is_published,
              sort_order: editItem.sort_order,
            }}
            onSubmit={handleUpdate}
            isLoading={updateIssue.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Sonni o'chirish"
          message="Bu jurnal soni butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteIssue.isPending}
        />
      </Container>
    </section>
  );
}
