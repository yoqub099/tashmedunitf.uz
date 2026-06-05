"use client";

import { useQuery } from "@tanstack/react-query";
import { conferenceRegistrationService } from "@/lib/services/conferenceRegistrationService";
import { QUERY_KEYS } from "@/lib/constants";

export function useConferenceUnreadCount() {
  return useQuery({
    queryKey: QUERY_KEYS.CONFERENCE_REGISTRATIONS_UNREAD,
    queryFn: () => conferenceRegistrationService.getUnreadCount(),
    refetchInterval: 60_000,       // har 60s polling
    staleTime: 55_000,             // 55s — polling orasida refetch qilmaydi
    gcTime: 5 * 60_000,            // 5 min cache
    refetchOnWindowFocus: false,   // polling yetarli
  });
}
