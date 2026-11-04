"use client";

import { useState } from "react";
import { Layout, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { store } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);

  const counts = {
    apiaries: store.getApiaries().length,
    hives: store.getHives().length,
    logs: store.getHives().flatMap((h) => h.workLogs).length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <Link href="/colmenares" className="flex items-center gap-3">
            <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
          </Link>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-10 sm:py-16 max-w-6xl mx-auto bg-[#121212] bg-[url('/comb.svg')] bg-repeat bg-[length:80px_140px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">Ajustes</p>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
                Ajustes y resumen
              </h1>
              <p className="mt-2 text-muted leading-relaxed">
                Datos almacenados localmente en el dispositivo. Sesión de:{user?.nombre}
              </p>
            </div>
          </div>

          <Card padded={false} className="p-6 border border-cream/10">
            <CardHeader>
              <CardTitle>Resumen de datos</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Explotaciones", value: counts.apiaries },
                  { label: "Colmenas", value: counts.hives },
                  { label: "Registros", value: counts.logs },
                ].map((item) => (
                  <Card key={item.label} padded={false} className="p-4 border-0 shadow-none">
                    <div className="text-3xl font-extrabold text-cream">{item.value}</div>
                    <div className="text-[11px] font-mono text-faint uppercase tracking-wider">{item.label}</div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card padded={false} className="p-6 border border-cream/10">
            <CardHeader>
              <CardTitle>Almacenamiento</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layout size={18} strokeWidth={2.5} className="text-amber" />
                    <div>
                      <p className="text-sm font-medium text-cream">localStorage</p>
                      <p className="text-xs text-muted">Todos los cambios se guardan en el navegador.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-cream/10 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const data = {
                      apiaries: store.getApiaries(),
                      hives: store.getHives(),
                      exportedAt: new Date().toISOString(),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "beekeeper-respaldo.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }} className="w-full">
                    <Download size={16} strokeWidth={2} /> Exportar respaldo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {confirmReset ? (
            <Card padded={false} className="p-6 border border-amber/20 bg-amber/5">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-amber">¿Restablecer datos de demostración?</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-3">
                <p className="text-sm text-amber">
                  Se borrarán todos los datos locales y se cargará el conjunto de demostración inicial.
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={() => {
                    store.resetToSeed();
                    setConfirmReset(false);
                  }} className="w-full">Sí, restablecer</Button>
                  <Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)} className="w-full">
                <Trash2 size={16} strokeWidth={2} /> Restablecer datos de demostración
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
