"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsService, type NewsParams } from "@/lib/services/newsService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { News, PaginatedResponse } from "@/types";

export function useNews(params?: NewsParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NEWS, params],
    queryFn: () => newsService.getAll(params),
  });
}

export function useNewsDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.NEWS_DETAIL(id),
    queryFn: () => newsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => newsService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Yangilik yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<News>>(
        { queryKey: QUERY_KEYS.NEWS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      revalidateFrontend(["news"], "/yangiliklar");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Yangilik yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      newsService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Yangilik yangilandi!");
      // Keshni bevosita yangilaymiz — qayta so'rov yubormaymiz
      queryClient.setQueriesData<PaginatedResponse<News>>(
        { queryKey: QUERY_KEYS.NEWS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.NEWS_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      revalidateFrontend(["news"], "/yangiliklar");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Yangilik yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => newsService.delete(id),
    // OPTIMISTIC: serverga yubormasdan oldin UI ni yangilaymiz
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.NEWS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<News>>({ queryKey: QUERY_KEYS.NEWS });
      queryClient.setQueriesData<PaginatedResponse<News>>(
        { queryKey: QUERY_KEYS.NEWS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success("Yangilik o'chirildi!");
    },
    onError: (error: any, _id, context) => {
      // Xato bo'lsa eski holatga qaytaramiz
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          if (data) queryClient.setQueryData(key, data);
        });
      }
      if (error?.response?.status === 404) {
        toast.success("Yangilik allaqachon o'chirilgan!");
        return;
      }
      const message = error?.response?.data?.message || error?.message || "Yangilik o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      revalidateFrontend(["news"], "/yangiliklar");
    },
  });
}
