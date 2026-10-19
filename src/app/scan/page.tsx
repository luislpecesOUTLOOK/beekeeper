"use client";

import { useState } from "react";
import { Scan, List } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScanPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleLookup = () => {
    const hive = store.getHives().find((h) => h.code === code.trim().toUpperCase());
    if (hive) {
      router.push(`/hives/${hive.id}`);
    }
  };

  return (
    <div className="max-w-[520px] mx-auto py-6 px-4 space-y-4 safe-bottom">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-charcoal">Escanear QR</h1>
        <p className="text-sm text-charcoal/60">
          Escanea la etiqueta de la colmena o escribe su código para abrirla.
        </p>
      </div>

      <Card padded>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scan size={20} strokeWidth={2.5} className="text-teal-primary" />
            <CardTitle className="text-base">Lectura rápida</CardTitle>
          </div>
          <p className="text-xs text-charcoal/50 mt-1">
            La cámara del dispositivo no está disponible en esta versión.
            Escribe el código impreso en la etiqueta QR.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
              Código de colmena
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej. LC-001"
              className="w-full pl-4 py-4 rounded-lg border border-charcoal/20 bg-white text-charcoal text-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-primary/50 uppercase"
            />
          </div>
          <Button
            variant="default"
            onClick={handleLookup}
            disabled={!code}
            className="w-full"
          >
            Abrir colmena
          </Button>
        </CardContent>
      </Card>

      <div className="pt-4 flex items-center gap-2">
        <Link href="/hives">
          <Button variant="outline" size="sm" className="flex-1">
            <List size={18} strokeWidth={2} /> Ver todas las colmenas
          </Button>
        </Link>
      </div>
    </div>
  );
}
