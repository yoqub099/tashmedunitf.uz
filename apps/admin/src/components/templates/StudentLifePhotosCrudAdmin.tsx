"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  useStudentLifePhotos,
  useCreateStudentLifePhoto,
  useUpdateStudentLifePhoto,
  useDeleteStudentLifePhoto,
} from "@/hooks/useStudentLifePhotos";
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
import type { StudentLifePhoto } from "@/types";
import { Plus, Camera } from "lucide-react";

const FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true },
  { name: "photo", label: "Foto", type: "media", accept: "image/*", maxSize: 10240 },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function StudentLifePhotosCrudAdmin() {
  const [editItem, setEditItem] = useState<StudentLifePhoto | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useStudentLifePhotos({ per_page: 100 });
  const createPhoto = useCreateStudentLifePhoto();
  const updatePhoto = useUpdateStudentLifePhoto();
  const deletePhoto = useDeleteStudentLifePhoto();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createPhoto.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createPhoto, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updatePhoto.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updatePhoto, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deletePhoto.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deletePhoto, refetch]);

  const items: StudentLifePhoto[] = data?.data || [];

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.is_active).length,
    }),
    [items]
  );

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Talabalar hayoti gallereyasi"
          subtitle="Universitet hayotidan rasmlar"
        />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="default">Jami: {stats.total}</Badge>
            <Badge variant="success">Faol: {stats.active}</Badge>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi rasm
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Rasmlar topilmadi"
            message="Talabalar hayoti gallereyasiga rasm qo'shing."
            icon={<Camera className="w-8 h-8 text-gray-400" />}
            action={{ label: "Birinchi rasm", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item, index) => (
              <EditableWrapper
                key={item.id}
                entityType="student-life-photo"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={`Rasm #${index + 1}`}
              >
                <Card padding={false}>
                  <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                    {item.photo ? (
                      <Image
                        src={item.photo}
                        alt={item.title?.uz || `Foto ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                        <Camera className="w-12 h-12" />
                      </div>
                    )}
                    {!item.is_active && (
                      <div className="absolute top-1.5 right-1.5">
                        <Badge variant="warning" size="sm">Nofaol</Badge>
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5">
                      #{item.sort_order || index + 1}
                    </div>
                  </div>
                  {item.title?.uz && (
                    <div className="px-2.5 py-2">
                      <p className="text-xs text-gray-700 line-clamp-1" title={item.title.uz}>
                        {item.title.uz}
                      </p>
                    </div>
                  )}
                </Card>
              </EditableWrapper>
            ))}
          </div>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi rasm qo'shish"
          fields={FIELDS}
          initialData={{ is_active: true, sort_order: items.length + 1 }}
          onSubmit={handleCreate}
          isLoading={createPhoto.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Rasmni tahrirlash"
            fields={FIELDS}
            initialData={{
              title: editItem.title,
              photo: editItem.photo,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updatePhoto.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Rasmni o'chirish"
          message="Bu rasm butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deletePhoto.isPending}
        />
      </Container>
    </section>
  );
}
