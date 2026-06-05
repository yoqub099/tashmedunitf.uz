"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { careerCenterInfoService, type CareerCenterInfoParams } from "@/lib/services/careerCenterInfoService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { CareerCenterInfo, PaginatedResponse } from "@/types";

export function useCareerCenterInfos(params?: CareerCenterInfoParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CAREER_CENTER_INFOS, params],
    queryFn: () => careerCenterInfoService.getAll(params),
  });
}

export function useCareerCenterInfoDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.CAREER_CENTER_INFO_DETAIL(id),
    queryFn: () => careerCenterInfoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCareerCenterInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => careerCenterInfoService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Karyera markazi ma'lumoti qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<CareerCenterInfo>>(
        { queryKey: QUERY_KEYS.CAREER_CENTER_INFOS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAREER_CENTER_INFOS });
      revalidateFrontend(["career-center-infos"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Ma'lumot qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateCareerCenterInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      careerCenterInfoService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Karyera markazi yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<CareerCenterInfo>>(
        { queryKey: QUERY_KEYS.CAREER_CENTER_INFOS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.CAREER_CENTER_INFO_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAREER_CENTER_INFOS });
      revalidateFrontend(["career-center-infos"], "/talabalarga");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Ma'lumot yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteCareerCenterInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => careerCenterInfoService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CAREER_CENTER_INFOS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<CareerCenterInfo>>({ queryKey: QUERY_KEYS.CAREER_CENTER_INFOS });
      queryClient.setQueriesData<PaginatedResponse<CareerCenterInfo>>(
        { queryKey: QUERY_KEYS.CAREER_CENTER_INFOS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Ma'lumot o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Ma'lumot o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAREER_CENTER_INFOS });
      revalidateFrontend(["career-center-infos"], "/talabalarga");
    },
  });
}
