import { api } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  NewsItem,
  Department,
  Staff,
  Faculty,
  Direction,
  FAQItem,
  Testimonial,
  Partner,
  Banner,
  Page,
  ContactMessage,
  SearchResult,
  SiteContent,
  LibraryResource,
  JournalIssue,
  NavTreeItem,
  TalentedStudent,
} from "@/types";

// ============ News ============

export async function getNews(params?: { page?: number; per_page?: number; category?: string }) {
  const { category, ...rest } = params || {};
  const queryParams: Record<string, string | number> = { ...rest };
  if (category) {
    queryParams["filter[category]"] = category;
  }
  return api.get<PaginatedResponse<NewsItem>>("/v1/news", { params: queryParams, tags: ["news"] });
}

export async function getNewsBySlug(slug: string) {
  return api.get<ApiResponse<NewsItem>>(`/v1/news/${slug}`, { tags: ["news"] });
}

// ============ Departments ============

export async function getDepartments(params?: { page?: number; per_page?: number }) {
  return api.get<PaginatedResponse<Department>>("/v1/departments", { params: params as Record<string, string | number>, tags: ["departments"] });
}

export async function getDepartmentBySlug(slug: string) {
  return api.get<ApiResponse<Department>>(`/v1/departments/${slug}`, { tags: ["departments"] });
}

// ============ Staff ============

export async function getStaff(params?: { page?: number; per_page?: number; department_id?: number }) {
  return api.get<PaginatedResponse<Staff>>("/v1/staff", { params: params as Record<string, string | number>, tags: ["staff"] });
}

export async function getStaffById(id: number) {
  return api.get<ApiResponse<Staff>>(`/v1/staff/${id}`, { tags: ["staff"] });
}

// ============ Faculties ============

export async function getFaculties(params?: { page?: number; per_page?: number; level?: string }) {
  const queryParams: Record<string, string | number> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.per_page) queryParams.per_page = params.per_page;
  if (params?.level) queryParams["filter[level]"] = params.level;
  return api.get<PaginatedResponse<Faculty>>("/v1/faculties", { params: queryParams, tags: ["faculties"] });
}

export async function getFacultyById(id: number) {
  return api.get<ApiResponse<Faculty>>(`/v1/faculties/${id}`, { tags: ["faculties"] });
}

// ============ Directions ============

export async function getDirections(params?: { page?: number; per_page?: number; level?: string; faculty_id?: number }) {
  const queryParams: Record<string, string | number> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.per_page) queryParams.per_page = params.per_page;
  if (params?.level) queryParams["filter[level]"] = params.level;
  if (params?.faculty_id) queryParams["filter[faculty_id]"] = params.faculty_id;
  return api.get<PaginatedResponse<Direction>>("/v1/directions", { params: queryParams, tags: ["directions"] });
}

export async function getDirectionById(id: number) {
  return api.get<ApiResponse<Direction>>(`/v1/directions/${id}`, { tags: ["directions"] });
}

// ============ FAQ ============

export async function getFaqs(params?: Record<string, string | number>) {
  return api.get<PaginatedResponse<FAQItem>>("/v1/faqs", { params, tags: ["faqs"] });
}

// ============ Testimonials ============

export async function getTestimonials(params?: { page?: number; per_page?: number }) {
  return api.get<PaginatedResponse<Testimonial>>("/v1/testimonials", { params: params as Record<string, string | number>, tags: ["testimonials"] });
}

// ============ Partners ============

export async function getPartners(params?: { page?: number; per_page?: number }) {
  return api.get<PaginatedResponse<Partner>>("/v1/partners", { params: params as Record<string, string | number>, tags: ["partners"] });
}

// ============ Banners ============

export async function getBanners() {
  return api.get<ApiResponse<Banner[]>>("/v1/banners", { tags: ["banners"] });
}

// ============ Pages ============

