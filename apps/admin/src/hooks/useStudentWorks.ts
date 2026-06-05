"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentWorkService } from "@/lib/services/studentWorkService";
import { QUERY_KEYS } from "@/lib/constants";

/**
 * Unread count — oyna ko'rinadigan bo'lsa polling qiladi.
 * Tab orqa planga o'tsa polling to'xtaydi (tabrik qaytib kelganda yangilanadi).
 */
export function useStudentWorkUnreadCount() {
  const [isVisible, setIsVisible] = useState<boolean>(
    typeof document !== "undefined" ? document.visibilityState === "visible" : true
  );

  useEffect(() => {
    const handler = () => setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return useQuery({
    queryKey: QUERY_KEYS.STUDENT_WORKS_UNREAD,
    queryFn: () => studentWorkService.getUnreadCount(),
    refetchInterval: isVisible ? 60_000 : false,
    staleTime: 55_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
}
