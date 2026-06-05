"use client";

import { useState, useCallback, useMemo } from "react";
import { useDirections, useCreateDirection, useUpdateDirection, useDeleteDirection } from "@/hooks/useDirections";
import { useFaculties } from "@/hooks/useFaculties";
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
import type { Direction } from "@/types";
import { Plus, GraduationCap, Clock, Code } from "lucide-react";
import { DEGREE_OPTIONS } from "@/lib/constants";

interface DirectionsCrudAdminProps {
  title: string;
  subtitle?: string;
  degree?: "bakalavriat" | "magistratura" | "ordinatura";
  facultyId?: number;
}

const BASE_DIRECTION_FIELDS: FieldConfig[] = [
  { name: "name", label: "Yo'nalish nomi", type: "text", translatable: true, required: true },
  { name: "code", label: "Kod", type: "text", required: true, placeholder: "60110300" },
  {
    name: "level", label: "Daraja", type: "select", required: true,
    options: DEGREE_OPTIONS.map((d) => ({ value: d.value, label: d.label })),
  },
  { name: "faculty_id", label: "Fakultet", type: "select", options: [] },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: true },
  { name: "duration", label: "O'qish muddati", type: "text", halfWidth: true, placeholder: "4 yil" },
  { name: "price_daytime", label: "Kunduzgi narx (so'm)", type: "number", halfWidth: true, placeholder: "0" },
  { name: "price_remote", label: "Sirtqi narx (so'm)", type: "number", halfWidth: true, placeholder: "0" },
  { name: "exam_subjects", label: "Imtihon fanlari", type: "tags", placeholder: "Masalan: Biologiya, Kimyo" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*" },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

function getLevelLabel(level: string): string {
  switch (level) {
    case "bakalavriat": return "Bakalavriat";
    case "magistratura": return "Magistratura";
    case "ordinatura": return "Klinik ordinatura";
    default: return level;
  }
}

export default function DirectionsCrudAdmin({ title, subtitle, degree, facultyId }: DirectionsCrudAdminProps) {
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<Direction | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useDirections({
    page,
    per_page: 12,
    degree,
    faculty_id: facultyId,
  });

  // Fetch all faculties for the select dropdown
  const { data: facultiesData } = useFaculties({ per_page: 50 });

  // Build fields with dynamic faculty options
  const DIRECTION_FIELDS = useMemo<FieldConfig[]>(() => {
    const facultyOptions = (facultiesData?.data || []).map((f) => ({
      value: String(f.id),
      label: `${f.name?.uz || "Nomsiz"} (${getLevelLabel(f.level)})`,
    }));
    return BASE_DIRECTION_FIELDS.map((field) =>
      field.name === "faculty_id"
        ? { ...field, options: facultyOptions, required: true }
        : field,
    );
  }, [facultiesData]);

  const createDirection = useCreateDirection();
  const updateDirection = useUpdateDirection();
  const deleteDirection = useDeleteDirection();

  const handleCreate = useCallback(async (formData: FormData) => {
    if (degree) formData.set("level", degree);
    if (facultyId) formData.set("faculty_id", String(facultyId));
    await createDirection.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [degree, facultyId, createDirection, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    await updateDirection.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetch();
  }, [editItem, updateDirection, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteDirection.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteDirection, refetch]);

  const items = data?.data || [];
  const meta = data?.meta;

  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yo&apos;nalish qo&apos;shish
          </Button>
        </div>

        {/* Stats row */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <Card padding={false} className="p-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{items.length}</p>
                  <p className="text-[11px] text-gray-500">Jami yo&apos;nalish</p>
                </div>
              </div>
            </Card>
            <Card padding={false} className="p-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Code className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {items.filter((i) => i.is_active).length}
                  </p>
                  <p className="text-[11px] text-gray-500">Faol</p>
                </div>
              </div>
            </Card>
            <Card padding={false} className="p-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {items.filter((i) => !i.is_active).length}
                  </p>
                  <p className="text-[11px] text-gray-500">Nofaol</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Yo'nalishlar topilmadi"
            message="Hozircha yo'nalish qo'shilmagan"
            icon={<GraduationCap className="w-8 h-8 text-gray-400" />}
            action={{ label: "Yo'nalish qo'shish", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item) => (
                <EditableWrapper
                  key={item.id}
                  entityType="direction"
                  entityId={item.id}
                  onEdit={() => setEditItem(item)}
                  onDelete={() => setDeleteId(item.id)}
                  label="Yo'nalish"
                >
                  <Card>
                    {item.image && (
                      <div className="h-32 sm:h-40 w-full overflow-hidden rounded-lg sm:rounded-xl mb-3 sm:mb-4 bg-gray-200">
                        <img
                          src={item.image}
                          alt={item.name?.uz || ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">{item.name?.uz || "Nomsiz"}</h3>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[11px] sm:text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Code className="w-3 h-3" /> {item.code}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.duration}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                      <Badge variant="info">{getLevelLabel(item.level)}</Badge>
                      <Badge variant={item.is_active ? "success" : "warning"}>
                        {item.is_active ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                  </Card>
                </EditableWrapper>
              ))}
            </div>
            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
                className="mt-8"
              />
            )}
          </>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi yo'nalish qo'shish"
          fields={DIRECTION_FIELDS}
          initialData={
            degree
              ? { level: degree, faculty_id: facultyId ? String(facultyId) : undefined, is_active: true, sort_order: 0 }
              : { is_active: true, sort_order: 0 }
          }
          onSubmit={handleCreate}
          isLoading={createDirection.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Yo'nalishni tahrirlash"
            fields={DIRECTION_FIELDS}
            initialData={{
              name: editItem.name,
              code: editItem.code,
              level: editItem.level,
              faculty_id: editItem.faculty_id ? String(editItem.faculty_id) : undefined,
              description: editItem.description,
              duration: editItem.duration,
              price_daytime: editItem.price_daytime,
              price_remote: editItem.price_remote,
              exam_subjects: editItem.exam_subjects ?? [],
              image: editItem.image ?? undefined,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateDirection.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Yo'nalishni o'chirish"
          message="Bu yo'nalish butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteDirection.isPending}
        />
      </Container>
    </section>
  );
}
