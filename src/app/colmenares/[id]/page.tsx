"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, List, ShieldAlert } from "lucide-react";
import { useSnapshot } from "@/lib/useSnapshot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { HiveCard } from "@/components/hives/HiveCard";

export default function ApiaryDetailPage() {
  const { id } = useParams();
  const apiary = useSnapshot((s) => s.getApiary(String(id)));
  const hives = useSnapshot((s) => s.getHivesByApiary(String(id)));

  if (!apiary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-[5%] py-20">
        <Card padded className="p-8 border border-cream/10 text-center">
          <h2 className="text-2xl font-extrabold text-cream">Colmenar no encontrado</h2>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/colmenares">Volver a colmenares</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <Link href="/colmenares" className="flex items-center gap-2">
            <ChevronLeft size={16} strokeWidth={2} className="text-cream" />
            <span className="font-medium text-cream">Volver</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-8 sm:py-12 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">
              Colmenar
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
              {apiary.name}
            </h1>
            <p className="mt-2 text-muted leading-relaxed">
              {apiary.location}{apiary.regaCode ? ` · REGA: ${apiary.regaCode}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/hives/new?apiaryId=${apiary.id}`}>
                + Colmena
              </Link>
            </Button>
          </div>
        </div>

        <Card padded className="p-6 border border-cream/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List size={20} strokeWidth={2.5} className="text-amber" />
                <CardTitle className="text-sm">Colmenas ({hives.length})</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {hives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShieldAlert size={32} strokeWidth={2} className="text-faint mb-2" />
                  <p className="text-muted text-sm">No hay colmenas en este colmenar aún.</p>
                </div>
              ) : (
                hives.map((hive) => (
                  <HiveCard key={hive.id} hive={hive} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
