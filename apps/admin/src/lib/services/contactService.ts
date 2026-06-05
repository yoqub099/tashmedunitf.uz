import api from "@/lib/api";
import type { Contact, PaginatedResponse, ApiResponse } from "@/types";

export interface ContactParams {
  page?: number;
  per_page?: number;
  is_read?: boolean;
  "filter[status]"?: string;
}

export interface ContactUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  is_read?: boolean;
  status?: 'new' | 'accepted' | 'completed';
}

export const contactService = {
  getAll: async (params?: ContactParams): Promise<PaginatedResponse<Contact>> => {
    const { data } = await api.get<PaginatedResponse<Contact>>("contacts", { params });
    return data;
  },

  getById: async (id: number | string): Promise<Contact> => {
    const { data } = await api.get<ApiResponse<Contact>>(`contacts/${id}`);
    return data.data;
  },

  update: async (id: number | string, updateData: ContactUpdateData): Promise<Contact> => {
    const { data } = await api.put<ApiResponse<Contact>>(`contacts/${id}`, updateData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`contacts/${id}`);
  },

  markAsRead: async (id: number | string): Promise<Contact> => {
    const { data } = await api.get<ApiResponse<Contact>>(`contacts/${id}`);
    return data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<{ success: boolean; message: string; data: { count: number } }>("contacts/unread/count");
    return data.data.count;
  },
};
