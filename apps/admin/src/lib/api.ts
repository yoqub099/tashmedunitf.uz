import axios from "axios";
import { siteConfig } from "@/config/site";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: siteConfig.apiUrl,
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 401 redirect'ni faqat 1 marta qilish uchun flag
let isRedirectingTo401 = false;

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => {
    // Muvaffaqiyatli response — flag ni reset qilish
    isRedirectingTo401 = false;
    return response;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isRedirectingTo401
    ) {
      const url = error.config?.url || "";
      if (!url.includes("auth/login") && !window.location.pathname.includes("/login")) {
        isRedirectingTo401 = true;

        useAuthStore.getState().logout();
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
