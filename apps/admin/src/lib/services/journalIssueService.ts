import api from "@/lib/api";
import type { JournalIssue, PaginatedResponse, ApiResponse } from "@/types";

export interface JournalIssueParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_current?: boolean;
  year?: number;
}

export const journalIssueService = {
  getAll: async (params?: JournalIssueParams): Promise<PaginatedResponse<JournalIssue>> => {
    const { is_current, year, search, ...rest } = params || {};
    const queryParams: Record<string, string | number | undefined> = { ...rest };
    if (is_current !== undefined) {
      queryParams["filter[is_current]"] = is_current ? 1 : 0;
    }
    if (year) {
      queryParams["filter[year]"] = year;
    }
    if (search) {
      queryParams["filter[title]"] = search;
    }
    const { data } = await api.get<PaginatedResponse<JournalIssue>>("journal-issues", { params: queryParams });
    return data;
  },

  getById: async (id: number | string): Promise<JournalIssue> => {
    const { data } = await api.get<ApiResponse<JournalIssue>>(`journal-issues/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<JournalIssue> => {
    const { data } = await api.post<ApiResponse<JournalIssue>>("journal-issues", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<JournalIssue> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<JournalIssue>>(`journal-issues/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`journal-issues/${id}`);
  },
};
