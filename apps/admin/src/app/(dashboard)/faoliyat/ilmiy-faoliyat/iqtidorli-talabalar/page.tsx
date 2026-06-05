"use client";

import { useState, useCallback } from "react";
import {
  useTalentedStudents,
  useTalentedStudentDetail,
  useCreateTalentedStudent,
  useUpdateTalentedStudent,
  useDeleteTalentedStudent,
} from "@/hooks/useTalentedStudents";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Breadcrumb from "@/components/shared/Breadcrumb";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import type { TalentedStudent } from "@/types";
import { decodeHtml, decodeTranslatable } from "@/lib/utils";
import { Plus, Pencil, Trash2, UserRound, Eye, EyeOff } from "lucide-react";

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const TITLE = "Iqtidorli talabalar";

const BREADCRUMB_ITEMS = [
  { label: "Faoliyat", href: "/faoliyat" },
  { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
  { label: "Iqtidorli talabalar" },
];

const STUDENT_FIELDS: FieldConfig[] = [
  { name: "name", label: "F.I.Sh.", type: "text", translatable: true, required: true },
  { name: "description", label: "Ma'lumot", type: "textarea", translatable: true, required: true },
  { name: "photo", label: "Rasm", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */
function StatusChip({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
        active ? "bg-emerald-500/90 text-white" : "bg-gray-400/90 text-white"
      }`}
    >
      {active ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
      {active ? "Faol" : "Nofaol"}
    </span>
  );
}

function AdminOverlay({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-green-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        title="Tahrirlash"
      >
        <Pencil className="size-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="flex size-9 items-center justify-center rounded-xl bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        title="O'chirish"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function StudentCard({
  item,
  onEdit,
  onDelete,
}: {
  item: TalentedStudent;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative flex h-full flex-col items-start gap-3 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
      <AdminOverlay onEdit={onEdit} onDelete={onDelete} />
      <div className="absolute top-3 left-3 z-10">
        <StatusChip active={item.is_active} />
      </div>

      {item.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.photo}
          alt={decodeHtml(item.name?.uz) || ""}
          className="h-56 w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-56 w-full items-center justify-center rounded-2xl bg-gray-200">
          <UserRound className="size-10 text-gray-400" />
        </div>
      )}

      <h6 className="font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-2 lg:text-lg">
        {decodeHtml(item.name?.uz) || "Nomsiz"}
      </h6>

      {item.description?.uz && (
        <p className="line-clamp-3 text-sm text-gray-500" style={{ textAlign: "justify" }}>
          {decodeHtml(item.description.uz)}
        </p>
      )}

      <div className="mt-auto flex w-full items-center justify-between pt-2 text-xs text-gray-400">
        <span>Tartib: {item.sort_order}</span>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
      <div className="h-56 w-full animate-pulse rounded-2xl bg-gray-200" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════ */
export default function IqtidorliTalabalarPage() {
  const [editItem, setEditItem] = useState<TalentedStudent | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useTalentedStudents({ per_page: 50 });
  const { data: editDetail, isLoading: isDetailLoading } = useTalentedStudentDetail(
    editItem?.id ?? 0
  );
  const createStudent = useCreateTalentedStudent();
  const updateStudent = useUpdateTalentedStudent();
  const deleteStudent = useDeleteTalentedStudent();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createStudent.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createStudent, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateStudent.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateStudent, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteStudent.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteStudent, refetch]);

  const items = data?.data || [];

  return (
    <section className="py-6 sm:py-8">
      <Container>
        {/* ── Header ── */}
        <div className="mb-6">
          <Breadcrumb items={BREADCRUMB_ITEMS} className="mb-3" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-semibold leading-tight text-gray-900 md:text-[32px] lg:text-[40px]">
                {TITLE}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Iqtidorli talabalar ro&apos;yxatini boshqarish
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              icon={<Plus className="size-4" />}
              size="lg"
            >
              Qo&apos;shish
            </Button>
          </div>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Iqtidorli talabalar topilmadi"
            message="Hozircha hech qanday talaba qo'shilmagan."
            action={{ label: "Qo'shish", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <StudentCard
                key={item.id}
                item={item}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
              />
            ))}
          </div>
        )}

        {/* Create modal */}
        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi iqtidorli talaba"
          fields={STUDENT_FIELDS}
          initialData={{ is_active: true, sort_order: 0 }}
          onSubmit={handleCreate}
          isLoading={createStudent.isPending}
        />

        {/* Edit modal */}
        {editItem && editDetail && !isDetailLoading && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Talabani tahrirlash"
            fields={STUDENT_FIELDS}
            initialData={{
              name: decodeTranslatable(editDetail.name),
              description: decodeTranslatable(editDetail.description),
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

        {/* Delete confirm */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Talabani o'chirish"
          message={(() => {
            const target = items.find((s) => s.id === deleteId);
            const name = target ? decodeHtml(target.name?.uz) : "";
            return name
              ? `"${name}" butunlay o'chiriladi. Davom etasizmi?`
              : "Ushbu iqtidorli talaba butunlay o'chiriladi. Davom etasizmi?";
          })()}
          isLoading={deleteStudent.isPending}
        />
      </Container>
    </section>
  );
}
