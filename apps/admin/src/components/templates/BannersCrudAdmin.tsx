"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/hooks/useBanners";
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
import type { Banner } from "@/types";
import { Plus, ImageIcon, ExternalLink } from "lucide-react";

const BANNER_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "subtitle", label: "Pastki sarlavha", type: "textarea", translatable: true },
  { name: "button_text", label: "Tugma matni", type: "text", translatable: true, placeholder: "Batafsil" },
  { name: "link", label: "Havola (URL)", type: "text", placeholder: "https://..." },
  { name: "image", label: "Banner rasm (1920×600)", type: "media", accept: "image/*", maxSize: 10240 },
  { name: "mobile_image", label: "Mobil rasm (768×400)", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "sort_order", label: "Tartib", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function BannersCrudAdmin() {
  const [editItem, setEditItem] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useBanners({ per_page: 50 });
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createBanner.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createBanner, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateBanner.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateBanner, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteBanner.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteBanner, refetch]);

  const items: Banner[] = data?.data || [];

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((b) => b.is_active).length,
      inactive: items.filter((b) => !b.is_active).length,
    }),
    [items]
  );

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Bannerlar boshqaruvi"
          subtitle="Bosh sahifa Hero slider — rasmlar, sarlavhalar va havolalar"
        />

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="default">Jami: {stats.total}</Badge>
            <Badge variant="success">Faol: {stats.active}</Badge>
            {stats.inactive > 0 && <Badge variant="warning">Nofaol: {stats.inactive}</Badge>}
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi banner
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Bannerlar topilmadi"
            message="Hozircha banner qo'shilmagan. Bosh sahifa Hero qismi uchun banner yarating."
            icon={<ImageIcon className="w-8 h-8 text-gray-400" />}
            action={{ label: "Birinchi banner", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {items.map((item, index) => (
              <EditableWrapper
                key={item.id}
                entityType="banner"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={`Banner #${index + 1}`}
              >
                <Card padding={false}>
                  {/* Banner preview */}
                  <div className="relative aspect-[16/6] bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
                    {item.image_desktop || item.image ? (
                      <Image
                        src={item.image_desktop || item.image || ""}
                        alt={item.title?.uz || "Banner"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/70">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <Badge variant={item.is_active ? "success" : "warning"} size="sm">
                        {item.is_active ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base sm:text-lg font-bold line-clamp-1">
                        {item.title?.uz || "Sarlavhasiz"}
                      </h3>
                      {item.subtitle?.uz && (
                        <p className="text-xs sm:text-sm text-white/85 line-clamp-2 mt-0.5">
                          {item.subtitle.uz}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="p-3 sm:p-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Tartib: {item.sort_order || 0}</span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline truncate max-w-[200px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.link}</span>
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
          title="Yangi banner qo'shish"
          fields={BANNER_FIELDS}
          initialData={{ is_active: true, sort_order: items.length + 1 }}
          onSubmit={handleCreate}
          isLoading={createBanner.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Bannerni tahrirlash"
            fields={BANNER_FIELDS}
            initialData={{
              title: editItem.title,
              subtitle: editItem.subtitle,
              button_text: editItem.button_text,
              link: editItem.link,
              image: editItem.image_desktop || editItem.image,
              mobile_image: editItem.image_mobile || editItem.mobile_image,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateBanner.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Bannerni o'chirish"
          message="Bu banner butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteBanner.isPending}
        />
      </Container>
    </section>
  );
}
