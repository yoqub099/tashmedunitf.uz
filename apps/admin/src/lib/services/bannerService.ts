import api from "@/lib/api";
import type { Banner, PaginatedResponse, ApiResponse } from "@/types";

export interface BannerParams {
  page?: number;
  per_page?: number;
}

export const bannerService = {
  getAll: async (params?: BannerParams): Promise<PaginatedResponse<Banner>> => {
    const { data } = await api.get<PaginatedResponse<Banner>>("banners", { params });
    return data;
  },

  getById: async (id: number | string): Promise<Banner> => {
    const { data } = await api.get<ApiResponse<Banner>>(`banners/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Banner> => {
    const { data } = await api.post<ApiResponse<Banner>>("banners", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Banner> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Banner>>(`banners/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`banners/${id}`);
  },
};
