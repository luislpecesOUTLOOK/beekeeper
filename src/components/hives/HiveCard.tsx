"use client";

import Link from "next/link";
import { ChevronRight, QrCode } from "lucide-react";
import { Hive } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";

function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-cream/10 overflow-hidden">
        <div
          className={`h-full bg-${color} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function HiveCard({ hive }: { hive: Hive }) {
  const { inventory, latestMetrics } = hive;
  const temperamentColor =
    latestMetrics.temperament === "Dócil"
      ? "amber"
      : latestMetrics.temperament === "Normal"
        ? "muted"
        : "red-500";

  return (
    <Card padded={false} className="p-5 border border-cream/10 group">
      <div className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-lg">{hive.code}</CardTitle>
          <p className="text-xs font-mono text-faint">
            {inventory.hiveType} · {inventory.deepBoxes} piso{
              inventory.deepBoxes !== 1 ? "s" : ""
            }{inventory.honeySupers > 0
              ? ` · ${inventory.honeySupers} alza${
                  inventory.honeySupers !== 1 ? "s" : ""
                }`
              : ""}
          </p>
        </div>
        <QrCode size={18} strokeWidth={2} className="text-faint group-hover:text-amber transition-colors" />
      </div>
      <CardContent className="pt-4 space-y-3">
        <StatBar
          label="Cría"
          value={latestMetrics.broodFrames}
          max={inventory.totalFrames}
          color="muted"
        />
        <StatBar
          label="Miel"
          value={latestMetrics.honeyFrames}
          max={inventory.totalFrames}
          color="amber"
        />
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-cream/10">
          <span className="text-xs font-medium text-muted">
            Población {latestMetrics.beeCoveragePercent}%
          </span>
          <span className={`text-xs font-medium text-${temperamentColor}`}>
            {latestMetrics.temperament}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Link href={`/hives/${hive.id}`}>
            <Button variant="amber" size="sm" className="flex-1 min-w-0">
              Inspeccionar <ChevronRight size={16} strokeWidth={2} />
            </Button>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <a
              href={hive.qrPayload}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-10 items-center justify-center"
            >
              <QrCode size={18} strokeWidth={2} />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function HiveList({ hives }: { hives: Hive[] }) {
  if (hives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted text-sm">No hay colmenas registradas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hives.map((hive) => (
        <HiveCard key={hive.id} hive={hive} />
      ))}
    </div>
  );
}
