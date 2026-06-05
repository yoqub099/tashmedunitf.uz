import api from "@/lib/api";
import type { Direction, PaginatedResponse, ApiResponse } from "@/types";

export interface DirectionParams {
  page?: number;
  per_page?: number;
  degree?: "bakalavriat" | "magistratura" | "ordinatura";
  faculty_id?: number | string;
}

export const directionService = {
  getAll: async (params?: DirectionParams): Promise<PaginatedResponse<Direction>> => {
    const queryParams: Record<string, string | number> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.degree) queryParams["filter[level]"] = params.degree;
    if (params?.faculty_id) queryParams["filter[faculty_id]"] = params.faculty_id;
    const { data } = await api.get<PaginatedResponse<Direction>>("directions", { params: queryParams });
    return data;
  },

  getById: async (id: number | string): Promise<Direction> => {
    const { data } = await api.get<ApiResponse<Direction>>(`directions/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Direction> => {
    const { data } = await api.post<ApiResponse<Direction>>("directions", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Direction> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Direction>>(`directions/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`directions/${id}`);
  },
};
