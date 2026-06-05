import api from "@/lib/api";
import type { Testimonial, PaginatedResponse, ApiResponse } from "@/types";

export interface TestimonialParams {
  page?: number;
  per_page?: number;
}

export const testimonialService = {
  getAll: async (params?: TestimonialParams): Promise<PaginatedResponse<Testimonial>> => {
    const { data } = await api.get<PaginatedResponse<Testimonial>>("testimonials", { params });
    return data;
  },

  getById: async (id: number | string): Promise<Testimonial> => {
    const { data } = await api.get<ApiResponse<Testimonial>>(`testimonials/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<Testimonial> => {
    const { data } = await api.post<ApiResponse<Testimonial>>("testimonials", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<Testimonial> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<Testimonial>>(`testimonials/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`testimonials/${id}`);
  },
};
