"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/useTestimonials";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import type { Testimonial } from "@/types";
import { Plus, Quote, Star } from "lucide-react";

const TESTIMONIAL_FIELDS: FieldConfig[] = [
  { name: "name", label: "Ism va familiya", type: "text", translatable: true, required: true },
  { name: "role", label: "Lavozim / Maqom", type: "text", translatable: true, required: true, placeholder: "Bitiruvchi, 2024" },
  { name: "text", label: "Fikr matni", type: "textarea", translatable: true, required: true },
  { name: "photo", label: "Surat", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function TestimonialsCrudAdmin() {
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useTestimonials({ per_page: 100 });
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createTestimonial.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createTestimonial, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateTestimonial.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateTestimonial, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteTestimonial.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteTestimonial, refetch]);

  const items: Testimonial[] = data?.data || [];

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((t) => t.is_active).length,
      inactive: items.filter((t) => !t.is_active).length,
    }),
    [items]
  );

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Testimoniallar"
          subtitle="Bitiruvchilar va talabalar fikrlari — bosh sahifa"
        />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="default">Jami: {stats.total}</Badge>
            <Badge variant="success">Faol: {stats.active}</Badge>
            {stats.inactive > 0 && <Badge variant="warning">Nofaol: {stats.inactive}</Badge>}
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi fikr
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Fikrlar topilmadi"
            message="Hozircha bitiruvchilar/talabalar fikri qo'shilmagan."
            icon={<Star className="w-8 h-8 text-gray-400" />}
            action={{ label: "Birinchi fikr", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {items.map((item, index) => (
              <EditableWrapper
                key={item.id}
                entityType="testimonial"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={`Fikr #${index + 1}`}
              >
                <Card padding={false}>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Quote className="w-7 h-7 text-blue-500/40" />
                      <Badge variant={item.is_active ? "success" : "warning"} size="sm">
                        {item.is_active ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-4 italic mb-4">
                      &ldquo;{item.text?.uz || "Fikr matni kiritilmagan"}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shrink-0">
                        {(item.photo || item.photo_thumbnail) ? (
                          <Image
                            src={item.photo_thumbnail || item.photo || ""}
                            alt={item.name?.uz || "Avatar"}
                            fill
                            className="object-cover"
                            sizes="44px"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                            {(item.name?.uz || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {item.name?.uz || "Ismsiz"}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {item.role?.uz || "—"}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">#{item.sort_order || index + 1}</span>
                    </div>
                  </div>
                </Card>
              </EditableWrapper>
            ))}
          </div>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi fikr qo'shish"
          fields={TESTIMONIAL_FIELDS}
          initialData={{ is_active: true, sort_order: items.length + 1 }}
          onSubmit={handleCreate}
          isLoading={createTestimonial.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Fikrni tahrirlash"
            fields={TESTIMONIAL_FIELDS}
            initialData={{
              name: editItem.name,
              role: editItem.role,
              text: editItem.text,
              photo: editItem.photo,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateTestimonial.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Fikrni o'chirish"
          message="Bu fikr butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteTestimonial.isPending}
        />
      </Container>
    </section>
  );
}
