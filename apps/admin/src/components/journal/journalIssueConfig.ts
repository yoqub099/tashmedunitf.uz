import type { FieldConfig } from "@/types/inline-edit";

export const JOURNAL_ISSUE_FIELDS: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "description", label: "Tavsif", type: "textarea", translatable: true },
  { name: "cover", label: "Muqova rasmi", type: "media", accept: "image/*", maxSize: 5120 },
  { name: "file", label: "PDF fayl", type: "media", accept: ".pdf", maxSize: 51200 },
  { name: "date", label: "Sana", type: "date", required: true, halfWidth: true },
  { name: "year", label: "Yil", type: "number", required: true, halfWidth: true },
  { name: "issue_number", label: "Son raqami", type: "number", required: true, halfWidth: true },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true },
  { name: "is_current", label: "Joriy son", type: "toggle", halfWidth: true },
  { name: "is_published", label: "Faol", type: "toggle", halfWidth: true },
];

export const JOURNAL_ISSUE_CREATE_DEFAULTS = {
  is_published: true,
  is_current: false,
  sort_order: 0,
  year: new Date().getFullYear(),
  issue_number: 1,
};

export function buildEditInitialData(detail: {
  title: unknown;
  description?: unknown;
  date: string;
  year: number;
  issue_number: number;
  is_current: boolean;
  is_published: boolean;
  sort_order: number;
  cover?: string;
  cover_thumbnail?: string;
  file_url?: string | null;
}) {
  return {
    title: detail.title,
    description: detail.description,
    date: detail.date,
    year: detail.year,
    issue_number: detail.issue_number,
    is_current: detail.is_current,
    is_published: detail.is_published,
    sort_order: detail.sort_order,
    cover: detail.cover || detail.cover_thumbnail,
    file: detail.file_url,
  };
}
