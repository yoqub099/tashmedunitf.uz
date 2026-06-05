"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentLifePhotoService, type StudentLifePhotoParams } from "@/lib/services/studentLifePhotoService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { StudentLifePhoto, PaginatedResponse } from "@/types";

export function useStudentLifePhotos(params?: StudentLifePhotoParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STUDENT_LIFE_PHOTOS, params],
    queryFn: () => studentLifePhotoService.getAll(params),
  });
}

export function useStudentLifePhotoDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTO_DETAIL(id),
    queryFn: () => studentLifePhotoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateStudentLifePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => studentLifePhotoService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Foto qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<StudentLifePhoto>>(
        { queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS });
      revalidateFrontend(["student-life-photos"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Foto qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateStudentLifePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      studentLifePhotoService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Foto yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<StudentLifePhoto>>(
        { queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.STUDENT_LIFE_PHOTO_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS });
      revalidateFrontend(["student-life-photos"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Foto yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteStudentLifePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => studentLifePhotoService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<StudentLifePhoto>>({ queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS });
      queryClient.setQueriesData<PaginatedResponse<StudentLifePhoto>>(
        { queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Foto o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Foto o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_LIFE_PHOTOS });
      revalidateFrontend(["student-life-photos"], "/talabalarga");
    },
  });
}
