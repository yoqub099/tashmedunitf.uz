import api from "@/lib/api";
import type { StudentLifePhoto, PaginatedResponse } from "@/types";

export interface StudentLifePhotoParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
}

export const studentLifePhotoService = {
  async getAll(params?: StudentLifePhotoParams): Promise<PaginatedResponse<StudentLifePhoto>> {
    const { data } = await api.get("/student-life-photos", { params });
    return data;
  },

  async getById(id: number | string): Promise<StudentLifePhoto> {
    const { data } = await api.get(`/student-life-photos/${id}`);
    return data.data;
  },

  async create(formData: FormData): Promise<StudentLifePhoto> {
    const { data } = await api.post("/student-life-photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async update(id: number | string, formData: FormData): Promise<StudentLifePhoto> {
    formData.append("_method", "PUT");
    const { data } = await api.post(`/student-life-photos/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/student-life-photos/${id}`);
  },
};
