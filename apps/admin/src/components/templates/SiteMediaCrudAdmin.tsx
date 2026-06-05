"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  useSiteMediaList,
  useCreateSiteMedia,
  useUpdateSiteMedia,
  useDeleteSiteMedia,
} from "@/hooks/useSiteMedia";
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
import SearchInput from "@/components/shared/SearchInput";
import type { FieldConfig } from "@/types/inline-edit";
import type { SiteMedia } from "@/types";
import { Plus, FolderArchive, FileText, Film } from "lucide-react";

const FIELDS: FieldConfig[] = [
  { name: "key", label: "Kalit (kebab-case, unique)", type: "text", required: true, placeholder: "hero-bg, about-video..." },
  { name: "title", label: "Sarlavha", type: "text", placeholder: "Optional" },
  { name: "description", label: "Tavsif", type: "textarea" },
  { name: "file", label: "Fayl", type: "media", maxSize: 51200 },
  { name: "is_active", label: "Faol", type: "toggle" },
];

function isImage(mime: string | null) {
  return mime?.startsWith("image/") ?? false;
}
function isVideo(mime: string | null) {
  return mime?.startsWith("video/") ?? false;
}

export default function SiteMediaCrudAdmin() {
  const [editItem, setEditItem] = useState<SiteMedia | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useSiteMediaList();
  const createMedia = useCreateSiteMedia();
  const updateMedia = useUpdateSiteMedia();
  const deleteMedia = useDeleteSiteMedia();

  const handleCreate = useCallback(
    async (formData: FormData) => {
      await createMedia.mutateAsync(formData);
      setIsCreateOpen(false);
      refetch();
    },
    [createMedia, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      await updateMedia.mutateAsync({ id: editItem.id, formData });
      setEditItem(null);
      refetch();
    },
    [editItem, updateMedia, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteMedia.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteMedia, refetch]);

  const items: SiteMedia[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.key.toLowerCase().includes(q) ||
        (item.title || "").toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.is_active).length,
      images: items.filter((i) => isImage(i.file_mime)).length,
      videos: items.filter((i) => isVideo(i.file_mime)).length,
    }),
    [items]
  );

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Sayt media kutubxonasi"
          subtitle="Kalit asosida saqlanadigan rasmlar va videolar"
        />

        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="default">Jami: {stats.total}</Badge>
              <Badge variant="success">Faol: {stats.active}</Badge>
              <Badge variant="default">Rasmlar: {stats.images}</Badge>
              {stats.videos > 0 && <Badge variant="default">Video: {stats.videos}</Badge>}
            </div>
            <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Yangi media
            </Button>
          </div>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Kalit yoki sarlavha bo'yicha qidirish..."
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Media topilmadi"
            message={items.length === 0 ? "Hozircha media kalit yaratilmagan." : "Filter bo'yicha hech narsa topilmadi."}
            icon={<FolderArchive className="w-8 h-8 text-gray-400" />}
            action={items.length === 0 ? { label: "Birinchi media", onClick: () => setIsCreateOpen(true) } : undefined}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <EditableWrapper
                key={item.id}
                entityType="site-media"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={item.key}
              >
                <Card padding={false}>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {isImage(item.file_mime) ? (
                      <Image
                        src={item.file_url}
                        alt={item.title || item.key}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        unoptimized
                      />
                    ) : isVideo(item.file_mime) ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-purple-50 to-purple-100">
                        <Film className="w-10 h-10" />
                        <span className="mt-1 text-[10px]">VIDEO</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <FileText className="w-10 h-10" />
                        <span className="mt-1 text-[10px]">FILE</span>
                      </div>
                    )}
                    {!item.is_active && (
                      <div className="absolute top-1.5 right-1.5">
                        <Badge variant="warning" size="sm">Nofaol</Badge>
                      </div>
                    )}
                  </div>
                  <div className="px-2.5 py-2">
                    <code className="block text-[10px] font-mono text-blue-700 truncate" title={item.key}>
                      {item.key}
                    </code>
                    {item.title && (
                      <p className="text-xs text-gray-700 mt-0.5 line-clamp-1" title={item.title}>
                        {item.title}
                      </p>
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
          title="Yangi media qo'shish"
          fields={FIELDS}
          initialData={{ is_active: true }}
          onSubmit={handleCreate}
          isLoading={createMedia.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Mediani tahrirlash"
            fields={FIELDS.filter((f) => f.name !== "key").concat([
              { name: "key", label: "Kalit", type: "text", required: true, placeholder: editItem.key },
            ])}
            initialData={{
              key: editItem.key,
              title: editItem.title || "",
              description: editItem.description || "",
              file: editItem.file_url,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateMedia.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Mediani o'chirish"
          message="Bu media kalit va fayl butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteMedia.isPending}
        />
      </Container>
    </section>
  );
}
