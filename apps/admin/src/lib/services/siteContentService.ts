import api from "@/lib/api";
import type { SiteContent, SiteContentUpsertData, ApiResponse } from "@/types";

interface SiteContentsResponse {
  success: boolean;
  message: string;
  data: SiteContent[];
}

export const siteContentService = {
  /**
   * Admin — barcha kontentlarni olish (ixtiyoriy section filter)
   */
  getAll: async (section?: string): Promise<SiteContent[]> => {
    const params = section ? { section } : {};
    const { data } = await api.get<SiteContentsResponse>("site-contents", { params });
    return data.data;
  },

  /**
   * Public — bo'lim bo'yicha kontentlarni olish
   */
  getBySection: async (section: string): Promise<SiteContent[]> => {
    const { data } = await api.get<SiteContentsResponse>(`site-contents/${section}`);
    return data.data;
  },

  /**
   * Admin — bitta kontentni upsert qilish
   */
  upsert: async (item: SiteContentUpsertData): Promise<SiteContent> => {
    const { data } = await api.put<ApiResponse<SiteContent>>("site-contents", item);
    return data.data;
  },

  /**
   * Admin — bir nechta kontentni birdaniga upsert qilish
   */
  batchUpsert: async (items: SiteContentUpsertData[]): Promise<SiteContent[]> => {
    const { data } = await api.put<SiteContentsResponse>("site-contents/batch", { items });
    return data.data;
  },

  /**
   * Admin — rasm yuklash
   */
  uploadImage: async (file: File, key: string, section: string): Promise<SiteContent> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);
    formData.append("section", section);
    const { data } = await api.post<ApiResponse<SiteContent>>("site-contents/upload-image", formData);
    return data.data;
  },

  /**
   * Admin — kontentni o'chirish
   */
  delete: async (key: string): Promise<void> => {
    await api.delete(`site-contents/${key}`);
  },
};
