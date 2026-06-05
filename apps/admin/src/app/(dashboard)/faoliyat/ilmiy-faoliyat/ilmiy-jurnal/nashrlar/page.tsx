"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import {
  useJournalIssues,
  useJournalIssueDetail,
  useCreateJournalIssue,
  useUpdateJournalIssue,
  useDeleteJournalIssue,
} from "@/hooks/useJournalIssues";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import AdminIssueCard from "@/components/journal/AdminIssueCard";
import {
  JOURNAL_ISSUE_FIELDS,
  JOURNAL_ISSUE_CREATE_DEFAULTS,
  buildEditInitialData,
} from "@/components/journal/journalIssueConfig";
import type { JournalIssue } from "@/types";

export default function NashrlarAdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useJournalIssues({ page, per_page: 20, search: search || undefined });

  const [editItem, setEditItem] = useState<JournalIssue | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: editDetail, isLoading: isDetailLoading } = useJournalIssueDetail(editItem?.id ?? 0);
  const createMutation = useCreateJournalIssue();
  const updateMutation = useUpdateJournalIssue();
  const deleteMutation = useDeleteJournalIssue();

  const handleCreate = useCallback(async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [createMutation, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    await updateMutation.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetch();
  }, [editItem, updateMutation, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteMutation, refetch]);

  const issues = data?.data ?? [];
  const meta = data?.meta;

  const editInitialData = useMemo(
    () => editDetail ? buildEditInitialData(editDetail) : undefined,
    [editDetail]
  );

  return (
    <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 space-y-8 pt-16 md:pt-20 pb-20">
      {/* ═══════ Header + Search + Add ═══════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nashrlar</h2>
          <p className="text-sm text-gray-500 mt-1">Barcha jurnal sonlari arxivi</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full sm:w-60 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00575B]/20 focus:border-[#00575B]"
            />
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#00575B] hover:bg-[#004548] transition-all active:scale-[0.98] shadow-md shadow-[#00575B]/20 whitespace-nowrap"
            style={{ borderRadius: 12 }}
          >
            <Plus className="h-4 w-4" />
            Yangi son
          </button>
        </div>
      </div>

      {/* ═══════ Loading ═══════ */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      )}

      {/* ═══════ Grid ═══════ */}
      {!isLoading && issues.length > 0 && (
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {issues.map((issue) => (
              <AdminIssueCard key={issue.id} issue={issue} onEdit={setEditItem} onDelete={setDeleteId} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════ Empty ═══════ */}
      {!isLoading && issues.length === 0 && (
        <div className="rounded-2xl p-8 lg:rounded-3xl bg-gray-100 text-center">
          <p className="text-gray-500 mb-4">
            {search ? "Natija topilmadi." : "Hali jurnal sonlari qo'shilmagan."}
          </p>
          {!search && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#00575B] hover:bg-[#004548] transition-all"
              style={{ borderRadius: 12 }}
            >
              <Plus className="h-4 w-4" />
              Birinchi sonni qo&apos;shish
            </button>
          )}
        </div>
      )}

      {/* ═══════ Pagination ═══════ */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                p === meta.current_page
                  ? "bg-[#00575B] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ═══════ CREATE Modal ═══════ */}
      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Yangi jurnal soni qo'shish"
        fields={JOURNAL_ISSUE_FIELDS}
        initialData={JOURNAL_ISSUE_CREATE_DEFAULTS}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* ═══════ EDIT Modal ═══════ */}
      {editItem && editDetail && !isDetailLoading && (
        <EditModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title="Jurnal sonini tahrirlash"
          fields={JOURNAL_ISSUE_FIELDS}
          initialData={editInitialData}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
        />
      )}

      {/* Loading overlay while detail loads */}
      {editItem && isDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      )}

      {/* ═══════ DELETE Confirm ═══════ */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Jurnal sonini o'chirish"
        message="Bu jurnal soni butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
