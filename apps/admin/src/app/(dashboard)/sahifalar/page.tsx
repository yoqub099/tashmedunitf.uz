"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  usePageTree,
  usePages,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  useReorderPages,
} from "@/hooks/usePages";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import SearchInput from "@/components/shared/SearchInput";
import PageTreeView from "@/components/shared/PageTreeView";
import PageLock from "@/components/shared/PageLock";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";
import type { FieldConfig } from "@/types/inline-edit";
import type { Page } from "@/types";
import { Plus, FolderPlus, FileText } from "lucide-react";

const SAHIFALAR_UNLOCK_KEY = "admin:sahifalar:unlock";
const SAHIFALAR_PASSWORD = "09";

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

/** Transliterate Uzbek text to slug */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/o['`']/g, "o")
    .replace(/g['`']/g, "g")
    .replace(/sh/g, "sh")
    .replace(/ch/g, "ch")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Flatten tree to list with depth info for parent select */
function flattenTree(pages: Page[], depth: number = 0): { id: number; title: string; depth: number }[] {
  const result: { id: number; title: string; depth: number }[] = [];
  for (const page of pages) {
    const indent = "\u00A0\u00A0".repeat(depth);
    result.push({
      id: page.id,
      title: `${indent}${depth > 0 ? "└ " : ""}${page.title?.uz || "Nomsiz"}`,
      depth,
    });
    if (page.children && page.children.length > 0) {
      result.push(...flattenTree(page.children, depth + 1));
    }
  }
  return result;
}

