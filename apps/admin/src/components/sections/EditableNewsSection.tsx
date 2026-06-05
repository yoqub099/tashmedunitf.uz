"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/useNews";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";
import type { News } from "@/types";
import type { FieldConfig } from "@/types/inline-edit";

const newsFields: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "slug", label: "Slug (URL)", type: "text", required: true },
  { name: "excerpt", label: "Qisqacha", type: "textarea", translatable: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true },
  { name: "category", label: "Kategoriya", type: "select", options: [
    { value: "yangiliklar", label: "Yangiliklar" },
    { value: "tadbirlar", label: "Tadbirlar" },
    { value: "konferensiyalar", label: "Konferensiyalar" },
    { value: "elonlar", label: "E'lonlar" },
  ]},
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
  { name: "cover", label: "Muqova rasmi", type: "media", accept: "image/*" },
];

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const CATEGORY_BADGES: Record<string, string> = {
  yangiliklar: "news-badge-green",
  tadbirlar: "news-badge-amber",
  konferensiyalar: "news-badge-blue",
  elonlar: "news-badge-purple",
};

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  const cls = CATEGORY_BADGES[category.toLowerCase()] ?? "news-badge-green";
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-extrabold uppercase text-white ${cls}`}>
      {label}
    </span>
  );
}

function IsftDate({ dateStr, large }: { dateStr?: string; large?: boolean }) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTHS_UZ[d.getMonth()];
  const year = d.getFullYear();
  return (
    <div className="flex items-center gap-x-2">
      <h2 className={`font-serif font-semibold leading-tight text-gray-900 ${large ? "text-2xl md:text-[32px] lg:text-[40px]" : "text-2xl md:text-[32px] lg:text-[40px]"}`}>
        {day}
      </h2>
      <div className="inline-flex flex-col items-start justify-center gap-0.5">
        <span className="text-xs text-gray-500">{month}</span>
        <span className="text-xs text-gray-400">{year}</span>
      </div>
    </div>
  );
}

function ArrowBtn({ size = 28 }: { size?: number }) {
  return (
    <span className="rounded-full border border-teal-700 bg-transparent p-1.5 text-teal-700 transition-colors hover:bg-teal-700 hover:text-white inline-flex">
      <ArrowUpRight style={{ width: size, height: size }} />
    </span>
  );
}

export default function EditableNewsSection() {
  const { data: newsData } = useNews({ per_page: 5 });
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();
  const router = useRouter();
  const [editItem, setEditItem] = useState<News | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const newsList = newsData?.data || [];
  const featured = newsList[0];
  const smallCards = newsList.slice(1, 3);
  const rightCards = newsList.slice(3, 5);

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionTitle
          title="Yangiliklar"
          subtitle="Filialimizdagi eng so'ngi yangiliklarni kuzatib boring"
        />

        {newsList.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* ── Left Column (2/3) ── */}
            <div className="flex flex-col items-start gap-6 lg:col-span-2">
              {/* Featured Card */}
              {featured && (
                <EditableWrapper
                  entityType="news"
                  entityId={featured.id}
                  onEdit={() => setEditItem(featured)}
                  onDelete={() => setDeleteId(featured.id)}
                  onAdd={() => setIsCreateOpen(true)}
                  label="Yangilik"
                  className="w-full"
                >
                  <div onClick={() => router.push(`/yangiliklar/${featured.id}`)} className="isft-card rounded-2xl p-4 md:p-6 lg:rounded-3xl flex w-full flex-col items-start gap-2 bg-gray-100 cursor-pointer transition-shadow hover:shadow-lg">
                    {featured.cover_thumbnail || featured.cover ? (
                      <img src={featured.cover_thumbnail || featured.cover} alt={featured.title?.uz || ""} className="h-96 w-full rounded-3xl object-cover" />
                    ) : (
                      <div className="flex h-96 w-full items-center justify-center rounded-3xl bg-gray-200">
                        <Newspaper className="size-12 text-gray-400" />
                      </div>
                    )}
                    <div className="flex w-full items-center gap-2 pb-0.5 pt-2">
                      <CategoryBadge category={featured.category} />
                    </div>
                    <div className="mt-2 text-left">
                      <h4 className="font-serif text-2xl font-semibold text-gray-900">{featured.title?.uz || "Sarlavhasiz"}</h4>
                      {featured.excerpt?.uz && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{featured.excerpt.uz}</p>
                      )}
                    </div>
                    <div className="mt-2 flex w-full flex-col gap-4 md:flex-row lg:items-end lg:justify-between">
                      <IsftDate dateStr={featured.published_at || featured.created_at} large />
                      <Link href={`/yangiliklar/${featured.id}`} className="flex h-10 items-center gap-1.5 rounded-full border border-teal-700 px-4 font-medium text-teal-700 transition-colors hover:bg-teal-700 hover:text-white">
                        <span>Batafsil</span>
                        <ArrowUpRight className="size-5" />
                      </Link>
                    </div>
                  </div>
                </EditableWrapper>
              )}

              {/* Two text-only cards below featured */}
              {smallCards.length > 0 && (
                <div className="grid h-full w-full items-stretch gap-6 md:grid-cols-2">
                  {smallCards.map((item) => (
                    <EditableWrapper
                      key={item.id}
                      entityType="news"
                      entityId={item.id}
                      onEdit={() => setEditItem(item)}
                      onDelete={() => setDeleteId(item.id)}
                      onAdd={() => setIsCreateOpen(true)}
                      label="Yangilik"
                    >
                      <div onClick={() => router.push(`/yangiliklar/${item.id}`)} className="isft-card rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-full flex-col items-start gap-2 bg-gray-100 cursor-pointer transition-shadow hover:shadow-lg">
                        <CategoryBadge category={item.category} />
                        <h6 className="mt-2 font-serif text-base font-semibold leading-tight text-left text-gray-900 line-clamp-3 lg:text-lg">
                          {item.title?.uz || "Sarlavhasiz"}
                        </h6>
                        <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                          <IsftDate dateStr={item.published_at || item.created_at} />
                          <ArrowBtn />
                        </div>
                      </div>
                    </EditableWrapper>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right Column (1/3) ── */}
            <div className="flex flex-col items-start gap-6">
              {rightCards.map((item) => (
                <EditableWrapper
                  key={item.id}
                  entityType="news"
                  entityId={item.id}
                  onEdit={() => setEditItem(item)}
                  onDelete={() => setDeleteId(item.id)}
                  onAdd={() => setIsCreateOpen(true)}
                  label="Yangilik"
                  className="w-full"
                >
                  <div onClick={() => router.push(`/yangiliklar/${item.id}`)} className="isft-card rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col items-start gap-2 bg-gray-100 w-full cursor-pointer transition-shadow hover:shadow-lg">
                    {item.cover_thumbnail || item.cover ? (
                      <img src={item.cover_thumbnail || item.cover} alt={item.title?.uz || ""} className="h-56 w-full rounded-3xl object-cover" />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center rounded-3xl bg-gray-200">
                        <Newspaper className="size-8 text-gray-400" />
                      </div>
                    )}
                    <CategoryBadge category={item.category} />
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg text-left text-gray-900 line-clamp-3">
                      {item.title?.uz || "Sarlavhasiz"}
                    </h6>
                    <div className="mt-auto flex w-full items-end justify-between gap-6">
                      <IsftDate dateStr={item.published_at || item.created_at} />
                      <ArrowBtn />
                    </div>
                  </div>
                </EditableWrapper>
              ))}
            </div>
          </div>
        ) : (
          <EditableWrapper
            entityType="news"
            entityId={0}
            onEdit={() => setIsCreateOpen(true)}
            onAdd={() => setIsCreateOpen(true)}
            label="Yangilik"
            className="col-span-full"
          >
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-400">Hozircha yangilik yo&apos;q — + bosib qo&apos;shing</p>
            </div>
          </EditableWrapper>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/yangiliklar"
            className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
          >
            Barcha yangiliklar
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>

      <EditModal
        isOpen={!!editItem || isCreateOpen}
        onClose={() => { setEditItem(null); setIsCreateOpen(false); }}
        title={editItem ? "Yangilikni tahrirlash" : "Yangi yangilik"}
        fields={newsFields}
        initialData={editItem ? { ...editItem } : undefined}
        onSubmit={async (formData) => {
          try {
            if (editItem) {
              await updateMutation.mutateAsync({ id: editItem.id, formData });
            } else {
              await createMutation.mutateAsync(formData);
            }
          } catch (err) {
            console.error("News save error:", err);
          } finally {
            setEditItem(null);
            setIsCreateOpen(false);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        title="Yangilikni o'chirish"
        message="Haqiqatan ham bu yangilikni o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}
