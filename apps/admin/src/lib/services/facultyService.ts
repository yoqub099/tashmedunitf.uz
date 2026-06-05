import api from "@/lib/api";
import type { Faculty, PaginatedResponse, ApiResponse } from "@/types";

export interface FacultyParams {
  page?: number;
  per_page?: number;
  level?: string;
}

export const facultyService = {
  getAll: async (params?: FacultyParams): Promise<PaginatedResponse<Faculty>> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.level) queryParams["filter[level]"] = params.level;
    const { data } = await api.get<PaginatedResponse<Faculty>>("faculties", { params: queryParams });
    return data;
  },

  getById: async (id: number | string): Promise<Faculty> => {
    const { data } = await api.get<ApiResponse<Faculty>>(`faculties/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Faculty> => {
    const { data } = await api.post<ApiResponse<Faculty>>("faculties", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Faculty> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Faculty>>(`faculties/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`faculties/${id}`);
  },
};
