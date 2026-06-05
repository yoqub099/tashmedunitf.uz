"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { siteMediaService } from "@/lib/services/siteMediaService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { SiteMedia } from "@/types";

export function useSiteMediaList() {
  return useQuery({
    queryKey: QUERY_KEYS.SITE_MEDIA,
    queryFn: () => siteMediaService.getAll(),
  });
}

export function useSiteMediaByKey(key: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SITE_MEDIA_BY_KEY(key),
    queryFn: () => siteMediaService.getByKey(key),
    enabled: !!key,
  });
}

export function useSiteMediaDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.SITE_MEDIA_DETAIL(id),
    queryFn: () => siteMediaService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSiteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => siteMediaService.create(formData),
    onSuccess: () => {
      toast.success("Media qo'shildi!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_MEDIA });
      revalidateFrontend(["site-media"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Media qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateSiteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      siteMediaService.update(id, formData),
    onSuccess: (updatedItem) => {
      toast.success("Media yangilandi!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_MEDIA });
      queryClient.setQueryData(QUERY_KEYS.SITE_MEDIA_DETAIL(updatedItem.id), updatedItem);
      revalidateFrontend(["site-media"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Media yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteSiteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => siteMediaService.delete(id),
    onSuccess: () => {
      toast.success("Media o'chirildi!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_MEDIA });
      revalidateFrontend(["site-media"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Media o'chirishda xato!";
      toast.error(message);
    },
  });
}
