"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { store } from "@/lib/store";

const ApiaryFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio").max(100),
  location: z.string().min(2, "La ubicación es obligatoria").max(200),
  regaCode: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});

type ApiaryFormValues = z.infer<typeof ApiaryFormSchema>;

export default function ApiaryForm() {
  const form = useForm<ApiaryFormValues>({
    resolver: zodResolver(ApiaryFormSchema),
    defaultValues: {
      name: "",
      location: "",
      regaCode: "",
      notes: "",
    },
  });

  const onSubmit = (values: ApiaryFormValues) => {
    store.createApiary({
      name: values.name,
      location: values.location,
      regaCode: values.regaCode || undefined,
      notes: values.notes || undefined,
    });
    form.reset();
  };

  return (
    <div className="max-w-[520px] mx-auto py-6 px-4 space-y-4 safe-bottom">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-charcoal">Nueva explotación</h1>
        <p className="text-sm text-charcoal/60">
          Registra un colmenar y comienza a añadirle colmenas.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Datos del colmenar</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} strokeWidth={2} className="text-teal-primary" />
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                  Nombre del colmenar
                </label>
              </div>
              <input
                {...form.register("name")}
                placeholder="Ej. Valle del Henares"
                className="w-full pl-3 py-3 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/50"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText size={18} strokeWidth={2} className="text-teal-primary" />
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                  Ubicación / coordenadas
                </label>
              </div>
              <input
                {...form.register("location")}
                placeholder="Ej. Torrejón de Ardoz, Madrid"
                className="w-full pl-3 py-3 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/50"
              />
              {form.formState.errors.location && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                Código REGA (opcional)
              </label>
              <input
                {...form.register("regaCode")}
                placeholder="Ej. REGA-28-00145"
                className="w-full pl-3 py-3 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                Notas
              </label>
              <textarea
                {...form.register("notes")}
                rows={3}
                placeholder="Zona de encina y romero, buena exposición sur…"
                className="w-full pl-3 py-3 rounded-lg border border-charcoal/20 bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="pt-2 flex items-center justify-between gap-2">
          <Button type="submit" variant="default" className="w-full lg:w-auto">
            Guardar explotación
          </Button>
          <Link href="/apiaries">
            <Button variant="ghost">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