export async function getPages(params?: { page?: number; per_page?: number }) {
  return api.get<PaginatedResponse<Page>>("/v1/pages", { params: params as Record<string, string | number>, tags: ["pages"] });
}

export async function getPageBySlug(slug: string) {
  return api.get<ApiResponse<Page>>(`/v1/pages/${slug}`, { tags: ["pages"] });
}

export async function getNavigation() {
  return api.get<ApiResponse<NavTreeItem[]>>("/v1/pages/navigation", { tags: ["navigation"] });
}

export async function getPageByPath(path: string) {
  return api.get<ApiResponse<Page>>(`/v1/pages/by-path/${path}`, { tags: ["pages"] });
}

// ============ Contact ============

export async function sendContactMessage(data: ContactMessage & { file?: File }) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);
  formData.append("subject", data.subject);
  formData.append("message", data.message);
  if (data.file) formData.append("file", data.file);

  return api.postFormData<ApiResponse<null>>("/v1/contact", formData);
}

export async function getContactStats() {
  return api.get<ApiResponse<{ total: number; new: number; accepted: number; completed: number }>>("/v1/contact/stats", { tags: ["contacts"] });
}

// ============ Conference Registration ============

export async function registerForConference(data: {
  news_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  return api.post<ApiResponse<null>>("/v1/conference-registrations", data);
}

// ============ Search ============

export async function search(query: string) {
  return api.get<ApiResponse<SearchResult[]>>("/v1/search", { params: { q: query }, tags: ["search"] });
}

// ============ Site Contents ============

export async function getSiteContents(section: string) {
  return api.get<ApiResponse<SiteContent[]>>(`/v1/site-contents/${section}`, { tags: ["site-contents"] });
}

// ============ Library Resources ============

export async function getLibraryResources(params?: { page?: number; per_page?: number; category?: string; search?: string }) {
  const { category, search, ...rest } = params || {};
  const queryParams: Record<string, string | number> = { ...rest };
  if (category) {
    queryParams["filter[category]"] = category;
  }
  if (search) {
    queryParams["filter[title]"] = search;
  }
  return api.get<PaginatedResponse<LibraryResource>>("/v1/library-resources", { params: queryParams, tags: ["library-resources"] });
}

export async function getLibraryResourceBySlug(slug: string) {
  return api.get<ApiResponse<LibraryResource>>(`/v1/library-resources/${slug}`, { tags: ["library-resources"] });
}

export async function getLibraryCategories() {
  return api.get<ApiResponse<string[]>>("/v1/library-resources/categories", { tags: ["library-categories"] });
}

// ============ Journal Issues ============

export async function getJournalIssues(params?: { page?: number; per_page?: number; is_current?: boolean; year?: number; search?: string }) {
  const { is_current, year, search, ...rest } = params || {};
  const queryParams: Record<string, string | number> = { ...rest };
  if (is_current !== undefined) {
    queryParams["filter[is_current]"] = is_current ? 1 : 0;
  }
  if (year) {
    queryParams["filter[year]"] = year;
  }
  if (search) {
    queryParams["filter[title]"] = search;
  }
  return api.get<PaginatedResponse<JournalIssue>>("/v1/journal-issues", { params: queryParams, tags: ["journal-issues"] });
}

export async function getJournalIssueBySlug(slug: string) {
  return api.get<ApiResponse<JournalIssue>>(`/v1/journal-issues/${slug}`, { tags: ["journal-issues"] });
}

// ============ Talented Students ============

export async function getTalentedStudents(params?: { page?: number; per_page?: number; search?: string }) {
  return api.get<PaginatedResponse<TalentedStudent>>("/v1/talented-students", { params: params as Record<string, string | number>, tags: ["talented-students"] });
}

// ============ Translations ============

export async function getTranslations() {
  return api.get<ApiResponse<Record<string, { uz: string; ru: string; en: string }>>>("/v1/translations", { tags: ["translations"] });
}
