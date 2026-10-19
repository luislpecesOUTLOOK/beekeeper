"use client";

import Link from "next/link";
import { useSnapshot } from "@/lib/useSnapshot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiaryList } from "@/components/apiaries/ApiaryCard";

export default function ApiariesPage() {
  const apiaries = useSnapshot((s) => s.getApiaries());

  return (
    <div className="max-w-[600px] mx-auto py-6 px-4 space-y-4 safe-bottom">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-charcoal">Explotaciones</h1>
        <p className="text-sm text-charcoal/60">
          Listado de colmenares. Toca uno para ver sus colmenas.
        </p>
      </div>

      <Card>
        <ApiaryList apiaries={apiaries} />
      </Card>

      <div className="pt-4">
        <Link href="/apiaries/new">
          <Button variant="amber" size="lg" className="w-full">
            Nueva explotación
          </Button>
        </Link>
      </div>
    </div>
  );
}
