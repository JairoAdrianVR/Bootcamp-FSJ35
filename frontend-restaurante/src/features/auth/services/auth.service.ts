import { apiRequest } from "@/shared/lib/apiClient";
import type { LoginCredentials, LoginResponse, AuthUser } from "@/features/auth/types";

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiRequest<LoginResponse>("/login", { method: "POST", body: credentials }),

  logout: () => apiRequest<{ message: string }>("/logout", { method: "POST" }),

  me: () => apiRequest<AuthUser>("/me"),
};
