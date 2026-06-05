import api from "@/lib/api";
import type { ContactLocation, ApiResponse, Translatable } from "@/types";

export interface ContactLocationFormData {
  name: Translatable | Partial<Translatable>;
  address: Translatable | Partial<Translatable>;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  sort_order?: number;
  is_active?: boolean;
}

export const contactLocationService = {
  getAll: async (): Promise<ContactLocation[]> => {
    const { data } = await api.get<ApiResponse<ContactLocation[]>>("contact-locations");
    return data.data;
  },

  getById: async (id: number | string): Promise<ContactLocation> => {
    const { data } = await api.get<ApiResponse<ContactLocation>>(`contact-locations/${id}`);
    return data.data;
  },

  create: async (formData: ContactLocationFormData): Promise<ContactLocation> => {
    const { data } = await api.post<ApiResponse<ContactLocation>>("contact-locations", formData);
    return data.data;
  },

  update: async (id: number | string, formData: Partial<ContactLocationFormData>): Promise<ContactLocation> => {
    const { data } = await api.put<ApiResponse<ContactLocation>>(`contact-locations/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`contact-locations/${id}`);
  },
};
