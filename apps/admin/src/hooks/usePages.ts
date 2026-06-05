"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pageService, type PageParams } from "@/lib/services/pageService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Page, PaginatedResponse } from "@/types";

export function usePages(params?: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PAGES, params],
    queryFn: () => pageService.getAll(params),
  });
}

export function usePageTree() {
  return useQuery({
    queryKey: QUERY_KEYS.PAGE_TREE,
    queryFn: () => pageService.getTree(),
  });
}

export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PAGE_DETAIL(slug),
    queryFn: () => pageService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => pageService.create(data),
    onSuccess: (newItem) => {
      toast.success("Sahifa yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<Page>>(
        { queryKey: QUERY_KEYS.PAGES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE_TREE });
      revalidateFrontend(["pages", "navigation"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Sahifa yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
      pageService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Sahifa yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Page>>(
        { queryKey: QUERY_KEYS.PAGES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.PAGE_DETAIL(String(id)), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE_TREE });
      revalidateFrontend(["pages", "navigation"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Sahifa yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => pageService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PAGES });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Page>>({ queryKey: QUERY_KEYS.PAGES });
      queryClient.setQueriesData<PaginatedResponse<Page>>(
        { queryKey: QUERY_KEYS.PAGES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Sahifa o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Sahifa o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE_TREE });
      revalidateFrontend(["pages", "navigation"]);
    },
  });
}

export function useReorderPages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: number; sort_order: number; parent_id: number | null }[]) =>
      pageService.reorder(items),
    onSuccess: () => {
      toast.success("Tartib yangilandi!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE_TREE });
      revalidateFrontend(["pages", "navigation"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Tartibni yangilashda xato!";
      toast.error(message);
    },
  });
}
