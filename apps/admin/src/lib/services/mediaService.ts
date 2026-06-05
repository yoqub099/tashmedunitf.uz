import api from "@/lib/api";
import type { MediaItem } from "@/types";

export const mediaService = {
  upload: async (file: File, collection?: string): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append("file", file);
    if (collection) {
      formData.append("collection_name", collection);
    }
    const { data } = await api.post<{ data: MediaItem }>("media/upload", formData);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`media/${id}`);
  },

  getStats: async (): Promise<Record<string, unknown>> => {
    const { data } = await api.get<{ success: boolean; message: string; data: Record<string, unknown> }>("media/stats");
    return data.data;
  },
};