/** Find siblings at the same level */
function findSiblings(pages: Page[], targetId: number): Page[] | null {
  for (const page of pages) {
    if (page.id === targetId) return pages;
    if (page.children) {
      const found = findSiblings(page.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

/* ═══════════════════════════════════════════
   Field configs
   ═══════════════════════════════════════════ */
const PAGE_TYPE_OPTIONS = [
  { value: "content", label: "Sahifa (kontent)" },
  { value: "link", label: "Havola (tashqi)" },
  { value: "group", label: "Bo'lim (guruh)" },
];

/* ═══════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════ */
export default function SahifalarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [editItem, setEditItem] = useState<Page | null>(null);
  const [deleteItem, setDeleteItem] = useState<Page | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<Record<string, unknown>>({});

  const { data: treeData, isLoading, error, refetch } = usePageTree();
  const { data: allPagesData } = usePages({ per_page: 200 });

  // Auto-open create modal when ?parent=slug is in URL (from navbar "+" button)
  const allPagesList2 = allPagesData?.data || [];
  useEffect(() => {
    const parentSlug = searchParams.get("parent");
    if (parentSlug && allPagesList2.length > 0) {
      const parentPage = allPagesList2.find((p) => p.slug === parentSlug || `${p.slug}` === parentSlug);
      if (parentPage) {
        setCreateDefaults({ parent_id: String(parentPage.id), is_nav_item: true, page_type: "content", is_published: true });
        setIsCreateOpen(true);
      } else {
        setCreateDefaults({ is_nav_item: true, page_type: "content", is_published: true });
        setIsCreateOpen(true);
      }
      // Clear query param
      router.replace("/sahifalar");
    }
  }, [searchParams, allPagesList2, router]);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();
  const reorderPages = useReorderPages();

  // Vaqtinchalik parol himoyasi — bir martta sessiyada (PageLock unlock'iga bog'langan)
  const { guard, modal: pwGuardModal } = usePasswordGuard(SAHIFALAR_PASSWORD, SAHIFALAR_UNLOCK_KEY);

  const pages = treeData || [];
  const allPagesList = allPagesData?.data || [];

  /** Build parent select options from flat list */
  const parentOptions = useMemo(() => {
    const flat = flattenTree(pages);
    return [
      { value: "", label: "-- Ota sahifa yo'q (root) --" },
      ...flat.map((item) => ({ value: String(item.id), label: item.title })),
    ];
  }, [pages]);

  /** Build field configs (dynamic because parent options change) */
  const getFields = useCallback(
    (pageType?: string): FieldConfig[] => {
      const fields: FieldConfig[] = [
        { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
      ];

      // Only show content for content type
      if (pageType !== "link" && pageType !== "group") {
        fields.push({
          name: "content",
          label: "Kontent",
          type: "richtext",
          translatable: true,
        });
      }

      fields.push(
        { name: "slug", label: "Slug (URL)", type: "text", placeholder: "avtomatik-yaratiladi" },
        {
          name: "parent_id",
          label: "Ota sahifa",
          type: "select",
          options: parentOptions,
        },
        {
          name: "sort_order",
          label: "Tartib raqami",
          type: "number",
          halfWidth: true,
        },
        {
          name: "page_type",
          label: "Sahifa turi",
          type: "select",
          options: PAGE_TYPE_OPTIONS,
          required: true,
          halfWidth: true,
        },
      );

      // Show external_url only for link type
      if (pageType === "link") {
        fields.push({
          name: "external_url",
          label: "Tashqi havola (URL)",
          type: "text",
          placeholder: "https://...",
        });
      }

      fields.push(
        { name: "nav_icon", label: "Nav icon (lucide nomi)", type: "text", halfWidth: true },
        { name: "is_nav_item", label: "Navigatsiyada ko'rsatish", type: "toggle" },
        { name: "is_published", label: "Chop etish", type: "toggle" },
      );

      return fields;
    },
    [parentOptions]
  );

  /* ── Handlers ── */

  // Inner: parolsiz modal ochish (URL ?parent= dan auto-open uchun ishlatilmaydi —
  // u allaqachon navbar tugmasi orqali parol bilan tasdiqlangan).
  const openCreateModal = useCallback((defaults?: Record<string, unknown>) => {
    setCreateDefaults({
      is_published: true,
      page_type: "content",
      sort_order: 0,
      is_nav_item: false,
      ...defaults,
    });
    setIsCreateOpen(true);
  }, []);

  // Tashqi entry pointlar — har biri parol so'raydi
  const handleOpenCreate = useCallback(
    (defaults?: Record<string, unknown>) => {
      guard(() => openCreateModal(defaults), {
        title: "Yangi sahifa qo'shish",
        description: "Davom etish uchun parolni kiriting",
      });
    },
    [guard, openCreateModal]
  );

  const handleOpenCreateSection = useCallback(() => {
    guard(() => openCreateModal({ is_nav_item: true, page_type: "group" }), {
      title: "Yangi bo'lim qo'shish",
      description: "Davom etish uchun parolni kiriting",
    });
  }, [guard, openCreateModal]);

  const handleAddChild = useCallback(
    (parentId: number) => {
      guard(() => openCreateModal({ parent_id: String(parentId) }), {
        title: "Bola sahifa qo'shish",
        description: "Davom etish uchun parolni kiriting",
      });
    },
    [guard, openCreateModal]
  );

  const handleCreate = useCallback(
    async (formData: FormData) => {
      // Auto-generate slug from title if not provided
      const slug = formData.get("slug") as string;
      const titleUz = formData.get("title[uz]") as string;
      if (!slug && titleUz) {
        formData.set("slug", slugify(titleUz));
      }

      // Build JSON payload from FormData (pageService expects Record<string, unknown>)
      const payload: Record<string, unknown> = {};
      const title: Record<string, string> = {};
      const content: Record<string, string> = {};

      formData.forEach((value, key) => {
        if (key.startsWith("title[")) {
          const lang = key.replace("title[", "").replace("]", "");
          title[lang] = value as string;
        } else if (key.startsWith("content[")) {
          const lang = key.replace("content[", "").replace("]", "");
          content[lang] = value as string;
        } else {
          payload[key] = value;
        }
      });

      if (Object.keys(title).length > 0) payload.title = title;
      if (Object.keys(content).length > 0) payload.content = content;

      // Convert toggle values
      if (payload.is_published !== undefined) payload.is_published = payload.is_published === "1";
      if (payload.is_nav_item !== undefined) payload.is_nav_item = payload.is_nav_item === "1";
      if (payload.sort_order !== undefined) payload.sort_order = Number(payload.sort_order) || 0;
      if (payload.parent_id === "" || payload.parent_id === undefined) payload.parent_id = null;
      else payload.parent_id = Number(payload.parent_id);

      await createPage.mutateAsync(payload);
      setIsCreateOpen(false);
      refetch();
    },
    [createPage, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;

      const slug = formData.get("slug") as string;
      const titleUz = formData.get("title[uz]") as string;
      if (!slug && titleUz) {
        formData.set("slug", slugify(titleUz));
      }

      // Build JSON payload
      const payload: Record<string, unknown> = {};
      const title: Record<string, string> = {};
      const content: Record<string, string> = {};

      formData.forEach((value, key) => {
        if (key.startsWith("title[")) {
          const lang = key.replace("title[", "").replace("]", "");
          title[lang] = value as string;
        } else if (key.startsWith("content[")) {
          const lang = key.replace("content[", "").replace("]", "");
          content[lang] = value as string;
        } else {
          payload[key] = value;
        }
      });

      if (Object.keys(title).length > 0) payload.title = title;
      if (Object.keys(content).length > 0) payload.content = content;

      // Convert toggle values
      if (payload.is_published !== undefined) payload.is_published = payload.is_published === "1";
      if (payload.is_nav_item !== undefined) payload.is_nav_item = payload.is_nav_item === "1";
      if (payload.sort_order !== undefined) payload.sort_order = Number(payload.sort_order) || 0;
      if (payload.parent_id === "" || payload.parent_id === undefined) payload.parent_id = null;
      else payload.parent_id = Number(payload.parent_id);

      await updatePage.mutateAsync({ id: editItem.id, data: payload });
      setEditItem(null);
      refetch();
    },
    [editItem, updatePage, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteItem) return;
    await deletePage.mutateAsync(deleteItem.id);
    setDeleteItem(null);
    refetch();
  }, [deleteItem, deletePage, refetch]);

  const handleMoveUp = useCallback(
    (page: Page) => {
      const siblings = findSiblings(pages, page.id);
      if (!siblings) return;
      const idx = siblings.findIndex((s) => s.id === page.id);
      if (idx <= 0) return;

      const items = siblings.map((s, i) => ({
        id: s.id,
        sort_order: i,
        parent_id: s.parent_id,
      }));
      // Swap
      const temp = items[idx].sort_order;
      items[idx].sort_order = items[idx - 1].sort_order;
      items[idx - 1].sort_order = temp;

      reorderPages.mutate(items);
    },
    [pages, reorderPages]
  );

  const handleMoveDown = useCallback(
    (page: Page) => {
      const siblings = findSiblings(pages, page.id);
      if (!siblings) return;
      const idx = siblings.findIndex((s) => s.id === page.id);
      if (idx < 0 || idx >= siblings.length - 1) return;

      const items = siblings.map((s, i) => ({
        id: s.id,
        sort_order: i,
        parent_id: s.parent_id,
      }));
      // Swap
      const temp = items[idx].sort_order;
      items[idx].sort_order = items[idx + 1].sort_order;
      items[idx + 1].sort_order = temp;

      reorderPages.mutate(items);
    },
    [pages, reorderPages]
  );

  /* ── Derive edit fields based on current page_type ── */
  const editFields = useMemo(() => {
    if (editItem) return getFields(editItem.page_type);
    const pt = (createDefaults.page_type as string) || "content";
    return getFields(pt);
  }, [editItem, createDefaults, getFields]);

  const editInitialData = useMemo(() => {
    if (!editItem) return createDefaults;
    return {
      title: editItem.title,
      content: editItem.content,
      slug: editItem.slug,
      parent_id: editItem.parent_id ? String(editItem.parent_id) : "",
      sort_order: editItem.sort_order,
      page_type: editItem.page_type,
      external_url: editItem.external_url || "",
      nav_icon: editItem.nav_icon || "",
      is_nav_item: editItem.is_nav_item,
      is_published: editItem.is_published,
    };
  }, [editItem, createDefaults]);

  return (
    <PageLock
      password={SAHIFALAR_PASSWORD}
      sessionKey={SAHIFALAR_UNLOCK_KEY}
      title="Sahifalar boshqaruvi qulflangan"
      description="Bu bo'limga kirish uchun parolni kiriting"
      cancelHref="/dashboard"
    >
    <section className="py-6">
      <Container>
        {/* ── Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              Sahifalar boshqaruvi
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Barcha sahifalar va navigatsiya tuzilmasini boshqaring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenCreateSection}
              variant="secondary"
              icon={<FolderPlus className="size-4" />}
            >
              Yangi bo&apos;lim
            </Button>
            <Button
              onClick={() => handleOpenCreate()}
              icon={<Plus className="size-4" />}
            >
              Yangi sahifa
            </Button>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Sahifa nomi yoki slug bo'yicha qidirish..."
            className="max-w-md"
          />
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : pages.length === 0 ? (
          <EmptyState
            title="Sahifalar topilmadi"
            message="Hozircha sahifa qo'shilmagan. Yangi sahifa yoki bo'lim yarating."
            icon={<FileText className="w-8 h-8 text-gray-400" />}
            action={{ label: "Yangi sahifa", onClick: () => handleOpenCreate() }}
          />
        ) : (
          <PageTreeView
            pages={pages}
            onEdit={setEditItem}
            onAddChild={handleAddChild}
            onDelete={setDeleteItem}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            searchQuery={searchQuery}
          />
        )}

        {/* ── Create Modal ── */}
        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi sahifa qo'shish"
          fields={editFields}
          initialData={createDefaults}
          onSubmit={handleCreate}
          isLoading={createPage.isPending}
        />

        {/* ── Edit Modal ── */}
        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Sahifani tahrirlash"
            fields={editFields}
            initialData={editInitialData}
            onSubmit={handleUpdate}
            isLoading={updatePage.isPending}
          />
        )}

        {/* ── Delete Confirm ── */}
        <ConfirmDialog
          isOpen={deleteItem !== null}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          title="Sahifani o'chirish"
          message={
            deleteItem?.children && deleteItem.children.length > 0
              ? `"${deleteItem?.title?.uz || "Nomsiz"}" sahifasi va uning ${deleteItem.children.length} ta bola sahifasi o'chiriladi. Davom etasizmi?`
              : `"${deleteItem?.title?.uz || "Nomsiz"}" sahifasi butunlay o'chiriladi. Davom etasizmi?`
          }
          isLoading={deletePage.isPending}
        />

        {/* ── Vaqtinchalik parol himoyasi (sessiyada bir martta) ── */}
        {pwGuardModal}
      </Container>
    </section>
    </PageLock>
  );
}
