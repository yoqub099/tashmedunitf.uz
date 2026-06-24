"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  lookService,
  type ActivityParams,
  type ErrorParams,
  type SessionParams,
} from "@/lib/services/lookService";

// Jonli polling interval (ms) — sahifa real vaqtda yangilanadi
const LIVE_INTERVAL = 8000;

const LOOK_KEYS = {
  STATS: ["look", "stats"] as const,
  ACTIVITIES: ["look", "activities"] as const,
  ERRORS: ["look", "errors"] as const,
  SESSIONS: ["look", "sessions"] as const,
  USERS: ["look", "users"] as const,
};

export function useLookStats(live = true) {
  return useQuery({
    queryKey: LOOK_KEYS.STATS,
    queryFn: () => lookService.stats(),
    refetchInterval: live ? LIVE_INTERVAL : false,
    refetchOnWindowFocus: true,
    staleTime: 4000,
  });
}

export function useLookActivities(params: ActivityParams, live = true) {
  return useQuery({
    queryKey: [...LOOK_KEYS.ACTIVITIES, params],
    queryFn: () => lookService.activities(params),
    refetchInterval: live ? LIVE_INTERVAL : false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 4000,
  });
}

export function useLookErrors(params: ErrorParams, live = true) {
  return useQuery({
    queryKey: [...LOOK_KEYS.ERRORS, params],
    queryFn: () => lookService.errors(params),
    refetchInterval: live ? LIVE_INTERVAL : false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 4000,
  });
}

export function useLookSessions(params: SessionParams, live = true) {
  return useQuery({
    queryKey: [...LOOK_KEYS.SESSIONS, params],
    queryFn: () => lookService.sessions(params),
    refetchInterval: live ? LIVE_INTERVAL : false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 4000,
  });
}

export function useLookUsers(live = true) {
  return useQuery({
    queryKey: LOOK_KEYS.USERS,
    queryFn: () => lookService.users(),
    refetchInterval: live ? LIVE_INTERVAL : false,
    refetchOnWindowFocus: true,
    staleTime: 4000,
  });
}
