"use client";

import { AuthProvider } from "./auth";

export function AuthProviderClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthProvider>{children}</AuthProvider>;
}
