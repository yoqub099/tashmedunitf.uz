import api from "@/lib/api";
import type { SiteMedia, ApiResponse } from "@/types";

export const siteMediaService = {
  getAll: async (): Promise<SiteMedia[]> => {
    const { data } = await api.get<ApiResponse<SiteMedia[]>>("site-media");
    return data.data;
  },

  getByKey: async (key: string): Promise<SiteMedia> => {
    const { data } = await api.get<ApiResponse<SiteMedia>>(`site-media/${key}`);
    return data.data;
  },

  getById: async (id: number | string): Promise<SiteMedia> => {
    const { data } = await api.get<ApiResponse<SiteMedia>>(`site-media/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<SiteMedia> => {
    const { data } = await api.post<ApiResponse<SiteMedia>>("site-media", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<SiteMedia> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<SiteMedia>>(`site-media/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`site-media/${id}`);
  },
};
