import api from "@/lib/api";
import type { Department, PaginatedResponse, ApiResponse } from "@/types";

export interface DepartmentParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const departmentService = {
  getAll: async (params?: DepartmentParams): Promise<PaginatedResponse<Department>> => {
    const { data } = await api.get<PaginatedResponse<Department>>("departments", { params });
    return data;
  },

  getBySlug: async (slug: string): Promise<Department> => {
    const { data } = await api.get<ApiResponse<Department>>(`departments/${slug}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Department> => {
    const { data } = await api.post<ApiResponse<Department>>("departments", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Department> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Department>>(`departments/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`departments/${id}`);
  },
};
