"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentService, type DepartmentParams } from "@/lib/services/departmentService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Department, PaginatedResponse } from "@/types";

export function useDepartments(params?: DepartmentParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, params],
    queryFn: () => departmentService.getAll(params),
  });
}

export function useDepartmentBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DEPARTMENT_DETAIL(slug),
    queryFn: () => departmentService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => departmentService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Bo'lim yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<Department>>(
        { queryKey: QUERY_KEYS.DEPARTMENTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      revalidateFrontend(["departments"], "/universitet");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Bo'lim yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      departmentService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Bo'lim yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Department>>(
        { queryKey: QUERY_KEYS.DEPARTMENTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.DEPARTMENT_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      revalidateFrontend(["departments"], "/universitet");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Bo'lim yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => departmentService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Department>>({ queryKey: QUERY_KEYS.DEPARTMENTS });
      queryClient.setQueriesData<PaginatedResponse<Department>>(
        { queryKey: QUERY_KEYS.DEPARTMENTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Bo'lim o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Bo'lim o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      revalidateFrontend(["departments"], "/universitet");
    },
  });
}
