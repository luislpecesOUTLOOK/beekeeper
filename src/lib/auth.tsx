"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type User = { id: string; nombre: string; email: string } | null;

type AuthContextType = {
  user: User;
  login: (nombre: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("beekeeper:user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = (nombre: string) => {
    setIsLoading(true);
    const u: User = { id: `user-${Date.now()}`, nombre, email: `${nombre.toLowerCase().replace(/\s+/g, "")}@lacajaambar.local` };
    localStorage.setItem("beekeeper:user", JSON.stringify(u));
    setUser(u);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("beekeeper:user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
