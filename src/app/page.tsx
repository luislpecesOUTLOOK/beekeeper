"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const field =
  "w-full rounded-xl bg-card px-4 py-3 text-cream placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber";

export default function WelcomePage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nombre || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }
    login(nombre);
    router.push("/colmenares");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <Image
            src="/assets/logo-lacajaambar.png"
            alt="LaCajaAmbar"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-[5%] py-20">
        <div className="mx-auto max-w-md">
          <Card padded className="p-8 sm:p-12 border border-cream/10">
            <div className="flex flex-col items-center gap-2 mb-8">
              <Image
                src="/assets/logo-lacajaambar.png"
                alt="LaCajaAmbar"
                width={96}
                height={82}
                className="h-20 w-auto"
              />
              <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">
                BeeKeeper · Acceso
              </p>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
                Bienvenido
              </h1>
              <p className="mt-2 leading-relaxed text-muted">
                Inicia sesión para gestionar tus colmenares y colmenas.
              </p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-5">
              <div className="grid gap-1.5">
                <label htmlFor="wl-user" className="text-sm font-medium text-cream">
                  Usuario
                </label>
                <input
                  id="wl-user"
                  type="text"
                  required
                  autoComplete="username"
                  spellCheck={false}
                  placeholder="Ej. apicultor1"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={field}
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="wl-pass" className="text-sm font-medium text-cream">
                  Contraseña
                </label>
                <input
                  id="wl-pass"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="········"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={field}
                />
              </div>

              {error && (
                <p className="min-h-5 text-sm text-amber">{error}</p>
              )}

              <Button
                type="submit"
                variant="amber"
                size="default"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Entrando…" : "Entrar a BeeKeeper"}
              </Button>
            </form>

            <p className="mt-6 text-xs text-faint text-center">
              Cualquier usuario y contraseña son válidos para este entorno de
              prueba.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
