"use client";

import { useState } from "react";
import { Plus, Clock, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { store } from "@/lib/store";
import { useNowStamp } from "@/lib/useSnapshot";

const LogFormSchema = z.object({
  date: z.string().min(1, "La fecha es obligatoria"),
  waxReplacedDate: z.string().optional(),
  waxFramesReplacedCount: z.coerce.number().min(0).optional(),
  feedingApplied: z.string().optional(),
  treatmentApplied: z.string().optional(),
  observations: z.string().optional(),
});

type LogFormValues = z.infer<typeof LogFormSchema>;

const field = (className?: string): string =>
  `w-full rounded-xl bg-card px-4 py-3 text-cream placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${className ?? ""}`;

export function MaintenanceLogList({ hiveId }: { hiveId: string }) {
  const [open, setOpen] = useState(false);
  const hive = store.getHive(hiveId);

  const waxAgeDays = useNowStamp((now) => {
    if (hive?.lastWaxChangeDate === undefined) return -1;
    return Math.floor(
      (now - new Date(hive.lastWaxChangeDate).getTime()) / (1000 * 60 * 60 * 24),
    );
  });

  const waxWarning =
    waxAgeDays !== -1 && waxAgeDays > 180
      ? `Han pasado ${waxAgeDays} días desde el último cambio de cera.`
      : null;

  const logs = store.getLogsForHive(hiveId);

  const form = useForm<LogFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(LogFormSchema) as any,
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      waxReplacedDate: undefined,
      waxFramesReplacedCount: undefined,
      feedingApplied: "",
      treatmentApplied: "",
      observations: "",
    },
  });

  const onSubmit = (values: LogFormValues) => {
    store.createLog({
      hiveId,
      date: values.date,
      waxReplacedDate: values.waxReplacedDate || undefined,
      waxFramesReplacedCount: values.waxFramesReplacedCount || undefined,
      feedingApplied: values.feedingApplied || undefined,
      treatmentApplied: values.treatmentApplied || undefined,
      observations: values.observations || undefined,
    });
    form.reset({
      date: new Date().toISOString().slice(0, 10),
      waxReplacedDate: undefined,
      waxFramesReplacedCount: undefined,
      feedingApplied: "",
      treatmentApplied: "",
      observations: "",
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle className="text-base">Trabajos y mantenimiento</CardTitle>
          <p className="text-xs text-muted">Historial de intervenciones de esta colmena.</p>
        </CardHeader>
        <Button variant="amber" size="sm" onClick={() => setOpen(true)}>
          <Plus size={18} strokeWidth={2.5} /> Nuevo registro
        </Button>
      </div>

      {waxWarning && (
        <div className="rounded-xl border border-amber/20 bg-amber/10 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} strokeWidth={2.5} className="text-amber mt-0.5" />
            <p className="text-sm text-amber leading-snug">{waxWarning}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock size={32} strokeWidth={2} className="text-faint mb-2" />
            <p className="text-muted text-sm">No hay registros de mantenimiento aún.</p>
          </div>
        ) : (
          logs.map((log) => (
            <Card key={log.id} padded={false} className="p-5 border border-cream/10">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <p className="text-sm font-medium text-cream">
                    {new Date(log.date).toLocaleDateString("es-ES")}
                  </p>
                  {log.waxReplacedDate && (
                    <p className="text-xs font-mono text-amber mt-0.5">
                      Cambio de cera:{" "}
                      {new Date(log.waxReplacedDate).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono text-faint">
                  #{log.id.slice(-4)}
                </span>
              </div>
              <div className="grid gap-2 text-sm text-muted">
                {log.waxFramesReplacedCount != null && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-cream">Ceras nuevas:</span>
                    <span>{log.waxFramesReplacedCount} cuadros</span>
                  </div>
                )}
                {log.feedingApplied && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-cream">Alimentación:</span>
                    <span>{log.feedingApplied}</span>
                  </div>
                )}
                {log.treatmentApplied && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-cream">Tratamiento:</span>
                    <span>{log.treatmentApplied}</span>
                  </div>
                )}
                {log.observations && (
                  <div className="break-all">
                    <span className="font-medium text-cream">Observaciones:</span>{" "}
                    <span className="ml-1">{log.observations}</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur">
          <div className="absolute inset-0" onClick={() => setOpen(false)} aria-label="Cerrar" />
          <Card padded={false} className="w-full max-w-[420px] p-8 border border-cream/10">
            <CardHeader>
              <CardTitle className="text-base">Nuevo registro de intervención</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Fecha</label>
                    <input {...form.register("date")} type="date" className={field()} />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Fecha de cambio de cera</label>
                    <input {...form.register("waxReplacedDate")} type="date" className={field()} />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Cuadros de cera introducidos</label>
                    <input {...form.register("waxFramesReplacedCount")} type="number" min="0" className={field("font-mono")} />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Alimentación aplicada</label>
                    <input {...form.register("feedingApplied")} placeholder="Ej. Jarabe 1:1, pasta proteica…" className={field()} />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Tratamiento sanitario</label>
                    <input {...form.register("treatmentApplied")} placeholder="Ej. Control de varroa…" className={field()} />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Observaciones</label>
                    <textarea {...form.register("observations")} rows={3} placeholder="Notas breves de la inspección…" className={field()} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => setOpen(false)} type="button">Cancelar</Button>
                  <Button variant="amber" size="sm" type="submit">Guardar registro</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
