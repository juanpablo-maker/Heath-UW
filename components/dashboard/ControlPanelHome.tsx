"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { clearMockSession } from "@/lib/mockAuth";

type RiskLevel = "Bajo" | "Medio" | "Alto";
type IntakeStatus = "Nueva" | "En revisión";

type TradingDeskRow = {
  solicitud: string; // broker (mock)
  operacion: string;
  estado: IntakeStatus;
  riesgo: RiskLevel;
};

type IntakeInitialRow = {
  broker: string;
  operacion: string;
  correosRecibidos: number;
  ultimoRecibidoISO: string;
};

type IntakeChannelDeclineRow = {
  canal: string;
  broker: string;
  correosDeclinados: number;
  estado: "Declinado (mapeado)";
};

type IntakeReasonDeclineRow = {
  motivo: string;
  oportunidad: string;
  riesgo: RiskLevel;
  correosDeclinados: number;
};

const tradingDeskMock: TradingDeskRow[] = [
  { solicitud: "Broker A", operacion: "Prop. marítimo", estado: "Nueva", riesgo: "Bajo" },
  { solicitud: "Broker B", operacion: "Renovación aviación", estado: "En revisión", riesgo: "Alto" },
  { solicitud: "Broker C", operacion: "Renovación propiedad", estado: "En revisión", riesgo: "Medio" },
  { solicitud: "Broker D", operacion: "Paquete especializado", estado: "Nueva", riesgo: "Alto" },
];

const intakeInitialMock: IntakeInitialRow[] = [
  {
    broker: "Broker A",
    operacion: "Prop. marítimo",
    correosRecibidos: 18,
    ultimoRecibidoISO: "2026-03-20",
  },
  {
    broker: "Broker C",
    operacion: "Renovación propiedad",
    correosRecibidos: 11,
    ultimoRecibidoISO: "2026-03-19",
  },
  {
    broker: "Broker E",
    operacion: "Nueva admisión - PVT corto",
    correosRecibidos: 7,
    ultimoRecibidoISO: "2026-03-19",
  },
];

const intakeChannelDeclineMock: IntakeChannelDeclineRow[] = [
  {
    canal: "Canal de eventos (comprometido)",
    broker: "Broker B",
    correosDeclinados: 9,
    estado: "Declinado (mapeado)",
  },
  {
    canal: "Canal de prioridad (comprometido)",
    broker: "Broker C",
    correosDeclinados: 5,
    estado: "Declinado (mapeado)",
  },
];

const intakeReasonDeclineMock: IntakeReasonDeclineRow[] = [
  {
    motivo: "Mercado vigente (ya estamos en la cuenta)",
    oportunidad: "Renovación Iberia Re - 12M",
    riesgo: "Bajo",
    correosDeclinados: 3,
  },
  {
    motivo: "Fuera de guideline (decisión técnica: islas Galápagos)",
    oportunidad: "Cobertura embarcaciones - Galápagos",
    riesgo: "Alto",
    correosDeclinados: 2,
  },
];

function riskDotClasses(risk: RiskLevel) {
  switch (risk) {
    case "Bajo":
      return "bg-positive";
    case "Medio":
      return "bg-intelligence";
    case "Alto":
      return "bg-risk";
  }
}

function estadoBadgeClasses(estado: IntakeStatus) {
  switch (estado) {
    case "Nueva":
      return "border-positive/30 bg-positive/10 text-positive";
    case "En revisión":
      return "border-intelligence/30 bg-intelligence/10 text-intelligence";
  }
}

function formatCompactDate(iso: string) {
  const locale = typeof document !== "undefined" && document.documentElement.lang === "en" ? "en-US" : "es-AR";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
}

