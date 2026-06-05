"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { libraryResourceService, type LibraryResourceParams } from "@/lib/services/libraryResourceService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { LibraryResource, PaginatedResponse } from "@/types";

export function useLibraryResources(params?: LibraryResourceParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.LIBRARY_RESOURCES, params],
    queryFn: () => libraryResourceService.getAll(params),
  });
}

export function useLibraryCategories() {
  return useQuery({
    queryKey: [...QUERY_KEYS.LIBRARY_RESOURCE_CATEGORIES],
    queryFn: () => libraryResourceService.getCategories(),
  });
}

export function useLibraryResourceDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.LIBRARY_RESOURCE_DETAIL(id),
    queryFn: () => libraryResourceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLibraryResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => libraryResourceService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Kutubxona resursi yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<LibraryResource>>(
        { queryKey: QUERY_KEYS.LIBRARY_RESOURCES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIBRARY_RESOURCES });
      revalidateFrontend(["library-resources"], "/talabalarga/kutubxona");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Kutubxona resursi yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateLibraryResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      libraryResourceService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Kutubxona resursi yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<LibraryResource>>(
        { queryKey: QUERY_KEYS.LIBRARY_RESOURCES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.LIBRARY_RESOURCE_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIBRARY_RESOURCES });
      const paths = ["/talabalarga/kutubxona"];
      if (updatedItem?.slug) paths.push(`/talabalarga/kutubxona/${updatedItem.slug}`);
      revalidateFrontend(["library-resources"], paths);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Kutubxona resursi yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteLibraryResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => libraryResourceService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.LIBRARY_RESOURCES });
      const previousData = queryClient.getQueriesData<PaginatedResponse<LibraryResource>>({ queryKey: QUERY_KEYS.LIBRARY_RESOURCES });
      // Kesh'dan o'chirilayotgan kitob slug'ini olish (revalidate uchun)
      let deletedSlug: string | undefined;
      previousData.forEach(([, data]) => {
        if (!data || !Array.isArray(data.data)) return;
        const found = data.data.find((item) => item.id === Number(id));
        if (found?.slug) deletedSlug = found.slug;
      });
      queryClient.setQueriesData<PaginatedResponse<LibraryResource>>(
        { queryKey: QUERY_KEYS.LIBRARY_RESOURCES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData, deletedSlug };
    },
    onSuccess: () => {
      toast.success("Kutubxona resursi o'chirildi!");
    },
    onError: (error: any, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          if (data) queryClient.setQueryData(key, data);
        });
      }
      if (error?.response?.status === 404) {
        toast.success("Kutubxona resursi allaqachon o'chirilgan!");
        return;
      }
      const message = error?.response?.data?.message || error?.message || "Kutubxona resursi o'chirishda xato!";
      toast.error(message);
    },
    onSettled: (_data, _err, _id, context) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIBRARY_RESOURCES });
      const paths = ["/talabalarga/kutubxona"];
      if (context?.deletedSlug) paths.push(`/talabalarga/kutubxona/${context.deletedSlug}`);
      revalidateFrontend(["library-resources"], paths);
    },
  });
}
