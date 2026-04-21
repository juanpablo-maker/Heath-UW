"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/components/providers/LanguageProvider";
import { clearMockSession, getMockSession, type MockUser } from "@/lib/mockAuth";

type SubscriptionStatus = "Activa" | "En revisión" | "Pausada" | "Suspendida";
type RiskLevel = "Bajo" | "Medio" | "Alto";
type DecisionStrategy = "Manual" | "Auto-conservador" | "Auto-agresivo";

type SubscriptionRequestStatus = "Nueva" | "En revisión" | "Aprobada" | "Rechazada";

type SubscriptionRequest = {
  id: string;
  oportunidad: string;
  tipoOperacion: "Renovación" | "Nueva admisión";
  score: number; // 0-100
  estado: SubscriptionRequestStatus;
  fechaISO: string;
};

type DecisionLog = {
  id: string;
  fechaISO: string;
  broker: string;
  deal: string;
  decision: "Aprobar" | "Rechazar" | "Solicitar info";
  risk: RiskLevel;
  notas: string;
};

type SubscriptionConfig = {
  realTimeDecisions: boolean;
  decisionStrategy: DecisionStrategy;
  riskTolerance: number; // 0-100
  capacityBufferPct: number; // 0-30
  minScoreToParticipate: number; // 0-100
  notifyOnHighRisk: boolean;
};

type Subscription = {
  id: string;
  nombre: string;
  empresa: string;
  linea: "Marítimo" | "Aviación" | "Propiedad" | "Construcción" | "Reaseguro";
  status: SubscriptionStatus;
  riskLevel: RiskLevel;
  renewalISO: string;
  capacityTotal: number; // en USD (mock)
  capacityUsed: number; // en USD (mock)
  kpis: {
    slaPct: number; // 0-100
    churnRiskPct: number; // 0-100
    decisionQueue: number;
  };
  alerts: Array<{ id: string; label: string; severity: "info" | "warn" | "risk" }>;
  requests: SubscriptionRequest[];
  decisionLogs: DecisionLog[];
};

const STATUS_ORDER: SubscriptionStatus[] = ["Activa", "En revisión", "Pausada", "Suspendida"];

function statusBadgeStyles(status: SubscriptionStatus) {
  switch (status) {
    case "Activa":
      return "border-positive/30 bg-positive/10 text-positive";
    case "En revisión":
      return "border-intelligence/30 bg-intelligence/10 text-intelligence";
    case "Pausada":
      return "border-secondary/30 bg-muted text-secondary";
    case "Suspendida":
      return "border-risk/30 bg-risk/10 text-risk";
  }
}

function riskDotClass(risk: RiskLevel) {
  switch (risk) {
    case "Bajo":
      return "bg-positive";
    case "Medio":
      return "bg-intelligence";
    case "Alto":
      return "bg-risk";
  }
}

function formatCompactDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

