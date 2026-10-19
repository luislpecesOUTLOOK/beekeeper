"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { store, DEFAULT_INVENTORY } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

const ColmenarFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio").max(100),
  location: z.string().min(2, "La ubicación es obligatoria").max(200),
  regaCode: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
  hiveCount: z.coerce.number().min(1).max(50),
  hiveType: z.enum(["Langstroth", "Perfección", "Dadant", "Industrial"]),
});

type ColmenarFormValues = z.infer<typeof ColmenarFormSchema>;

const field = (className?: string): string =>
  `w-full rounded-xl bg-card px-4 py-3 text-cream placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${className ?? ""}`;

export default function NewColmenarPage() {
  const form = useForm<ColmenarFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ColmenarFormSchema) as any,
    defaultValues: {
      name: "",
      location: "",
      regaCode: "",
      notes: "",
      hiveCount: 1,
      hiveType: "Langstroth",
    },
  });

  const [step, setStep] = useState<"form" | "qr" | "done">("form");
  const [createdApiary, setCreatedApiary] = useState<{
    id: string;
    name: string;
    qrPayload: string;
    hiveCount: number;
  } | null>(null);

  const onSubmit = (values: ColmenarFormValues) => {
    const apiary = store.createApiary({
      name: values.name,
      location: values.location,
      regaCode: values.regaCode || undefined,
      notes: values.notes || undefined,
    });

    for (let i = 0; i < values.hiveCount; i++) {
      const inv = DEFAULT_INVENTORY(values.hiveType);
      store.createHive({
        apiaryId: apiary.id,
        inventory: inv,
      });
    }

    setCreatedApiary({
      id: apiary.id,
      name: apiary.name,
      qrPayload: `https://beekeeper.lacajaambar.es/colmenar/${apiary.id}`,
      hiveCount: values.hiveCount,
    });
    setStep("qr");
    form.reset();
  };

  if (step === "qr" && createdApiary) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
          <div className="mx-auto max-w-6xl flex items-center gap-3">
            <Link href="/colmenares" className="flex items-center gap-3">
              <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-[5%] py-10 sm:py-16 max-w-md mx-auto">
          <Card padded className="p-8 sm:p-12 border border-cream/10">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="p-3 bg-amber/10 rounded-2xl border border-amber/20">
                <QrCode size={32} strokeWidth={2.5} className="text-amber" />
              </div>
              <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">
                Colmenar creado
              </p>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
                {createdApiary.name}
              </h2>
              <p className="mt-2 text-muted leading-relaxed text-center">
                {createdApiary.hiveCount} colmena{
                  createdApiary.hiveCount !== 1 ? "s" : ""
                } creada{createdApiary.hiveCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-card/40 rounded-xl border border-cream/10">
                <p className="font-mono text-xs uppercase tracking-wider text-faint mb-2">
                  Código QR del colmenar
                </p>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-2 bg-white rounded-md border border-cream/20">
                    <QRCode value={createdApiary.qrPayload} size={200} />
                  </div>
                  <p className="text-sm font-mono text-cream break-all text-center">
                    {createdApiary.qrPayload}
                  </p>
                  <p className="text-xs text-faint text-center">
                    Imprime este código y fíjalo al colmenar.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => window.print()}
                  className="flex-1"
                >
                  Imprimir etiqueta
                </Button>
                <Button variant="amber" size="default" asChild className="flex-1">
                  <Link href={`/colmenares/${createdApiary.id}`}>
                    Ir al colmenar
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <Link href="/colmenares" className="flex items-center gap-3">
            <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-10 sm:py-16 max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">
              Nuevo colmenar
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
              Crear colmenar
            </h1>
            <p className="mt-2 text-muted leading-relaxed">
              Registra un nuevo colmenar con sus colmenas. Cada colmena
              recibirá su propio código QR para identificación en campo.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-5">
            <Card padded className="p-6 border border-cream/10">
              <CardHeader>
                <CardTitle>Datos del colmenar</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid gap-1.5">
                  <label htmlFor="cm-name" className="text-sm font-medium text-cream">
                    Nombre del colmenar
                  </label>
                  <input
                    {...form.register("name")}
                    id="cm-name"
                    placeholder="Ej. Valle del Henares"
                    className={field()}
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-amber">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cm-location" className="text-sm font-medium text-cream">
                    Ubicación / coordenadas
                  </label>
                  <input
                    {...form.register("location")}
                    id="cm-location"
                    placeholder="Ej. Torrejón de Ardoz, Madrid"
                    className={field()}
                  />
                  {form.formState.errors.location && (
                    <p className="text-xs text-amber">{form.formState.errors.location.message}</p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cm-rega" className="text-sm font-medium text-cream">
                    Código REGA (opcional)
                  </label>
                  <input
                    {...form.register("regaCode")}
                    id="cm-rega"
                    placeholder="Ej. REGA-28-00145"
                    className={field("font-mono")}
                  />
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cm-notes" className="text-sm font-medium text-cream">
                    Notas
                  </label>
                  <textarea
                    {...form.register("notes")}
                    id="cm-notes"
                    rows={3}
                    placeholder="Zona de encina y romero…"
                    className={field("font-mono")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card padded className="p-6 border border-cream/10">
              <CardHeader>
                <CardTitle>Colmenas iniciales</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid gap-1.5">
                  <label htmlFor="cm-count" className="text-sm font-medium text-cream">
                    Número de colmenas (1 a N)
                  </label>
                  <input
                    {...form.register("hiveCount")}
                    id="cm-count"
                    type="number"
                    min="1"
                    max="50"
                    className={field("font-mono")}
                  />
                  {form.formState.errors.hiveCount && (
                    <p className="text-xs text-amber">
                      {form.formState.errors.hiveCount.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="cm-type" className="text-sm font-medium text-cream">
                    Tipo de colmena
                  </label>
                  <Select {...form.register("hiveType")} id="cm-type">
                    <option value="Langstroth">Langstroth (o Perfección) — 10 cuadros</option>
                    <option value="Perfección">Perfección — 10 cuadros</option>
                    <option value="Dadant">Dadant (o Industrial) — 10 cuadros</option>
                    <option value="Industrial">Industrial — 8 cuadros</option>
                  </Select>
                  <p className="mt-1 text-xs text-faint">
                    Cada colmena se crea con su inventario base según el tipo
                    seleccionado.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="pt-2 flex items-center justify-between gap-2">
              <Button variant="outline" size="default" asChild>
                <Link href="/colmenares">Cancelar</Link>
              </Button>
              <Button variant="amber" size="default" type="submit">
                Crear colmenar
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
