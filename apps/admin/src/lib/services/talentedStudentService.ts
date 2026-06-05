import api from "@/lib/api";
import type { TalentedStudent, PaginatedResponse, ApiResponse } from "@/types";

export interface TalentedStudentParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const talentedStudentService = {
  getAll: async (params?: TalentedStudentParams): Promise<PaginatedResponse<TalentedStudent>> => {
    const { data } = await api.get<PaginatedResponse<TalentedStudent>>("talented-students", { params });
    return data;
  },

  getById: async (id: number | string): Promise<TalentedStudent> => {
    const { data } = await api.get<ApiResponse<TalentedStudent>>(`talented-students/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<TalentedStudent> => {
    const { data } = await api.post<ApiResponse<TalentedStudent>>("talented-students", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<TalentedStudent> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<TalentedStudent>>(`talented-students/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`talented-students/${id}`);
  },
};