function formatMoneyUSD(n: number) {
  const nf = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return nf.format(n);
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

const subscriptionsMock: Subscription[] = [
  {
    id: "sub_iberia_renov",
    nombre: "Automatización de renovaciones",
    empresa: "Iberia Re",
    linea: "Marítimo",
    status: "Activa",
    riskLevel: "Bajo",
    renewalISO: "2026-06-10",
    capacityTotal: 12_000_000,
    capacityUsed: 7_840_000,
    kpis: { slaPct: 98, churnRiskPct: 7, decisionQueue: 12 },
    alerts: [
      { id: "a1", label: "SLA dentro de objetivo", severity: "info" },
      { id: "a2", label: "Capacidad suficiente para nuevas renovaciones", severity: "warn" },
    ],
    requests: [
      {
        id: "r1",
        oportunidad: "Renovación - Prop. marítimo 12M",
        tipoOperacion: "Renovación",
        score: 84,
        estado: "Aprobada",
        fechaISO: "2026-03-12",
      },
      {
        id: "r2",
        oportunidad: "Renovación - Flota regional",
        tipoOperacion: "Renovación",
        score: 78,
        estado: "En revisión",
        fechaISO: "2026-03-15",
      },
      {
        id: "r3",
        oportunidad: "Renovación - Cobertura contingencias",
        tipoOperacion: "Renovación",
        score: 72,
        estado: "Nueva",
        fechaISO: "2026-03-17",
      },
    ],
    decisionLogs: [
      {
        id: "d1",
        fechaISO: "2026-03-17",
        broker: "Broker A",
        deal: "Renovación flota regional",
        decision: "Aprobar",
        risk: "Bajo",
        notas: "SLA y score alineados. Capacidad con buffer disponible.",
      },
      {
        id: "d2",
        fechaISO: "2026-03-15",
        broker: "Broker B",
        deal: "Cobertura contingencias",
        decision: "Solicitar info",
        risk: "Medio",
        notas: "Faltan datos de historial y límites de agregación.",
      },
    ],
  },
  {
    id: "sub_atlas_nueva",
    nombre: "Nueva admisión - pipeline",
    empresa: "Atlas Marítimo",
    linea: "Marítimo",
    status: "En revisión",
    riskLevel: "Alto",
    renewalISO: "2026-05-01",
    capacityTotal: 9_500_000,
    capacityUsed: 8_620_000,
    kpis: { slaPct: 91, churnRiskPct: 24, decisionQueue: 38 },
    alerts: [
      { id: "a3", label: "Capacidad casi al límite", severity: "warn" },
      { id: "a4", label: "Aumento de riesgo en agregación", severity: "risk" },
    ],
    requests: [
      {
        id: "r4",
        oportunidad: "Nueva admisión - Carga especial",
        tipoOperacion: "Nueva admisión",
        score: 58,
        estado: "En revisión",
        fechaISO: "2026-03-16",
      },
      {
        id: "r5",
        oportunidad: "Nueva admisión - PVT corto",
        tipoOperacion: "Nueva admisión",
        score: 49,
        estado: "Nueva",
        fechaISO: "2026-03-18",
      },
      {
        id: "r6",
        oportunidad: "Nueva admisión - Operación mixta",
        tipoOperacion: "Nueva admisión",
        score: 63,
        estado: "En revisión",
        fechaISO: "2026-03-19",
      },
    ],
    decisionLogs: [
      {
        id: "d3",
        fechaISO: "2026-03-19",
        broker: "Broker D",
        deal: "Operación mixta",
        decision: "Solicitar info",
        risk: "Alto",
        notas: "Se requiere revisión de límites por zona y trayectoria de siniestros.",
      },
      {
        id: "d4",
        fechaISO: "2026-03-16",
        broker: "Broker C",
        deal: "Carga especial",
        decision: "Rechazar",
        risk: "Alto",
        notas: "Score bajo + agregación superior al umbral de capacidad.",
      },
    ],
  },
  {
    id: "sub_santapro_paused",
    nombre: "Renovación anual - control manual",
    empresa: "SantaProp",
    linea: "Propiedad",
    status: "Pausada",
    riskLevel: "Medio",
    renewalISO: "2026-04-20",
    capacityTotal: 7_200_000,
    capacityUsed: 3_920_000,
    kpis: { slaPct: 84, churnRiskPct: 16, decisionQueue: 9 },
    alerts: [{ id: "a5", label: "Flujo pausado por revisión de reglas", severity: "info" }],
    requests: [
      {
        id: "r7",
        oportunidad: "Renovación anual - Edificios zona norte",
        tipoOperacion: "Renovación",
        score: 69,
        estado: "Nueva",
        fechaISO: "2026-03-14",
      },
      {
        id: "r8",
        oportunidad: "Renovación anual - Oficinas premium",
        tipoOperacion: "Renovación",
        score: 74,
        estado: "Nueva",
        fechaISO: "2026-03-18",
      },
    ],
    decisionLogs: [
      {
        id: "d5",
        fechaISO: "2026-03-10",
        broker: "Broker B",
        deal: "Edificios zona norte",
        decision: "Aprobar",
        risk: "Medio",
        notas: "Se aplicó recomendación manual y límites por contrato.",
      },
    ],
  },
  {
    id: "sub_andina_suspend",
    nombre: "Reaseguro facultativo",
    empresa: "Andina AVI",
    linea: "Aviación",
    status: "Suspendida",
    riskLevel: "Alto",
    renewalISO: "2026-07-02",
    capacityTotal: 6_000_000,
    capacityUsed: 5_780_000,
    kpis: { slaPct: 76, churnRiskPct: 41, decisionQueue: 64 },
    alerts: [
      { id: "a6", label: "Suspendida por exposición concentrada", severity: "risk" },
      { id: "a7", label: "Requiere ajuste de buffer de capacidad", severity: "warn" },
    ],
    requests: [
      {
        id: "r9",
        oportunidad: "Reaseguro facultativo - tramo 1",
        tipoOperacion: "Nueva admisión",
        score: 41,
        estado: "En revisión",
        fechaISO: "2026-03-12",
      },
      {
        id: "r10",
        oportunidad: "Reaseguro facultativo - tramo 2",
        tipoOperacion: "Nueva admisión",
        score: 52,
        estado: "Nueva",
        fechaISO: "2026-03-17",
      },
      {
        id: "r11",
        oportunidad: "Reaseguro facultativo - tramo 3",
        tipoOperacion: "Nueva admisión",
        score: 39,
        estado: "Rechazada",
        fechaISO: "2026-03-19",
      },
    ],
    decisionLogs: [
      {
        id: "d6",
        fechaISO: "2026-03-19",
        broker: "Broker A",
        deal: "Tramo 3",
        decision: "Rechazar",
        risk: "Alto",
        notas: "Exposición concentrada y score por debajo del umbral.",
      },
      {
        id: "d7",
        fechaISO: "2026-03-17",
        broker: "Broker C",
        deal: "Tramo 2",
        decision: "Solicitar info",
        risk: "Alto",
        notas: "Falta evaluación de agregación y límites por riesgo.",
      },
    ],
  },
];

const defaultConfigTemplate: SubscriptionConfig = {
  realTimeDecisions: true,
  decisionStrategy: "Auto-conservador",
  riskTolerance: 62,
  capacityBufferPct: 12,
  minScoreToParticipate: 55,
  notifyOnHighRisk: true,
};

function buildDefaultConfigMap(subs: Subscription[]) {
  const map: Record<string, SubscriptionConfig> = {};
  for (const s of subs) {
    const base = { ...defaultConfigTemplate };
    if (s.status === "Suspendida") base.realTimeDecisions = false;
    if (s.status === "Pausada") base.decisionStrategy = "Manual";
    if (s.status === "En revisión") base.minScoreToParticipate = clampInt(base.minScoreToParticipate + 8, 0, 100);
    if (s.riskLevel === "Alto") base.riskTolerance = clampInt(base.riskTolerance - 8, 0, 100);
    map[s.id] = base;
  }
  return map;
}

function computeSimulationImpact(sub: Subscription, config: SubscriptionConfig) {
  const capacityPct = sub.capacityUsed / sub.capacityTotal; // 0..1
  const effectiveBuffer = config.capacityBufferPct / 100;
  const availableAfterBuffer = Math.max(0, sub.capacityTotal * (1 - capacityPct - effectiveBuffer));

  const scoreThresholdImpact = (config.minScoreToParticipate - 50) / 50; // -1..+1
  const riskPenalty = config.riskTolerance < 60 ? 0.85 : 1.0;

  const expectedApprovals = clampInt(18 + (config.realTimeDecisions ? 8 : -4) - scoreThresholdImpact * 9, 0, 40);
  const expectedQueueReduction = clampInt((sub.kpis.decisionQueue / 2) * (config.realTimeDecisions ? 0.28 : 0.08) * riskPenalty, 0, 40);
  const expectedAvgSla = clampInt(sub.kpis.slaPct + (config.realTimeDecisions ? 4 : -2) - config.capacityBufferPct / 10, 50, 100);

  return {
    availableAfterBufferUSD: availableAfterBuffer,
    expectedApprovals,
    expectedQueueReduction,
    expectedAvgSlaPct: expectedAvgSla,
    recommendation:
      config.decisionStrategy === "Manual"
        ? "Revisión manual recomendada hasta estabilizar agregación."
        : config.decisionStrategy === "Auto-conservador"
          ? "Estrategia conservadora reduce rechazos y mantiene SLA."
          : "Estrategia agresiva mejora participación, pero exige buffer suficiente.",
  };
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusBadgeStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function RiskDot({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={`inline-flex h-2.5 w-2.5 rounded-full ${riskDotClass(risk)}`}
      aria-hidden="true"
    />
  );
}

function LabeledValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-secondary">{label}</div>
      <div className="mt-1 text-sm font-bold text-primary">{value}</div>
    </div>
  );
}

