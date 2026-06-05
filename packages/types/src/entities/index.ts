/**
 * Domain entity types — mirror Laravel models.
 *
 * TODO: Auto-generate from OpenAPI spec (apps/api/docs/openapi.yaml)
 */

import type {
  Identifiable,
  Translatable,
  Timestamps,
  SoftDeletable,
  Sortable,
  Toggleable,
  MediaItem,
  Slug,
} from '../common';

export type News = Identifiable &
  Timestamps &
  SoftDeletable & {
    title: Translatable;
    excerpt: Translatable;
    content: Translatable;
    slug: Slug;
    category: string;
    is_published: boolean;
    published_at: string | null;
    cover?: MediaItem;
    media?: MediaItem[];
  };

export type Faculty = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    name: Translatable;
    description: Translatable;
    level: 'bakalavriat' | 'magistratura' | 'ordinatura';
  };

export type Department = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    name: Translatable;
    description: Translatable;
    slug: Slug;
    head_name: Translatable;
    head_title: Translatable;
    phone: string | null;
    email: string | null;
  };

export type Staff = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    full_name: Translatable;
    position: Translatable;
    bio: Translatable;
    department_id: number;
    department?: Department;
    phone: string | null;
    email: string | null;
    photo?: MediaItem;
  };

export type Direction = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    name: Translatable;
    description: Translatable;
    code: string;
    faculty_id: number | null;
    level: 'bakalavriat' | 'magistratura' | 'ordinatura';
    duration: number | null;
    price_daytime: number | null;
    price_remote: number | null;
    exam_subjects: string[] | null;
  };

export type Faq = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    question: Translatable;
    answer: Translatable;
    faculty_id: number | null;
    category: string;
  };

export type Banner = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    title: Translatable;
    subtitle: Translatable;
    button_text: Translatable;
    link: string | null;
    image?: MediaItem;
  };

export type Partner = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    name: string;
    url: string | null;
    logo?: MediaItem;
  };

export type Testimonial = Identifiable &
  Timestamps &
  SoftDeletable &
  Sortable &
  Toggleable & {
    name: Translatable;
    role: Translatable;
    text: Translatable;
    photo?: MediaItem;
  };

export type Page = Identifiable &
  Timestamps &
  SoftDeletable & {
    title: Translatable;
    content: Translatable;
    slug: Slug;
    parent_id: number | null;
    is_published: boolean;
    sort_order: number;
    depth: number;
    path: string;
    is_nav_item: boolean;
    page_type: string;
    external_url: string | null;
    nav_icon: string | null;
    children?: Page[];
  };

export type ContactMessage = Identifiable &
  Timestamps &
  SoftDeletable & {
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    status: 'new' | 'in_progress' | 'completed';
  };

export type SiteContent = Identifiable &
  Timestamps & {
    key: string;
    section: string;
    value: Translatable | Record<string, unknown>;
    type: 'text' | 'textarea' | 'image' | 'json';
  };
