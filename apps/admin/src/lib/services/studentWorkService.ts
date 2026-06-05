import api from "@/lib/api";
import type { StudentWork, PaginatedResponse, ApiResponse } from "@/types";

export interface StudentWorkParams {
  page?: number;
  per_page?: number;
  is_read?: 0 | 1;
  search?: string;
}

export const studentWorkService = {
  getAll: (params?: StudentWorkParams) =>
    api.get<PaginatedResponse<StudentWork>>("student-works", { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<StudentWork>>(`student-works/${id}`).then((r) => r.data.data),

  delete: (id: number) =>
    api.delete(`student-works/${id}`),

  getUnreadCount: () =>
    api
      .get<{ success: boolean; data: { count: number } }>("student-works/unread/count")
      .then((r) => r.data.data.count),
};
