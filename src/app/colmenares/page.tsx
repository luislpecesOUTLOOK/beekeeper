"use client";

import Link from "next/link";
import { useSnapshot } from "@/lib/useSnapshot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ApiariesPage() {
  const apiaries = useSnapshot((s) => s.getApiaries());

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
          </Link>
          <Link href="/colmenar/nuevo" className="ml-auto">
            <Button variant="amber" size="sm">Nuevo Colmenar</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-10 sm:py-16 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">
                Colmenares
              </p>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
                Tus colmenares
              </h1>
              <p className="mt-2 text-muted leading-relaxed">
                Cada colmenar puede tener de 1 a N colmenas. Crea uno nuevo o
                selecciona uno existente.
              </p>
            </div>
          </div>

          <Card padded className="p-6">
            {apiaries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted text-sm">
                  No hay colmenares registrados aún.
                </p>
                <Button variant="amber" size="default" className="mt-4">
                  Crear primer colmenar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiaries.map((apiary) => (
                  <Link
                    key={apiary.id}
                    href={`/colmenares/${apiary.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-card/40 p-5 hover:border-amber transition-colors"
                  >
                    <div>
                      <h3 className="font-extrabold text-cream">{apiary.name}</h3>
                      <p className="text-sm text-muted">
                        {apiary.location}{apiary.regaCode ? ` · REGA: ${apiary.regaCode}` : ""}
                      </p>
                      <p className="mt-1 text-xs font-mono text-faint">
                        {apiary.hiveCount} colmena{apiary.hiveCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-amber font-display font-bold">›</span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
