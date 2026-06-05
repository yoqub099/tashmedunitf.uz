"use client";

import { useState } from "react";
import { usePageBySlug, useCreatePage, useUpdatePage } from "@/hooks/usePages";
import { sanitizeHtml } from "@/lib/sanitize";
import { parseFormData } from "@/lib/utils";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import { Plus, Pencil } from "lucide-react";

const PAGE_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true, required: true },
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
];

const fallbackContent = `
<p><strong>Toshkent davlat tibbiyot universiteti Termiz filiali (TdTUTF)</strong> ning konsultativ-maslahat organlari filial faoliyatini samarali boshqarish, ta'lim sifatini nazorat qilish va strategik qarorlar qabul qilishda muhim rol o'ynaydi.</p>
<p><strong>Kuzatuv kengashi</strong> — filialning eng yuqori boshqaruv organi bo'lib, TdTUTF Termiz filialining uzoq muddatli rivojlanish strategiyasini belgilaydi, moliyaviy hisobotlarni ko'rib chiqadi va filial rahbariyati faoliyatini nazorat qiladi.</p>
<p><strong>Filial kengashi</strong> — ichki boshqaruv va akademik siyosatni amalga oshiradi. Kengash tibbiy ta'lim dasturlarini tasdiqlash, professor-o'qituvchilar tarkibini shakllantirish va talabalar qabuli masalalarini hal qiladi.</p>
`;

/* ── Org chart box ── */
function OrgBox({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`rounded-xl border-2 border-[#00575B] bg-white px-4 py-3 text-center text-sm font-semibold text-[#00575B] shadow-sm ${className || ""}`}
    >
      {label}
    </div>
  );
}

/* ── Org chart component ── */
function OrgChart() {
  return (
    <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center gap-0">
      {/* Kuzatuv kengashi */}
      <OrgBox label="Kuzatuv kengashi" className="w-64" />
      <div className="h-6 w-0.5 bg-[#00575B]" />

      {/* Filial Kengashi */}
      <OrgBox label="Filial Kengashi" className="w-64" />
      <div className="h-6 w-0.5 bg-[#00575B]" />

      {/* Connector line */}
      <div className="w-full max-w-xl border-t-2 border-[#00575B]" />

      {/* 3 columns */}
      <div className="grid w-full max-w-xl grid-cols-3 gap-0">
        {/* Left column */}
        <div className="flex flex-col items-center gap-0">
          <div className="h-6 w-0.5 bg-[#00575B]" />
          <OrgBox label="O'quv-uslubiy kengash" className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label="Ilmiy kengash" className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label="Kafedralar kengashi" className="w-full" />
        </div>

        {/* Center spacer */}
        <div />

        {/* Right column */}
        <div className="flex flex-col items-center gap-0">
          <div className="h-6 w-0.5 bg-[#00575B]" />
          <OrgBox label="Direktor maslahatchilari" className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label="Talabalar kengashi" className="w-full" />
          <div className="h-4 w-0.5 bg-[#00575B]" />
          <OrgBox label="Moliya qo'mitasi" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default function KonsultativOrganlarAdminPage() {
  const slug = "konsultativ-organlar";
  const { data: page, isLoading, error, refetch } = usePageBySlug(slug);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (page) {
      await updatePage.mutateAsync({ id: page.id, data: parseFormData(formData) });
    } else {
      formData.append("slug", slug);
      await createPage.mutateAsync(parseFormData(formData));
    }
    setIsModalOpen(false);
    refetch();
  };

  const title = page?.title?.uz || "Konsultativ-maslahat organlari";
  const content = page?.content?.uz || fallbackContent;
  const hasPage = !!page;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 md:text-[32px]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Maslahat va kengash organlari</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={hasPage ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {hasPage ? "Tahrirlash" : "Sahifa yaratish"}
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error && !page ? (
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl flex flex-col gap-6">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">{title}</h4>
            <div
              className="text-base text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(fallbackContent) }}
            />
            <OrgChart />
            <div className="flex justify-center pt-4">
              <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                Sahifa yaratish (bazaga saqlash)
              </Button>
            </div>
          </div>
        ) : (
          <EditableWrapper
            entityType="page"
            entityId={page?.id}
            onEdit={() => setIsModalOpen(true)}
            label="Sahifa kontenti"
          >
            <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl flex flex-col gap-6">
              <h4 className="font-serif text-2xl font-semibold text-gray-900">{title}</h4>
              <div
                className="text-base text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_strong]:text-gray-900 [&_a]:text-[#00575B] [&_a]:underline [&_img]:mx-auto [&_img]:rounded-xl [&_img]:my-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
              />
              {!hasPage && <OrgChart />}
            </div>
          </EditableWrapper>
        )}

        {/* Org chart always shown below content */}
        {hasPage && (
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl mt-6">
            <h4 className="font-serif text-lg font-semibold text-gray-700 text-center mb-2">Tashkiliy tuzilma</h4>
            <OrgChart />
          </div>
        )}

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={hasPage ? "Konsultativ organlar — Tahrirlash" : "Konsultativ organlar — Yangi sahifa"}
          fields={PAGE_FIELDS}
          initialData={page ? {
            title: page.title,
            content: page.content,
            is_published: page.is_published,
          } : { title: { uz: "Konsultativ-maslahat organlari" }, is_published: true }}
          onSubmit={handleSubmit}
          isLoading={createPage.isPending || updatePage.isPending}
        />
      </Container>
    </section>
  );
}