function PanelCard({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/95 p-4 shadow-card-lift ring-1 ring-primary/[0.03]">
      <div>
        <div className="text-xs font-medium text-secondary">{kicker}</div>
        <div className="mt-1 text-lg font-bold text-primary">{title}</div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TradingDeskTable() {
  const counts = useMemo(() => {
    const out: Record<IntakeStatus, number> = { "Nueva": 0, "En revisión": 0 };
    for (const r of tradingDeskMock) out[r.estado] += 1;
    return out;
  }, []);

  return (
    <PanelCard kicker="Suscripción" title="Mesa de trading (solicitudes)">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary">
          Nueva: {counts["Nueva"]}
        </span>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary">
          En revisión: {counts["En revisión"]}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
        <div className="grid grid-cols-[1.1fr_1.5fr_1fr_0.9fr] gap-0 border-b border-border bg-muted/40 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary">
          <span>SOLICITUD</span>
          <span>OPERACIÓN</span>
          <span>ESTADO</span>
          <span>RIESGO</span>
        </div>

        <div className="divide-y divide-border bg-card">
          {tradingDeskMock.map((r) => (
            <div
              key={`${r.solicitud}-${r.operacion}`}
              className="grid grid-cols-[1.1fr_1.5fr_1fr_0.9fr] gap-0 px-3 py-2.5 text-sm"
            >
              <div className="min-w-0 pr-2 font-semibold text-primary truncate">{r.solicitud}</div>
              <div className="min-w-0 pr-2 text-secondary truncate">{r.operacion}</div>
              <div className="min-w-0 pr-2">
                <span
                  className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${estadoBadgeClasses(
                    r.estado
                  )}`}
                >
                  {r.estado}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${riskDotClasses(r.riesgo)}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-bold ${
                    r.riesgo === "Bajo"
                      ? "text-positive"
                      : r.riesgo === "Medio"
                        ? "text-intelligence"
                        : "text-risk"
                  }`}
                >
                  {r.riesgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function IntakeInitialTable() {
  const total = intakeInitialMock.reduce((acc, r) => acc + r.correosRecibidos, 0);

  return (
    <PanelCard kicker="Submission (Intake)" title="Información inicial recibida">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary">
          Total (mock): {total} correos
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
        <div className="grid grid-cols-[1.1fr_1.3fr_0.9fr_1fr] gap-0 border-b border-border bg-muted/40 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary">
          <span>Broker</span>
          <span>Operación</span>
          <span>Correos</span>
          <span>Último</span>
        </div>
        <div className="divide-y divide-border bg-card">
          {intakeInitialMock.map((r) => (
            <div
              key={`${r.broker}-${r.operacion}`}
              className="grid grid-cols-[1.1fr_1.3fr_0.9fr_1fr] gap-0 px-3 py-2.5 text-sm"
            >
              <div className="min-w-0 pr-2 font-semibold text-primary truncate">{r.broker}</div>
              <div className="min-w-0 pr-2 text-secondary truncate">{r.operacion}</div>
              <div className="text-primary font-bold">{r.correosRecibidos}</div>
              <div className="text-secondary">{formatCompactDate(r.ultimoRecibidoISO)}</div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function IntakeChannelDeclineTable() {
  const total = intakeChannelDeclineMock.reduce((acc, r) => acc + r.correosDeclinados, 0);

  return (
    <PanelCard kicker="Submission (Intake)" title="Comprometidos con este canal (declinado)">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary">
          Total (mock): {total} correos declinados
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
        <div className="grid grid-cols-[1.2fr_1fr_0.9fr_1.2fr] gap-0 border-b border-border bg-muted/40 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary">
          <span>Canal</span>
          <span>Broker</span>
          <span>Correos</span>
          <span>Estado</span>
        </div>
        <div className="divide-y divide-border bg-card">
          {intakeChannelDeclineMock.map((r) => (
            <div
              key={`${r.canal}-${r.broker}`}
              className="grid grid-cols-[1.2fr_1fr_0.9fr_1.2fr] gap-0 px-3 py-2.5 text-sm"
            >
              <div className="min-w-0 pr-2 text-secondary truncate">{r.canal}</div>
              <div className="min-w-0 pr-2 font-semibold text-primary truncate">{r.broker}</div>
              <div className="text-primary font-bold">{r.correosDeclinados}</div>
              <div>
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-secondary">
                  {r.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function IntakeReasonDeclineTable() {
  const total = intakeReasonDeclineMock.reduce((acc, r) => acc + r.correosDeclinados, 0);

  return (
    <PanelCard kicker="Submission (Intake)" title="Declinados por motivo (mercado / guideline)">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary">
          Total (mock): {total} correos declinados
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
        <div className="grid grid-cols-[1.35fr_1.2fr_0.85fr_0.85fr] gap-0 border-b border-border bg-muted/40 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary">
          <span>Motivo</span>
          <span>Oportunidad</span>
          <span>Riesgo</span>
          <span>Correos</span>
        </div>
        <div className="divide-y divide-border bg-card">
          {intakeReasonDeclineMock.map((r) => (
            <div
              key={`${r.motivo}-${r.oportunidad}`}
              className="grid grid-cols-[1.35fr_1.2fr_0.85fr_0.85fr] gap-0 px-3 py-2.5 text-sm"
            >
              <div className="min-w-0 pr-2 text-secondary truncate">{r.motivo}</div>
              <div className="min-w-0 pr-2 font-semibold text-primary truncate">{r.oportunidad}</div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${riskDotClasses(r.riesgo)}`} aria-hidden />
                <span
                  className={`text-xs font-bold ${
                    r.riesgo === "Bajo"
                      ? "text-positive"
                      : r.riesgo === "Medio"
                        ? "text-intelligence"
                        : "text-risk"
                  }`}
                >
                  {r.riesgo}
                </span>
              </div>
              <div className="text-primary font-bold">{r.correosDeclinados}</div>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

export function ControlPanelSidebar({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const { locale } = useI18n();

  return (
    <aside className="lg:sticky lg:top-12">
      <div className="w-[180px] rounded-2xl border border-white/10 bg-[#063246] p-2.5 shadow-card-lift">
        <div className="rounded-xl px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-sm font-bold text-accent"
              aria-hidden
            >
              H
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold leading-none">Heath</div>
              <div className="mt-1 truncate text-xs font-medium text-white/70">
                {locale === "es" ? "Menú" : "Menu"}
              </div>
            </div>
          </div>
        </div>

        <nav
          id="panel-nav"
          className="mt-2 space-y-[6px] rounded-xl px-1 pb-1 pt-0"
          aria-label="Panel"
        >
          <Link
            href="/panel-de-suscripcion-dashboard"
            className={`block rounded-lg px-3 py-1.5 text-[13px] font-semibold leading-[18px] transition-colors ${
              pathname === "/panel-de-suscripcion-dashboard"
                ? "bg-white/10 text-white ring-1 ring-white/10"
                : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            {locale === "es" ? "Home del panel de control" : "Control panel home"}
          </Link>

          <Link
            href="/panel-de-suscripcion-dashboard/configuraciones"
            className={`block rounded-lg px-3 py-1.5 text-[13px] font-semibold leading-[18px] transition-colors ${
              pathname === "/panel-de-suscripcion-dashboard/configuraciones"
                ? "bg-white/10 text-white ring-1 ring-white/10"
                : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            {locale === "es" ? "Configuraciones" : "Settings"}
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="block w-full rounded-lg px-3 py-1.5 text-left text-[13px] font-semibold leading-[18px] text-white/90 hover:bg-risk/20"
          >
            {locale === "es" ? "Cerrar sesión" : "Sign out"}
          </button>
        </nav>
      </div>
    </aside>
  );
}

export function ControlPanelShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { locale } = useI18n();

  function onLogout() {
    clearMockSession();
    router.replace(`/iniciar-sesion?redirect=/panel-de-suscripcion-dashboard&lang=${locale}`);
  }

  return (
    <div className="min-h-screen bg-backgroundSecondary/60">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
          <ControlPanelSidebar onLogout={onLogout} />

          <div className="flex-1 space-y-5">
            <header>
              <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 max-w-2xl text-sm text-secondary md:text-base">
                  {subtitle}
                </p>
              )}
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ControlPanelHome() {
  const { locale } = useI18n();
  return (
    <ControlPanelShell
      title={locale === "es" ? "Panel de control" : "Control panel"}
      subtitle={
        locale === "es"
          ? "Data mock para el seguimiento de solicitudes e intake, con decisiones mapeadas a estado y riesgo."
          : "Mock data for submission and intake tracking, with decisions mapped to status and risk."
      }
    >
      <div className="space-y-5">
        <TradingDeskTable />
        <IntakeInitialTable />
        <IntakeChannelDeclineTable />
        <IntakeReasonDeclineTable />
      </div>
    </ControlPanelShell>
  );
}

