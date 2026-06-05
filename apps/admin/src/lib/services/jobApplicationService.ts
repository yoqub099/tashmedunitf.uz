import api from "@/lib/api";
import type { JobApplication, PaginatedResponse, ApiResponse } from "@/types";

export interface JobApplicationParams {
  page?: number;
  per_page?: number;
  "filter[is_read]"?: boolean;
  "filter[name]"?: string;
  "filter[email]"?: string;
  "filter[position]"?: string;
}

export const jobApplicationService = {
  getAll: (params?: JobApplicationParams) =>
    api.get<PaginatedResponse<JobApplication>>("job-applications", { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<JobApplication>>(`job-applications/${id}`).then((r) => r.data.data),

  delete: (id: number) =>
    api.delete(`job-applications/${id}`),

  getUnreadCount: () =>
    api.get<{ success: boolean; data: { count: number } }>("job-applications/unread/count").then((r) => r.data.data.count),
};
