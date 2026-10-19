"use client";

import { useState } from "react";
import { Sliders, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { store, DEFAULT_METRICS, type HiveStatusMetrics, type HiveInventory } from "@/lib/store";

interface SliderControlProps {
  label: string;
  value: number;
  max: number;
  step: number;
  unit: string;
  color: "muted" | "amber";
  accentText?: string;
  onChange: (value: number) => void;
}

function SliderControl({
  label,
  value,
  max,
  step,
  unit,
  color,
  accentText,
  onChange,
}: SliderControlProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-cream">{label}</span>
          {accentText && (
            <span className={`text-xs font-mono font-bold text-${color}`}>
              {accentText}
            </span>
          )}
        </div>
        <span className="text-sm font-mono font-bold text-cream">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-10">
        <div className="h-2 w-full rounded-full bg-cream/10" />
        <div
          className={`h-2 rounded-full transition-all duration-200 bg-${color}`}
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full z-10 opacity-0 cursor-pointer accent-amber"
        />
      </div>
    </div>
  );
}

interface HiveInspectionSlidersProps {
  hiveId: string;
  inventory: HiveInventory;
  initialMetrics: HiveStatusMetrics;
  onSave: (metrics: HiveStatusMetrics) => void;
}

export function HiveInspectionSliders({
  hiveId,
  inventory,
  initialMetrics,
  onSave,
}: HiveInspectionSlidersProps) {
  const [metrics, setMetrics] = useState<HiveStatusMetrics>(initialMetrics);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const hive = store.getHive(hiveId);
    if (!hive) return;
    store.updateHive(hiveId, { latestMetrics: metrics });
    onSave(metrics);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card padded={false} className="p-6 border border-cream/10 space-y-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sliders size={20} strokeWidth={2.5} className="text-amber" />
          <CardTitle className="text-base">Inspección de campo</CardTitle>
        </div>
        <p className="text-xs text-muted mt-1">
          Diseñado para usar con guantes. Toca las barras o los botones ±.
        </p>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        <SliderControl
          label="Cuadros de cría"
          value={metrics.broodFrames}
          max={inventory.totalFrames}
          step={1}
          unit=""
          color="muted"
          accentText="abierta y operculada"
          onChange={(v) => setMetrics((m) => ({ ...m, broodFrames: v }))}
        />
        <SliderControl
          label="Cuadros de polen"
          value={metrics.pollenFrames}
          max={inventory.totalFrames}
          step={1}
          unit=""
          color="amber"
          accentText="pan de abeja"
          onChange={(v) => setMetrics((m) => ({ ...m, pollenFrames: v }))}
        />
        <SliderControl
          label="Cuadros de miel"
          value={metrics.honeyFrames}
          max={inventory.totalFrames}
          step={1}
          unit=""
          color="amber"
          accentText="almacenada"
          onChange={(v) => setMetrics((m) => ({ ...m, honeyFrames: v }))}
        />
        <SliderControl
          label="Población / cobertura"
          value={metrics.beeCoveragePercent}
          max={100}
          step={5}
          unit="%"
          color="muted"
          accentText="ocupación del cajón"
          onChange={(v) =>
            setMetrics((m) => ({ ...m, beeCoveragePercent: v }))
          }
        />

        <div className="space-y-3 pt-2 border-t border-cream/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} strokeWidth={2.5} className="text-faint" />
              <div>
                <span className="text-sm font-medium text-cream">¿Reina vista?</span>
                <p className="text-xs text-muted">
                  Marca si localizaste a la reina en la inspección.
                </p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={metrics.queenSpotted}
              onClick={() =>
                setMetrics((m) => ({ ...m, queenSpotted: !m.queenSpotted }))
              }
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                metrics.queenSpotted
                  ? "bg-amber border-amber"
                  : "bg-cream/10 border-cream/40"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-ink shadow ring-0 transition-transform ${
                  metrics.queenSpotted ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${metrics.queenSpotted ? "text-amber" : "text-muted"}`}>
              {metrics.queenSpotted ? "Sí" : "No"}
            </span>
            <span className="text-xs font-mono text-faint">{metrics.temperament}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setMetrics({ ...DEFAULT_METRICS })}
            disabled={saved}
            className="flex-1"
          >
            Restablecer
          </Button>
          <Button
            variant="amber"
            size="lg"
            onClick={handleSave}
            disabled={saved}
            className="flex-1"
          >
            {saved ? (
              <>
                <Check size={18} strokeWidth={2.5} /> Guardado
              </>
            ) : (
              "Guardar inspección"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
