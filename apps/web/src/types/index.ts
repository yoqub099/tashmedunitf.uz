// ============ API Response Types ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ============ Translatable Field ============

export type Translatable = {
  uz?: string;
  ru?: string;
  en?: string;
};

// ============ News ============

export interface NewsItem {
  id: number;
  title: Translatable;
  slug: string;
  excerpt: Translatable;
  content: Translatable;
  category: string;
  is_published: boolean;
  published_at: string | null;
  cover: string;
  cover_thumbnail: string;
  gallery: { id: number; url: string; name: string }[];
  created_at: string;
  updated_at?: string;
}

// ============ Department ============

export interface Department {
  id: number;
  name: Translatable;
  slug: string;
  description: Translatable;
  head_name: Translatable;
  head_title: Translatable;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  sort_order: number;
  image: string;
  image_thumbnail: string | null;
  image_medium: string | null;
  head_photo: string;
  head_photo_thumbnail: string | null;
  head_photo_medium: string | null;
  staff?: Staff[];
  created_at: string;
  updated_at: string;
}

// ============ Staff ============

export interface Staff {
  id: number;
  full_name: Translatable;
  position: Translatable;
  bio: Translatable;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  sort_order: number;
  photo: string;
  photo_thumbnail: string | null;
  photo_medium: string | null;
  department_id: number | null;
  department?: Department;
  created_at: string;
  updated_at: string;
}

// ============ Faculty ============

export interface Faculty {
  id: number;
  name: Translatable;
  description: Translatable;
  level: "bakalavriat" | "magistratura" | "ordinatura";
  is_active: boolean;
  sort_order: number;
  image: string;
  image_thumbnail: string | null;
  image_medium: string | null;
  directions?: Direction[];
  directions_count?: number;
  created_at: string;
  updated_at: string;
}

// ============ Direction / Program ============

export interface Direction {
  id: number;
  name: Translatable;
  code: string;
  level: "bakalavriat" | "magistratura" | "ordinatura";
  description: Translatable;
  duration: string;
  price_daytime: number | null;
  price_remote: number | null;
  faculty_id: number | null;
  is_active: boolean;
  sort_order: number;
  exam_subjects: string[];
  image: string;
  image_thumbnail: string | null;
  image_medium: string | null;
  created_at: string;
  updated_at: string;
}

// ============ FAQ ============

export interface FAQItem {
  id: number;
  question: Translatable;
  answer: Translatable;
  category: string;
  faculty_id?: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============ Testimonial ============

export interface Testimonial {
  id: number;
  name: Translatable;
  role: Translatable;
  text: Translatable;
  is_active: boolean;
  sort_order: number;
  photo: string;
  photo_thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Partner ============

export interface Partner {
  id: number;
  name: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  logo: string;
  logo_thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Banner / Slider ============

export interface Banner {
  id: number;
  title: Translatable;
  subtitle: Translatable;
  link: string;
  button_text: Translatable;
  is_active: boolean;
  sort_order: number;
  image: string;
  image_desktop: string | null;
  image_mobile: string | null;
  image_thumbnail: string | null;
  mobile_image: string | null;
  video: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Navigation Tree (dynamic CMS nav) ============

export interface NavTreeItem {
  id: number;
  title: { uz?: string; ru?: string; en?: string };
  slug: string;
  page_type: 'content' | 'link' | 'group';
  external_url: string | null;
  nav_icon: string | null;
  children?: NavTreeItem[];
}

// ============ Page (CMS) ============

export interface Page {
  id: number;
  title: Translatable;
  slug: string;
  content: Translatable;
  page_type?: 'content' | 'link' | 'group';
  parent_id?: number | null;
  full_path?: string;
  is_published: boolean;
  images: { id: number; url: string; thumbnail_url: string; medium_url: string; large_url: string; name: string; file_name: string; mime_type: string; size: number }[];
  documents: { id: number; url: string; name: string; file_name: string; size: number; mime_type: string }[];
  children?: Page[];
  created_at: string;
  updated_at: string;
}

// ============ Contact Message ============

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ============ Search ============

export interface SearchResult {
  type: string;
  id: number;
  title: Translatable | string;
  slug?: string;
  excerpt?: string;
  url: string;
}

// ============ Site Content ============

export interface SiteContent {
  id: number;
  key: string;
  section: string;
  value: Translatable;
  type: 'text' | 'textarea' | 'html';
  created_at: string;
  updated_at: string;
}

// ============ Library Resource ============

export interface LibraryResource {
  id: number;
  title: Translatable;
  slug: string;
  description: Translatable;
  content: Translatable;
  category: string;
  type: string | null;
  url: string | null;
  is_published: boolean;
  published_at: string | null;
  sort_order: number;
  cover: string;
  cover_medium: string;
  cover_thumbnail: string;
  document: string | null;
  document_name: string | null;
  gallery: { id: number; url: string; name: string }[];
  created_at: string;
}

// ============ Talented Student ============

export interface TalentedStudent {
  id: number;
  name: Translatable;
  description: Translatable;
  sort_order: number;
  is_active: boolean;
  photo?: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Journal Issue ============

export interface JournalIssue {
  id: number;
  title: Translatable;
  slug: string;
  description: Translatable;
  date: string;
  issue_number: number;
  year: number;
  is_current: boolean;
  is_published: boolean;
  sort_order: number;
  cover: string;
  cover_medium: string;
  cover_thumbnail: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
}
