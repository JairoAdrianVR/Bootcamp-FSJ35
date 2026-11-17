"use client";

import { AuthProvider } from "@/features/auth/components/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
