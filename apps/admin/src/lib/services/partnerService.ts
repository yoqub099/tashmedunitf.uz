import api from "@/lib/api";
import type { Partner, PaginatedResponse, ApiResponse } from "@/types";

export interface PartnerParams {
  page?: number;
  per_page?: number;
}

export const partnerService = {
  getAll: async (params?: PartnerParams): Promise<PaginatedResponse<Partner>> => {
    const { data } = await api.get<PaginatedResponse<Partner>>("partners", { params });
    return data;
  },

  getById: async (id: number | string): Promise<Partner> => {
    const { data } = await api.get<ApiResponse<Partner>>(`partners/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Partner> => {
    const { data } = await api.post<ApiResponse<Partner>>("partners", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Partner> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Partner>>(`partners/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`partners/${id}`);
  },
};
