"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { QUERY_KEYS } from "@/lib/constants";
import type { LoginCredentials } from "@/types";
import toast from "react-hot-toast";

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Email yoki parol noto'g'ri!";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Tizimdan chiqdingiz");
    },
    onError: () => {
      // API xatolik bersa ham logout qilish
      logout();
      queryClient.clear();
    },
  });
}

export function useMe() {
  const { isAuthenticated, token, logout } = useAuthStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: () => authService.me(),
    enabled: isAuthenticated && !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 daqiqa
  });

  // Token yaroqsiz bo'lsa — logout (useEffect ichida, render-safe)
  useEffect(() => {
    if (query.isError && isAuthenticated) {
      logout();
    }
  }, [query.isError, isAuthenticated, logout]);

  return query;
}
