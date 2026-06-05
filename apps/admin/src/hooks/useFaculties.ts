"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { facultyService, type FacultyParams } from "@/lib/services/facultyService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Faculty, PaginatedResponse } from "@/types";

export function useFaculties(params?: FacultyParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.FACULTIES, params],
    queryFn: () => facultyService.getAll(params),
  });
}

export function useFacultyDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.FACULTY_DETAIL(id),
    queryFn: () => facultyService.getById(id),
    enabled: !!id,
    retry: false,
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => facultyService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Fakultet qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<Faculty>>(
        { queryKey: QUERY_KEYS.FACULTIES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FACULTIES });
      revalidateFrontend(["faculties"], [
        "/abiturientlarga",
        "/abiturientlarga/bakalavriat",
        "/abiturientlarga/magistratura",
        "/abiturientlarga/ordinatura",
      ]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Fakultet qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      facultyService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Fakultet yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Faculty>>(
        { queryKey: QUERY_KEYS.FACULTIES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.FACULTY_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FACULTIES });
      revalidateFrontend(["faculties"], [
        "/abiturientlarga",
        "/abiturientlarga/bakalavriat",
        "/abiturientlarga/magistratura",
        "/abiturientlarga/ordinatura",
        `/abiturientlarga/bakalavriat/fakultet/${id}`,
        `/abiturientlarga/magistratura/fakultet/${id}`,
        `/abiturientlarga/ordinatura/fakultet/${id}`,
      ]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Fakultet yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => facultyService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FACULTIES });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Faculty>>({ queryKey: QUERY_KEYS.FACULTIES });
      queryClient.setQueriesData<PaginatedResponse<Faculty>>(
        { queryKey: QUERY_KEYS.FACULTIES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Fakultet o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Fakultet o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FACULTIES });
      revalidateFrontend(["faculties"], [
        "/abiturientlarga",
        "/abiturientlarga/bakalavriat",
        "/abiturientlarga/magistratura",
        "/abiturientlarga/ordinatura",
      ]);
    },
  });
}
