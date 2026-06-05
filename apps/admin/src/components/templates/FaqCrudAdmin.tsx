"use client";

import { useState, useCallback } from "react";
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@/hooks/useFaqs";
import { sanitizeHtml } from "@/lib/sanitize";
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
import type { Faq } from "@/types";
import { parseFormData } from "@/lib/utils";
import { Plus, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const FAQ_FIELDS: FieldConfig[] = [
  { name: "question", label: "Savol", type: "text", translatable: true, required: true },
  { name: "answer", label: "Javob", type: "richtext", translatable: true, required: true },
  { name: "category", label: "Kategoriya", type: "text", placeholder: "Umumiy" },
  { name: "sort_order", label: "Tartib raqami", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
];

export default function FaqCrudAdmin() {
  const [editItem, setEditItem] = useState<Faq | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useFaqs({ "filter[general]": 1, per_page: 50 });
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const handleCreate = useCallback(async (formData: FormData) => {
    const obj = parseFormData(formData);
    await createFaq.mutateAsync(obj);
    setIsCreateOpen(false);
    refetch();
  }, [createFaq, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    const obj = parseFormData(formData);
    await updateFaq.mutateAsync({ id: editItem.id, data: obj });
    setEditItem(null);
    refetch();
  }, [editItem, updateFaq, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteFaq.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteFaq, refetch]);

  const items: Faq[] = data?.data || [];

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          title="Ko'p beriladigan savollar"
          subtitle="FAQ — Savollarni boshqarish"
        />

        <div className="flex justify-end mb-6 sm:mb-8">
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi savol
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Savollar topilmadi"
            message="Hozircha FAQ qo'shilmagan"
            icon={<HelpCircle className="w-8 h-8 text-gray-400" />}
            action={{ label: "Savol qo'shish", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="space-y-2.5 sm:space-y-3 max-w-3xl mx-auto">
            {items.map((item, index) => (
              <EditableWrapper
                key={item.id}
                entityType="faq"
                entityId={item.id}
                onEdit={() => setEditItem(item)}
                onDelete={() => setDeleteId(item.id)}
                label={`FAQ #${index + 1}`}
              >
                <Card padding={false}>
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-400 w-5 sm:w-6">
                        {item.sort_order || index + 1}
                      </span>
                      <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-1">
                        {item.question?.uz || "Savolsiz"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-3 sm:ml-4">
                      <Badge variant={item.is_active ? "success" : "warning"} size="sm">
                        {item.is_active ? "Faol" : "Nofaol"}
                      </Badge>
                      {expandedId === item.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedId === item.id && (
                    <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-0 border-t border-gray-100">
                      <div
                        className="prose prose-sm max-w-none text-gray-600 mt-3"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.answer?.uz) || "Javob kiritilmagan" }}
                      />
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
          title="Yangi savol qo'shish"
          fields={FAQ_FIELDS}
          initialData={{ is_active: true, sort_order: items.length + 1 }}
          onSubmit={handleCreate}
          isLoading={createFaq.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Savolni tahrirlash"
            fields={FAQ_FIELDS}
            initialData={{
              question: editItem.question,
              answer: editItem.answer,
              category: editItem.category,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateFaq.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Savolni o'chirish"
          message="Bu savol butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteFaq.isPending}
        />
      </Container>
    </section>
  );
}
