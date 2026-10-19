"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, QrCode, ClipboardList, Thermometer } from "lucide-react";
import { useSnapshot } from "@/lib/useSnapshot";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HiveInspectionSliders } from "@/components/hives/HiveInspectionSliders";
import { MaintenanceLogList } from "@/components/hives/MaintenanceLogList";
import { QRCodeModal } from "@/components/hives/QRCodeModal";

export default function HiveDetailPage() {
  const { id } = useParams();
  const hive = useSnapshot((s) => s.getHive(String(id)));
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState<"inspeccion" | "trabajos">("inspeccion");

  if (!hive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-[5%] py-20">
        <Card padded className="p-8 border border-cream/10 text-center">
          <h2 className="text-2xl font-extrabold text-cream">Colmena no encontrada</h2>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/colmenares">Volver a colmenares</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const tabs = [
    { key: "inspeccion", label: "Inspección", icon: Thermometer },
    { key: "trabajos", label: "Trabajos", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/colmenares">
                <ChevronLeft size={16} strokeWidth={2} className="text-cream" />
                Volver
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowQR(true)}>
              <QrCode size={16} strokeWidth={2} className="text-cream" />
              Etiqueta QR
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-8 sm:py-12 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
              {hive.code}
            </h1>
            <p className="mt-1 text-muted leading-relaxed">
              {hive.inventory.hiveType} · {hive.inventory.deepBoxes} piso{
                hive.inventory.deepBoxes !== 1 ? "s" : ""
              }
              {hive.inventory.honeySupers > 0 ? ` · ${hive.inventory.honeySupers} alzas` : ""}
            </p>
            <p className="text-xs font-mono text-faint mt-2">{hive.qrPayload}</p>
          </div>
        </div>

        <Card padded className="p-6 border border-cream/10 mb-6">
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "amber" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key as "inspeccion" | "trabajos")}
                className="text-xs text-cream"
              >
                <tab.icon size={16} strokeWidth={2} /> {tab.label}
              </Button>
            ))}
          </div>
        </Card>

        {activeTab === "inspeccion" && (
          <HiveInspectionSliders
            hiveId={hive.id}
            inventory={hive.inventory}
            initialMetrics={hive.latestMetrics}
            onSave={() => {}}
          />
        )}

        {activeTab === "trabajos" && (
          <MaintenanceLogList hiveId={hive.id} />
        )}

        {showQR && (
          <QRCodeModal
            open
            onClose={() => setShowQR(false)}
            code={hive.code}
            qrPayload={hive.qrPayload}
            apiaryName={store.getApiary(hive.apiaryId)?.name}
          />
        )}
      </main>
    </div>
  );
}
