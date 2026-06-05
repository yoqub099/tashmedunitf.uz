/**
 * Base HTTP client — fetch wrapper with retry, timeout, error normalization.
 */

import type { ApiError } from '@tmtu/types';

export type ClientOptions = {
  baseUrl: string;
  timeout?: number;
  token?: string;
  defaultHeaders?: HeadersInit;
};

export class TmtuApiClient {
  private baseUrl: string;
  private timeout: number;
  private token: string | undefined;
  private defaultHeaders: HeadersInit;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.timeout = options.timeout ?? 15_000;
    this.token = options.token;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  setToken(token: string | undefined): void {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    init?: RequestInit & { tags?: string[]; revalidate?: number | false },
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(this.defaultHeaders as Record<string, string>),
      ...(init?.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const res = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as ApiError;
        throw {
          ...body,
          status: res.status,
          success: false,
        } satisfies ApiError;
      }

      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  get<T>(endpoint: string, options?: { tags?: string[]; revalidate?: number | false }): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const createClient = (options: ClientOptions): TmtuApiClient => new TmtuApiClient(options);
