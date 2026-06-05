"use client";

import { use } from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useNews, useNewsDetail, useUpdateNews, useDeleteNews } from "@/hooks/useNews";
import { sanitizeHtml } from "@/lib/sanitize";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import { ArrowLeft, Image as ImageIcon, Link2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { NEWS_CATEGORIES } from "@/lib/constants";

/* ═══════════════════════════════════════════
   Constants — frontend bilan bir xil
   ═══════════════════════════════════════════ */
const CAT_BADGE_CLS: Record<string, string> = {
  yangiliklar: "news-badge-green",
  tadbirlar: "bg-gradient-to-r from-[#870037] to-[#C30050]",
  konferensiyalar: "bg-gradient-to-r from-[#870037] to-[#C30050]",
  elonlar: "news-badge-green",
  vakansiyalar: "news-badge-blue",
};

const CAT_LABEL: Record<string, string> = {
  yangiliklar: "YANGILIK",
  tadbirlar: "TADBIR",
  konferensiyalar: "KONFERENSIYA",
  elonlar: "E'LON",
  vakansiyalar: "VAKANSIYA",
};

const SIDEBAR_TITLE: Record<string, string> = {
  yangiliklar: "So'nggi yangiliklar",
  tadbirlar: "So'nggi tadbirlar",
  konferensiyalar: "So'nggi konferensiyalar",
  elonlar: "So'nggi e'lonlar",
  vakansiyalar: "So'nggi vakansiyalar",
};

const MONTHS_UZ = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const NEWS_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "excerpt", label: "Qisqa matn", type: "textarea", translatable: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true, required: true },
  {
    name: "category", label: "Kategoriya", type: "select", required: true,
    options: NEWS_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
  },
  { name: "cover", label: "Muqova rasm", type: "media", accept: "image/*" },
  { name: "is_published", label: "Chop etish", type: "toggle" },
  { name: "published_at", label: "Sana", type: "date" },
];

/* ── Arrow icon (frontend bilan bir xil) ── */
function ArrowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ── Date block (day/month/year) ── */
function DateBlock({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTHS_UZ[d.getMonth()];
  const year = d.getFullYear();
  return (
    <div className="flex items-center gap-x-2">
      <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] mt-1 text-gray-900">
        {day}
      </h2>
      <div className="inline-flex flex-col items-start justify-center gap-0.5">
        <span className="text-xs text-gray-500">{month}</span>
        <span className="text-xs text-gray-400">{year}</span>
      </div>
    </div>
  );
}

/* ── Category badge ── */
function CategoryBadge({ category }: { category?: string }) {
  const cat = category?.toLowerCase() || "yangiliklar";
  const cls = CAT_BADGE_CLS[cat] ?? "news-badge-green";
  const label = CAT_LABEL[cat] ?? category?.toUpperCase() ?? "YANGILIK";
  return (
    <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-extrabold uppercase text-white ${cls}`}>
      {label}
    </span>
  );
}

/* ── Share buttons (copy, Telegram, Facebook) ── */
function ShareButtons({ frontendSlug }: { frontendSlug?: string }) {
  const [copied, setCopied] = useState(false);
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
  // Share the PUBLIC frontend URL (not admin URL)
  const publicUrl = frontendSlug ? `${FRONTEND_URL}/uz/yangiliklar/${frontendSlug}` : "";
  const BTN = "flex h-9 w-9 items-center justify-center rounded-full border border-green-600 bg-white text-green-600 shadow-sm transition-colors hover:bg-green-600 hover:text-white";

  const copyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Havola nusxalandi!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Nusxalash amalga oshmadi");
    }
  };

  const shareToTelegram = () => {
    if (!publicUrl) return;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}`, "_blank", "noopener,noreferrer");
  };

  const shareToFacebook = () => {
    if (!publicUrl) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={copyLink} className={BTN} title="Havolani nusxalash">
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
      <button type="button" onClick={shareToTelegram} className={BTN} title="Telegram">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      </button>
      <button type="button" onClick={shareToFacebook} className={BTN} title="Facebook">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
    </div>
  );
}

interface NewsDetailAdminProps {
  params: Promise<{ id: string }>;
}

