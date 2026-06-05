"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useTranslations,
  useCreateTranslation,
  useUpdateTranslation,
  useDeleteTranslation,
} from "@/hooks/useTranslations";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import type { Translation } from "@/types";
import { parseFormData } from "@/lib/utils";
import { Plus, Pencil, Trash2, Languages } from "lucide-react";

/* ═══════════════════════════════════════════
   Field configs
   ═══════════════════════════════════════════ */
const CREATE_FIELDS: FieldConfig[] = [
  { name: "key", label: "Kalit (key)", type: "text", required: true, placeholder: "masalan: hero.title" },
  { name: "group", label: "Guruh (group)", type: "text", required: true, placeholder: "masalan: general" },
  { name: "value", label: "Qiymat", type: "textarea", translatable: true, required: true },
];

const EDIT_FIELDS: FieldConfig[] = [
  { name: "key", label: "Kalit (key)", type: "text", required: true, placeholder: "masalan: hero.title" },
  { name: "group", label: "Guruh (group)", type: "text", required: true, placeholder: "masalan: general" },
  { name: "value", label: "Qiymat", type: "textarea", translatable: true, required: true },
];

/* ═══════════════════════════════════════════
   Helper: truncate text
   ═══════════════════════════════════════════ */
function truncate(text: string | undefined, max: number = 50): string {
  if (!text) return "—";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function TranslationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [editItem, setEditItem] = useState<Translation | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Build query params
  const params: Record<string, unknown> = {
    page,
    per_page: 20,
    ...(search && { "filter[search]": search }),
    ...(groupFilter && { "filter[group]": groupFilter }),
  };

  const { data, isLoading, error, refetch } = useTranslations(params);

  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation();
  const deleteTranslation = useDeleteTranslation();

  // Extract unique groups from current data for the dropdown
  const groups = useMemo(() => {
    if (!data?.data) return [];
    const set = new Set(data.data.map((item) => item.group));
    return Array.from(set).sort();
  }, [data?.data]);

  const handleCreate = useCallback(
    async (formData: FormData) => {
      const obj = parseFormData(formData);
      await createTranslation.mutateAsync(obj);
      setIsCreateOpen(false);
      refetch();
    },
    [createTranslation, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      const obj = parseFormData(formData);
      await updateTranslation.mutateAsync({ id: editItem.id, data: obj });
      setEditItem(null);
      refetch();
    },
    [editItem, updateTranslation, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteTranslation.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteTranslation, refetch]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleGroupChange = useCallback((value: string) => {
    setGroupFilter(value);
    setPage(1);
  }, []);

  const items: Translation[] = data?.data || [];
  const meta = data?.meta;

  return (
    <section className="py-6">
      <Container>
        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
                Tarjimalar boshqaruvi
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sayt tarjimalarini boshqarish
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              size="lg"
            >
              Yangi tarjima
            </Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Kalit yoki qiymat bo'yicha qidirish..."
            className="w-full sm:w-72"
          />
          <select
            value={groupFilter}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors"
          >
            <option value="">Barcha guruhlar</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Tarjimalar topilmadi"
            message="Hozircha tarjima qo'shilmagan"
            icon={<Languages className="w-8 h-8 text-gray-400" />}
            action={{
              label: "Tarjima qo'shish",
              onClick: () => setIsCreateOpen(true),
            }}
          />
        ) : (
          <>
            {/* ── Table ── */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Key
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Guruh
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      UZ
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left font-semibold text-gray-600">
                      RU
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left font-semibold text-gray-600">
                      EN
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-800 max-w-48">
                        <span className="line-clamp-1">{item.key}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {item.group}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-48">
                        <span className="line-clamp-1">
                          {truncate(item.value?.uz, 50)}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-500 max-w-48">
                        <span className="line-clamp-1">
                          {truncate(item.value?.ru, 50)}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-gray-500 max-w-48">
                        <span className="line-clamp-1">
                          {truncate(item.value?.en, 50)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditItem(item)}
                            className="flex size-8 items-center justify-center rounded-lg text-blue-600 transition-colors hover:bg-blue-50"
                            title="Tahrirlash"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="flex size-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
                            title="O'chirish"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
                className="mt-6"
              />
            )}
          </>
        )}

        {/* ── Create Modal ── */}
        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi tarjima qo'shish"
          fields={CREATE_FIELDS}
          initialData={{}}
          onSubmit={handleCreate}
          isLoading={createTranslation.isPending}
        />

        {/* ── Edit Modal ── */}
        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Tarjimani tahrirlash"
            fields={EDIT_FIELDS}
            initialData={{
              key: editItem.key,
              group: editItem.group,
              value: editItem.value,
            }}
            onSubmit={handleUpdate}
            isLoading={updateTranslation.isPending}
          />
        )}

        {/* ── Delete Confirm ── */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Tarjimani o'chirish"
          message="Bu tarjima butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteTranslation.isPending}
        />
      </Container>
    </section>
  );
}
