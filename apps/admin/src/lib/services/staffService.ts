import api from "@/lib/api";
import type { Staff, PaginatedResponse, ApiResponse } from "@/types";

export interface StaffParams {
  page?: number;
  per_page?: number;
  search?: string;
  department_id?: number;
}

export const staffService = {
  getAll: async (params?: StaffParams): Promise<PaginatedResponse<Staff>> => {
    const { data } = await api.get<PaginatedResponse<Staff>>("staff", { params });
    return data;
  },

  getById: async (id: number | string): Promise<Staff> => {
    const { data } = await api.get<ApiResponse<Staff>>(`staff/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Staff> => {
    const { data } = await api.post<ApiResponse<Staff>>("staff", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Staff> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Staff>>(`staff/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`staff/${id}`);
  },
};
