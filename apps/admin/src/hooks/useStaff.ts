"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffService, type StaffParams } from "@/lib/services/staffService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Staff, PaginatedResponse } from "@/types";

export function useStaff(params?: StaffParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STAFF, params],
    queryFn: () => staffService.getAll(params),
  });
}

export function useStaffDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF_DETAIL(id),
    queryFn: () => staffService.getById(id),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => staffService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Xodim qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<Staff>>(
        { queryKey: QUERY_KEYS.STAFF },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      revalidateFrontend(["staff", "departments"], "/universitet");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Xodim qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      staffService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Xodim yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Staff>>(
        { queryKey: QUERY_KEYS.STAFF },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.STAFF_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      revalidateFrontend(["staff", "departments"], "/universitet");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Xodim yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => staffService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.STAFF });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Staff>>({ queryKey: QUERY_KEYS.STAFF });
      queryClient.setQueriesData<PaginatedResponse<Staff>>(
        { queryKey: QUERY_KEYS.STAFF },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Xodim o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Xodim o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      revalidateFrontend(["staff", "departments"], "/universitet");
    },
  });
}
