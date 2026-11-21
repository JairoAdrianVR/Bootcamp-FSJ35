"use client";

import { useAuthContext } from "@/features/auth/components/AuthProvider";

export function useAuth() {
  return useAuthContext();
}
