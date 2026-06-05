import api from "@/lib/api";
import type { AuthResponse, LoginCredentials, User } from "@/types";

// Backend response format: { success: true, message: "...", data: { ... } }
interface ApiWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<ApiWrapper<AuthResponse>>("auth/login", credentials);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("auth/logout");
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<ApiWrapper<User>>("auth/me");
    return data.data;
  },
};
