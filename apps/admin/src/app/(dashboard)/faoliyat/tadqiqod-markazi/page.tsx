"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { usePageBySlug, useCreatePage, useUpdatePage, useDeletePage } from "@/hooks/usePages";
import { t, parseFormData } from "@/lib/utils";
import api from "@/lib/api";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { FieldConfig } from "@/types/inline-edit";

const childPageFields: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true, required: true },
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
  { name: "sort_order", label: "Tartib raqami", type: "number" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*", maxSize: 10240 },
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function TadqiqodMarkaziPage() {
  const { data: pageData, isLoading, refetch } = usePageBySlug("tadqiqod-markazi");
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();

  const [editChild, setEditChild] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const page = pageData;
  const children = page?.children || [];

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-gray-200" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-200" />
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            Tadqiqot markazi
          </h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600"
          >
            <Plus className="h-4 w-4" /> Maqola qo&apos;shish
          </button>
        </div>

        <Breadcrumb
          items={[
            { label: "Faoliyat", href: "/faoliyat" },
            { label: "Tadqiqot markazi" },
          ]}
          className="mt-3"
        />

        {/* ISFT-style card grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child: any) => {
            const title = t(child.title, "uz");
            const content = t(child.content, "uz");
            const excerpt = content ? stripHtml(content).slice(0, 200) : "";
            const image = child.images?.[0]?.url || child.images?.[0]?.original_url || null;

            return (
              <div key={child.id} className="group relative">
                {/* CRUD tugmalari */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditChild(child)}
                    className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
                    title="Tahrirlash"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(child.id)}
                    className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Link href={`/faoliyat/tadqiqod-markazi/${child.id}`}>
                  <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl h-full bg-gray-100 transition-shadow hover:shadow-md">
                    {image ? (
                      <div className="w-full aspect-[362/220] overflow-hidden rounded-xl bg-gray-200">
                        <img
                          src={image}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full rounded-xl bg-gradient-to-br from-[#00575B] to-[#003d40] aspect-[362/220] flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-50">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      </div>
                    )}

                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-4 text-gray-900">
                      {title}
                    </h6>

                    <div className="mt-2 text-sm text-gray-500 line-clamp-4">
                      <p>{excerpt}</p>
                    </div>

                    {!child.is_published && (
                      <span className="mt-2 inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        Nofaol
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {children.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Maqolalar topilmadi</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00575B] px-6 py-3 text-white hover:bg-[#003d40]"
            >
              <Plus className="h-5 w-5" /> Birinchi maqolani qo&apos;shing
            </button>
          </div>
        )}
      </Container>

      {/* Create/Edit Modal */}
      <EditModal
        isOpen={!!editChild || isCreateOpen}
        onClose={() => { setEditChild(null); setIsCreateOpen(false); }}
        title={editChild ? "Maqolani tahrirlash" : "Yangi maqola"}
        fields={childPageFields}
        initialData={editChild ? {
          ...editChild,
          image: editChild.images?.map((img: any) => {
            const url = img.url || img.original_url;
            return { id: img.id, url };
          }) || [],
        } : { is_published: true, parent_id: page?.id, page_type: "content" }}
        onSubmit={async (formData) => {
          // 1. Barcha media fieldlarni ajratib olish
          const imageFiles: File[] = [];
          const removeIds: string[] = [];
          const cleanFd = new FormData();

          let removeAll = false;
          for (const [key, val] of Array.from(formData.entries())) {
            if (key === "remove_media_ids[]") {
              removeIds.push(String(val));
            } else if (key === "remove_image" && val === "1") {
              removeAll = true;
            } else if ((key === "image" || key === "image[]") && val instanceof File && val.size > 0) {
              imageFiles.push(val);
            } else if (key === "image" || key === "image[]" || key === "remove_image") {
              // skip
            } else {
              cleanFd.append(key, val);
            }
          }

          // 2. Page data saqlash
          const data = parseFormData(cleanFd);
          let pageId: number;

          if (editChild) {
            await updatePage.mutateAsync({ id: editChild.id, data });
            pageId = editChild.id;
          } else {
            if (page?.id) {
              data.parent_id = page.id;
              data.page_type = "content";
            }
            const created = await createPage.mutateAsync(data);
            pageId = created.id;
          }

          // 3. Eski rasmlarni o'chirish
          if (removeAll && editChild?.images) {
            for (const img of editChild.images) {
              await api.delete(`media/${img.id}`).catch(() => {});
            }
          }
          for (const mediaId of removeIds) {
            await api.delete(`media/${mediaId}`).catch(() => {});
          }

          // 4. Yangi rasmlarni yuklash
          for (const file of imageFiles) {
            const mediaFd = new FormData();
            mediaFd.append("file", file);
            mediaFd.append("model_type", "page");
            mediaFd.append("model_id", String(pageId));
            mediaFd.append("collection", "images");
            mediaFd.append("type", "image");
            await api.post("media/upload", mediaFd);
          }

          setEditChild(null);
          setIsCreateOpen(false);
          refetch();
        }}
        isLoading={createPage.isPending || updatePage.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await deletePage.mutateAsync(deleteId); refetch(); } setDeleteId(null); }}
        title="Maqolani o'chirish"
        message="Haqiqatan ham bu maqolani o'chirmoqchimisiz?"
        isLoading={deletePage.isPending}
      />
    </section>
  );
}
