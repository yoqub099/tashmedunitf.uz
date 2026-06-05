"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { contactService, type ContactParams, type ContactUpdateData } from "@/lib/services/contactService";
import { QUERY_KEYS } from "@/lib/constants";
import toast from "react-hot-toast";
import type { Contact, PaginatedResponse } from "@/types";

export function useContacts(params?: ContactParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTACTS, params],
    queryFn: () => contactService.getAll(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useContactDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACT_DETAIL(id),
    queryFn: () => contactService.getById(id),
    enabled: !!id,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACTS_UNREAD,
    queryFn: () => contactService.getUnreadCount(),
    refetchInterval: 60_000,       // har 60s polling
    staleTime: 55_000,             // 55s — polling orasida refetch qilmaydi
    gcTime: 5 * 60_000,            // 5 min cache
    refetchOnWindowFocus: false,   // polling yetarli
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: ContactUpdateData }) =>
      contactService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Xabar yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<Contact>>(
        { queryKey: QUERY_KEYS.CONTACTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS_UNREAD });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Xabar yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => contactService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CONTACTS });
      const previousData = queryClient.getQueriesData<PaginatedResponse<Contact>>({ queryKey: QUERY_KEYS.CONTACTS });
      queryClient.setQueriesData<PaginatedResponse<Contact>>(
        { queryKey: QUERY_KEYS.CONTACTS },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Xabar o'chirildi!"),
    onError: (error: any, _id, context) => {
      if (context?.previousData) context.previousData.forEach(([key, data]) => { if (data) queryClient.setQueryData(key, data); });
      const message = error?.response?.data?.message || error?.message || "Xabar o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS_UNREAD });
    },
  });
}
