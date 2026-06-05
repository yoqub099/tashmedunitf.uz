import api from "@/lib/api";
import type { Faq, ApiResponse, PaginatedResponse } from "@/types";

export const faqService = {
  getAll: async (params?: Record<string, unknown>): Promise<PaginatedResponse<Faq>> => {
    const { data } = await api.get<PaginatedResponse<Faq>>("faqs", { params });
    return data;
  },

  create: async (payload: Record<string, unknown>): Promise<Faq> => {
    const { data } = await api.post<ApiResponse<Faq>>("faqs", payload);
    return data.data;
  },

  update: async (id: number | string, payload: Record<string, unknown>): Promise<Faq> => {
    const { data } = await api.put<ApiResponse<Faq>>(`faqs/${id}`, payload);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`faqs/${id}`);
  },
};
