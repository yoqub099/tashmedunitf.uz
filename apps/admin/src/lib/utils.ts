import type { Translatable } from '@/types';
import type { Language } from '@/types/inline-edit';

// `cn` is sourced from the shared @tmtu/utils package (monorepo consolidation).
export { cn } from '@tmtu/utils';

/**
 * Get translated value or fallback to UZ
 */
export function t(value: Translatable | undefined, lang: Language = 'uz'): string {
  if (!value) return '';
  return value[lang] || value.uz || '';
}

/**
 * Format date to locale string
 */
export function formatDate(date: string | Date, locale: string = 'uz-UZ'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "3 soat oldin")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Hozirgina';
  if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;
  if (diffHours < 24) return `${diffHours} soat oldin`;
  if (diffDays < 7) return `${diffDays} kun oldin`;
  return formatDate(date);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

export function decodeHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#0?39);/g, (m) => HTML_ENTITY_MAP[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function decodeTranslatable(value: Translatable | undefined): Translatable {
  if (!value) return { uz: '' };
  return {
    uz: decodeHtml(value.uz),
    ru: value.ru !== undefined ? decodeHtml(value.ru) : undefined,
    en: value.en !== undefined ? decodeHtml(value.en) : undefined,
  };
}

/**
 * Build FormData from object, handling translatable fields with bracket keys
 */
export function buildFormData(data: Record<string, unknown>, method?: 'PUT' | 'POST'): FormData {
  const formData = new FormData();

  if (method === 'PUT') {
    formData.append('_method', 'PUT');
  }

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) && value[0] instanceof File) {
      value.forEach((file: File) => formData.append(`${key}[]`, file));
    } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
      // Translatable or nested object: { uz: "...", ru: "...", en: "..." }
      const obj = value as Record<string, unknown>;
      for (const [subKey, subValue] of Object.entries(obj)) {
        if (subValue !== undefined && subValue !== null) {
          formData.append(`${key}[${subKey}]`, String(subValue));
        }
      }
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}

/**
 * Parse FormData back to nested object
 * Converts bracket-notation keys like "question[uz]" to { question: { uz: "..." } }
 * Required when sending FormData as JSON to Laravel backend
 */
export function parseFormData(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    // Handle empty bracket notation: field[] → array
    const arrayMatch = key.match(/^([^[]+)\[\]$/);
    if (arrayMatch) {
      const parent = arrayMatch[1];
      if (!result[parent]) result[parent] = [];
      (result[parent] as unknown[]).push(value);
      return;
    }

    // Handle bracket notation: field[subkey] → { field: { subkey: value } }
    const bracketMatch = key.match(/^([^[]+)\[([^\]]+)\]$/);
    if (bracketMatch) {
      const [, parent, child] = bracketMatch;
      if (!result[parent] || typeof result[parent] !== 'object') {
        result[parent] = {};
      }
      (result[parent] as Record<string, unknown>)[child] = value;
    } else {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Slug generator from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
