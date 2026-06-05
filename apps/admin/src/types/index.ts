// ============================================
// Auth Types
// ============================================
export interface User {
  id: number;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "editor";
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// Translatable Fields
// ============================================
export interface Translatable {
  uz: string;
  ru?: string;
  en?: string;
}

// ============================================
// Media
// ============================================
export interface MediaItem {
  id: number;
  url: string;
  thumbnail_url?: string;
  file_name: string;
  mime_type: string;
  size: number;
  collection_name: string;
  created_at: string;
}

// ============================================
// News
// ============================================
export interface News {
  id: number;
  slug: string;
  title: Translatable;
  content: Translatable;
  excerpt?: Translatable;
  category: string;
  is_published: boolean;
  published_at?: string;
  cover?: string;
  cover_thumbnail?: string;
  gallery?: { id: number; url: string; name: string }[];
  created_at: string;
}

export interface NewsFormData {
  title: Translatable;
  content: Translatable;
  excerpt?: Translatable;
  category: string;
  is_published: boolean;
  published_at?: string;
  cover?: File;
}

// ============================================
// Banners
// ============================================
export interface Banner {
  id: number;
  title: Translatable;
  subtitle?: Translatable;
  link?: string;
  button_text?: Translatable;
  sort_order: number;
  is_active: boolean;
  image?: string;
  image_desktop?: string;
  image_mobile?: string;
  image_thumbnail?: string;
  mobile_image?: string;
  video?: string;
  created_at: string;
  updated_at: string;
}

export interface BannerFormData {
  title: Translatable;
  subtitle?: Translatable;
  link?: string;
  button_text?: Translatable;
  sort_order: number;
  is_active: boolean;
  image?: File;
}

// ============================================
// Partners
// ============================================
export interface Partner {
  id: number;
  name: string;
  url?: string;
  sort_order: number;
  is_active: boolean;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerFormData {
  name: string;
  url?: string;
  sort_order: number;
  is_active: boolean;
  logo?: File;
}

// ============================================
// Testimonials
// ============================================
export interface Testimonial {
  id: number;
  name: Translatable;
  role: Translatable;
  text: Translatable;
  sort_order: number;
  is_active: boolean;
  photo?: string;
  photo_thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export interface TestimonialFormData {
  name: Translatable;
  role: Translatable;
  text: Translatable;
  sort_order: number;
  is_active: boolean;
  photo?: File;
}

// ============================================
// FAQ
// ============================================
export interface Faq {
  id: number;
  question: Translatable;
  answer: Translatable;
  category?: string;
  faculty_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqFormData {
  question: Translatable;
  answer: Translatable;
  category?: string;
  faculty_id?: number;
  sort_order: number;
  is_active: boolean;
}

// ============================================
// Pages (static)
// ============================================
export interface Page {
  id: number;
  slug: string;
  title: Translatable;
  content: Translatable;
  parent_id: number | null;
  sort_order: number;
  depth: number;
  path: string;
  is_nav_item: boolean;
  page_type: "content" | "link" | "group";
  external_url?: string;
  nav_icon?: string;
  is_published: boolean;
  images: { id: number; url: string; thumbnail_url?: string; medium_url?: string; large_url?: string; name: string; file_name?: string; mime_type?: string; size?: number }[];
  documents: { id: number; url: string; name: string; file_name: string; size: number; mime_type: string }[];
  children?: Page[];
  children_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PageFormData {
  slug: string;
  title: Translatable;
  content: Translatable;
  parent_id?: number | null;
  sort_order: number;
  is_nav_item: boolean;
  page_type: "content" | "link" | "group";
  external_url?: string;
  nav_icon?: string;
  is_published: boolean;
}

// ============================================
// Contact Messages
// ============================================
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  status: 'new' | 'accepted' | 'completed';
  attachment_url?: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Conference Registrations
// ============================================
export interface ConferenceRegistration {
  id: number;
  news_id: number;
  news?: { id: number; title: Translatable; slug: string };
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================
// Contact Locations
// ============================================

// ============================================
// Job Applications
// ============================================
export interface JobApplication {
  id: number;
  name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  email: string;
  position: string;
  company?: string;
  salary?: string;
  birthday?: string;
  skype?: string;
  citizenship?: string;
  contact_phone?: string;
  extra_email?: string;
  social_media_link?: string;
  is_convicted: boolean;
  how_find_vacancy?: string;
  is_currently_working: boolean;
  applied_before_comment?: string;
  relative_detail_at_university?: string;
  skills?: string;
  additional_info?: string;
  research_identifier?: string;
  degree?: string;
  is_currently_in_uzbekistan: boolean;
  is_previously_worked_at_university: boolean;
  about_motivation?: string;
  is_read: boolean;
  files?: Record<string, JobApplicationFile | null>;
  created_at: string;
  updated_at?: string;
}

export interface JobApplicationFile {
  id: number;
  url: string;
  name: string;
  size: number;
  mime_type: string;
}

// ============================================
// Student Works (public form submission)
// ============================================
export interface StudentWork {
  id: number;
  fullname: string;
  organization: string;
  email: string;
  phone: string;
  address: string;
  file_path: string | null;
  file_name: string | null;
  is_read: boolean;
  created_at: string;
}

// ============================================
// Contact Locations
// ============================================
export interface ContactLocation {
  id: number;
  name: Translatable;
  address: Translatable;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Departments
// ============================================
export interface Department {
  id: number;
  slug: string;
  name: Translatable;
  description: Translatable;
  head_name?: Translatable;
  head_title?: Translatable;
  phone?: string;
  email?: string;
  sort_order: number;
  is_active: boolean;
  image?: string;
  image_thumbnail?: string;
  image_medium?: string;
  head_photo?: string;
  head_photo_thumbnail?: string;
  head_photo_medium?: string;
  staff?: Staff[];
  created_at: string;
  updated_at: string;
}

export interface DepartmentFormData {
  name: Translatable;
  description: Translatable;
  head_name?: Translatable;
  head_title?: Translatable;
  phone?: string;
  email?: string;
  sort_order: number;
  is_active: boolean;
  image?: File;
  head_photo?: File;
}

// ============================================
// Staff
// ============================================
export interface Staff {
  id: number;
  full_name: Translatable;
  position: Translatable;
  bio?: Translatable;
  phone?: string;
  email?: string;
  sort_order: number;
  is_active: boolean;
  photo?: string;
  photo_thumbnail?: string;
  photo_medium?: string;
  department?: Department;
  created_at: string;
  updated_at: string;
}

export interface StaffFormData {
  full_name: Translatable;
  position: Translatable;
  bio?: Translatable;
  department_id?: number;
  phone?: string;
  email?: string;
  sort_order: number;
  is_active: boolean;
  photo?: File;
}

// ============================================
// Faculties
// ============================================
export interface Faculty {
  id: number;
  name: Translatable;
  description: Translatable;
  level: string;
  is_active: boolean;
  sort_order: number;
  image?: string;
  image_thumbnail?: string;
  image_medium?: string;
  directions?: Direction[];
  directions_count?: number;
  created_at: string;
  updated_at: string;
}

export interface FacultyFormData {
  name: Translatable;
  description: Translatable;
  level: string;
  sort_order: number;
  is_active: boolean;
  image?: File;
}

// ============================================
// Directions
// ============================================
export interface Direction {
  id: number;
  name: Translatable;
  code: string;
  level: string;
  description: Translatable;
  duration: string;
  price_daytime: number | null;
  price_remote: number | null;
  faculty_id: number | null;
  sort_order: number;
  is_active: boolean;
  exam_subjects: string[];
  image?: string;
  image_thumbnail?: string;
  image_medium?: string;
  created_at: string;
  updated_at: string;
}

export interface DirectionFormData {
  name: Translatable;
  code: string;
  level: string;
  description: Translatable;
  duration: string;
  price_daytime: number | null;
  price_remote: number | null;
  sort_order: number;
  is_active: boolean;
  image?: File;
}

// ============================================
// Translations
// ============================================
export interface Translation {
  id: number;
  key: string;
  group: string;
  value: Translatable;
  created_at: string;
  updated_at: string;
}

// ============================================
// API Response Types
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// Dashboard Stats
// ============================================
export interface DashboardStats {
  total_news: number;
  total_departments: number;
  total_staff: number;
  total_directions: number;
  total_faqs: number;
  total_banners: number;
  total_partners: number;
  total_testimonials: number;
  total_pages: number;
  unread_contacts: number;
}

// ============================================
// Site Contents (editable text blocks)
// ============================================
export interface SiteContent {
  id: number;
  key: string;
  section: string;
  value: Translatable;
  type: 'text' | 'textarea' | 'html';
  created_at: string;
  updated_at: string;
}

export interface SiteContentUpsertData {
  key: string;
  section: string;
  value: Translatable;
  type?: 'text' | 'textarea' | 'html';
}

// ============================================
// Talented Students
// ============================================
export interface TalentedStudent {
  id: number;
  name: Translatable;
  description: Translatable;
  sort_order: number;
  is_active: boolean;
  photo?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Site Media
// ============================================
export interface SiteMedia {
  id: number;
  key: string;
  title: string | null;
  description: string | null;
  is_active: boolean;
  file_url: string;
  file_mime: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Career Center Info
// ============================================
export interface CareerCenterInfo {
  id: number;
  title: Translatable;
  subtitle: Translatable;
  content: Translatable;
  address: Translatable;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// Student Life Photos
// ============================================
export interface StudentLifePhoto {
  id: number;
  title: Translatable;
  photo: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// Library Resources (Kutubxona)
// ============================================
export interface LibraryResource {
  id: number;
  title: Translatable;
  slug: string;
  description?: Translatable;
  content?: Translatable;
  category: string;
  type?: string;
  url?: string;
  is_published: boolean;
  published_at?: string;
  sort_order: number;
  cover?: string;
  cover_medium?: string;
  cover_thumbnail?: string;
  document?: string;
  document_name?: string;
  gallery?: { id: number; url: string; name: string }[];
  created_at: string;
}

export interface LibraryResourceFormData {
  title: Translatable;
  description?: Translatable;
  content?: Translatable;
  category: string;
  type?: string;
  url?: string;
  is_published: boolean;
  published_at?: string;
  sort_order: number;
  cover?: File;
  document?: File;
}

// ============================================
// Journal Issues (Ilmiy jurnal sonlari)
// ============================================
export interface JournalIssue {
  id: number;
  title: Translatable;
  slug: string;
  description?: Translatable;
  date: string;
  issue_number: number;
  year: number;
  is_current: boolean;
  is_published: boolean;
  sort_order: number;
  cover?: string;
  cover_medium?: string;
  cover_thumbnail?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}

export interface JournalIssueFormData {
  title: Translatable;
  description?: Translatable;
  date: string;
  issue_number: number;
  year: number;
  is_current: boolean;
  is_published: boolean;
  sort_order: number;
  cover?: File;
  file?: File;
}
