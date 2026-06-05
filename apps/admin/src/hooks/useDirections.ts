"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { directionService, type DirectionParams } from "@/lib/services/directionService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Direction, PaginatedResponse } from "@/types";

export function useDirections(params?: DirectionParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DIRECTIONS, params],
    queryFn: () => directionService.getAll(params),
  });
}

export function useDirectionDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.DIRECTION_DETAIL(id),
    queryFn: () => directionService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDirection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => directionService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Yo'nalish qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<Direction>>(
        { queryKey: QUERY_KEYS.DIRECTIONS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIRECTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FACULTIES });
      revalidateFrontend(["directions", "faculties"], [
        "/abiturientlarga",
        "/abiturientlarga/bakalavriat",
        "/abiturientlarga/magistratura",
        "/abiturientlarga/ordinatura",
      ]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Yo'nalish qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateDirection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      directionService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Yo'nalish yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Direction>>(
        { queryKey: QUERY_KEYS.DIRECTIONS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.DIRECTION_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIRECTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FACULTIES });
      const paths = [
        "/abiturientlarga",
        "/abiturientlarga/bakalavriat",
        "/abiturientlarga/magistratura",
        "/abiturientlarga/ordinatura",
        `/abiturientlarga/bakalavriat/${id}`,
        `/abiturientlarga/magistratura/${id}`,
        `/abiturientlarga/ordinatura/${id}`,
      ];
      if (updatedItem?.faculty_id) {
        const fid = updatedItem.faculty_id;
        paths.push(
          `/abiturientlarga/bakalavriat/fakultet/${fid}`,
          `/abiturientlarga/magistratura/fakultet/${fid}`,
          `/abiturientlarga/ordinatura/fakultet/${fid}`,
        );
      }
      revalidateFrontend(["directions", "faculties"], paths);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Yo'nalish yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteDirection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => directionService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.DIRECTIONS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Direction>>({ queryKey: QUERY_KEYS.DIRECTIONS });
      queryClient.setQueriesData<PaginatedResponse<Direction>>(
        { queryKey: QUERY_KEYS.DIRECTIONS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Yo'nalish o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Yo'nalish o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DIRECTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FACULTIES });
      revalidateFrontend(["directions", "faculties"], [
        "/abiturientlarga",
        "/abiturientlarga/bakalavriat",
        "/abiturientlarga/magistratura",
        "/abiturientlarga/ordinatura",
      ]);
    },
  });
}
