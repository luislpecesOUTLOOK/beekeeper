"use client";

import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";
import { List, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSnapshot } from "@/lib/useSnapshot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiveList } from "@/components/hives/HiveCard";

export default function ApiaryDetailPage() {
  const { id } = useParams();
  const apiary = useSnapshot((s) => s.getApiary(String(id)));
  const hives = useSnapshot((s) => s.getHivesByApiary(String(id)));

  if (!apiary) {
    return (
      <div className="max-w-[600px] mx-auto py-20 px-4 text-center">
        <p className="text-charcoal/60 text-sm">Explotación no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto py-6 px-4 space-y-4 safe-bottom">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-charcoal">{apiary.name}</h1>
          <p className="text-sm text-charcoal/60">
            {apiary.location}{apiary.regaCode ? ` · REGA: ${apiary.regaCode}` : ""}
          </p>
        </div>
        <Link href="/hives/new">
          <Button variant="amber" size="sm">
            <List size={18} strokeWidth={2.5} /> Añadir colmena
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Colmenas ({hives.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <HiveList hives={hives} />
        </CardContent>
      </Card>

      <div className="pt-4 flex gap-2">
        <Link href="/apiaries">
          <Button variant="outline" size="sm">
            <ChevronRight size={16} strokeWidth={2} /> Volver
          </Button>
        </Link>
      </div>
    </div>
  );
}
