export type HiveType = "Langstroth" | "Perfección" | "Dadant" | "Industrial";

export type BoxMaterial =
  | "Madera de pino"
  | "Madera de cedro"
  | "Poliestireno de alta densidad"
  | "Plástico"
  | "Otro";

export type BaseType =
  | "Sanitaria / fondo ventilado"
  | "Fondo ciego tradicional";

export type FeederType = "De techo" | "De cuadro" | "Piquera" | "Ninguno";

export type Temperament = "Dócil" | "Normal" | "Defensiva";

export interface Apiary {
  id: string;
  name: string;
  location: string;
  regaCode?: string;
  notes?: string;
  hiveCount: number;
  createdAt: string;
}

export interface HiveInventory {
  hiveType: HiveType;
  deepBoxes: number;
  honeySupers: number;
  framesPerBox: number;
  totalFrames: number;
  boxMaterial: BoxMaterial;
  baseType: BaseType;
  feederType: FeederType;
}

export type PropolisLevel = "none" | "low" | "medium" | "high";

export interface HiveStatusMetrics {
  broodFrames: number;
  pollenFrames: number;
  honeyFrames: number;
  beeCoveragePercent: number;
  beeFrames?: number;
  propolisLevel?: PropolisLevel;
  queenSpotted: boolean;
  temperament: Temperament;
}

export interface MaintenanceLog {
  id: string;
  hiveId: string;
  date: string;
  waxReplacedDate?: string;
  waxFramesReplacedCount?: number;
  feedingApplied?: string;
  treatmentApplied?: string;
  observations?: string;
}

export interface Hive {
  id: string;
  code: string;
  apiaryId: string;
  qrPayload: string;
  inventory: HiveInventory;
  latestMetrics: HiveStatusMetrics;
  lastWaxChangeDate?: string;
  workLogs: MaintenanceLog[];
  createdAt: string;
}

export interface SeedData {
  apiaries: Apiary[];
  hives: Hive[];
}

export const FRAMES_PER_TYPE: Record<HiveType, number> = {
  Langstroth: 10,
  "Perfección": 10,
  Dadant: 10,
  Industrial: 8,
};

export const DEFAULT_INVENTORY: (hiveType: HiveType) => HiveInventory = (
  hiveType,
) => ({
  hiveType,
  deepBoxes: 1,
  honeySupers: hiveType === "Industrial" ? 0 : 1,
  framesPerBox: FRAMES_PER_TYPE[hiveType],
  totalFrames: FRAMES_PER_TYPE[hiveType],
  boxMaterial: "Madera de pino",
  baseType: "Sanitaria / fondo ventilado",
  feederType: "Ninguno",
});

export const DEFAULT_METRICS: HiveStatusMetrics = {
  broodFrames: 0,
  pollenFrames: 0,
  honeyFrames: 0,
  beeCoveragePercent: 0,
  beeFrames: 0,
  propolisLevel: "none",
  queenSpotted: false,
  temperament: "Normal",
};

// GDPR consent storage key
const GDPR_CONSENT_KEY = "beekeeper:hcaptcha_consent";

const hasGDPRConsent = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(GDPR_CONSENT_KEY);
    return raw === "true";
  } catch {
    return false;
  }
};

const setGDPRConsent = (value: boolean) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GDPR_CONSENT_KEY, value ? "true" : "false");
  } catch {
    // Ignore storage errors in private/incognito modes
  }
};

// Storage keys
export const STORAGE_KEYS = {
  APIARIES: "beekeeper:apiaries",
  HIVES: "beekeeper:hives",
  LOGS: "beekeeper:logs",
} as const;

