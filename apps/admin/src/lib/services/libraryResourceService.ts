import api from "@/lib/api";
import type { LibraryResource, PaginatedResponse, ApiResponse } from "@/types";

export interface LibraryResourceParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  type?: string;
}

export const libraryResourceService = {
  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<ApiResponse<string[]>>("library-resources/categories");
    return data.data;
  },

  getAll: async (params?: LibraryResourceParams): Promise<PaginatedResponse<LibraryResource>> => {
    const { category, type, search, ...rest } = params || {};
    const queryParams: Record<string, string | number | undefined> = { ...rest };
    if (category) {
      queryParams["filter[category]"] = category;
    }
    if (type) {
      queryParams["filter[type]"] = type;
    }
    if (search) {
      queryParams["filter[title]"] = search;
    }
    const { data } = await api.get<PaginatedResponse<LibraryResource>>("library-resources", { params: queryParams });
    return data;
  },

  getById: async (id: number | string): Promise<LibraryResource> => {
    const { data } = await api.get<ApiResponse<LibraryResource>>(`library-resources/${id}`);
    return data.data;
  },

  create: async (formData: FormData): Promise<LibraryResource> => {
    const { data } = await api.post<ApiResponse<LibraryResource>>("library-resources", formData);
    return data.data;
  },

  update: async (id: number | string, formData: FormData): Promise<LibraryResource> => {
    formData.append("_method", "PUT");
    const { data } = await api.post<ApiResponse<LibraryResource>>(`library-resources/${id}`, formData);
    return data.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`library-resources/${id}`);
  },
};
