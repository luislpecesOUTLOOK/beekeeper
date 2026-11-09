// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HiveInspectionSliders } from "./HiveInspectionSliders";
import type { HiveInventory, HiveStatusMetrics } from "@/lib/store";

const inventory: HiveInventory = {
  hiveType: "Langstroth",
  deepBoxes: 1,
  honeySupers: 1,
  framesPerBox: 10,
  totalFrames: 20,
  boxMaterial: "Madera de pino",
  baseType: "Sanitaria / fondo ventilado",
  feederType: "Ninguno",
};

const metrics = {
  broodFrames: 4,
  pollenFrames: 2,
  honeyFrames: 5,
  beeFrames: 7,
  beeCoveragePercent: 35,
  propolisLevel: "low",
  queenSpotted: false,
  temperament: "Normal",
} satisfies HiveStatusMetrics;

describe("HiveInspectionSliders opción C", () => {
  it("muestra las cuatro métricas en cuadrícula sin sliders", () => {
    render(
      <HiveInspectionSliders
        hiveId="hive-1"
        inventory={inventory}
        initialMetrics={metrics}
        onSave={vi.fn()}
      />,
    );

    for (const label of ["Abejas", "Miel", "Polen", "Cría"]) {
      expect(screen.getByRole("heading", { name: label })).toBeTruthy();
    }
    expect(screen.queryByRole("slider")).toBeNull();
  });

  it("incrementa con botones explícitos y limita el valor al total de cuadros", async () => {
    const user = userEvent.setup();
    render(
      <HiveInspectionSliders
        hiveId="hive-1"
        inventory={{ ...inventory, totalFrames: 8 }}
        initialMetrics={metrics}
        onSave={vi.fn()}
      />,
    );

    const increase = screen.getByRole("button", { name: "Aumentar cuadros de abejas" });
    await user.click(increase);
    await user.click(increase);

    expect(screen.getByLabelText("Abejas: 8 de 8").textContent).toBe("8");
    expect(increase).toHaveProperty("disabled", true);
  });

  it("permite registrar el nivel de propóleo con opciones táctiles grandes", async () => {
    const user = userEvent.setup();
    render(
      <HiveInspectionSliders
        hiveId="hive-1"
        inventory={inventory}
        initialMetrics={metrics}
        onSave={vi.fn()}
      />,
    );

    const medium = screen.getByRole("button", { name: "Propóleo: Medio" });
    await user.click(medium);

    expect(medium.getAttribute("aria-pressed")).toBe("true");
  });
});