export const SEED_DATA: SeedData = {
  apiaries: [
    {
      id: "apiary-1",
      name: "Valle del Henares",
      location: "Torrejón de Ardoz, Madrid",
      regaCode: "REGA-28-00145",
      notes: "Zona de encina y romero, buena exposición sur.",
      hiveCount: 3,
      createdAt: "2024-03-10T09:00:00Z",
    },
    {
      id: "apiary-2",
      name: "Sierra de Guadarrama",
      location: "Cercedilla, Madrid",
      regaCode: "REGA-28-00210",
      notes: "Altura 1.200 m, florecimiento de castaño y brezo.",
      hiveCount: 2,
      createdAt: "2024-04-02T10:30:00Z",
    },
  ],
  hives: [
    {
      id: "hive-1",
      code: "LC-LANG-001",
      apiaryId: "apiary-1",
      qrPayload: "https://beekeeper.lacajaambar.es/hive/LC-LANG-001",
      inventory: {
        hiveType: "Langstroth",
        deepBoxes: 2,
        honeySupers: 2,
        framesPerBox: 10,
        totalFrames: 40,
        boxMaterial: "Madera de pino",
        baseType: "Sanitaria / fondo ventilado",
        feederType: "De techo",
      },
      latestMetrics: {
        broodFrames: 12,
        pollenFrames: 4,
        honeyFrames: 8,
        beeCoveragePercent: 78,
        queenSpotted: true,
        temperament: "Dócil",
      },
      lastWaxChangeDate: "2024-05-20",
      workLogs: [
        {
          id: "log-1",
          hiveId: "hive-1",
          date: "2024-05-20",
          waxReplacedDate: "2024-05-20",
          waxFramesReplacedCount: 5,
          feedingApplied: "Jarabe 1:1",
          treatmentApplied: "Ácido oxálico",
          observations: "Colmena fuerte, reina marcada vista.",
        },
      ],
      createdAt: "2024-03-15T08:00:00Z",
    },
    {
      id: "hive-2",
      code: "LC-LANG-002",
      apiaryId: "apiary-1",
      qrPayload: "https://beekeeper.lacajaambar.es/hive/LC-LANG-002",
      inventory: {
        hiveType: "Langstroth",
        deepBoxes: 1,
        honeySupers: 1,
        framesPerBox: 10,
        totalFrames: 20,
        boxMaterial: "Madera de pino",
        baseType: "Fondo ciego tradicional",
        feederType: "De cuadro",
      },
      latestMetrics: {
        broodFrames: 6,
        pollenFrames: 2,
        honeyFrames: 3,
        beeCoveragePercent: 55,
        queenSpotted: false,
        temperament: "Normal",
      },
      lastWaxChangeDate: "2024-04-10",
      workLogs: [],
      createdAt: "2024-03-18T11:00:00Z",
    },
    {
      id: "hive-3",
      code: "LC-DAD-003",
      apiaryId: "apiary-1",
      qrPayload: "https://beekeeper.lacajaambar.es/hive/LC-DAD-003",
      inventory: {
        hiveType: "Dadant",
        deepBoxes: 1,
        honeySupers: 1,
        framesPerBox: 10,
        totalFrames: 20,
        boxMaterial: "Madera de cedro",
        baseType: "Sanitaria / fondo ventilado",
        feederType: "Piquera",
      },
      latestMetrics: {
        broodFrames: 9,
        pollenFrames: 5,
        honeyFrames: 2,
        beeCoveragePercent: 85,
        queenSpotted: true,
        temperament: "Defensiva",
      },
      lastWaxChangeDate: "2024-03-01",
      workLogs: [
        {
          id: "log-2",
          hiveId: "hive-3",
          date: "2024-03-01",
          waxReplacedDate: "2024-03-01",
          waxFramesReplacedCount: 3,
          feedingApplied: "Pasta proteica",
          treatmentApplied: "",
          observations: "Reina vista, temperamento defensivo al abrir.",
        },
      ],
      createdAt: "2024-03-20T09:30:00Z",
    },
    {
      id: "hive-4",
      code: "LC-IND-004",
      apiaryId: "apiary-2",
      qrPayload: "https://beekeeper.lacajaambar.es/hive/LC-IND-004",
      inventory: {
        hiveType: "Industrial",
        deepBoxes: 2,
        honeySupers: 0,
        framesPerBox: 8,
        totalFrames: 16,
        boxMaterial: "Poliestireno de alta densidad",
        baseType: "Sanitaria / fondo ventilado",
        feederType: "Ninguno",
      },
      latestMetrics: {
        broodFrames: 8,
        pollenFrames: 3,
        honeyFrames: 1,
        beeCoveragePercent: 62,
        queenSpotted: true,
        temperament: "Normal",
      },
      lastWaxChangeDate: "2024-04-25",
      workLogs: [],
      createdAt: "2024-04-05T14:00:00Z",
    },
    {
      id: "hive-5",
      code: "LC-PER-005",
      apiaryId: "apiary-2",
      qrPayload: "https://beekeeper.lacajaambar.es/hive/LC-PER-005",
      inventory: {
        hiveType: "Perfección",
        deepBoxes: 2,
        honeySupers: 1,
        framesPerBox: 10,
        totalFrames: 30,
        boxMaterial: "Madera de pino",
        baseType: "Fondo ciego tradicional",
        feederType: "De techo",
      },
      latestMetrics: {
        broodFrames: 4,
        pollenFrames: 1,
        honeyFrames: 0,
        beeCoveragePercent: 40,
        queenSpotted: false,
        temperament: "Normal",
      },
      lastWaxChangeDate: undefined,
      workLogs: [],
      createdAt: "2024-04-10T16:00:00Z",
    },
  ],
};

