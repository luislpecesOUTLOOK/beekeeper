"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CircleDot,
  Crown,
  Droplets,
  Flower2,
  Hexagon,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { store, type HiveInventory, type HiveStatusMetrics, type PropolisLevel } from "@/lib/store";

interface HiveInspectionSlidersProps {
  hiveId: string;
  inventory: HiveInventory;
  initialMetrics: HiveStatusMetrics;
  onSave: (metrics: HiveStatusMetrics) => void;
}

type FieldKey = "beeFrames" | "honeyFrames" | "pollenFrames" | "broodFrames";

type InspectionMetrics = HiveStatusMetrics & {
  beeFrames: number;
  propolisLevel: PropolisLevel;
};

const PROPOLIS_OPTIONS: Array<{ value: PropolisLevel; label: string }> = [
  { value: "none", label: "Nada" },
  { value: "low", label: "Poco" },
  { value: "medium", label: "Medio" },
  { value: "high", label: "Mucho" },
];

const METRIC_CONFIG = [
  { key: "beeFrames" as const, label: "Abejas", hint: "cuadros equivalentes", icon: CircleDot },
  { key: "honeyFrames" as const, label: "Miel", hint: "cuadros", icon: Droplets },
  { key: "pollenFrames" as const, label: "Polen", hint: "cuadros", icon: Flower2 },
  { key: "broodFrames" as const, label: "Cría", hint: "cuadros", icon: Sprout },
];

function normalizeMetrics(initial: HiveStatusMetrics, totalFrames: number): InspectionMetrics {
  const clampFrames = (value: number) => Math.max(0, Math.min(totalFrames, value));
  const estimatedBeeFrames = Math.round((initial.beeCoveragePercent / 100) * totalFrames);
  return {
    ...initial,
    broodFrames: clampFrames(initial.broodFrames),
    pollenFrames: clampFrames(initial.pollenFrames),
    honeyFrames: clampFrames(initial.honeyFrames),
    beeFrames: clampFrames(initial.beeFrames ?? estimatedBeeFrames),
    propolisLevel: initial.propolisLevel ?? "none",
  };
}

