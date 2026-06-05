"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testimonialService, type TestimonialParams } from "@/lib/services/testimonialService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { Testimonial, PaginatedResponse } from "@/types";

export function useTestimonials(params?: TestimonialParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.TESTIMONIALS, params],
    queryFn: () => testimonialService.getAll(params),
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => testimonialService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Izoh qo'shildi!");
      queryClient.setQueriesData<PaginatedResponse<Testimonial>>(
        { queryKey: QUERY_KEYS.TESTIMONIALS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TESTIMONIALS });
      revalidateFrontend(["testimonials"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Izoh qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      testimonialService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Izoh yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Testimonial>>(
        { queryKey: QUERY_KEYS.TESTIMONIALS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.TESTIMONIAL_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TESTIMONIALS });
      revalidateFrontend(["testimonials"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Izoh yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => testimonialService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TESTIMONIALS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Testimonial>>({ queryKey: QUERY_KEYS.TESTIMONIALS });
      queryClient.setQueriesData<PaginatedResponse<Testimonial>>(
        { queryKey: QUERY_KEYS.TESTIMONIALS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Izoh o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Izoh o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TESTIMONIALS });
      revalidateFrontend(["testimonials"]);
    },
  });
}
