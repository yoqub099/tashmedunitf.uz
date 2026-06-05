"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactLocationService, type ContactLocationFormData } from "@/lib/services/contactLocationService";
import { QUERY_KEYS } from "@/lib/constants";
import toast from "react-hot-toast";
import { revalidateFrontend } from "@/lib/revalidate";
import type { ContactLocation } from "@/types";

export function useContactLocations() {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACT_LOCATIONS,
    queryFn: () => contactLocationService.getAll(),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useCreateContactLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactLocationFormData) => contactLocationService.create(data),
    onSuccess: (newItem) => {
      toast.success("Joylashuv qo'shildi!");
      queryClient.setQueryData<ContactLocation[]>(
        QUERY_KEYS.CONTACT_LOCATIONS,
        (old) => old ? [...old, newItem] : [newItem]
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACT_LOCATIONS });
      revalidateFrontend(["contacts"], "/boglanish");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Joylashuv qo'shishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateContactLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<ContactLocationFormData> }) =>
      contactLocationService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Joylashuv yangilandi!");
      queryClient.setQueryData<ContactLocation[]>(
        QUERY_KEYS.CONTACT_LOCATIONS,
        (old) => old ? old.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACT_LOCATIONS });
      revalidateFrontend(["contacts"], "/boglanish");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Joylashuv yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteContactLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => contactLocationService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CONTACT_LOCATIONS });
      const previousData = queryClient.getQueryData<ContactLocation[]>(QUERY_KEYS.CONTACT_LOCATIONS);
      queryClient.setQueryData<ContactLocation[]>(
        QUERY_KEYS.CONTACT_LOCATIONS,
        (old) => old ? old.filter((item) => item.id !== Number(id)) : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Joylashuv o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) queryClient.setQueryData(QUERY_KEYS.CONTACT_LOCATIONS, context.previousData);
      const message = error?.response?.data?.message || error?.message || "Joylashuv o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACT_LOCATIONS });
      revalidateFrontend(["contacts"], "/boglanish");
    },
  });
}
