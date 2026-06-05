"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { talentedStudentService, type TalentedStudentParams } from "@/lib/services/talentedStudentService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { TalentedStudent, PaginatedResponse } from "@/types";

export function useTalentedStudents(params?: TalentedStudentParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TALENTED_STUDENTS, params],
    queryFn: () => talentedStudentService.getAll(params),
  });
}

export function useTalentedStudentDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.TALENTED_STUDENT_DETAIL(id),
    queryFn: () => talentedStudentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTalentedStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => talentedStudentService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Iqtidorli talaba qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<TalentedStudent>>(
        { queryKey: QUERY_KEYS.TALENTED_STUDENTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TALENTED_STUDENTS });
      revalidateFrontend(["talented-students"], "/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Talaba qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateTalentedStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      talentedStudentService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Talaba yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<TalentedStudent>>(
        { queryKey: QUERY_KEYS.TALENTED_STUDENTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.TALENTED_STUDENT_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TALENTED_STUDENTS });
      revalidateFrontend(["talented-students"], "/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Talaba yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteTalentedStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => talentedStudentService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TALENTED_STUDENTS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<TalentedStudent>>({ queryKey: QUERY_KEYS.TALENTED_STUDENTS });
      queryClient.setQueriesData<PaginatedResponse<TalentedStudent>>(
        { queryKey: QUERY_KEYS.TALENTED_STUDENTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Talaba o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Talaba o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TALENTED_STUDENTS });
      revalidateFrontend(["talented-students"], "/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar");
    },
  });
}
