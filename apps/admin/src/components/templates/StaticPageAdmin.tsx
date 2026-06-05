"use client";

import { useState, useRef } from "react";
import { usePageBySlug, useCreatePage, useUpdatePage } from "@/hooks/usePages";
import { sanitizeHtml } from "@/lib/sanitize";
import api from "@/lib/api";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import Button from "@/components/shared/Button";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import { parseFormData } from "@/lib/utils";
import { FileText, Plus, Upload, Trash2, Download, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Card from "@/components/shared/Card";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DefaultDocItem {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  href?: string;
}

interface StaticPageAdminProps {
  slug: string;
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  defaultItems?: DefaultDocItem[];
  children?: React.ReactNode;
}

const PAGE_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "content", label: "Kontent", type: "richtext", translatable: true, required: true },
  { name: "is_published", label: "Chop etilgan", type: "toggle" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DOC_COLORS = ["blue", "green", "purple", "orange", "teal", "red", "indigo", "cyan", "yellow"];

const colorClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
  indigo: "bg-indigo-50 text-indigo-600",
  yellow: "bg-yellow-50 text-yellow-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

export default function StaticPageAdmin({ slug, title, description, breadcrumbItems, defaultItems, children }: StaticPageAdminProps) {
  const { data: page, isLoading, error, refetch } = usePageBySlug(slug);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDocumentUpload = async (files: FileList) => {
    if (!page) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("model_type", "page");
        fd.append("model_id", String(page.id));
        fd.append("collection", "documents");
        fd.append("type", "document");
        await api.post("media/upload", fd);
      }
      toast.success("Hujjat yuklandi");
      refetch();
    } catch {
      toast.error("Hujjat yuklashda xatolik");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDocumentRemove = async (mediaId: number) => {
    if (!page) return;
    try {
      await api.delete(`media/${mediaId}`);
      toast.success("Hujjat o'chirildi");
      refetch();
    } catch {
      toast.error("Hujjat o'chirishda xatolik");
    }
  };

  const handleDocumentReplace = (mediaId: number) => {
    if (!page) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setIsUploading(true);
      try {
        await api.delete(`media/${mediaId}`);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("model_type", "page");
        fd.append("model_id", String(page.id));
        fd.append("collection", "documents");
        fd.append("type", "document");
        await api.post("media/upload", fd);
        toast.success("Hujjat almashtirildi");
        refetch();
      } catch {
        toast.error("Hujjatni almashtirishda xatolik");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        {breadcrumbItems && (
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              {title}
            </h1>
            <Breadcrumb items={breadcrumbItems} className="mt-3" />
          </div>
        )}
        <LoadingSpinner size="lg" text="Yuklanmoqda..." />
      </Container>
    );
  }

  if (error && !page) {
    return (
      <section className="py-10 sm:py-16">
        <Container>
          {breadcrumbItems ? (
            <div className="mb-8">
              <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
                {title}
              </h1>
              <Breadcrumb items={breadcrumbItems} className="mt-3" />
            </div>
          ) : (
            <SectionTitle title={title} subtitle={description} />
          )}
          {defaultItems && defaultItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {defaultItems.map((item, i) => {
                const color = item.color || DOC_COLORS[i % DOC_COLORS.length];
                const colorClass = colorClasses[color] || colorClasses.blue;
                const cardContent = (
                  <Card key={i} className="group hover:shadow-md hover:border-blue-200 transition-all duration-200 h-full cursor-pointer">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                );
                return item.href ? (
                  <Link key={i} href={item.href}>{cardContent}</Link>
                ) : (
                  <div key={i}>{cardContent}</div>
                );
              })}
            </div>
          )}

          {children && <div className="mb-8">{children}</div>}

          <div className="flex flex-col items-center justify-center py-10 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Sahifa hali yaratilmagan</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 max-w-md text-center">
              &quot;{title}&quot; uchun kontent yaratish uchun quyidagi tugmani bosing.
            </p>
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Sahifa yaratish
            </Button>
          </div>
          <EditModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`${title} — Yangi sahifa`}
            fields={PAGE_FIELDS}
            initialData={{ title: { uz: title }, is_published: true, slug }}
            onSubmit={handleSubmit}
            isLoading={createPage.isPending}
          />
        </Container>
      </section>
    );
  }

  const documents = page?.documents ?? [];

  return (
    <section className="py-6 sm:py-8">
      <Container>
        {breadcrumbItems && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} className="mb-3" />
            <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              {title}
            </h1>
            {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
          </div>
        )}

        {children && <div className="mb-8">{children}</div>}

        {/* Hujjatlar NavHub-uslubdagi kartalar */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {documents.map((doc, i) => {
              const color = DOC_COLORS[i % DOC_COLORS.length];
              const colorClass = colorClasses[color] || colorClasses.blue;
              return (
                <Card key={doc.id} className="group relative hover:shadow-md hover:border-blue-200 transition-all duration-200 h-full">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">
                          {doc.name || doc.file_name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <a
                      href={doc.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#00575B] bg-[#00575B]/5 hover:bg-[#00575B]/10 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Yuklab olish
                    </a>
                    <button
                      onClick={() => handleDocumentReplace(doc.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Almashtirish
                    </button>
                    <button
                      onClick={() => handleDocumentRemove(doc.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      O&apos;chirish
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {documents.length === 0 && defaultItems && defaultItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {defaultItems.map((item, i) => {
              const color = item.color || DOC_COLORS[i % DOC_COLORS.length];
              const colorClass = colorClasses[color] || colorClasses.blue;
              const cardContent = (
                <Card key={i} className="group hover:shadow-md hover:border-blue-200 transition-all duration-200 h-full cursor-pointer">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                </Card>
              );
              return item.href ? (
                <Link key={i} href={item.href}>{cardContent}</Link>
              ) : (
                <div key={i}>{cardContent}</div>
              );
            })}
          </div>
        )}

        {/* Kontent bo'limi (yig'ilgan) */}
        <EditableWrapper
          entityType="page"
          entityId={page?.id}
          onEdit={() => setIsModalOpen(true)}
          label="Sahifa kontenti"
        >
          {!breadcrumbItems && (
            <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              {page?.title?.uz || title}
            </h2>
          )}
          {page?.content?.uz && (
            <section className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl mt-4">
              <div
                className="prose prose-base max-w-none text-gray-800 leading-relaxed
                  [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h1]:mt-0 [&_h1]:mb-4
                  [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-0 [&_h2]:mb-4
                  [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:text-base [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2
                  [&_strong]:text-gray-900 [&_strong]:font-semibold
                  [&_a]:text-[#00575B] [&_a]:underline
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:bg-white [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:shadow-sm
                  [&_thead]:bg-[#00575B]
                  [&_th]:text-white [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold
                  [&_td]:p-3 [&_td]:border-t [&_td]:border-gray-200 [&_td]:text-sm [&_td]:align-top
                  [&_tbody_tr:nth-child(even)]:bg-gray-50
                  [&_tbody_tr:hover]:bg-[#00575B]/5"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content.uz) }}
              />
            </section>
          )}
        </EditableWrapper>

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${title} — Tahrirlash`}
          fields={PAGE_FIELDS}
          initialData={page ? {
            title: page.title,
            content: page.content,
            is_published: page.is_published,
          } : { title: { uz: title }, is_published: true }}
          onSubmit={handleSubmit}
          isLoading={updatePage.isPending}
        />
      </Container>
    </section>
  );
}
