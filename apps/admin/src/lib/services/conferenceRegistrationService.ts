import api from "@/lib/api";
import type { ConferenceRegistration, PaginatedResponse, ApiResponse } from "@/types";

export interface ConferenceRegistrationParams {
  page?: number;
  per_page?: number;
  "filter[is_read]"?: boolean;
  "filter[news_id]"?: number;
}

export const conferenceRegistrationService = {
  getAll: (params?: ConferenceRegistrationParams) =>
    api.get<PaginatedResponse<ConferenceRegistration>>("conference-registrations", { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<ConferenceRegistration>>(`conference-registrations/${id}`).then((r) => r.data.data),

  delete: (id: number) =>
    api.delete(`conference-registrations/${id}`),

  getUnreadCount: () =>
    api.get<{ success: boolean; data: { count: number } }>("conference-registrations/unread/count").then((r) => r.data.data.count),
};
