"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jobApplicationService } from "@/lib/services/jobApplicationService";
import { QUERY_KEYS } from "@/lib/constants";

/**
 * Unread count — oyna ko'rinadigan bo'lsa polling qiladi.
 * Tab orqa planga o'tganda polling to'xtaydi (document.visibilityState = hidden).
 */
export function useJobAppUnreadCount() {
  const [isVisible, setIsVisible] = useState<boolean>(
    typeof document !== "undefined" ? document.visibilityState === "visible" : true
  );

  useEffect(() => {
    const handler = () => setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return useQuery({
    queryKey: QUERY_KEYS.JOB_APPLICATIONS_UNREAD,
    queryFn: () => jobApplicationService.getUnreadCount(),
    refetchInterval: isVisible ? 60_000 : false,   // hidden tab — polling yo'q
    staleTime: 55_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: true,                     // tabga qaytganda refresh
  });
}
