"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { siteContentService } from "@/lib/services/siteContentService";
import { QUERY_KEYS } from "@/lib/constants";
import { revalidateFrontend } from "@/lib/revalidate";
import toast from "react-hot-toast";
import type { SiteContent, SiteContentUpsertData } from "@/types";

/**
 * Bo'lim bo'yicha sayt kontentlarini olish
 */
export function useSiteContents(section?: string) {
  return useQuery({
    queryKey: section
      ? QUERY_KEYS.SITE_CONTENTS_SECTION(section)
      : QUERY_KEYS.SITE_CONTENTS,
    queryFn: () =>
      section
        ? siteContentService.getBySection(section)
        : siteContentService.getAll(),
  });
}

/**
 * Bitta kontentni upsert qilish
 */
export function useUpsertSiteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: SiteContentUpsertData) => siteContentService.upsert(item),
    onSuccess: (updatedItem) => {
      toast.success("Kontent yangilandi!");
      // Barcha site-contents keshlarni yangilaymiz
      queryClient.setQueriesData<SiteContent[]>(
        { queryKey: QUERY_KEYS.SITE_CONTENTS },
        (old) => {
          if (!old) return old;
          const idx = old.findIndex((c) => c.key === updatedItem.key);
          if (idx >= 0) { const copy = [...old]; copy[idx] = updatedItem; return copy; }
          return [...old, updatedItem];
        }
      );
      revalidateFrontend(["site-contents"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Kontentni yangilashda xato!";
      toast.error(message);
    },
  });
}

/**
 * Bir nechta kontentni birdaniga upsert qilish
 */
export function useBatchUpsertSiteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: SiteContentUpsertData[]) =>
      siteContentService.batchUpsert(items),
    onSuccess: () => {
      toast.success("Barcha kontentlar yangilandi!");
      // Batch da aniq qaysi elementlar o'zgardi bilmaymiz — invalidate qilamiz
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_CONTENTS });
      revalidateFrontend(["site-contents"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Kontentlarni yangilashda xato!";
      toast.error(message);
    },
  });
}

/**
 * Rasm yuklash
 */
export function useUploadSiteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, key, section }: { file: File; key: string; section: string }) =>
      siteContentService.uploadImage(file, key, section),
    onSuccess: () => {
      toast.success("Rasm yuklandi!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_CONTENTS });
      revalidateFrontend(["site-contents"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Rasm yuklashda xato!";
      toast.error(message);
    },
  });
}

/**
 * Kontentni o'chirish
 */
export function useDeleteSiteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => siteContentService.delete(key),
    onMutate: async (key) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.SITE_CONTENTS });
      const previousData = queryClient.getQueriesData<SiteContent[]>({ queryKey: QUERY_KEYS.SITE_CONTENTS });
      queryClient.setQueriesData<SiteContent[]>(
        { queryKey: QUERY_KEYS.SITE_CONTENTS },
        (old) => old ? old.filter((c) => c.key !== key) : old
      );
      return { previousData };
    },
    onSuccess: () => toast.success("Kontent o'chirildi!"),
    onError: (error: any, _key, context) => {
      if (context?.previousData) context.previousData.forEach(([k, data]) => { if (data) queryClient.setQueryData(k, data); });
      const message = error?.response?.data?.message || error?.message || "Kontentni o'chirishda xato!";
      toast.error(message);
    },
    onSettled: () => revalidateFrontend(["site-contents"]),
  });
}

/**
 * Helper: SiteContent[] dan kerakli key bo'yicha qiymat olish
 */
export function getContentValue(
  contents: SiteContent[] | undefined,
  key: string,
  lang: "uz" | "ru" | "en" = "uz"
): string {
  if (!contents) return "";
  const item = contents.find((c) => c.key === key);
  if (!item) return "";
  return item.value[lang] || item.value.uz || "";
}

/**
 * Helper: SiteContent[] dan kerakli key bo'yicha to'liq Translatable olish
 */
export function getContentTranslatable(
  contents: SiteContent[] | undefined,
  key: string
): { uz: string; ru?: string; en?: string } {
  if (!contents) return { uz: "" };
  const item = contents.find((c) => c.key === key);
  if (!item) return { uz: "" };
  return item.value;
}
