"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { journalIssueService, type JournalIssueParams } from "@/lib/services/journalIssueService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { JournalIssue, PaginatedResponse } from "@/types";

const REVALIDATE_PATH = "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal";

export function useJournalIssues(params?: JournalIssueParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.JOURNAL_ISSUES, params],
    queryFn: () => journalIssueService.getAll(params),
  });
}

export function useJournalIssueDetail(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.JOURNAL_ISSUE_DETAIL(id),
    queryFn: () => journalIssueService.getById(id),
    enabled: !!id,
  });
}

export function useCreateJournalIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => journalIssueService.create(formData),
    onSuccess: (newItem) => {
      toast.success("Jurnal soni yaratildi!");
      queryClient.setQueriesData<PaginatedResponse<JournalIssue>>(
        { queryKey: QUERY_KEYS.JOURNAL_ISSUES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: [newItem, ...old.data], meta: { ...old.meta, total: old.meta.total + 1 } } : old
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ISSUES });
      revalidateFrontend(["journal-issues"], REVALIDATE_PATH);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Jurnal soni yaratishda xato!";
      toast.error(message);
    },
  });
}

export function useUpdateJournalIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      journalIssueService.update(id, formData),
    onSuccess: (updatedItem, { id }) => {
      toast.success("Jurnal soni yangilandi!");
      queryClient.setQueriesData<PaginatedResponse<JournalIssue>>(
        { queryKey: QUERY_KEYS.JOURNAL_ISSUES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.map((item) => item.id === Number(id) ? { ...item, ...updatedItem } : item) } : old
      );
      queryClient.setQueryData(QUERY_KEYS.JOURNAL_ISSUE_DETAIL(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ISSUES });
      revalidateFrontend(["journal-issues"], REVALIDATE_PATH);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Jurnal soni yangilashda xato!";
      toast.error(message);
    },
  });
}

export function useDeleteJournalIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => journalIssueService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.JOURNAL_ISSUES });
      const previousData = queryClient.getQueriesData<PaginatedResponse<JournalIssue>>({ queryKey: QUERY_KEYS.JOURNAL_ISSUES });
      queryClient.setQueriesData<PaginatedResponse<JournalIssue>>(
        { queryKey: QUERY_KEYS.JOURNAL_ISSUES },
        (old) => old && Array.isArray(old.data) ? { ...old, data: old.data.filter((item) => item.id !== Number(id)), meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) } } : old
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success("Jurnal soni o'chirildi!");
    },
    onError: (error: any, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          if (data) queryClient.setQueryData(key, data);
        });
      }
      if (error?.response?.status === 404) {
        toast.success("Jurnal soni allaqachon o'chirilgan!");
        return;
      }
      const message = error?.response?.data?.message || error?.message || "Jurnal soni o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOURNAL_ISSUES });
      revalidateFrontend(["journal-issues"], REVALIDATE_PATH);
    },
  });
}
