import api from "@/lib/api";
import type { News, PaginatedResponse, ApiResponse } from "@/types";

export interface NewsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
}

export const newsService = {
  getAll: async (params?: NewsParams): Promise<PaginatedResponse<News>> => {
    const { category, ...rest } = params || {};
    const queryParams: Record<string, string | number | undefined> = { ...rest };
    if (category) {
      queryParams["filter[category]"] = category;
    }
    const { data } = await api.get<PaginatedResponse<News>>("news", { params: queryParams });
    return data;
  },

  getById: async (id: number | string): Promise<News> => {
    const { data } = await api.get<ApiResponse<News>>(`news/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<News> => {
    const { data } = await api.post<ApiResponse<News>>("news", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<News> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<News>>(`news/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`news/${id}`);
  },
};
