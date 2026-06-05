const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/** Server origin without /api path — for building image URLs etc. */
export const API_BASE = API_BASE_URL.replace("/api", "") || "http://localhost:8000";

// API xatolik klassi — strukturali xato ma'lumotlari bilan
export class ApiError extends Error {
  status: number;
  statusText: string;
  body: Record<string, unknown> | null;

  constructor(status: number, statusText: string, body: Record<string, unknown> | null = null) {
    super(`API Error: ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
  tags?: string[];
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string, defaultTimeout = 15000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const { params, tags, timeout, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    // Dev mode: kesh ishlatmaymiz (har doim fresh data olish)
    // Prod mode: ISR — 60 soniyada yangilanadi + on-demand revalidateTag()
    //
    // MUHIM: revalidate: false ISHLATMAYMIZ chunki:
    // - Agar on-demand revalidation ishlamasa, sahifa ABADIY eski qoladi
    // - 999 million user eski sahifani ko'radi
    // - revalidate: 60 = har 60 soniyada tekshiriladi (fallback)
    // - On-demand revalidation ham ishlaydi (admin CRUD orqali)
    //
    const isDev = process.env.NODE_ENV === "development";
    const nextOptions = isDev
      ? { tags } // dev: no Data Cache
      : { revalidate: 60, tags }; // prod: 60s TTL fallback + on-demand tags

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeout || this.defaultTimeout),
      cache: isDev ? "no-store" : undefined,
      next: nextOptions,
      ...fetchOptions,
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch {}
      throw new ApiError(response.status, response.statusText, body);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    const { params, timeout, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeout || this.defaultTimeout),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch {}
      throw new ApiError(response.status, response.statusText, body);
    }

    return response.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData, options?: FetchOptions): Promise<T> {
    const { params, timeout, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(timeout || this.defaultTimeout),
      body: formData,
      ...fetchOptions,
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch {}
      throw new ApiError(response.status, response.statusText, body);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    const { params, timeout, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeout || this.defaultTimeout),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch {}
      throw new ApiError(response.status, response.statusText, body);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const { params, timeout, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(timeout || this.defaultTimeout),
      ...fetchOptions,
    });

    if (!response.ok) {
      let body = null;
      try { body = await response.json(); } catch {}
      throw new ApiError(response.status, response.statusText, body);
    }

    // 204 No Content — body yo'q
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);
