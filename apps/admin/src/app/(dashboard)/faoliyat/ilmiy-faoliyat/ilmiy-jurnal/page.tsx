"use client";

import { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
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

export default function IlmiyJurnalBoshSahifaAdmin() {
  const { data: currentData, isLoading: loadingCurrent, refetch: refetchCurrent } = useJournalIssues({ is_current: true, per_page: 10 });
  const { data: previousData, isLoading: loadingPrevious, refetch: refetchPrevious } = useJournalIssues({ is_current: false, per_page: 20 });

  const [editItem, setEditItem] = useState<JournalIssue | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: editDetail, isLoading: isDetailLoading } = useJournalIssueDetail(editItem?.id ?? 0);
  const createMutation = useCreateJournalIssue();
  const updateMutation = useUpdateJournalIssue();
  const deleteMutation = useDeleteJournalIssue();

  const refetchAll = useCallback(() => {
    refetchCurrent();
    refetchPrevious();
  }, [refetchCurrent, refetchPrevious]);

  const handleCreate = useCallback(async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
    refetchAll();
  }, [createMutation, refetchAll]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    await updateMutation.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetchAll();
  }, [editItem, updateMutation, refetchAll]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    refetchAll();
  }, [deleteId, deleteMutation, refetchAll]);

  const currentIssues = currentData?.data ?? [];
  const previousIssues = previousData?.data ?? [];
  const isLoading = loadingCurrent || loadingPrevious;

  const editInitialData = useMemo(
    () => editDetail ? buildEditInitialData(editDetail) : undefined,
    [editDetail]
  );

  return (
    <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-20 pt-16 md:pt-20 pb-20">
      {/* ═══════ Hero (saytdagi hero rasm Sahifalar → "ilmiy-jurnal" → rasmlar
          orqali boshqariladi: 1-rasm hero, qolganlari litsenziyalar) ═══════ */}
      <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-170 overflow-hidden rounded-2xl lg:rounded-3xl bg-linear-to-br from-[#00575B] to-[#00969D] flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-semibold text-center px-6">
          Termiz tibbiyot ilmiy axborotnomasi
        </h1>
        <div className="absolute bottom-4 left-4 bg-black/40 text-white px-3 py-1.5 rounded-lg text-xs">
          Saytdagi hero/litsenziya rasmlari: Sahifalar → “ilmiy-jurnal” → rasmlar
        </div>
      </div>

      {/* ═══════ CTA Banner ═══════ */}
      <div className="rounded-2xl p-4 lg:rounded-3xl flex flex-col items-center gap-10 bg-linear-to-br from-[#00575B] to-[#00969D] text-white md:flex-row md:p-8">
        <div className="flex-1 space-y-4">
          <h3 className="text-lg md:text-2xl leading-6 font-semibold">
            Fikrlaringiz sahifaga aylansin – maqolangizni hoziroq
            jo&apos;nating.
          </h3>
          <p className="text-base leading-6 font-normal text-white/90">
            Maqolangizni hoziroq yuboring! Jurnalimiz sizning ilmiy
            tadqiqotingiz, tahlilingiz va innovatsion yondashuvingizni
            kutmoqda.
          </p>
        </div>
        <div className="hidden lg:block w-px h-20 bg-white/30" />
        <span className="rounded-full bg-white px-5 py-2.5 text-base leading-6 text-gray-900 font-medium whitespace-nowrap">
          Maqolani yuborish
        </span>
      </div>

      {/* ═══════ Add button ═══════ */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Jurnal sonlari
        </h2>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#00575B] hover:bg-[#004548] transition-all active:scale-[0.98] shadow-md shadow-[#00575B]/20"
          style={{ borderRadius: 12 }}
        >
          <Plus className="h-4 w-4" />
          Yangi son
        </button>
      </div>

      {/* ═══════ Loading State ═══════ */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      )}

      {/* ═══════ Current Issues ═══════ */}
      {!isLoading && currentIssues.length > 0 && (
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
          <h4 className="text-base md:text-xl leading-6 text-gray-900 font-bold">
            So&apos;nggi son
          </h4>
          <div className="text-base font-normal pt-4 text-gray-600 leading-relaxed">
            <p className="text-justify">
              &quot;Termiz tibbiyot ilmiy axborotnomasi&quot; — Toshkent davlat
              tibbiyot universiteti Termiz filialining rasmiy ilmiy jurnali.
            </p>
          </div>
          <div className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentIssues.map((issue) => (
                <AdminIssueCard key={issue.id} issue={issue} onEdit={setEditItem} onDelete={setDeleteId} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Previous Issues ═══════ */}
      {!isLoading && previousIssues.length > 0 && (
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
          <h4 className="text-base md:text-xl leading-6 text-gray-900 font-bold">
            &quot;Termiz tibbiyot ilmiy axborotnomasi&quot;
          </h4>
          <div className="text-base font-normal pt-4 text-gray-600 leading-relaxed">
            <p className="text-justify">
              Oldingi yillarda nashr etilgan sonlar. Turli ilmiy
              yo&apos;nalishlarda olib borilgan tadqiqotlar natijalari jamlangan.
            </p>
          </div>
          <div className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {previousIssues.map((issue) => (
                <AdminIssueCard key={issue.id} issue={issue} onEdit={setEditItem} onDelete={setDeleteId} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Empty state ═══════ */}
      {!isLoading && currentIssues.length === 0 && previousIssues.length === 0 && (
        <div className="rounded-2xl p-8 lg:rounded-3xl bg-gray-100 text-center">
          <p className="text-gray-500 mb-4">Hali jurnal sonlari qo&apos;shilmagan.</p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#00575B] hover:bg-[#004548] transition-all"
            style={{ borderRadius: 12 }}
          >
            <Plus className="h-4 w-4" />
            Birinchi sonni qo&apos;shish
          </button>
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
