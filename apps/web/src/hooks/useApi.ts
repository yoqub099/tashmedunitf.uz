"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import * as services from "@/lib/services";
import type { ContactMessage } from "@/types";

// ============ News ============

export function useNews(params?: { page?: number; per_page?: number; category?: string }) {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => services.getNews(params),
  });
}

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => services.getNewsBySlug(slug),
    enabled: !!slug,
  });
}

// ============ Departments ============

export function useDepartments(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => services.getDepartments(params),
  });
}

export function useDepartmentBySlug(slug: string) {
  return useQuery({
    queryKey: ["department", slug],
    queryFn: () => services.getDepartmentBySlug(slug),
    enabled: !!slug,
  });
}

// ============ Staff ============

export function useStaff(params?: { page?: number; per_page?: number; department_id?: number }) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => services.getStaff(params),
  });
}

// ============ Directions ============

export function useDirections(params?: { page?: number; per_page?: number; level?: string }) {
  return useQuery({
    queryKey: ["directions", params],
    queryFn: () => services.getDirections(params),
  });
}

// ============ FAQ ============

export function useFaqs(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["faqs", params],
    queryFn: () => services.getFaqs(params),
  });
}

// ============ Testimonials ============

export function useTestimonials(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ["testimonials", params],
    queryFn: () => services.getTestimonials(params),
  });
}

// ============ Partners ============

export function usePartners(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ["partners", params],
    queryFn: () => services.getPartners(params),
  });
}

// ============ Banners ============

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => services.getBanners(),
  });
}

// ============ Pages ============

export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: () => services.getPageBySlug(slug),
    enabled: !!slug,
  });
}

// ============ Contact ============

export function useSendContact() {
  return useMutation({
    mutationFn: (data: ContactMessage) => services.sendContactMessage(data),
  });
}

// ============ Search ============

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => services.search(query),
    enabled: query.length >= 2,
  });
}
