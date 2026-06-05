/**
 * Common base types shared across all entities.
 */

export type Locale = 'uz' | 'ru' | 'en';

export type Translatable = {
  uz?: string | null;
  ru?: string | null;
  en?: string | null;
};

export type Timestamps = {
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type Identifiable = {
  id: number;
};

export type SoftDeletable = {
  deleted_at?: string | null;
};

export type Sortable = {
  sort_order: number;
};

export type Toggleable = {
  is_active: boolean;
};

export type Slug = string;

export type MediaItem = {
  id: number;
  uuid: string;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url: string;
  preview_url?: string;
  conversions?: Record<string, string>;
};
