import api from "@/lib/api";
import type { Translation, ApiResponse, PaginatedResponse } from "@/types";

export const translationService = {
  getAll: async (params?: Record<string, unknown>): Promise<PaginatedResponse<Translation>> => {
    const { data } = await api.get<PaginatedResponse<Translation>>("translations/admin", { params });
    return data;
  },

  create: async (payload: Record<string, unknown>): Promise<Translation> => {
    const { data } = await api.post<ApiResponse<Translation>>("translations", payload);
    return data.data;
  },

  update: async (id: number | string, payload: Record<string, unknown>): Promise<Translation> => {
    const { data } = await api.put<ApiResponse<Translation>>(`translations/${id}`, payload);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`translations/${id}`);
  },
};