export default function NewsDetailAdmin({ params }: NewsDetailAdminProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading, error, refetch } = useNewsDetail(id);
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Sidebar latest news — same category (only request when we know the category)
  const { data: latestData } = useNews(
    item?.category ? { per_page: 6, category: item.category } : { per_page: 6 }
  );
  const latestNews = (latestData?.data || []).filter((n) => n.id !== item?.id).slice(0, 5);

  const handleUpdate = useCallback(async (formData: FormData) => {
    await updateNews.mutateAsync({ id: Number(id), formData });
    setIsEditOpen(false);
    refetch();
  }, [id, updateNews, refetch]);

  const handleDelete = useCallback(async () => {
    await deleteNews.mutateAsync(Number(id));
    router.push("/yangiliklar");
  }, [id, deleteNews, router]);

  if (isLoading) {
    return (
      <Container className="py-16">
        <LoadingSpinner size="lg" text="Yuklanmoqda..." />
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container className="py-16">
        <ErrorState onRetry={() => refetch()} />
      </Container>
    );
  }

  const title = item.title?.uz || "Sarlavhasiz";
  const content = item.content?.uz || "";
  const cat = item.category?.toLowerCase() || "yangiliklar";
  const sidebarTitle = SIDEBAR_TITLE[cat] ?? SIDEBAR_TITLE.yangiliklar;

  // Back route based on category
  const backRoute =
    cat === "tadbirlar" ? "/tadbirlar" :
    cat === "konferensiyalar" ? "/konferensiyalar" :
    "/yangiliklar";

  return (
    <div className="py-6 lg:py-10">
      <Container as="main">
        {/* Back button */}
        <button
          onClick={() => router.push(backRoute)}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </button>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ═══ Left: Article Detail ═══ */}
          <div className="flex-1">
            <EditableWrapper
              entityType="news"
              entityId={item.id}
              onEdit={() => setIsEditOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
              label="Yangilik"
            >
              <div className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex flex-col gap-4 bg-gray-50">
                {/* Cover — fixed aspect 16/7 */}
                {item.cover ? (
                  <div className="relative w-full aspect-[16/7] overflow-hidden rounded-xl bg-gray-200">
                    <img
                      src={item.cover}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex w-full aspect-[16/7] items-center justify-center rounded-xl bg-gray-200">
                    <ImageIcon className="size-12 text-gray-400" />
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={item.category} />
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      item.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.is_published ? "✓ Chop etilgan" : "⚠ Qoralama"}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif text-2xl font-semibold text-gray-900 lg:text-3xl">
                  {title}
                </h4>

                {/* Excerpt */}
                {item.excerpt?.uz && (
                  <p className="border-l-4 border-green-600 pl-4 text-base italic text-gray-600">
                    {item.excerpt.uz}
                  </p>
                )}

                {/* Content */}
                {content && (
                  <div
                    className="prose max-w-none text-container overflow-x-auto [&_img]:max-w-full [&_table]:max-w-full [&_iframe]:max-w-full [&_pre]:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                  />
                )}

                {/* Gallery */}
                {item.gallery && item.gallery.length > 0 && (
                  <div className="mt-4">
                    <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
                      Galereya
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {item.gallery.map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden news-card-shadow"
                        >
                          <img
                            src={img.url}
                            alt={img.name || ""}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date + Share */}
                <div className="mt-auto flex flex-col gap-3 md:flex-row md:items-center">
                  <DateBlock dateStr={item.published_at || item.created_at} />
                  <div className="flex items-center gap-3 md:ml-auto">
                    <p className="font-serif text-sm font-medium text-gray-900">Ulashish:</p>
                    <ShareButtons frontendSlug={item.slug} />
                  </div>
                </div>
              </div>
            </EditableWrapper>
          </div>

          {/* ═══ Right: Sidebar — So'nggi yangiliklar ═══ */}
          <div className="w-full space-y-6 lg:max-w-[420px]">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">{sidebarTitle}</h4>
            <div className="grid gap-6">
              {latestNews.length === 0 ? (
                <p className="text-sm text-gray-400">Boshqa yangilik yo&apos;q</p>
              ) : (
                latestNews.map((n) => (
                  <div
                    key={n.id}
                    className="news-card-shadow rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-full flex-col items-start gap-2 bg-gray-50"
                  >
                    <CategoryBadge category={n.category || cat} />
                    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg mt-2 text-left text-gray-900 line-clamp-3">
                      {n.title?.uz || "Sarlavhasiz"}
                    </h6>
                    <div className="mt-auto flex w-full items-end justify-between gap-2 sm:gap-6">
                      <DateBlock dateStr={n.published_at || n.created_at} />
                      <Link
                        href={`/yangiliklar/${n.id}`}
                        className="rounded-full border border-green-600 bg-transparent p-2 text-green-600 transition-colors hover:bg-green-600 hover:text-white inline-flex min-w-[44px] min-h-[44px] items-center justify-center"
                      >
                        <ArrowIcon />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Yangilikni tahrirlash"
          fields={NEWS_FIELDS}
          initialData={{
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            is_published: item.is_published,
            published_at: item.published_at,
          }}
          onSubmit={handleUpdate}
          isLoading={updateNews.isPending}
        />

        {/* Delete Confirm */}
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Yangilikni o'chirish"
          message="Bu yangilik butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteNews.isPending}
        />
      </Container>
    </div>
  );
}