function loadSeed(): SeedData {
  return SEED_DATA;
}

export class BeekeeperStore {
  private apiaries: Apiary[] = [];
  private hives: Hive[] = [];
  private logs: MaintenanceLog[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      if (typeof window === "undefined") {
        const seed = loadSeed();
        this.apiaries = seed.apiaries;
        this.hives = seed.hives;
        this.logs = this.hives.flatMap((h) => h.workLogs);
        return;
      }

      const rawA = localStorage.getItem(STORAGE_KEYS.APIARIES);
      const rawH = localStorage.getItem(STORAGE_KEYS.HIVES);
      const rawL = localStorage.getItem(STORAGE_KEYS.LOGS);

      if (rawA && rawH) {
        this.apiaries = JSON.parse(rawA);
        this.hives = JSON.parse(rawH);
        this.logs = rawL ? JSON.parse(rawL) : [];
      } else {
        const seed = loadSeed();
        this.apiaries = seed.apiaries;
        this.hives = seed.hives;
        this.logs = this.hives.flatMap((h) => h.workLogs);
        this.persist();
      }
    } catch {
      const seed = loadSeed();
      this.apiaries = seed.apiaries;
      this.hives = seed.hives;
      this.logs = this.hives.flatMap((h) => h.workLogs);
    }
  }

  private persist(): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEYS.APIARIES, JSON.stringify(this.apiaries));
    localStorage.setItem(STORAGE_KEYS.HIVES, JSON.stringify(this.hives));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));

    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  getApiaries(): Apiary[] {
    return [...this.apiaries].sort((a, b) => a.name.localeCompare(b.name));
  }

  getApiary(id: string): Apiary | undefined {
    return this.apiaries.find((a) => a.id === id);
  }

  createApiary(data: Omit<Apiary, "id" | "hiveCount" | "createdAt">): Apiary {
    const apiary: Apiary = {
      ...data,
      id: `apiary-${Date.now()}`,
      hiveCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.apiaries.push(apiary);
    this.persist();
    return apiary;
  }

  updateApiary(id: string, data: Partial<Apiary>): Apiary | undefined {
    const idx = this.apiaries.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.apiaries[idx] = { ...this.apiaries[idx], ...data };
    this.persist();
    return this.apiaries[idx];
  }

  deleteApiary(id: string): boolean {
    const idx = this.apiaries.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.apiaries.splice(idx, 1);
    this.hives = this.hives.filter((h) => h.apiaryId !== id);
    this.logs = this.logs.filter((l) => {
      const h = this.hives.find((x) => x.id === l.hiveId);
      return h ? true : false;
    });
    this.persist();
    return true;
  }

  getHives(): Hive[] {
    return [...this.hives].sort((a, b) => a.code.localeCompare(b.code));
  }

  getHivesByApiary(apiaryId: string): Hive[] {
    return this.getHives().filter((h) => h.apiaryId === apiaryId);
  }

  getHive(id: string): Hive | undefined {
    return this.hives.find((h) => h.id === id);
  }

  private nextHiveNumber(): number {
    const existing = this.hives
      .map((h) => {
        const m = h.code.match(/(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter((n) => Number.isFinite(n));
    return existing.length ? Math.max(...existing) + 1 : 1;
  }

  createHive(data: {
    apiaryId: string;
    code?: string;
    inventory: HiveInventory;
    metrics?: HiveStatusMetrics;
  }): Hive {
    const code = data.code || `LC-${this.nextHiveNumber().toString().padStart(3, "0")}`;
    const hive: Hive = {
      id: `hive-${Date.now()}`,
      code,
      apiaryId: data.apiaryId,
      qrPayload: `https://beekeeper.lacajaambar.es/hive/${code}`,
      inventory: data.inventory,
      latestMetrics: data.metrics ?? DEFAULT_METRICS,
      workLogs: [],
      createdAt: new Date().toISOString(),
    };
    this.hives.push(hive);
    const apiary = this.apiaries.find((a) => a.id === data.apiaryId);
    if (apiary) apiary.hiveCount += 1;
    this.persist();
    return hive;
  }

  updateHive(id: string, data: Partial<Hive>): Hive | undefined {
    const idx = this.hives.findIndex((h) => h.id === id);
    if (idx === -1) return undefined;
    this.hives[idx] = { ...this.hives[idx], ...data };
    this.persist();
    return this.hives[idx];
  }

  deleteHive(id: string): boolean {
    const idx = this.hives.findIndex((h) => h.id === id);
    if (idx === -1) return false;
    const hive = this.hives[idx];
    this.hives.splice(idx, 1);
    this.logs = this.logs.filter((l) => l.hiveId !== id);
    const apiary = this.apiaries.find((a) => a.id === hive.apiaryId);
    if (apiary) apiary.hiveCount = Math.max(0, apiary.hiveCount - 1);
    this.persist();
    return true;
  }

  getLogsForHive(hiveId: string): MaintenanceLog[] {
    return [...this.logs]
      .filter((l) => l.hiveId === hiveId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  createLog(data: Omit<MaintenanceLog, "id">): MaintenanceLog {
    const log: MaintenanceLog = { ...data, id: `log-${Date.now()}` };
    this.logs.push(log);
    const hive = this.hives.find((h) => h.id === data.hiveId);
    if (hive) {
      hive.workLogs = [log, ...hive.workLogs].sort(
        (a, b) => b.date.localeCompare(a.date),
      );
      if (data.waxReplacedDate) {
        hive.lastWaxChangeDate = data.waxReplacedDate;
      }
    }
    this.persist();
    return log;
  }

  deleteLog(id: string): boolean {
    const idx = this.logs.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    const log = this.logs[idx];
    this.logs.splice(idx, 1);
    const hive = this.hives.find((h) => h.id === log.hiveId);
    if (hive) {
      hive.workLogs = hive.workLogs.filter((l) => l.id !== id);
      if (!hive.workLogs.length && log.waxReplacedDate) {
        hive.lastWaxChangeDate = undefined;
      }
    }
    this.persist();
    return true;
  }

  resetToSeed(): void {
    const seed = loadSeed();
    this.apiaries = seed.apiaries;
    this.hives = seed.hives;
    this.logs = this.hives.flatMap((h) => h.workLogs);
    this.persist();
  }
}

export const store = new BeekeeperStore();