export function SubscriptionDashboard() {
  const router = useRouter();
  const { locale } = useI18n();
  const [user, setUser] = useState<MockUser | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todas" | SubscriptionStatus>("Todas");

  const [selectedId, setSelectedId] = useState<string>(subscriptionsMock[0]?.id ?? "");
  const filteredSubscriptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscriptionsMock
      .filter((s) => (statusFilter === "Todas" ? true : s.status === statusFilter))
      .filter((s) => {
        if (!q) return true;
        return `${s.nombre} ${s.empresa} ${s.linea}`.toLowerCase().includes(q);
      })
      .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  }, [query, statusFilter]);

  const [configById, setConfigById] = useState<Record<string, SubscriptionConfig>>(() =>
    buildDefaultConfigMap(subscriptionsMock)
  );

  const selected = useMemo(
    () => subscriptionsMock.find((s) => s.id === selectedId) ?? subscriptionsMock[0],
    [selectedId]
  );

  useEffect(() => {
    const current = filteredSubscriptions.find((s) => s.id === selectedId);
    if (!current && filteredSubscriptions[0]) {
      setSelectedId(filteredSubscriptions[0].id);
    }
  }, [filteredSubscriptions, selectedId]);

  useEffect(() => {
    setUser(getMockSession());
  }, []);

  const savedConfig = configById[selected.id] ?? defaultConfigTemplate;

  const [draftConfig, setDraftConfig] = useState<SubscriptionConfig>(savedConfig);
  useEffect(() => {
    setDraftConfig(savedConfig);
  }, [savedConfig]);

  const [lastSavedAtISO, setLastSavedAtISO] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<ReturnType<typeof computeSimulationImpact> | null>(null);
  const [simulating, setSimulating] = useState(false);

  function onLogout() {
    clearMockSession();
    router.replace(`/iniciar-sesion?redirect=/dashboard`);
  }

  function onSaveConfig() {
    setConfigById((prev) => ({
      ...prev,
      [selected.id]: draftConfig,
    }));
    setLastSavedAtISO(new Date().toISOString());

    setSimulation(computeSimulationImpact(selected, draftConfig));
  }

  async function onSimulateDecision() {
    setSimulating(true);
    try {
      // Mock delay for UX.
      await new Promise((r) => setTimeout(r, 650));
      setSimulation(computeSimulationImpact(selected, draftConfig));
    } finally {
      setSimulating(false);
    }
  }

  const capacityUsedPct = Math.round((selected.capacityUsed / selected.capacityTotal) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-backgroundSecondary/60">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {locale === "es" ? "Panel de Underwriting" : "Underwriting Dashboard"}
            </h1>
            <p className="mt-2 max-w-2xl text-secondary">
              {locale === "es"
                ? "Escenarios mock de submissions, con configuración y simulación de decisiones."
                : "Mock submission scenarios with configurable rules and decision simulation."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={onSimulateDecision} disabled={simulating}>
              {simulating ? (locale === "es" ? "Simulando..." : "Simulating...") : locale === "es" ? "Simular decisión" : "Simulate decision"}
            </Button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-primary shadow-soft hover:bg-muted active:scale-[0.98]"
            >
              {locale === "es" ? "Cerrar sesión" : "Sign out"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-card-lift ring-1 ring-primary/[0.03] backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-medium text-secondary">Submissions</div>
                  <div className="mt-1 text-lg font-bold text-primary">
                    {filteredSubscriptions.length}
                  </div>
                </div>
                <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-secondary">
                  {statusFilter === "Todas" ? "Vista general" : statusFilter}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="search" className="sr-only">
                  {locale === "es" ? "Buscar submission" : "Search submission"}
                </label>
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={locale === "es" ? "Buscar por nombre, empresa o línea" : "Search by name, company, or line"}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-primary outline-none ring-accent focus:ring-2"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <FilterChip
                  active={statusFilter === "Todas"}
                  label="Todas"
                  onClick={() => setStatusFilter("Todas")}
                />
                {STATUS_ORDER.map((st) => (
                  <FilterChip
                    key={st}
                    active={statusFilter === st}
                    label={st}
                    onClick={() => setStatusFilter(st)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredSubscriptions.map((s) => {
                const isSelected = s.id === selected.id;
                const usedPct = Math.round((s.capacityUsed / s.capacityTotal) * 100);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-accent bg-card/95 shadow-card-lift"
                        : "border-border bg-card/90 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <RiskDot risk={s.riskLevel} />
                          <div className="truncate text-sm font-bold text-primary">
                            {s.nombre}
                          </div>
                        </div>
                        <div className="mt-1 truncate text-xs text-secondary">
                          {s.empresa} · {s.linea}
                        </div>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <LabeledValue label="Capacidad" value={`${usedPct}%`} />
                      <LabeledValue label="Cola" value={`${s.kpis.decisionQueue}`} />
                    </div>
                  </button>
                );
              })}

              {filteredSubscriptions.length === 0 && (
                <div className="rounded-2xl border border-border bg-card/95 p-6 text-center text-secondary">
                  {locale === "es" ? "No hay resultados." : "No results found."}
                </div>
              )}
            </div>
          </aside>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <main className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift ring-1 ring-primary/[0.03]">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xs font-medium text-secondary">Selección</div>
                    <div className="mt-1 text-xl font-bold text-primary">
                      {selected.nombre}
                    </div>
                    <div className="mt-1 text-sm text-secondary">
                      {selected.empresa} · {selected.linea} · Renovación{" "}
                      {formatCompactDate(selected.renewalISO)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
                      <div className="text-xs font-medium text-secondary">Capacidad usada</div>
                      <div className="mt-1 text-lg font-bold text-primary">
                        {capacityUsedPct}%
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background px-4 py-3 text-center">
                      <div className="text-xs font-medium text-secondary">SLA</div>
                      <div className="mt-1 text-lg font-bold text-primary">
                        {selected.kpis.slaPct}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <StatCard
                    label="Riesgo de churn"
                    value={`${selected.kpis.churnRiskPct}%`}
                    tone={selected.kpis.churnRiskPct > 25 ? "risk" : selected.kpis.churnRiskPct > 12 ? "neutral" : "positive"}
                  />
                  <StatCard
                    label="Cola de decisión"
                    value={`${selected.kpis.decisionQueue}`}
                    tone={selected.kpis.decisionQueue > 30 ? "risk" : selected.kpis.decisionQueue > 15 ? "neutral" : "positive"}
                  />
                  <StatCard
                    label="Capacidad disponible"
                    value={formatMoneyUSD(Math.max(0, selected.capacityTotal - selected.capacityUsed))}
                    tone={capacityUsedPct > 85 ? "risk" : capacityUsedPct > 70 ? "neutral" : "positive"}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift ring-1 ring-primary/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-secondary">Solicitudes en cola</div>
                    <div className="mt-1 text-lg font-bold text-primary">Últimos compromisos</div>
                  </div>

                  {selected.alerts.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2">
                      {selected.alerts.slice(0, 3).map((a) => (
                        <AlertPill key={a.id} severity={a.severity} label={a.label} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background/40">
                  <div className="grid grid-cols-[1.5fr_1fr_0.7fr_1fr_0.9fr] gap-0 border-b border-border bg-muted/40 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-secondary">
                    <span>Oportunidad</span>
                    <span>Tipo</span>
                    <span>Score</span>
                    <span>Estado</span>
                    <span>Fecha</span>
                  </div>

                  <div className="divide-y divide-border bg-card">
                    {selected.requests.map((r) => (
                      <div
                        key={r.id}
                        className="grid grid-cols-[1.5fr_1fr_0.7fr_1fr_0.9fr] gap-0 px-3 py-3 text-sm"
                      >
                        <div className="min-w-0 pr-2 font-semibold text-primary truncate">
                          {r.oportunidad}
                        </div>
                        <div className="text-secondary">{r.tipoOperacion}</div>
                        <div className="text-primary font-bold">{r.score}</div>
                        <div className="flex items-center">
                          <RequestStatusBadge status={r.estado} />
                        </div>
                        <div className="text-secondary">{formatCompactDate(r.fechaISO)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift ring-1 ring-primary/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-secondary">Decisiones recientes</div>
                    <div className="mt-1 text-lg font-bold text-primary">
                        {locale === "es" ? "Trazabilidad de decisiones" : "Decision traceability"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {selected.decisionLogs.map((d) => (
                    <DecisionRow key={d.id} log={d} />
                  ))}
                </div>
              </div>
            </main>

            <section className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift ring-1 ring-primary/[0.03]">
                <div>
                  <div className="text-xs font-medium text-secondary">{locale === "es" ? "Zona de configuración" : "Configuration area"}</div>
                  <div className="mt-1 text-lg font-bold text-primary">{locale === "es" ? "Reglas para este submission" : "Rules for this submission"}</div>
                </div>

                <div className="mt-4 space-y-4">
                  <ToggleRow
                    checked={draftConfig.realTimeDecisions}
                    onChange={(checked) =>
                      setDraftConfig((prev) => ({ ...prev, realTimeDecisions: checked }))
                    }
                    label="Decisiones en tiempo real"
                    description="Activa el flujo automático con trazabilidad (mock)."
                  />

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary">Estrategia de decisión</div>
                    <div className="flex flex-wrap gap-2">
                      {(["Manual", "Auto-conservador", "Auto-agresivo"] as DecisionStrategy[]).map(
                        (opt) => (
                          <RadioChip
                            key={opt}
                            checked={draftConfig.decisionStrategy === opt}
                            label={opt}
                            onClick={() =>
                              setDraftConfig((prev) => ({
                                ...prev,
                                decisionStrategy: opt,
                              }))
                            }
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-primary">
                        Tolerancia de riesgo
                      </div>
                      <div className="text-sm font-bold text-primary">{draftConfig.riskTolerance}</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draftConfig.riskTolerance}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDraftConfig((prev) => ({
                          ...prev,
                          riskTolerance: Number(e.target.value),
                        }))
                      }
                      className="mt-2 w-full accent-accent"
                    />
                    <div className="mt-1 text-xs text-secondary">
                      Menor tolerancia: más filtros. Mayor: más participación.
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-primary">
                        Buffer de capacidad
                      </div>
                      <div className="text-sm font-bold text-primary">{draftConfig.capacityBufferPct}%</div>
                    </div>
                    <select
                      value={draftConfig.capacityBufferPct}
                      onChange={(e) =>
                        setDraftConfig((prev) => ({
                          ...prev,
                          capacityBufferPct: Number(e.target.value),
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-primary outline-none ring-accent focus:ring-2"
                    >
                      {[5, 8, 12, 15, 20, 25].map((pct) => (
                        <option key={pct} value={pct}>
                          {pct}%
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 text-xs text-secondary">
                      Reserva extra para mantener SLA y evitar sobreexposición (mock).
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-primary">
                        Score mínimo para participar
                      </div>
                      <div className="text-sm font-bold text-primary">{draftConfig.minScoreToParticipate}</div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draftConfig.minScoreToParticipate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDraftConfig((prev) => ({
                          ...prev,
                          minScoreToParticipate: Number(e.target.value),
                        }))
                      }
                      className="mt-2 w-full accent-accent"
                    />
                    <div className="mt-1 text-xs text-secondary">
                      Umbral que controla rechazos/participación para este submission.
                    </div>
                  </div>

                  <ToggleRow
                    checked={draftConfig.notifyOnHighRisk}
                    onChange={(checked) =>
                      setDraftConfig((prev) => ({
                        ...prev,
                        notifyOnHighRisk: checked,
                      }))
                    }
                    label="Notificar alertas de alto riesgo"
                    description="Genera avisos para el equipo de underwriting (mock)."
                  />

                  <div className="space-y-3 pt-2">
                    <Button variant="primary" className="w-full" onClick={onSaveConfig}>
                      {locale === "es" ? "Guardar cambios (simulación)" : "Save changes (simulation)"}
                    </Button>
                    {lastSavedAtISO && (
                      <div className="text-center text-xs text-secondary">
                        Guardado:{" "}
                        <span className="font-semibold text-primary">
                          {formatCompactDate(lastSavedAtISO)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift ring-1 ring-primary/[0.03]">
                <div className="text-xs font-medium text-secondary">Impacto estimado</div>
                <div className="mt-1 text-lg font-bold text-primary">
                  {simulation ? (locale === "es" ? "Resultado de simulación" : "Simulation result") : locale === "es" ? "Ejecutá una simulación" : "Run a simulation"}
                </div>

                {!simulation ? (
                  <div className="mt-4 text-sm text-secondary">
                    {locale === "es"
                      ? "Ajustá las reglas y presioná “Simular decisión” o “Guardar cambios (simulación)”."
                      : "Adjust rules and click “Simulate decision” or “Save changes (simulation)”."}
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background px-4 py-3">
                        <div className="text-xs font-medium text-secondary">Capacidad post-buffer</div>
                        <div className="mt-1 text-sm font-bold text-primary">
                          {formatMoneyUSD(simulation.availableAfterBufferUSD)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background px-4 py-3">
                        <div className="text-xs font-medium text-secondary">Aprobaciones esperadas</div>
                        <div className="mt-1 text-sm font-bold text-primary">
                          {simulation.expectedApprovals}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background px-4 py-3">
                        <div className="text-xs font-medium text-secondary">Reducción de cola</div>
                        <div className="mt-1 text-sm font-bold text-primary">
                          {simulation.expectedQueueReduction}
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background px-4 py-3">
                        <div className="text-xs font-medium text-secondary">SLA promedio estimado</div>
                        <div className="mt-1 text-sm font-bold text-primary">
                          {simulation.expectedAvgSlaPct}%
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-secondary">
                      <span className="font-semibold text-primary">{locale === "es" ? "Recomendación:" : "Recommendation:"}</span>{" "}
                      {simulation.recommendation}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {user && (
          <div className="mt-10 text-center text-xs text-secondary">
            {locale === "es" ? "Sesión mock iniciada para " : "Mock session started for "}
            <span className="font-semibold text-primary">{user.company}</span>. (Sin backend)
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-background text-secondary hover:bg-muted/40 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: ReactNode;
  tone: "positive" | "neutral" | "risk";
}) {
  const toneClass =
    tone === "positive"
      ? "text-positive"
      : tone === "risk"
        ? "text-risk"
        : "text-intelligence";
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <div className="text-xs font-medium text-secondary">{label}</div>
      <div className={`mt-1 text-sm font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}

function AlertPill({
  severity,
  label,
}: {
  severity: "info" | "warn" | "risk";
  label: string;
}) {
  const className =
    severity === "risk"
      ? "border-risk/30 bg-risk/10 text-risk"
      : severity === "warn"
        ? "border-intelligence/30 bg-intelligence/10 text-intelligence"
        : "border-positive/30 bg-positive/10 text-positive";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

function RequestStatusBadge({
  status,
}: {
  status: SubscriptionRequestStatus;
}) {
  const styles =
    status === "Aprobada"
      ? "border-positive/30 bg-positive/10 text-positive"
      : status === "Rechazada"
        ? "border-risk/30 bg-risk/10 text-risk"
        : status === "En revisión"
          ? "border-intelligence/30 bg-intelligence/10 text-intelligence"
          : "border-border bg-background text-secondary";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
      {status}
    </span>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-primary">{label}</div>
        {description && <div className="mt-1 text-xs text-secondary">{description}</div>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 cursor-pointer accent-accent"
      />
    </label>
  );
}

function RadioChip({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        checked
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-background text-secondary hover:bg-muted/40 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function DecisionRow({ log }: { log: DecisionLog }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <RiskDot risk={log.risk} />
            <div className="truncate text-sm font-bold text-primary">
              {log.deal}
            </div>
          </div>
          <div className="mt-1 text-xs text-secondary">
            {log.broker} · {formatCompactDate(log.fechaISO)}
          </div>
        </div>
        <div className="mt-1 sm:mt-0">
          <DecisionPill decision={log.decision} />
        </div>
      </div>
      <div className="mt-2 text-sm text-secondary">{log.notas}</div>
    </div>
  );
}

function DecisionPill({ decision }: { decision: DecisionLog["decision"] }) {
  const styles =
    decision === "Aprobar"
      ? "border-positive/30 bg-positive/10 text-positive"
      : decision === "Rechazar"
        ? "border-risk/30 bg-risk/10 text-risk"
        : "border-intelligence/30 bg-intelligence/10 text-intelligence";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${styles}`}>
      {decision}
    </span>
  );
}

