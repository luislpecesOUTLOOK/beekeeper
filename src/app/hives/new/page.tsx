"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnapshot } from "@/lib/useSnapshot";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

const HiveFormSchema = z.object({
  apiaryId: z.string().min(1, "Selecciona un colmenar"),
  code: z.string().min(2, "El código es obligatorio").max(20),
  hiveType: z.enum(["Langstroth", "Perfección", "Dadant", "Industrial"]),
  deepBoxes: z.coerce.number().min(1).max(3),
  honeySupers: z.coerce.number().min(0).max(5),
  framesPerBox: z.coerce.number().min(1).max(20),
  boxMaterial: z.enum([
    "Madera de pino",
    "Madera de cedro",
    "Poliestireno de alta densidad",
    "Plástico",
    "Otro",
  ]),
  baseType: z.enum(["Sanitaria / fondo ventilado", "Fondo ciego tradicional"]),
  feederType: z.enum(["De techo", "De cuadro", "Piquera", "Ninguno"]),
});

type HiveFormValues = z.infer<typeof HiveFormSchema>;

const field = (className?: string): string =>
  `w-full rounded-xl bg-card px-4 py-3 text-cream placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${className ?? ""}`;

export default function NewHivePage() {
  const router = useRouter();
  const apiaries = useSnapshot(() => store.getApiaries());

  const form = useForm<HiveFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(HiveFormSchema) as any,
    defaultValues: {
      apiaryId: apiaries[0]?.id ?? "",
      code: `LC-${String(store.getHives().length + 1).padStart(3, "0")}`,
      hiveType: "Langstroth",
      deepBoxes: 1,
      honeySupers: 1,
      framesPerBox: 10,
      boxMaterial: "Madera de pino",
      baseType: "Sanitaria / fondo ventilado",
      feederType: "Ninguno",
    },
  });

  const onSubmit = (values: HiveFormValues) => {
    const inv = {
      hiveType: values.hiveType,
      deepBoxes: values.deepBoxes,
      honeySupers: values.honeySupers,
      framesPerBox: values.framesPerBox,
      totalFrames: (values.deepBoxes + values.honeySupers) * values.framesPerBox,
      boxMaterial: values.boxMaterial,
      baseType: values.baseType,
      feederType: values.feederType,
    };
    store.createHive({
      apiaryId: values.apiaryId,
      code: values.code,
      inventory: inv,
    });
    router.push("/colmenares");
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando…</div>}>
      <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream/10 bg-ink/85 backdrop-blur px-[5%] py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <Link href="/colmenares" className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-cream">LaCajaAmbar</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-[5%] py-10 sm:py-16 max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.16em] text-amber">Nueva colmena</p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
              Catalogar colmena
            </h1>
            <p className="mt-2 text-muted leading-relaxed">
              Asigna un código único, define su inventario y genera su etiqueta QR.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-5">
            <Card padded={false} className="p-6 border border-cream/10">
              <CardHeader>
                <CardTitle>Identificación</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-cream uppercase tracking-wider">Colmenar</label>
                  <select
                    {...form.register("apiaryId")}
                    className={field()}
                  >
                    {apiaries.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-cream uppercase tracking-wider">Código</label>
                  <input
                    {...form.register("code")}
                    placeholder="Ej. LC-001"
                    className={`${field()} font-mono`}
                  />
                  {form.formState.errors.code && (
                    <p className="text-xs text-amber">{form.formState.errors.code.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card padded={false} className="p-6 border border-cream/10">
              <CardHeader>
                <CardTitle>Inventario de material</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-cream uppercase tracking-wider">Tipo de colmena</label>
                  <select
                    {...form.register("hiveType")}
                    onChange={(e) => {
                      const type = e.target.value as "Langstroth" | "Perfección" | "Dadant" | "Industrial";
                      const frames = type === "Industrial" ? 8 : 10;
                      form.setValue("hiveType", type);
                      form.setValue("framesPerBox", frames);
                      form.setValue("honeySupers", type === "Industrial" ? 0 : 1);
                    }}
                    className={field()}
                  >
                    <option value="Langstroth">Langstroth (o Perfección) — 10 cuadros</option>
                    <option value="Perfección">Perfección — 10 cuadros</option>
                    <option value="Dadant">Dadant (o Industrial) — 10 cuadros</option>
                    <option value="Industrial">Industrial — 8 cuadros</option>
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Pisos / cámaras</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const v = Math.max(1, Number(form.getValues("deepBoxes")) - 1);
                        form.setValue("deepBoxes", v);
                      }}>−</Button>
                      <span className="w-8 text-center text-sm font-mono text-cream">{form.getValues("deepBoxes")}</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        const v = Math.min(3, Number(form.getValues("deepBoxes")) + 1);
                        form.setValue("deepBoxes", v);
                      }}>+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Alzas</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const v = Math.max(0, Number(form.getValues("honeySupers")) - 1);
                        form.setValue("honeySupers", v);
                      }}>−</Button>
                      <span className="w-8 text-center text-sm font-mono text-cream">{form.getValues("honeySupers")}</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        const v = Math.min(5, Number(form.getValues("honeySupers")) + 1);
                        form.setValue("honeySupers", v);
                      }}>+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Cuadros / alza</label>
                    <input
                      {...form.register("framesPerBox")}
                      type="number"
                      className={`${field()} font-mono`}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Material de caja</label>
                    <select {...form.register("boxMaterial")} className={field()}>
                      {["Madera de pino", "Madera de cedro", "Poliestireno de alta densidad", "Plástico", "Otro"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Tipo de fondo</label>
                    <select {...form.register("baseType")} className={field()}>
                      {["Sanitaria / fondo ventilado", "Fondo ciego tradicional"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-cream uppercase tracking-wider">Alimentador</label>
                    <select {...form.register("feederType")} className={field()}>
                      {["De techo", "De cuadro", "Piquera", "Ninguno"].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cream/10">
                  <span className="text-xs font-medium text-muted">Total de cuadros estimado</span>
                  <span className="text-sm font-mono font-bold text-amber">
                    {(Number(form.getValues("deepBoxes")) + Number(form.getValues("honeySupers"))) * Number(form.getValues("framesPerBox"))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="pt-2 flex items-center justify-between gap-2">
              <Button variant="outline" size="default" asChild>
                <Link href="/colmenares">Cancelar</Link>
              </Button>
              <Button variant="amber" size="default" type="submit">Guardar colmena</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
    </Suspense>
  );
}
