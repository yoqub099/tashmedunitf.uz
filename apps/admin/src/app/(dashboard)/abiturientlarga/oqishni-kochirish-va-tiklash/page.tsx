"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import type { FieldConfig } from "@/types/inline-edit";
import type { SiteContentUpsertData } from "@/types";
import { useSiteContents, useBatchUpsertSiteContent, useDeleteSiteContent } from "@/hooks/useSiteContents";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";

const TRANSFER_FIELDS: FieldConfig[] = [
  { name: "transfer_title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "transfer_text", label: "Matn", type: "richtext", translatable: true },
];

export default function OqishniKochirishPage() {
  const { data: siteContents = [], isLoading, error, refetch } = useSiteContents("applicants");
  const batchUpsert = useBatchUpsertSiteContent();
  const deleteSiteContent = useDeleteSiteContent();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const findContent = (key: string) => siteContents.find((c: { key: string }) => c.key === key);

  const titleContent = findContent("applicants_transfer_title");
  const textContent = findContent("applicants_transfer_text");

  const title = titleContent?.value?.uz || "O'qishni ko'chirish va tiklash";
  const text = textContent?.value?.uz || "<p>Talabalar o\u2018qishni ko\u2018chirish bo\u2018yicha arizalarni topshirish va ko\u2018rib chiqish quyidagicha amalga oshiriladi:</p><ul><li>o\u2018qishni ko\u2018chirish bo\u2018yicha arizalarni taqdim etish - har yili 10-iyuldan 10-avgustga qadar amalga oshiriladi;</li><li>arizalarni ko\u2018rib chiqish va qaror qabul qilish - har yili 10-avgustdan 30-avgustga qadar amalga oshiriladi.</li></ul>";

  const handleSave = async (fd: FormData) => {
    const items: SiteContentUpsertData[] = [];
    const titleVal: Record<string, string> = {};
    const textVal: Record<string, string> = {};
    fd.forEach((v, k) => {
      const m = k.match(/^transfer_title\[(\w+)\]$/);
      if (m) { titleVal[m[1]] = String(v); return; }
      const m2 = k.match(/^transfer_text\[(\w+)\]$/);
      if (m2) { textVal[m2[1]] = String(v); }
    });
    if (Object.keys(titleVal).length > 0) {
      items.push({ key: "applicants_transfer_title", section: "applicants", value: { uz: titleVal.uz || "", ru: titleVal.ru, en: titleVal.en }, type: "text" });
    }
    if (Object.keys(textVal).length > 0) {
      items.push({ key: "applicants_transfer_text", section: "applicants", value: { uz: textVal.uz || "", ru: textVal.ru, en: textVal.en }, type: "html" });
    }
    if (items.length > 0) await batchUpsert.mutateAsync(items);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    try {
      await Promise.all([
        deleteSiteContent.mutateAsync("applicants_transfer_title"),
        deleteSiteContent.mutateAsync("applicants_transfer_text"),
      ]);
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Container className="py-6">
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700 font-medium mb-3">Ma&apos;lumotlarni yuklashda xatolik</p>
          <button onClick={() => refetch()} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">
            Qayta urinish
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* Header — ISFT style */}
      <section>
        <h1 className="font-serif text-[32px] font-semibold leading-tight lg:text-5xl first-letter:capitalize">
          {title}
        </h1>

        {/* Breadcrumb */}
        <nav className="text-sm font-medium mb-6 mt-3">
          <ol className="flex items-center gap-1.5 text-gray-500 flex-wrap">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="hover:text-[#00575B] transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            </li>
            <li className="flex items-center gap-1.5">
              <Link href="/abiturientlarga" className="hover:text-[#00575B] transition-colors">
                Abiturientlarga
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            </li>
            <li className="text-[#00575B] font-semibold">
              O&apos;qishni ko&apos;chirish va tiklash
            </li>
          </ol>
        </nav>

        {/* Content card */}
        <EditableWrapper
          entityType="site-content"
          entityId="transfer"
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
          onAdd={() => setIsEditOpen(true)}
          label="Ko'chirish bo'limi"
        >
          <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100">
            <div
              className="text-base font-semibold text-gray-800 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-2 [&_li]:mb-1.5 [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
            />
          </div>
        </EditableWrapper>
      </section>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="O'qishni ko'chirish va tiklash — tahrirlash"
        fields={TRANSFER_FIELDS}
        initialData={{
          transfer_title: titleContent?.value || { uz: title },
          transfer_text: textContent?.value || { uz: text },
        }}
        onSubmit={handleSave}
        isLoading={batchUpsert.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Kontentni tozalash"
        message="Sarlavha va matn tozalanadi. Standart matn ko'rinadi. Davom etasizmi?"
        isLoading={deleteSiteContent.isPending}
      />
    </Container>
  );
}
