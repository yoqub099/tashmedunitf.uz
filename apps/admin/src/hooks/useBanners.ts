"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannerService, type BannerParams } from "@/lib/services/bannerService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Banner, PaginatedResponse } from "@/types";

export function useBanners(params?: BannerParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BANNERS, params],
    queryFn: () => bannerService.getAll(params),
  });
}

export function useBannerDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.BANNER_DETAIL(id),
    queryFn: () => bannerService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => bannerService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Banner yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<Banner>>(
        { queryKey: QUERY_KEYS.BANNERS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BANNERS });
      revalidateFrontend(["banners"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Banner yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      bannerService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Banner yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Banner>>(
        { queryKey: QUERY_KEYS.BANNERS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.BANNER_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BANNERS });
      revalidateFrontend(["banners"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Banner yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => bannerService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.BANNERS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Banner>>({ queryKey: QUERY_KEYS.BANNERS });
      queryClient.setQueriesData<PaginatedResponse<Banner>>(
        { queryKey: QUERY_KEYS.BANNERS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Banner o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Banner o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BANNERS });
      revalidateFrontend(["banners"]);
    },
  });
}
