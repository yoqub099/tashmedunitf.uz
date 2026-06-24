import api from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types";

// ============================================
// /look — Kuzatuv markazi tiplari
// ============================================

export interface LookStats {
  activities: { today: number; week: number; total: number };
  errors: {
    today: number;
    week: number;
    total: number;
    by_source: { backend: number; web: number; admin: number };
  };
  sessions: { logins_today: number; failed_today: number };
  online_now: number;
  generated_at: string;
}

export interface LookActivity {
  id: number;
  log_name: "content" | "auth" | "media";
  event: string;
  description: string | null;
  causer: { id: number | null; name: string | null; role: string | null };
  subject: { type: string | null; id: number | null; label: string | null };
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  properties: Record<string, unknown> | null;
  ip: string | null;
  method: string | null;
  url: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface LookError {
  id: number;
  source: "backend" | "web" | "admin";
  level: string;
  type: string | null;
  message: string;
  file: string | null;
  line: number | null;
  url: string | null;
  method: string | null;
  status_code: number | null;
  user: { id: number | null; name: string | null };
  ip: string | null;
  user_agent: string | null;
  context: { trace?: unknown[]; stack?: string; componentStack?: string; extra?: unknown } | null;
  fingerprint: string | null;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface LookUser {
  id: number;
  name: string;
  email: string;
  role: string | null;
  is_online: boolean;
  last_seen: string | null;
  last_login: string | null;
  last_activity: string | null;
  actions_today: number;
  actions_week: number;
  actions_total: number;
}

export interface ActivityParams {
  page?: number;
  per_page?: number;
  log_name?: string;
  event?: string;
  causer_id?: number;
  subject_type?: string;
  q?: string;
}

export interface ErrorParams {
  page?: number;
  per_page?: number;
  source?: string;
  level?: string;
  q?: string;
}

export interface SessionParams {
  page?: number;
  per_page?: number;
  event?: string;
  causer_id?: number;
}

// ============================================
// Service
// ============================================

export const lookService = {
  stats: async (): Promise<LookStats> => {
    const { data } = await api.get<ApiResponse<LookStats>>("look/stats");
    return data.data;
  },

  activities: async (params?: ActivityParams): Promise<PaginatedResponse<LookActivity>> => {
    const { data } = await api.get<PaginatedResponse<LookActivity>>("look/activities", { params });
    return data;
  },

  errors: async (params?: ErrorParams): Promise<PaginatedResponse<LookError>> => {
    const { data } = await api.get<PaginatedResponse<LookError>>("look/errors", { params });
    return data;
  },

  sessions: async (params?: SessionParams): Promise<PaginatedResponse<LookActivity>> => {
    const { data } = await api.get<PaginatedResponse<LookActivity>>("look/sessions", { params });
    return data;
  },

  users: async (): Promise<LookUser[]> => {
    const { data } = await api.get<ApiResponse<LookUser[]>>("look/users");
    return data.data;
  },
};
