"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useSiteContents,
  useUpsertSiteContent,
  useDeleteSiteContent,
} from "@/hooks/useSiteContents";
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
import { sanitizeHtml } from "@/lib/sanitize";
import type { FieldConfig } from "@/types/inline-edit";
import type { SiteContent, SiteContentUpsertData, Translatable } from "@/types";
import { Plus, FileText, Filter } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "text", label: "Oddiy matn" },
  { value: "textarea", label: "Uzun matn" },
  { value: "html", label: "HTML / Rich text" },
];

const SITE_CONTENT_FIELDS_CREATE: FieldConfig[] = [
  { name: "key", label: "Kalit (kebab-case)", type: "text", required: true, placeholder: "hero-title, footer-tagline..." },
  { name: "section", label: "Bo'lim", type: "text", required: true, placeholder: "hero, footer, about..." },
  {
    name: "type",
    label: "Tur",
    type: "select",
    required: true,
    options: TYPE_OPTIONS,
    halfWidth: true,
  },
  { name: "value", label: "Qiymat", type: "richtext", translatable: true, required: true },
];

const SITE_CONTENT_FIELDS_EDIT: FieldConfig[] = [
  // Key va section o'zgartirilmaydi (immutable identifier)
  {
    name: "type",
    label: "Tur",
    type: "select",
    required: true,
    options: TYPE_OPTIONS,
  },
  { name: "value", label: "Qiymat", type: "richtext", translatable: true, required: true },
];

interface FlatFormData {
  key?: string;
  section?: string;
  type?: string;
  value?: Translatable;
}

function parseFormDataLocal(formData: FormData): FlatFormData {
  const obj: FlatFormData = {};
  const value: Record<string, string> = {};

  formData.forEach((v, key) => {
    if (key === "_method") return;
    if (key.startsWith("value[") && key.endsWith("]")) {
      const lang = key.slice(6, -1);
      value[lang] = String(v);
    } else if (key === "key") {
      obj.key = String(v);
    } else if (key === "section") {
      obj.section = String(v);
    } else if (key === "type") {
      obj.type = String(v);
    }
  });

  if (Object.keys(value).length > 0) {
    obj.value = (value as { uz?: string; ru?: string; en?: string }) as Translatable;
  }

  return obj;
}

export default function SiteContentsCrudAdmin() {
  const [editItem, setEditItem] = useState<SiteContent | null>(null);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const { data: contents, isLoading, error, refetch } = useSiteContents();
  const upsertContent = useUpsertSiteContent();
  const deleteContent = useDeleteSiteContent();

  const items: SiteContent[] = useMemo(() => contents || [], [contents]);

  const sections = useMemo(() => {
    const set = new Set<string>();
    items.forEach((c) => set.add(c.section));
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = items;
    if (selectedSection) list = list.filter((c) => c.section === selectedSection);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.key.toLowerCase().includes(q) ||
          c.section.toLowerCase().includes(q) ||
          (c.value?.uz || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, selectedSection, searchQuery]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, SiteContent[]> = {};
    filteredItems.forEach((c) => {
      if (!groups[c.section]) groups[c.section] = [];
      groups[c.section].push(c);
    });
    return groups;
  }, [filteredItems]);

  const handleCreate = useCallback(
    async (formData: FormData) => {
      const obj = parseFormDataLocal(formData);
      if (!obj.key || !obj.section || !obj.value) return;
      await upsertContent.mutateAsync({
        key: obj.key,
        section: obj.section,
        value: obj.value,
        type: (obj.type as "text" | "textarea" | "html") || "text",
      } as SiteContentUpsertData);
      setIsCreateOpen(false);
      refetch();
    },
    [upsertContent, refetch]
  );

  const handleUpdate = useCallback(
    async (formData: FormData) => {
      if (!editItem) return;
      const obj = parseFormDataLocal(formData);
      if (!obj.value) return;
      await upsertContent.mutateAsync({
        key: editItem.key,
        section: editItem.section,
        value: obj.value,
        type: (obj.type as "text" | "textarea" | "html") || editItem.type,
      } as SiteContentUpsertData);
      setEditItem(null);
      refetch();
    },
    [editItem, upsertContent, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteKey) return;
    await deleteContent.mutateAsync(deleteKey);
    setDeleteKey(null);
    refetch();
  }, [deleteKey, deleteContent, refetch]);

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Sayt kontenti"
          subtitle="Frontenddagi statik matnlar va HTML bloklar — kalit asosida"
        />

        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="default">Jami: {items.length}</Badge>
              <Badge variant="success">Bo&apos;limlar: {sections.length}</Badge>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Yangi kalit
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Kalit, bo'lim yoki qiymat bo'yicha qidirish..."
              className="flex-1"
            />
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Hamma bo&apos;limlar</option>
                {sections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Kontent topilmadi"
            message={items.length === 0 ? "Hozircha sayt kontenti yo'q. Birinchi kalitni qo'shing." : "Filter bo'yicha hech narsa topilmadi."}
            icon={<FileText className="w-8 h-8 text-gray-400" />}
            action={items.length === 0 ? { label: "Birinchi kalit", onClick: () => setIsCreateOpen(true) } : undefined}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([section, sectionItems]) => (
              <div key={section}>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700">
                    {section}
                  </h3>
                  <Badge variant="default" size="sm">{sectionItems.length}</Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {sectionItems.map((item) => (
                    <EditableWrapper
                      key={item.key}
                      entityType="site-content"
                      entityId={item.key}
                      onEdit={() => setEditItem(item)}
                      onDelete={() => setDeleteKey(item.key)}
                      label={item.key}
                    >
                      <Card padding={true}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0 flex-1">
                            <code className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {item.key}
                            </code>
                          </div>
                          <Badge variant="default" size="sm">{item.type}</Badge>
                        </div>
                        <div
                          className="prose prose-sm max-w-none text-gray-700 line-clamp-3 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(item.value?.uz) || "<em class='text-gray-400'>Qiymat kiritilmagan</em>",
                          }}
                        />
                      </Card>
                    </EditableWrapper>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi sayt kontenti qo'shish"
          fields={SITE_CONTENT_FIELDS_CREATE}
          initialData={{ type: "text" }}
          onSubmit={handleCreate}
          isLoading={upsertContent.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title={`Tahrirlash: ${editItem.key}`}
            fields={SITE_CONTENT_FIELDS_EDIT}
            initialData={{
              type: editItem.type,
              value: editItem.value,
            }}
            onSubmit={handleUpdate}
            isLoading={upsertContent.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteKey !== null}
          onClose={() => setDeleteKey(null)}
          onConfirm={handleDelete}
          title="Kalitni o'chirish"
          message={`"${deleteKey}" kaliti butunlay o'chiriladi. Davom etasizmi?`}
          isLoading={deleteContent.isPending}
        />
      </Container>
    </section>
  );
}
