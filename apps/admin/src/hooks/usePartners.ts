"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { partnerService, type PartnerParams } from "@/lib/services/partnerService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Partner, PaginatedResponse } from "@/types";

export function usePartners(params?: PartnerParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PARTNERS, params],
    queryFn: () => partnerService.getAll(params),
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => partnerService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Hamkor qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<Partner>>(
        { queryKey: QUERY_KEYS.PARTNERS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
      revalidateFrontend(["partners"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Hamkor qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      partnerService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Hamkor yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Partner>>(
        { queryKey: QUERY_KEYS.PARTNERS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.PARTNER_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
      revalidateFrontend(["partners"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Hamkor yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => partnerService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PARTNERS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Partner>>({ queryKey: QUERY_KEYS.PARTNERS });
      queryClient.setQueriesData<PaginatedResponse<Partner>>(
        { queryKey: QUERY_KEYS.PARTNERS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Hamkor o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Hamkor o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTNERS });
      revalidateFrontend(["partners"]);
    },
  });
}
