import api from "@/lib/api";
import type { Page, PaginatedResponse, ApiResponse } from "@/types";

export interface PageParams {
  page?: number;
  per_page?: number;
  search?: string;
}

/**
 * Check if data contains File objects (needs multipart/form-data)
 */
function hasFiles(data: Record<string, unknown> | null | undefined): boolean {
  if (!data) return false;
  for (const value of Object.values(data)) {
    if (value instanceof File) return true;
    if (Array.isArray(value) && value.some((v) => v instanceof File)) return true;
  }
  return false;
}

/**
 * Convert data object to FormData for multipart upload
 */
function toFormData(data: Record<string, unknown>, method?: "PUT"): FormData {
  const fd = new FormData();
  if (method === "PUT") fd.append("_method", "PUT");

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      fd.append(`${key}[]`, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item instanceof File) {
          fd.append(`${key}[${i}]`, item);
        } else {
          fd.append(`${key}[${i}]`, String(item));
        }
      });
    } else if (typeof value === "object" && !(value instanceof File)) {
      const obj = value as Record<string, unknown>;
      for (const [subKey, subValue] of Object.entries(obj)) {
        if (subValue !== undefined && subValue !== null) {
          fd.append(`${key}[${subKey}]`, String(subValue));
        }
      }
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

export const pageService = {
  getAll: async (params?: PageParams): Promise<PaginatedResponse<Page>> => {
    const { data } = await api.get<PaginatedResponse<Page>>("pages", { params });
    return data;
  },

  getBySlug: async (slug: string): Promise<Page> => {
    const { data } = await api.get<ApiResponse<Page>>(`pages/${slug}`);
    return data.data;
  },

  create: async (payload: Record<string, unknown>): Promise<Page> => {
    // File bor bo'lsa multipart, yo'q bo'lsa JSON
    if (hasFiles(payload)) {
      const fd = toFormData(payload);
      const { data } = await api.post<ApiResponse<Page>>("pages", fd);
      return data.data;
    }
    const { data } = await api.post<ApiResponse<Page>>("pages", payload);
    return data.data;
  },

  update: async (id: number | string, payload: Record<string, unknown>): Promise<Page> => {
    // File bor bo'lsa multipart (POST + _method=PUT), yo'q bo'lsa JSON PUT
    if (hasFiles(payload)) {
      const fd = toFormData(payload, "PUT");
      const { data } = await api.post<ApiResponse<Page>>(`pages/${id}`, fd);
      return data.data;
    }
    const { data } = await api.put<ApiResponse<Page>>(`pages/${id}`, payload);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`pages/${id}`);
  },

  getTree: async (): Promise<Page[]> => {
    const { data } = await api.get<ApiResponse<Page[]>>("pages/tree");
    return data.data;
  },

  reorder: async (items: { id: number; sort_order: number; parent_id: number | null }[]): Promise<void> => {
    await api.put("pages/reorder", { items });
  },
};
