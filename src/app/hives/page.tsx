"use client";

import { Search, List } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSnapshot } from "@/lib/useSnapshot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { HiveList } from "@/components/hives/HiveCard";

export default function HivesPage() {
  const hives = useSnapshot((s) => s.getHives());
  const [query, setQuery] = useState("");

  const filtered = hives.filter(
    (h) =>
      h.code.toLowerCase().includes(query.toLowerCase()) ||
      h.apiaryId.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
          </Link>
          <Link href="/colmenares" className="text-sm font-medium text-muted hover:text-amber transition-colors">
            Colmenares
          </Link>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-10 sm:py-16 max-w-6xl mx-auto bg-[#121212] bg-[url('/comb.svg')] bg-repeat bg-[length:80px_140px]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">Colmenas</p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
              Todas las colmenas
            </h1>
            <p className="mt-2 text-muted leading-relaxed">
              Busca por código o gestiona el inventario de colmenas.
            </p>
          </div>

          <div className="relative mt-6">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="text"
              placeholder="Buscar código (Ej. LC-001)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border border-cream/10 bg-card text-cream text-sm focus:outline-none focus:ring-2 focus:ring-amber`}
            />
          </div>

          <Card padded={false} className="border border-cream/10">
            <CardHeader>
              <CardTitle className="text-sm">Listado ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <HiveList hives={filtered} />
            </CardContent>
          </Card>

          <div className="pt-8 flex items-center gap-2">
            <Link href="/colmenar/nuevo">
              <Button variant="amber" size="default" className="flex-1">
                <List size={20} strokeWidth={2.5} /> Nuevo Colmenar
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
