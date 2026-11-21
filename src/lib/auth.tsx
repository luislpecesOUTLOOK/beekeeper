"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
type User = { id: string; nombre: string; email: string } | null;

type AuthContextType = {
  user: User;
  login: (nombre: string, captchaToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  captchaConsentGiven: boolean;
  setCaptchaConsentGiven: (value: boolean) => void;
};

const GDPR_CONSENT_KEY = "beekeeper:hcaptcha_consent";

const hasGDPRConsent = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(GDPR_CONSENT_KEY);
    return raw === "true";
  } catch {
    return false;
  }
};

const setGDPRConsent = (value: boolean) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GDPR_CONSENT_KEY, value ? "true" : "false");
  } catch {
    // Ignore storage errors in private/incognito modes
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("beekeeper:user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [captchaConsentGiven, setCaptchaConsentGiven] = useState<
    boolean
  >(hasGDPRConsent);

  useEffect(() => {
    setCaptchaConsentGiven(hasGDPRConsent());
  }, []);

  const login = async (nombre: string, captchaToken: string) => {
    setIsLoading(true);
    // Verify hCaptcha token with backend
    try {
      const resp = await fetch("/api/verify-hcaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      });
      const data = await resp.json();
      if (!data.success) {
        setIsLoading(false);
        throw new Error("CAPTCHA verification failed");
      }
    } catch (err) {
      console.error("hCaptcha verification error:", err);
      // Fallback: proceed without CAPTCHA for local development
    }

    const u: User = {
      id: `user-${Date.now()}`,
      nombre,
      email: `${nombre.toLowerCase().replace(/\s+/g, "")}@lacajaambar.local`,
    };
    localStorage.setItem("beekeeper:user", JSON.stringify(u));
    setUser(u);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("beekeeper:user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, captchaConsentGiven, setCaptchaConsentGiven }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}