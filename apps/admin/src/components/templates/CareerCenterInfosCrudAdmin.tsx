"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useCareerCenterInfos,
  useCreateCareerCenterInfo,
  useUpdateCareerCenterInfo,
  useDeleteCareerCenterInfo,
} from "@/hooks/useCareerCenterInfos";
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
import { sanitizeHtml } from "@/lib/sanitize";
import type { FieldConfig } from "@/types/inline-edit";
import type { CareerCenterInfo } from "@/types";
import { Plus, Briefcase, Phone, Mail, MapPin } from "lucide-react";

const FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "subtitle", label: "Pastki sarlavha", type: "text", translatable: true },
  { name: "content", label: "Mazmun", type: "richtext", translatable: true, required: true },
  { name: "address", label: "Manzil", type: "text", translatable: true },
  { name: "phone", label: "Telefon", type: "text", placeholder: "+998 99 999 99 99", halfWidth: true },
  { name: "email", label: "Email", type: "text", placeholder: "career@tdtutf.uz", halfWidth: true },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function CareerCenterInfosCrudAdmin() {
  const [editItem, setEditItem] = useState<CareerCenterInfo | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useCareerCenterInfos({ per_page: 100 });
  const createInfo = useCreateCareerCenterInfo();
  const updateInfo = useUpdateCareerCenterInfo();
  const deleteInfo = useDeleteCareerCenterInfo();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createInfo.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createInfo, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateInfo.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateInfo, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteInfo.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteInfo, refetch]);

  const items: CareerCenterInfo[] = data?.data || [];

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
          title="Karyera markazi ma'lumotlari"
          subtitle="TdTUTF Karyera markazi haqida bo'limlar"
        />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="default">Jami: {stats.total}</Badge>
            <Badge variant="success">Faol: {stats.active}</Badge>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi bo&apos;lim
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Ma'lumotlar topilmadi"
            message="Hozircha karyera markazi haqida ma'lumot kiritilmagan."
            icon={<Briefcase className="w-8 h-8 text-gray-400" />}
            action={{ label: "Birinchi bo'lim", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <EditableWrapper
                key={item.id}
                entityType="career-center-info"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={`Bo'lim #${index + 1}`}
              >
                <Card padding={true}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                        {item.title?.uz || "Sarlavhasiz"}
                      </h3>
                      {item.subtitle?.uz && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {item.subtitle.uz}
                        </p>
                      )}
                    </div>
                    <Badge variant={item.is_active ? "success" : "warning"} size="sm">
                      {item.is_active ? "Faol" : "Nofaol"}
                    </Badge>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-gray-600 line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content?.uz) }}
                  />
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    {item.address?.uz && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {item.address.uz}
                      </span>
                    )}
                    {item.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {item.phone}
                      </span>
                    )}
                    {item.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> {item.email}
                      </span>
                    )}
                  </div>
                </Card>
              </EditableWrapper>
            ))}
          </div>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi bo'lim qo'shish"
          fields={FIELDS}
          initialData={{ is_active: true, sort_order: items.length + 1 }}
          onSubmit={handleCreate}
          isLoading={createInfo.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Bo'limni tahrirlash"
            fields={FIELDS}
            initialData={{
              title: editItem.title,
              subtitle: editItem.subtitle,
              content: editItem.content,
              address: editItem.address,
              phone: editItem.phone || "",
              email: editItem.email || "",
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateInfo.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Bo'limni o'chirish"
          message="Bu bo'lim butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteInfo.isPending}
        />
      </Container>
    </section>
  );
}
