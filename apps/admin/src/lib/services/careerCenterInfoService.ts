import api from "@/lib/api";
import type { CareerCenterInfo, PaginatedResponse, ApiResponse } from "@/types";

export interface CareerCenterInfoParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const careerCenterInfoService = {
  getAll: async (params?: CareerCenterInfoParams): Promise<PaginatedResponse<CareerCenterInfo>> => {
    const { data } = await api.get<PaginatedResponse<CareerCenterInfo>>("career-center-infos", { params });
    return data;
  },

  getById: async (id: number | string): Promise<CareerCenterInfo> => {
    const { data } = await api.get<ApiResponse<CareerCenterInfo>>(`career-center-infos/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<CareerCenterInfo> => {
    const { data } = await api.post<ApiResponse<CareerCenterInfo>>("career-center-infos", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<CareerCenterInfo> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<CareerCenterInfo>>(`career-center-infos/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`career-center-infos/${id}`);
  },
};
