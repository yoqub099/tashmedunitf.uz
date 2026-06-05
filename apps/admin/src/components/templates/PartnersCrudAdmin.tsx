"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from "@/hooks/usePartners";
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
import type { Partner } from "@/types";
import { Plus, Handshake, ExternalLink } from "lucide-react";

const PARTNER_FIELDS: FieldConfig[] = [
  { name: "name", label: "Tashkilot nomi", type: "text", required: true, placeholder: "TASHGMU, UNICEF..." },
  { name: "url", label: "Veb-sayt", type: "text", placeholder: "https://..." },
  { name: "logo", label: "Logotip (PNG/SVG)", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function PartnersCrudAdmin() {
  const [editItem, setEditItem] = useState<Partner | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = usePartners({ per_page: 100 });
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createPartner.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createPartner, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updatePartner.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updatePartner, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deletePartner.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deletePartner, refetch]);

  const items: Partner[] = data?.data || [];

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((p) => p.is_active).length,
      inactive: items.filter((p) => !p.is_active).length,
    }),
    [items]
  );

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Hamkorlar"
          subtitle="Bosh sahifadagi hamkor logolari"
        />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="default">Jami: {stats.total}</Badge>
            <Badge variant="success">Faol: {stats.active}</Badge>
            {stats.inactive > 0 && <Badge variant="warning">Nofaol: {stats.inactive}</Badge>}
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi hamkor
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Hamkorlar topilmadi"
            message="Hamkor tashkilotlar va logolarini bu yerga qo'shing"
            icon={<Handshake className="w-8 h-8 text-gray-400" />}
            action={{ label: "Birinchi hamkor", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item, index) => (
              <EditableWrapper
                key={item.id}
                entityType="partner"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={`Hamkor #${index + 1}`}
              >
                <Card padding={false}>
                  <div className="relative aspect-square bg-white p-4 flex items-center justify-center border-b border-gray-100">
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.name}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        unoptimized
                      />
                    ) : (
                      <Handshake className="w-12 h-12 text-gray-300" />
                    )}
                    {!item.is_active && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="warning" size="sm">Nofaol</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </h3>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline truncate max-w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.url.replace(/^https?:\/\//, "")}</span>
                      </a>
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
          title="Yangi hamkor qo'shish"
          fields={PARTNER_FIELDS}
          initialData={{ is_active: true, sort_order: items.length + 1 }}
          onSubmit={handleCreate}
          isLoading={createPartner.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Hamkorni tahrirlash"
            fields={PARTNER_FIELDS}
            initialData={{
              name: editItem.name,
              url: editItem.url,
              logo: editItem.logo,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updatePartner.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Hamkorni o'chirish"
          message="Bu hamkor logosi va ma'lumotlari o'chiriladi. Davom etasizmi?"
          isLoading={deletePartner.isPending}
        />
      </Container>
    </section>
  );
}