export function HiveInspectionSliders({
  hiveId,
  inventory,
  initialMetrics,
  onSave,
}: HiveInspectionSlidersProps) {
  const totalFrames = inventory.totalFrames;
  const normalizedInitial = useMemo(
    () => normalizeMetrics(initialMetrics, totalFrames),
    [initialMetrics, totalFrames],
  );
  const [metrics, setMetrics] = useState<InspectionMetrics>(normalizedInitial);
  const [saved, setSaved] = useState(false);

  const changeMetric = (key: FieldKey, delta: number) => {
    setMetrics((current) => ({
      ...current,
      [key]: Math.max(0, Math.min(totalFrames, current[key] + delta)),
    }));
    setSaved(false);
  };

  const selectPropolis = (value: PropolisLevel) => {
    setMetrics((current) => ({ ...current, propolisLevel: value }));
    setSaved(false);
  };

  const toggleQueen = () => {
    setMetrics((current) => ({ ...current, queenSpotted: !current.queenSpotted }));
    setSaved(false);
  };

  const handleReset = () => {
    setMetrics(normalizedInitial);
    setSaved(false);
  };

  const handleSave = () => {
    const hive = store.getHive(hiveId);
    if (!hive) return;

    const nextMetrics: HiveStatusMetrics = {
      ...metrics,
      beeCoveragePercent:
        totalFrames > 0 ? Math.round((metrics.beeFrames / totalFrames) * 100) : 0,
    };

    store.updateHive(hiveId, { latestMetrics: nextMetrics });
    onSave(nextMetrics);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Card className="space-y-5 border-2 border-amber bg-ink p-4 text-cream shadow-[0_0_0_3px_rgba(245,168,0,0.12)] sm:p-6">
      <CardHeader className="space-y-2 pb-0">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber text-ink" aria-hidden="true">
            <Hexagon size={28} strokeWidth={3} />
          </span>
          <div>
            <CardTitle className="text-xl font-black text-cream">Inspección rápida</CardTitle>
            <p className="mt-1 text-sm font-semibold text-cream/80">
              Usa − y +. Máximo: {totalFrames} cuadros.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-0">
        <div className="grid grid-cols-1 gap-2 min-[440px]:grid-cols-2 sm:gap-3">
          {METRIC_CONFIG.map(({ key, label, hint, icon: Icon }) => (
            <section
              key={key}
              className="min-w-0 rounded-2xl border-2 border-cream/30 bg-card p-2 sm:p-3"
              aria-labelledby={`${key}-label`}
            >
              <div className="mb-2 flex min-h-12 items-center gap-2">
                <Icon className="shrink-0 text-amber" size={26} strokeWidth={2.7} aria-hidden="true" />
                <div className="min-w-0">
                  <h4 id={`${key}-label`} className="text-base font-black leading-tight text-cream">
                    {label}
                  </h4>
                  <p className="text-[11px] font-semibold leading-tight text-cream/70">{hint}</p>
                </div>
              </div>

              <div className="flex items-stretch overflow-hidden rounded-xl border-2 border-cream/50 bg-ink">
                <button
                  type="button"
                  className="grid h-16 w-14 shrink-0 place-items-center bg-cream text-ink transition-colors hover:bg-amber focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label={`Reducir cuadros de ${label.toLowerCase()}`}
                  disabled={metrics[key] <= 0}
                  onClick={() => changeMetric(key, -1)}
                >
                  <Minus size={30} strokeWidth={4} aria-hidden="true" />
                </button>
                <output
                  className="grid min-w-0 flex-1 place-items-center px-1 font-mono text-2xl font-black text-cream"
                  aria-live="polite"
                  aria-label={`${label}: ${metrics[key]} de ${totalFrames}`}
                >
                  {metrics[key]}
                </output>
                <button
                  type="button"
                  className="grid h-16 w-14 shrink-0 place-items-center bg-amber text-ink transition-colors hover:bg-cream focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cream disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label={`Aumentar cuadros de ${label.toLowerCase()}`}
                  disabled={metrics[key] >= totalFrames}
                  onClick={() => changeMetric(key, 1)}
                >
                  <Plus size={30} strokeWidth={4} aria-hidden="true" />
                </button>
              </div>
            </section>
          ))}
        </div>

        <section className="rounded-2xl border-2 border-cream/30 bg-card p-3" aria-labelledby="propolis-label">
          <div className="mb-3 flex items-center gap-2">
            <Hexagon className="text-amber" size={25} strokeWidth={2.7} aria-hidden="true" />
            <h4 id="propolis-label" className="text-base font-black text-cream">Propóleo</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PROPOLIS_OPTIONS.map((option) => {
              const selected = metrics.propolisLevel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-label={`Propóleo: ${option.label}`}
                  aria-pressed={selected}
                  onClick={() => selectPropolis(option.value)}
                  className={`min-h-14 rounded-xl border-2 px-2 text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber ${
                    selected
                      ? "border-amber bg-amber text-ink"
                      : "border-cream/50 bg-ink text-cream hover:border-amber"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          aria-pressed={metrics.queenSpotted}
          onClick={toggleQueen}
          className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber ${
            metrics.queenSpotted
              ? "border-amber bg-amber text-ink"
              : "border-cream/50 bg-card text-cream"
          }`}
        >
          <span className="flex items-center gap-3">
            <Crown size={28} strokeWidth={2.8} aria-hidden="true" />
            <span>
              <span className="block text-base font-black">Reina vista</span>
              <span className="block text-xs font-semibold opacity-80">Toca para marcar o desmarcar</span>
            </span>
          </span>
          <span className="grid h-9 min-w-16 place-items-center rounded-full border-2 border-current px-2 text-sm font-black">
            {metrics.queenSpotted ? "SÍ" : "NO"}
          </span>
        </button>

        <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
          <Button
            type="button"
            variant="outline"
            className="min-h-14 gap-2 rounded-xl border-2 border-cream/50 bg-transparent px-5 text-cream"
            onClick={handleReset}
          >
            <RotateCcw size={20} aria-hidden="true" />
            Restablecer
          </Button>
          <Button
            type="button"
            className="min-h-16 gap-3 rounded-xl text-lg font-black"
            onClick={handleSave}
          >
            {saved ? <Check size={24} strokeWidth={3} aria-hidden="true" /> : <Save size={24} strokeWidth={3} aria-hidden="true" />}
            {saved ? "Inspección guardada" : "Guardar inspección"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
