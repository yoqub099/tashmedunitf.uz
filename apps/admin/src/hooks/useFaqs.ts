"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqService } from "@/lib/services/faqService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Faq, PaginatedResponse } from "@/types";

export function useFaqs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.FAQS, params],
    queryFn: () => faqService.getAll(params),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => faqService.create(data),
    onSuccess: (newItem) => {
      toast.success("FAQ yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<Faq>>(
        { queryKey: QUERY_KEYS.FAQS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAQS });
      revalidateFrontend(["faqs"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "FAQ yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
      faqService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      toast.success("FAQ yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Faq>>(
        { queryKey: QUERY_KEYS.FAQS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAQS });
      revalidateFrontend(["faqs"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "FAQ yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => faqService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAQS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Faq>>({ queryKey: QUERY_KEYS.FAQS });
      queryClient.setQueriesData<PaginatedResponse<Faq>>(
        { queryKey: QUERY_KEYS.FAQS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("FAQ o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "FAQ o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAQS });
      revalidateFrontend(["faqs"]);
    },
  });
}
