"use client";

import { QrCode, Printer, X } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  qrPayload: string;
  apiaryName?: string;
}

export function QRCodeModal({
  open,
  onClose,
  code,
  qrPayload,
  apiaryName,
}: QRCodeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur sm:pb-20">
      <div className="absolute inset-0" onClick={onClose} aria-label="Cerrar" />
      <Card padded={false} className="w-full max-w-[380px] p-8 border border-cream/10 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <QrCode size={20} strokeWidth={2.5} className="text-amber" />
              <CardTitle className="text-sm">Etiqueta QR</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={18} strokeWidth={2.5} />
            </Button>
          </div>
          {apiaryName && (
            <p className="text-xs text-faint mt-1">{apiaryName}</p>
          )}
        </CardHeader>
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="p-3 bg-white rounded-lg border border-cream/20 shadow-sm">
            <QRCode value={qrPayload} size={240} />
          </div>
          <p className="text-sm font-mono font-bold text-cream text-center break-all">{code}</p>
          <p className="text-xs text-faint text-center px-4">
            Imprime a alta resolución, plastifica y fija en la madera del colmenar.
          </p>
          <div className="flex gap-2 pt-4 w-full">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="flex-1">
              <Printer size={18} strokeWidth={2.5} /> Imprimir
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
