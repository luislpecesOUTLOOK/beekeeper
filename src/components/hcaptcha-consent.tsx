"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";

/**
 * hCaptcha v3 GDPR consent widget
 * 
 * This component:
 * 1. Requests user consent for hCaptcha data processing
 * 2. Shows GDPR-relevant information about data transfers
 * 3. Stores consent locally for future sessions
 * 4. Integrates with the auth flow - login requires consent
 */
export function HcaptchaConsentWidget() {
  const { captchaConsentGiven, setCaptchaConsentGiven } = useAuth();
  const [showWidget, setShowWidget] = useState(true);

  useEffect(() => {
    // Auto-hide after consent is given
    if (captchaConsentGiven) {
      setShowWidget(false);
    }
  }, [captchaConsentGiven]);

  if (!showWidget) {
    return null;
  }

  const handleConsentToggle = (given: boolean) => {
    // Store GDPR consent preference
    localStorage.setItem("beekeeper:hcaptcha_consent", given ? "true" : "false");
    setCaptchaConsentGiven(given);
  };

  if (!captchaConsentGiven) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#121212]">
        <div className="bg-[#1f1f1f] rounded-xl p-8 max-w-md w-full border border-cream/10 text-center">
          <h2 className="text-2xl font-bold text-cream mb-4">Protección contra bots</h2>
          
          <p className="text-muted mb-6">
            LaCajaAmbar utiliza hCaptcha v3 para distinguir humanos de bots y proteger tus colmenas de accesos no autorizados.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded bg-amber/5 text-sm">
              <strong>Datos procesados:</strong> IP, atributos del navegador, movimientos del mouse (estadísticas agregadas)
            </div>
            <div className="p-3 rounded bg-amber/5 text-sm">
              <strong>Ubicación procesamiento:</strong> Servidores regionales UE y EE. UU.
            </div>
          </div>
          
          <p className="text-xs text-faint mb-6">
            Al hacer clic en "Aceptar", consiente el procesamiento de datos descrito arriba para protección contra bots.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleConsentToggle(true)}
              className="w-full px-6 py-3 bg-amber text-ink rounded font-medium hover:bg-amber/90"
            >
              Aceptar y continuar
            </button>
            <button
              onClick={() => handleConsentToggle(false)}
              className="w-full px-6 py-3 bg-card text-faint rounded font-medium hover:bg-card/80"
            >
              Rechazar (funcionalidad limitada)
            </button>
          </div>
          
          <details className="mt-6">
            <summary className="text-xs text-faint cursor-pointer">
              Ver información completa de privacidad
            </summary>
            <div className="mt-2 text-sm text-faint max-w-xs mx-auto">
              <p>
                hCaptcha actúa como procesador de datos bajo las instrucciones de LaCajaAmbar.
                Los datos recopilados incluyen: dirección IP, datos del agente de usuario,
                coordenadas del mouse, posición de desplazamiento y eventos de tecla.
                Estos datos se procesan para tomar decisiones de riesgo y se conservan
                durante un período limitado (generalmente 30 días para estadísticas).
                hCaptcha está inscrito en los marcos de privacidad UE-EE. UU. y ofrece
                DPAs y SCCs para transferencias internacionales de datos.
              </p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  // User has given consent, show the invisible hCaptcha integration
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#121212]">
      <div className="bg-[#1f1f1f] rounded-xl p-8 max-w-md w-full border border-cream/10 text-center">
        <h2 className="text-2xl font-bold text-cream mb-4">Protección contra bots</h2>
        
        <p className="text-muted mb-6">
          Hemos registrado tu consentimiento para la protección contra bots. Los desafíos
          hCaptcha se ejecutarán invisible cuando inicies sesión.
        </p>
        
        {/* Invisible hCaptcha badge/indicator */}
        <div className="mt-4 flex items-center justify-center">
          <span className="text-sm text-amber">
            ✓ hCaptcha v3 activo (modo invisible)
          </span>
        </div>
        
        <p className="text-xs text-faint mt-4">
          Puedes retirar tu consentimiento en cualquier momento desde la configuración.
        </p>
      </div>
    </div>
  );
}