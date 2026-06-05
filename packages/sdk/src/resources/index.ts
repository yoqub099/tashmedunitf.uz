/**
 * Resource accessors — typed wrappers around API endpoints.
 *
 * TODO: Generate from OpenAPI spec.
 */

import type {
  News,
  Faculty,
  Department,
  Staff,
  Direction,
  Faq,
  PaginatedResponse,
  ApiResponse,
} from '@tmtu/types';
import type { TmtuApiClient } from '../client';

export const createResources = (client: TmtuApiClient) => ({
  news: {
    list: (params?: { page?: number; per_page?: number; category?: string }) =>
      client.get<PaginatedResponse<News>>(
        `/v1/news${params ? '?' + new URLSearchParams(params as Record<string, string>) : ''}`,
        { tags: ['news'] },
      ),
    show: (slug: string) =>
      client.get<ApiResponse<News>>(`/v1/news/${slug}`, { tags: ['news'] }),
  },
  faculties: {
    list: (level?: string) =>
      client.get<PaginatedResponse<Faculty>>(
        `/v1/faculties${level ? `?level=${level}` : ''}`,
        { tags: ['faculties'] },
      ),
    show: (id: number) =>
      client.get<ApiResponse<Faculty>>(`/v1/faculties/${id}`, { tags: ['faculties'] }),
  },
  departments: {
    list: () =>
      client.get<PaginatedResponse<Department>>('/v1/departments', { tags: ['departments'] }),
    show: (slug: string) =>
      client.get<ApiResponse<Department>>(`/v1/departments/${slug}`, { tags: ['departments'] }),
  },
  staff: {
    list: () => client.get<PaginatedResponse<Staff>>('/v1/staff', { tags: ['staff'] }),
    show: (id: number) =>
      client.get<ApiResponse<Staff>>(`/v1/staff/${id}`, { tags: ['staff'] }),
  },
  directions: {
    list: (params?: { level?: string; faculty_id?: number }) =>
      client.get<PaginatedResponse<Direction>>(
        `/v1/directions${params ? '?' + new URLSearchParams(params as Record<string, string>) : ''}`,
        { tags: ['directions'] },
      ),
    show: (id: number) =>
      client.get<ApiResponse<Direction>>(`/v1/directions/${id}`, { tags: ['directions'] }),
  },
  faqs: {
    list: () => client.get<PaginatedResponse<Faq>>('/v1/faqs', { tags: ['faqs'] }),
  },
});
