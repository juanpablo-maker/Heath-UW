"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileDown,
  FileText,
  Filter,
  ChevronDown,
  RefreshCw,
  Search,
  SquareDashedBottom,
  User,
  Users,
  XCircle,
  Eye,
  MessageSquare,
  PencilLine,
  Scale,
  Activity,
  ShieldCheck,
  Briefcase,
  ReceiptText,
  Sparkles,
} from "lucide-react";

import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardSubmissionRow } from "@/types/dashboard";

const EN_TOKEN_REPLACEMENTS: Array<[string, string]> = [
  ["Solicitar más información", "Request more information"],
  ["Aprobar para cotizar", "Approve for quote"],
  ["Pendiente información", "Pending information"],
  ["En revisión", "In review"],
  ["Recomendado", "Recommended"],
  ["Declinado", "Declined"],
  ["Cotizado", "Quoted"],
  ["Nuevo", "New"],
  ["Todas", "All"],
  ["Todos", "All"],
  ["Alta", "High"],
  ["Media", "Medium"],
  ["Baja", "Low"],
  ["En apetito", "In appetite"],
  ["Fuera de apetito", "Out of appetite"],
  ["Revisar", "Review"],
  ["Reasignado desde", "Reassigned from"],
  ["Bandeja actualizada", "Inbox updated"],
  ["Nota agregada", "Note added"],
  ["Acción registrada", "Action recorded"],
  ["Decisión emitida", "Decision issued"],
  ["Solicitud de información", "Information request"],
  ["Comentario agregado", "Comment added"],
  ["Archivos procesados", "Files processed"],
  ["Asignado a underwriter", "Assigned to underwriter"],
  ["Submission recibido", "Submission received"],
  ["Cargando panel...", "Loading dashboard..."],
  ["Cerrar sesión", "Sign out"],
  ["Capacidad", "Capacity"],
  ["Riesgo", "Risk"],
  ["Estado", "Status"],
  ["Prioridad", "Priority"],
  ["Documentos", "Documents"],
  ["Actividad", "Activity"],
  ["Resumen", "Summary"],
  ["Decisión", "Decision"],
  ["Justo ahora", "Just now"],
];

function translateWorkbenchText(text: string, locale: "es" | "en") {
  let out = text;
  const replacements =
    locale === "en"
      ? EN_TOKEN_REPLACEMENTS
      : EN_TOKEN_REPLACEMENTS.map(([from, to]) => [to, from] as const);
  for (const [from, to] of replacements) {
    out = out.replaceAll(from, to);
  }
  if (locale === "en") {
    out = out.replace(/\b(\d+)\s*d\b/g, "$1d ago");
    out = out.replace(/\b(\d+)\s*h\b/g, "$1h ago");
    out = out.replace(/\b(\d+)\s*m\b/g, "$1m ago");
  } else {
    out = out.replace(/\b(\d+)d ago\b/g, "Hace $1d");
    out = out.replace(/\b(\d+)h ago\b/g, "Hace $1h");
    out = out.replace(/\b(\d+)m ago\b/g, "Hace $1m");
  }
  return out;
}

function translateWorkbenchDom(root: HTMLElement, locale: "es" | "en") {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const textNode = node as Text;
    const current = textNode.nodeValue ?? "";
    const translated = translateWorkbenchText(current, locale);
    if (translated !== current) {
      textNode.nodeValue = translated;
    }
    node = walker.nextNode();
  }
}

// #region agent log
function debugWorkbenchLog(
  hypothesisId: string,
  message: string,
  data: Record<string, unknown> = {},
  runId = "initial"
) {
  fetch("http://127.0.0.1:7353/ingest/001a0099-7b7c-4267-89af-63c0012fcef0", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "feb0a3" },
    body: JSON.stringify({
      sessionId: "feb0a3",
      runId,
      hypothesisId,
      location: "components/dashboard/UnderwritingWorkbench.tsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

type Priority = "Alta" | "Media" | "Baja";
type Appetite = "En apetito" | "Revisar" | "Fuera de apetito";
type SubmissionStatus =
  | "Nuevo"
  | "En revisión"
  | "Pendiente información"
  | "Recomendado"
  | "Declinado"
  | "Cotizado";
type Line = "Marine Cargo" | "Construction" | "Aviation" | "Property";
type TabKey = "Resumen" | "Documentos" | "Actividad" | "Decisión";

type Underwriter = {
  id: string;
  name: string;
};

type UnderwritingDocument = {
  id: string;
  name: string;
  type: "PDF" | "Excel" | "MSG" | "Documento";
  sizeMB: number;
  dateISO: string;
  processing: "Procesado" | "Pendiente lectura" | "Extraído";
};

type ActivityEvent = {
  id: string;
  kind:
    | "Submission recibido"
    | "Archivos procesados"
    | "Asignado a underwriter"
    | "Comentario agregado"
    | "Solicitud de información"
    | "Decisión emitida";
  user: string;
  timestampISO: string;
};

type UnderwritingInsight = {
  id: string;
  icon:
    | "apetite"
    | "exposicion"
    | "datos"
    | "broker"
    | "capacidad";
  title: string;
  description: string;
  impact: string;
  tone: "good" | "warn" | "risk" | "neutral";
};

type UnderwritingNote = {
  id: string;
  user: string;
  timestampISO: string;
  body: string;
};

type FinalDecision = "Aprobar para cotizar" | "Declinar" | "Solicitar más información";

type Submission = {
  id: string;
  insuredName: string;
  broker: string;
  line: Line;
  estimatedPremiumUSD: number;
  priority: Priority;
  status: SubmissionStatus;
  appetite: Appetite;
  receivedAtISO: string;
  assignedUnderwriterId: string;
  scorePrelim: number; // 0..100
  effectiveDateISO: string;

  // Resumen
  countryRegion: string;
  riskType: string;
  limitUSD: number;
  deductibleUSD: number;
  leadFollow: string;
  suggestedParticipationPct: number;
  suggestedLeadFollowPct: number;
  dates: { quoteDueISO: string; bindingStartISO: string };

  // Insights (mock)
  insights: UnderwritingInsight[];
  executiveSummary: string;

  // Documentos
  documents: UnderwritingDocument[];

  // Actividad
  activity: ActivityEvent[];

  // Decisión / capacidades
  capacityAvailableUSD: number;
  capacityUtilizationPct: number;
  notes: UnderwritingNote[];
  nextStepAlerts: Array<{
    id: string;
    tone: "good" | "warn" | "risk" | "neutral";
    title: string;
    detail: string;
    etaISO?: string; // para SLA
  }>;
  missingDataFlags: {
    hasLossRuns: boolean;
    hasHistorySiniestros: boolean;
    hasRegionalExposure: boolean;
  };
  finalDecision?: FinalDecision | null;
};

const PRIORITY_ORDER: Priority[] = ["Alta", "Media", "Baja"];
const APPETITE_ORDER: Appetite[] = ["En apetito", "Revisar", "Fuera de apetito"];

function normalizeLine(raw: string | null | undefined): Line {
  const text = (raw ?? "").toLowerCase();
  if (text.includes("marine") || text.includes("marit")) return "Marine Cargo";
  if (text.includes("aviation") || text.includes("aviac")) return "Aviation";
  if (text.includes("construct")) return "Construction";
  return "Property";
}

function mapDecisionToStatus(raw: string | null | undefined): SubmissionStatus {
  const text = (raw ?? "").toLowerCase();
  if (text.includes("declin")) return "Declinado";
  if (text.includes("accept") || text.includes("aprob")) return "Cotizado";
  if (text.includes("review") || text.includes("revisi")) return "En revisión";
  if (text.includes("reply")) return "Recomendado";
  return "Nuevo";
}

function mapDecisionToAppetite(raw: string | null | undefined): Appetite {
  const text = (raw ?? "").toLowerCase();
  if (text.includes("declin")) return "Fuera de apetito";
  if (text.includes("accept") || text.includes("aprob")) return "En apetito";
  return "Revisar";
}

function mapDashboardRowsToWorkbenchSubmissions(rows: DashboardSubmissionRow[]): Submission[] {
  const nowMs = Date.now();
  return rows.map((row, index) => {
    const insured = row.insured?.trim() || `Asegurado ${index + 1}`;
    const broker = row.broker_name?.trim() || "Broker no definido";
    const line = normalizeLine(row.line_of_business);
    const createdAtISO = row.created_at && !Number.isNaN(Date.parse(row.created_at))
      ? row.created_at
      : hoursAgoISO((index + 1) * 2, nowMs);
    const limitUSD = Number(row.insured_limit_raw) || 750000;
    const priority: Priority = index % 3 === 0 ? "Alta" : index % 3 === 1 ? "Media" : "Baja";
    const status = mapDecisionToStatus(row.decision);
    const appetite = mapDecisionToAppetite(row.decision);
    const scorePrelim = status === "Declinado" ? 42 : status === "Cotizado" ? 84 : 66;
    const decisionLabel = row.decision?.trim() || "Pendiente";
    const reasonLabel = row.decision_reason?.trim() || "Sin motivo informado";
    const country = row.country?.trim() || "N/D";

    return {
      id: `db-${index + 1}`,
      insuredName: insured,
      broker,
      line,
      estimatedPremiumUSD: Math.max(18000, Math.round(limitUSD * 0.025)),
      priority,
      status,
      appetite,
      receivedAtISO: createdAtISO,
      assignedUnderwriterId: BASE_UNDERWRITERS[index % BASE_UNDERWRITERS.length]!.id,
      scorePrelim,
      effectiveDateISO: isoInDays(20 + (index % 30), nowMs),
      countryRegion: country,
      riskType: line,
      limitUSD,
      deductibleUSD: Math.max(25000, Math.round(limitUSD * 0.04)),
      leadFollow: "Follow",
      suggestedParticipationPct: 12 + (index % 6) * 3,
      suggestedLeadFollowPct: 8 + (index % 4) * 2,
      dates: {
        quoteDueISO: isoInDays(2 + (index % 4), nowMs),
        bindingStartISO: isoInDays(7 + (index % 8), nowMs),
      },
      insights: [
        {
          id: `ins-${index}-1`,
          icon: "apetite",
          title: `Decisión base: ${decisionLabel}`,
          description: `Estado fuente: ${row.decision_status ?? "Sin estado"}`,
          impact: status === "Declinado" ? "Riesgo alto" : "Seguimiento operativo",
          tone: status === "Declinado" ? "risk" : "warn",
        },
        {
          id: `ins-${index}-2`,
          icon: "datos",
          title: "Motivo registrado",
          description: reasonLabel,
          impact: "Contexto para priorización",
          tone: "neutral",
        },
      ],
      executiveSummary: `${insured} (${broker}) en ${country}. Decision actual: ${decisionLabel}.`,
      documents: [
        {
          id: `doc-${index}-1`,
          name: "Submission base",
          type: "Documento",
          sizeMB: 0.4,
          dateISO: createdAtISO,
          processing: "Extraído",
        },
      ],
      activity: [
        {
          id: `act-${index}-1`,
          kind: "Submission recibido",
          user: broker,
          timestampISO: createdAtISO,
        },
      ],
      capacityAvailableUSD: 18000000,
      capacityUtilizationPct: 55 + (index % 30),
      notes: [],
      nextStepAlerts: [
        {
          id: `alert-${index}-1`,
          tone: status === "Declinado" ? "risk" : "warn",
          title: "Validar caso en mesa",
          detail: reasonLabel,
          etaISO: isoInDays(1, nowMs),
        },
      ],
      missingDataFlags: {
        hasLossRuns: true,
        hasHistorySiniestros: true,
        hasRegionalExposure: true,
      },
      finalDecision: null,
    };
  });
}

function formatMoneyUSD(n: number) {
  const nf = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return nf.format(n);
}

function formatCompactDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function msToCompactDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function hoursAgoISO(hoursAgo: number, baseMs: number) {
  return new Date(baseMs - hoursAgo * 60 * 60 * 1000).toISOString();
}

function minutesAgoISO(minutesAgo: number, baseMs: number) {
  return new Date(baseMs - minutesAgo * 60 * 1000).toISOString();
}

function isoInDays(days: number, baseMs: number) {
  return new Date(baseMs + days * 24 * 60 * 60 * 1000).toISOString();
}

function relativeTime(iso: string, nowMs: number) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diff = Math.max(0, nowMs - t);
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days > 0) return `Hace ${days}d`;
  if (hours > 0) return `Hace ${hours}h`;
  if (minutes > 0) return `Hace ${minutes}m`;
  return "Justo ahora";
}

function slaHoursForPriority(p: Priority) {
  if (p === "Alta") return 4;
  if (p === "Media") return 8;
  return 12;
}

function remainingSlaMs(sub: Submission, nowMs: number) {
  const t = new Date(sub.receivedAtISO).getTime();
  const slaMs = slaHoursForPriority(sub.priority) * 60 * 60 * 1000;
  return t + slaMs - nowMs;
}

function appetiteTone(app: Appetite): { border: string; bg: string; text: string } {
  switch (app) {
    case "En apetito":
      return { border: "border-positive/25", bg: "bg-positive/8", text: "text-positive" };
    case "Revisar":
      return { border: "border-accent/25", bg: "bg-accent/8", text: "text-accent" };
    case "Fuera de apetito":
      return { border: "border-risk/25", bg: "bg-risk/8", text: "text-risk" };
  }
}

function statusTone(status: SubmissionStatus): { border: string; bg: string; text: string } {
  switch (status) {
    case "Nuevo":
      return { border: "border-intelligence/25", bg: "bg-intelligence/8", text: "text-intelligence" };
    case "En revisión":
      return { border: "border-intelligence/20", bg: "bg-muted/60", text: "text-primary" };
    case "Pendiente información":
      return { border: "border-accent/20", bg: "bg-accent/8", text: "text-accent" };
    case "Recomendado":
      return { border: "border-positive/20", bg: "bg-positive/8", text: "text-positive" };
    case "Declinado":
      return { border: "border-risk/25", bg: "bg-risk/8", text: "text-risk" };
    case "Cotizado":
      return { border: "border-positive/20", bg: "bg-positive/8", text: "text-positive" };
  }
}

function priorityTone(p: Priority): { border: string; bg: string; text: string } {
  switch (p) {
    case "Alta":
      return { border: "border-accent/25", bg: "bg-accent/8", text: "text-accent" };
    case "Media":
      return { border: "border-secondary/25", bg: "bg-[#F9D77A]/8", text: "text-[#B45309]" };
    case "Baja":
      return { border: "border-border/30", bg: "bg-muted/60", text: "text-secondary" };
  }
}

function toneToStyles(tone: UnderwritingInsight["tone"] | Submission["nextStepAlerts"][number]["tone"]) {
  switch (tone) {
    case "good":
      return { border: "border-positive/20", bg: "bg-positive/8", text: "text-positive" };
    case "warn":
      return { border: "border-accent/20", bg: "bg-accent/8", text: "text-accent" };
    case "risk":
      return { border: "border-risk/20", bg: "bg-risk/8", text: "text-risk" };
    default:
      return { border: "border-border/30", bg: "bg-muted/60", text: "text-secondary" };
  }
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function IconForInsight({ icon }: { icon: UnderwritingInsight["icon"] }) {
  const common = "h-4.5 w-4.5";
  // Note: lucide doesn't ship every specialized metaphor; we reuse consistent icons.
  switch (icon) {
    case "apetite":
      return <ShieldCheck className={common + " text-positive"} />;
    case "exposicion":
      return <SquareDashedBottom className={common + " text-intelligence"} />;
    case "datos":
      return <ReceiptText className={common + " text-accent"} />;
    case "broker":
      return <Briefcase className={common + " text-secondary"} />;
    case "capacidad":
      return <Scale className={common + " text-intelligence"} />;
  }
}

function KeyInsightsList({ insights }: { insights: UnderwritingInsight[] }) {
  if (insights.length === 0) {
    return (
      <div className="mt-4">
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="Sin insights"
          description="Sin sugerencias (mock)."
        />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-1.5">
      {insights.map((ins) => {
        const toneColor =
          ins.tone === "good"
            ? "text-positive"
            : ins.tone === "warn"
              ? "text-accent"
              : ins.tone === "risk"
                ? "text-risk"
                : "text-secondary";

        const leftBorder =
          ins.tone === "good"
            ? "border-l-positive/50"
            : ins.tone === "warn"
              ? "border-l-accent/50"
              : ins.tone === "risk"
                ? "border-l-risk/50"
                : "border-l-border/50";

        const iconBg =
          ins.tone === "good"
            ? "bg-positive/10"
            : ins.tone === "warn"
              ? "bg-accent/10"
              : ins.tone === "risk"
                ? "bg-risk/10"
                : "bg-muted/60";

        const iconText =
          ins.tone === "good"
            ? "text-positive"
            : ins.tone === "warn"
              ? "text-accent"
              : ins.tone === "risk"
                ? "text-risk"
                : "text-secondary";

        return (
          <div
            key={ins.id}
            className={`group flex items-start gap-3 rounded-2xl border border-border bg-white/35 p-2.5 transition-all duration-200 hover:bg-white hover:-translate-y-[1px] border-l-4 ${leftBorder}`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border border-border ${iconBg}`}>
              <span className={iconText}>
                <IconForInsight icon={ins.icon} />
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-primary leading-tight">{ins.title}</div>
              <div className="mt-0.5 max-h-[2.2em] overflow-hidden text-xs leading-relaxed text-secondary">
                {ins.description}
              </div>
              <div className={`mt-1 text-[11px] font-semibold ${toneColor}`}>{ins.impact}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AutoSummaryCard({ executiveSummary }: { executiveSummary: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-accent" />
            <div className="text-xs font-semibold text-accent">Resumen automático</div>
          </div>
          <div className="mt-1 text-sm font-bold text-primary">Lectura ejecutiva</div>
        </div>
        <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
          AI
        </span>
      </div>

      <div className="mt-2 max-h-[3.2em] overflow-hidden text-sm text-secondary leading-relaxed">
        {executiveSummary}
      </div>

      <div className="mt-2 text-xs text-secondary">Usalo como primer filtro: confirmá con documentos antes de emitir.</div>
    </div>
  );
}

function SystemRecommendationCard({
  recToneStyles,
  riskLevel,
  recommendationAction,
  recommendationExplanation,
  suggestedParticipationPct,
  modelConfidencePct,
}: {
  recToneStyles: { border: string; bg: string; text: string; bar: string };
  riskLevel: "Bajo" | "Medio" | "Alto";
  recommendationAction: string;
  recommendationExplanation: string;
  suggestedParticipationPct: number;
  modelConfidencePct: number;
}) {
  const confidenceToneStyles =
    modelConfidencePct > 85
      ? {
          border: "border-positive/25",
          bg: "bg-positive/10",
          text: "text-positive",
          bar: "bg-positive",
        }
      : recToneStyles;

  return (
    <div className={`mt-4 rounded-2xl border ${confidenceToneStyles.border} ${confidenceToneStyles.bg} p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className={`h-4.5 w-4.5 ${confidenceToneStyles.text}`} />
            <div className={`text-xs font-semibold ${confidenceToneStyles.text}`}>Recomendación del sistema</div>
          </div>
          <div className="mt-1 text-lg font-extrabold tracking-tight text-primary leading-snug">
            {recommendationAction}
          </div>
          <div className={`mt-1 text-sm font-semibold ${confidenceToneStyles.text}`}>Nivel de riesgo: {riskLevel}</div>
          <div className="mt-2 text-xs text-secondary">{recommendationExplanation}</div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-secondary">Confianza del modelo</div>
          <div className={`mt-1 text-2xl font-bold ${confidenceToneStyles.text}`}>{modelConfidencePct}%</div>
          <div className="mt-2 h-2 w-28 overflow-hidden rounded-full bg-white/40">
            <div
              className={`h-full rounded-full ${confidenceToneStyles.bar}`}
              style={{ width: `${modelConfidencePct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-white/80 text-sm font-bold text-primary shadow-soft">
        {initials || "U"}
      </div>
      <div className="hidden text-right lg:block">
        <div className="text-xs font-semibold text-primary">{name}</div>
        <div className="text-[11px] text-secondary">Underwriter</div>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton skeleton-shimmer ${className}`} aria-hidden />;
}

function BadgePill({
  toneBorder,
  toneBg,
  toneText,
  children,
}: {
  toneBorder: string;
  toneBg: string;
  toneText: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneBorder} ${toneBg} ${toneText}`}
    >
      {children}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={`group relative rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2EC] ${
        active
          ? "border-border bg-white/80 text-primary shadow-soft"
          : "border-transparent text-secondary hover:border-border hover:bg-muted/50 hover:text-primary"
      }`}
    >
      {active ? (
        <motion.span
          className="absolute inset-x-2 -bottom-[10px] h-[2px] rounded-full bg-accent"
          layoutId="tab-underline"
        />
      ) : null}
      {children}
    </button>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white/70 p-6 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/50 text-primary">
        {icon}
      </div>
      <div className="mt-3 text-sm font-semibold text-primary">{title}</div>
      <div className="mt-1 text-sm text-secondary">{description}</div>
    </div>
  );
}

function Stepper({
  status,
}: {
  status: SubmissionStatus;
}) {
  const steps: Array<{ label: string; key: string }> = [
    { label: "Recibido", key: "Nuevo" },
    { label: "Procesado", key: "Procesado" },
    { label: "En revisión", key: "En revisión" },
    { label: "Decisión", key: "Recomendado" },
    { label: "Cierre", key: "Cierre" },
  ];

  let activeIndex = 0;
  if (status === "Nuevo") activeIndex = 0;
  else if (status === "En revisión") activeIndex = 2;
  else if (status === "Pendiente información") activeIndex = 2;
  else if (status === "Recomendado") activeIndex = 3;
  else if (status === "Declinado" || status === "Cotizado") activeIndex = 4;
  else activeIndex = 1;

  return (
    <div className="space-y-3">
      {steps.map((s, idx) => {
        const state = idx < activeIndex ? "done" : idx === activeIndex ? "active" : "todo";
        return (
          <div key={s.label} className="flex items-start gap-3">
            <div className="relative mt-0.5 flex h-7 w-7 items-center justify-center">
              {idx < activeIndex ? (
                <CheckCircle2 className="h-5 w-5 text-positive" />
              ) : idx === activeIndex ? (
                <div className="h-7 w-7 rounded-2xl border border-accent/40 bg-accent/10 flex items-center justify-center">
                  <Clock className="h-4.5 w-4.5 text-accent" />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-2xl border border-border bg-white/70" />
              )}
              {idx !== steps.length - 1 ? (
                <div
                  className={`absolute left-1/2 top-7 h-full w-[2px] -translate-x-1/2 rounded-full ${
                    idx < activeIndex ? "bg-positive/30" : "bg-border"
                  }`}
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <div
                className={`text-sm font-semibold ${
                  state === "active"
                    ? "text-primary"
                    : state === "done"
                      ? "text-primary"
                      : "text-secondary"
                }`}
              >
                {s.label}
              </div>
              {state === "active" ? (
                <div className="mt-0.5 text-xs text-secondary">En curso</div>
              ) : state === "done" ? (
                <div className="mt-0.5 text-xs text-secondary">Completado</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const BASE_UNDERWRITERS: Underwriter[] = [
  { id: "uw_sofia", name: "Sofía Alvarez" },
  { id: "uw_camilo", name: "Camilo Ríos" },
  { id: "uw_valeria", name: "Valeria Contreras" },
  { id: "uw_diego", name: "Diego Figueroa" },
];

function buildMockSubmissions() {
  const baseMs = Date.now();
  const submissions: Submission[] = [
    {
      id: "SUB-ACME-0007",
      insuredName: "ACME Logistics Ltd",
      broker: "Marsh",
      line: "Marine Cargo",
      estimatedPremiumUSD: 145_000,
      priority: "Alta",
      status: "Nuevo",
      appetite: "En apetito",
      receivedAtISO: hoursAgoISO(2, baseMs),
      assignedUnderwriterId: "",
      scorePrelim: 82,
      effectiveDateISO: isoInDays(21, baseMs),
      countryRegion: "US · East Coast",
      riskType: "Marine Cargo",
      limitUSD: 1_800_000,
      deductibleUSD: 25_000,
      leadFollow: "Equipo líder: Marine Cargo",
      suggestedParticipationPct: 28,
      suggestedLeadFollowPct: 60,
      dates: {
        quoteDueISO: isoInDays(4, baseMs),
        bindingStartISO: isoInDays(28, baseMs),
      },
      insights: [
        {
          id: "i1",
          icon: "apetite",
          title: "Alta coincidencia con apetito",
          description: "Encaje con límites y perfil objetivo.",
          impact: "Impacto en la decisión: +15% viabilidad para cotizar",
          tone: "good",
        },
        {
          id: "i2",
          icon: "capacidad",
          title: "Capacidad cerca del límite",
          description: "Buffer para SLA sin sobreexposición.",
          impact: "Impacto en la decisión: riesgo operativo (ajustar participación/ buffer)",
          tone: "warn",
        },
        {
          id: "i3",
          icon: "datos",
          title: "Faltan datos de siniestros",
          description: "Validar severidad y recurrencia regional.",
          impact: "Impacto en la decisión: decisión incompleta hasta confirmar siniestralidad",
          tone: "neutral",
        },
      ],
      executiveSummary:
        "Marine Cargo USD 145k. Alineado a apetito; validar exposición regional y siniestralidad.",
      documents: [
        {
          id: "doc_acme_1",
          name: "Slip.pdf",
          type: "PDF",
          sizeMB: 1.7,
          dateISO: minutesAgoISO(110, baseMs),
          processing: "Extraído",
        },
        {
          id: "doc_acme_2",
          name: "Loss Runs.xlsx",
          type: "Excel",
          sizeMB: 0.9,
          dateISO: minutesAgoISO(90, baseMs),
          processing: "Pendiente lectura",
        },
        {
          id: "doc_acme_3",
          name: "Submission Email.msg",
          type: "MSG",
          sizeMB: 0.4,
          dateISO: minutesAgoISO(80, baseMs),
          processing: "Procesado",
        },
        {
          id: "doc_acme_4",
          name: "Survey Report.pdf",
          type: "PDF",
          sizeMB: 2.3,
          dateISO: minutesAgoISO(70, baseMs),
          processing: "Extraído",
        },
      ],
      activity: [
        {
          id: "ev_acme_1",
          kind: "Submission recibido",
          user: "Intake Bot",
          timestampISO: hoursAgoISO(2, baseMs),
        },
        {
          id: "ev_acme_2",
          kind: "Archivos procesados",
          user: "Data Extractor",
          timestampISO: minutesAgoISO(105, baseMs),
        },
        {
          id: "ev_acme_3",
          kind: "Asignado a underwriter",
          user: "Underwriting Desk",
          timestampISO: minutesAgoISO(95, baseMs),
        },
        {
          id: "ev_acme_4",
          kind: "Comentario agregado",
          user: "Sofía Alvarez",
          timestampISO: minutesAgoISO(65, baseMs),
        },
        {
          id: "ev_acme_5",
          kind: "Solicitud de información",
          user: "Sofía Alvarez",
          timestampISO: minutesAgoISO(35, baseMs),
        },
      ],
      capacityAvailableUSD: 3_100_000,
      capacityUtilizationPct: 82,
      notes: [
        {
          id: "note_acme_1",
          user: "Sofía Alvarez",
          timestampISO: minutesAgoISO(62, baseMs),
          body: "Revisar siniestralidad última ventana; validar exposición regional y consistencia con límites previos.",
        },
      ],
      nextStepAlerts: [
        {
          id: "na_acme_1",
          tone: "warn",
          title: "Faltan loss runs",
          detail: "Loss Runs.xlsx está pendiente de lectura (SLA interno: 1h 20m).",
          etaISO: minutesAgoISO(80, baseMs),
        },
        {
          id: "na_acme_2",
          tone: "neutral",
          title: "Pendiente revisión técnica",
          detail: "Validar exposición US East Coast y coherencia de límites por viaje/embarque.",
        },
        {
          id: "na_acme_3",
          tone: "good",
          title: "Apetito alineado",
          detail: "La curva de riesgo se mantiene dentro del rango objetivo del portafolio.",
        },
      ],
      missingDataFlags: { hasLossRuns: false, hasHistorySiniestros: false, hasRegionalExposure: true },
      finalDecision: null,
    },
    {
      id: "SUB_BUILDCORP_0011",
      insuredName: "BuildCorp LATAM",
      broker: "Aon",
      line: "Construction",
      estimatedPremiumUSD: 310_000,
      priority: "Media",
      status: "En revisión",
      appetite: "Revisar",
      receivedAtISO: hoursAgoISO(6, baseMs),
      assignedUnderwriterId: "uw_camilo",
      scorePrelim: 67,
      effectiveDateISO: isoInDays(32, baseMs),
      countryRegion: "LATAM · Brazil",
      riskType: "Construction · Erection/All Risks",
      limitUSD: 4_500_000,
      deductibleUSD: 40_000,
      leadFollow: "Capacidad compartida LATAM",
      suggestedParticipationPct: 22,
      suggestedLeadFollowPct: 45,
      dates: {
        quoteDueISO: isoInDays(3, baseMs),
        bindingStartISO: isoInDays(35, baseMs),
      },
      insights: [
        {
          id: "i4",
          icon: "broker",
          title: "Broker alta conversión",
          description: "Aon mantiene tasas de aceptación estables.",
          impact: "Impacto en la decisión: +10% probabilidad de aceptación",
          tone: "good",
        },
        {
          id: "i5",
          icon: "datos",
          title: "Faltan loss runs",
          description: "Ventana 24M incompleta.",
          impact: "Impacto en la decisión: requiere revisión adicional; posible retraso",
          tone: "warn",
        },
        {
          id: "i6",
          icon: "capacidad",
          title: "Capacidad controlada",
          description: "Participación reduce exposición agregada.",
          impact: "Impacto en la decisión: reduce exposición (participación optimizada)",
          tone: "neutral",
        },
      ],
      executiveSummary:
        "Construction LATAM USD 310k. Revisar: completar loss runs y ajustar agregación.",
      documents: [
        {
          id: "doc_bc_1",
          name: "Slip.pdf",
          type: "PDF",
          sizeMB: 2.1,
          dateISO: minutesAgoISO(280, baseMs),
          processing: "Extraído",
        },
        {
          id: "doc_bc_2",
          name: "Loss Runs.xlsx",
          type: "Excel",
          sizeMB: 1.2,
          dateISO: minutesAgoISO(260, baseMs),
          processing: "Pendiente lectura",
        },
        {
          id: "doc_bc_3",
          name: "Submission Email.msg",
          type: "MSG",
          sizeMB: 0.5,
          dateISO: minutesAgoISO(250, baseMs),
          processing: "Procesado",
        },
        {
          id: "doc_bc_4",
          name: "Survey Report.pdf",
          type: "PDF",
          sizeMB: 3.1,
          dateISO: minutesAgoISO(230, baseMs),
          processing: "Extraído",
        },
      ],
      activity: [
        {
          id: "ev_bc_1",
          kind: "Submission recibido",
          user: "Intake Bot",
          timestampISO: hoursAgoISO(6, baseMs),
        },
        {
          id: "ev_bc_2",
          kind: "Archivos procesados",
          user: "Data Extractor",
          timestampISO: hoursAgoISO(5.6, baseMs),
        },
        {
          id: "ev_bc_3",
          kind: "Asignado a underwriter",
          user: "Underwriting Desk",
          timestampISO: hoursAgoISO(5.3, baseMs),
        },
        {
          id: "ev_bc_4",
          kind: "Comentario agregado",
          user: "Camilo Ríos",
          timestampISO: hoursAgoISO(4.4, baseMs),
        },
      ],
      capacityAvailableUSD: 5_200_000,
      capacityUtilizationPct: 68,
      notes: [
        {
          id: "note_bc_1",
          user: "Camilo Ríos",
          timestampISO: hoursAgoISO(4.2, baseMs),
          body: "Revisar consistencia de límites por sitio y confirmar ventana de siniestralidad para la decisión final.",
        },
      ],
      nextStepAlerts: [
        {
          id: "na_bc_1",
          tone: "warn",
          title: "Pedir loss runs completos",
          detail: "Loss Runs.xlsx incompleto; solicitar ventana 24M con desglose regional.",
        },
        {
          id: "na_bc_2",
          tone: "neutral",
          title: "Validar exposición por sitio",
          detail: "Chequeo técnico: validar agregación y coherencia de límites.",
        },
        {
          id: "na_bc_3",
          tone: "good",
          title: "Ruta de decisión clara",
          detail: "Con datos completos, el score se mantiene dentro del rango objetivo.",
        },
      ],
      missingDataFlags: { hasLossRuns: false, hasHistorySiniestros: false, hasRegionalExposure: false },
      finalDecision: null,
    },
    {
      id: "SUB_SKYJET_0032",
      insuredName: "SkyJet Regional",
      broker: "Willis",
      line: "Aviation",
      estimatedPremiumUSD: 520_000,
      priority: "Alta",
      status: "Pendiente información",
      appetite: "Fuera de apetito",
      receivedAtISO: hoursAgoISO(10, baseMs),
      assignedUnderwriterId: "",
      scorePrelim: 59,
      effectiveDateISO: isoInDays(26, baseMs),
      countryRegion: "LATAM · Andean region",
      riskType: "Aviation · Regional Ops",
      limitUSD: 7_000_000,
      deductibleUSD: 60_000,
      leadFollow: "Revisar capacidad de syndicate",
      suggestedParticipationPct: 15,
      suggestedLeadFollowPct: 30,
      dates: {
        quoteDueISO: isoInDays(2, baseMs),
        bindingStartISO: isoInDays(30, baseMs),
      },
      insights: [
        {
          id: "i7",
          icon: "apetite",
          title: "Apetito fuera de rango",
          description: "Riesgo de cola y variabilidad.",
          impact: "Impacto en la decisión: baja viabilidad para cotizar sin evidencia adicional",
          tone: "risk",
        },
        {
          id: "i8",
          icon: "datos",
          title: "Faltan datos de siniestros",
          description: "Evidencia insuficiente en la región.",
          impact: "Impacto en la decisión: bloquea validación final hasta obtener siniestros/loss runs",
          tone: "warn",
        },
        {
          id: "i9",
          icon: "broker",
          title: "Trazabilidad parcial",
          description: "Revisar consistencia documental antes de cotizar.",
          impact: "Impacto en la decisión: mejora consistencia; evita re-trabajo",
          tone: "neutral",
        },
      ],
      executiveSummary:
        "Aviation USD 520k. Fuera de apetito; pedir siniestralidad y loss runs.",
      documents: [
        {
          id: "doc_sj_1",
          name: "Slip.pdf",
          type: "PDF",
          sizeMB: 2.6,
          dateISO: minutesAgoISO(620, baseMs),
          processing: "Extraído",
        },
        {
          id: "doc_sj_2",
          name: "Loss Runs.xlsx",
          type: "Excel",
          sizeMB: 1.3,
          dateISO: minutesAgoISO(590, baseMs),
          processing: "Pendiente lectura",
        },
        {
          id: "doc_sj_3",
          name: "Submission Email.msg",
          type: "MSG",
          sizeMB: 0.6,
          dateISO: minutesAgoISO(575, baseMs),
          processing: "Procesado",
        },
        {
          id: "doc_sj_4",
          name: "Survey Report.pdf",
          type: "PDF",
          sizeMB: 3.4,
          dateISO: minutesAgoISO(560, baseMs),
          processing: "Procesado",
        },
      ],
      activity: [
        {
          id: "ev_sj_1",
          kind: "Submission recibido",
          user: "Intake Bot",
          timestampISO: hoursAgoISO(10, baseMs),
        },
        {
          id: "ev_sj_2",
          kind: "Archivos procesados",
          user: "Data Extractor",
          timestampISO: hoursAgoISO(9.6, baseMs),
        },
        {
          id: "ev_sj_3",
          kind: "Asignado a underwriter",
          user: "Underwriting Desk",
          timestampISO: hoursAgoISO(9.1, baseMs),
        },
        {
          id: "ev_sj_4",
          kind: "Solicitud de información",
          user: "Valeria Contreras",
          timestampISO: hoursAgoISO(7.8, baseMs),
        },
      ],
      capacityAvailableUSD: 1_900_000,
      capacityUtilizationPct: 88,
      notes: [
        {
          id: "note_sj_1",
          user: "Valeria Contreras",
          timestampISO: hoursAgoISO(7.7, baseMs),
          body: "Fuera de apetito. Solicitar loss runs + evidencia de severidad en región antes de proponer participación.",
        },
      ],
      nextStepAlerts: [
        {
          id: "na_sj_1",
          tone: "risk",
          title: "SLA en riesgo",
          detail: "Apetito fuera de rango + datos incompletos. Revisión prioritaria.",
          etaISO: minutesAgoISO(160, baseMs),
        },
        {
          id: "na_sj_2",
          tone: "warn",
          title: "Faltan loss runs",
          detail: "Loss Runs.xlsx está pendiente de lectura; solicitar ventana completa y desglose por región.",
        },
        {
          id: "na_sj_3",
          tone: "neutral",
          title: "Capacidad limitada",
          detail: "Reducir participación sugerida para evitar sobreexposición.",
        },
      ],
      missingDataFlags: { hasLossRuns: false, hasHistorySiniestros: false, hasRegionalExposure: true },
      finalDecision: null,
    },
    {
      id: "SUB_HARBOR_0051",
      insuredName: "Harbor Energy Group",
      broker: "Lockton",
      line: "Property",
      estimatedPremiumUSD: 220_000,
      priority: "Media",
      status: "Recomendado",
      appetite: "En apetito",
      receivedAtISO: hoursAgoISO(14, baseMs),
      assignedUnderwriterId: "uw_diego",
      scorePrelim: 76,
      effectiveDateISO: isoInDays(41, baseMs),
      countryRegion: "Europe · North Sea",
      riskType: "Property · Energy Assets",
      limitUSD: 2_900_000,
      deductibleUSD: 30_000,
      leadFollow: "Lead: property underwriting",
      suggestedParticipationPct: 24,
      suggestedLeadFollowPct: 55,
      dates: {
        quoteDueISO: isoInDays(1, baseMs),
        bindingStartISO: isoInDays(44, baseMs),
      },
      insights: [
        {
          id: "i10",
          icon: "apetite",
          title: "Apetito alineado",
          description: "Estructura consistente con portafolio.",
          impact: "Impacto en la decisión: acelera emisión con menor fricción",
          tone: "good",
        },
        {
          id: "i11",
          icon: "capacidad",
          title: "Capacidad en buffer",
          description: "Decisión con baja fricción operativa.",
          impact: "Impacto en la decisión: +8% eficacia operativa (control de SLA)",
          tone: "good",
        },
        {
          id: "i12",
          icon: "datos",
          title: "Datos técnicos listos",
          description: "Loss runs y exposición disponibles.",
          impact: "Impacto en la decisión: reduce incertidumbre; habilita emisión",
          tone: "neutral",
        },
      ],
      executiveSummary:
        "Property USD 220k. Alineado; emitir con participación sugerida.",
      documents: [
        {
          id: "doc_har_1",
          name: "Slip.pdf",
          type: "PDF",
          sizeMB: 1.5,
          dateISO: minutesAgoISO(780, baseMs),
          processing: "Extraído",
        },
        {
          id: "doc_har_2",
          name: "Loss Runs.xlsx",
          type: "Excel",
          sizeMB: 0.8,
          dateISO: minutesAgoISO(770, baseMs),
          processing: "Procesado",
        },
        {
          id: "doc_har_3",
          name: "Submission Email.msg",
          type: "MSG",
          sizeMB: 0.3,
          dateISO: minutesAgoISO(760, baseMs),
          processing: "Procesado",
        },
        {
          id: "doc_har_4",
          name: "Survey Report.pdf",
          type: "PDF",
          sizeMB: 2.9,
          dateISO: minutesAgoISO(750, baseMs),
          processing: "Extraído",
        },
      ],
      activity: [
        {
          id: "ev_har_1",
          kind: "Submission recibido",
          user: "Intake Bot",
          timestampISO: hoursAgoISO(14, baseMs),
        },
        {
          id: "ev_har_2",
          kind: "Archivos procesados",
          user: "Data Extractor",
          timestampISO: hoursAgoISO(13.7, baseMs),
        },
        {
          id: "ev_har_3",
          kind: "Asignado a underwriter",
          user: "Underwriting Desk",
          timestampISO: hoursAgoISO(13.2, baseMs),
        },
        {
          id: "ev_har_4",
          kind: "Comentario agregado",
          user: "Diego Figueroa",
          timestampISO: hoursAgoISO(11.1, baseMs),
        },
        {
          id: "ev_har_5",
          kind: "Decisión emitida",
          user: "System Recommendation",
          timestampISO: hoursAgoISO(4.2, baseMs),
        },
      ],
      capacityAvailableUSD: 2_500_000,
      capacityUtilizationPct: 74,
      notes: [
        {
          id: "note_har_1",
          user: "Diego Figueroa",
          timestampISO: hoursAgoISO(11.0, baseMs),
          body: "Confirmar consistencia con buffer. Si no hay cambios de datos, emitir cotización con participación 24%.",
        },
      ],
      nextStepAlerts: [
        {
          id: "na_har_1",
          tone: "good",
          title: "Decisión sugerida lista",
          detail: "Evidencia técnica completa; riesgo dentro de apetito.",
        },
        {
          id: "na_har_2",
          tone: "neutral",
          title: "SLA por vencer pronto",
          detail: "Quote due hoy + 1 día. Mantener ritmo para cerrar el ciclo.",
        },
      ],
      missingDataFlags: { hasLossRuns: true, hasHistorySiniestros: true, hasRegionalExposure: true },
      finalDecision: null,
    },
  ];

  return submissions;
}

function ToneDot({ tone }: { tone: "good" | "warn" | "risk" | "neutral" }) {
  switch (tone) {
    case "good":
      return <span className="inline-flex h-2 w-2 rounded-full bg-positive" aria-hidden />;
    case "warn":
      return <span className="inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden />;
    case "risk":
      return <span className="inline-flex h-2 w-2 rounded-full bg-risk" aria-hidden />;
    default:
      return <span className="inline-flex h-2 w-2 rounded-full bg-secondary" aria-hidden />;
  }
}

export function UnderwritingWorkbench({
  sourceSubmissions,
}: {
  sourceSubmissions?: DashboardSubmissionRow[];
}) {
  const { locale } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Resumen");

  const initialSubmissions = useMemo(() => {
    if (sourceSubmissions && sourceSubmissions.length > 0) {
      return mapDashboardRowsToWorkbenchSubmissions(sourceSubmissions);
    }
    return buildMockSubmissions();
  }, [sourceSubmissions]);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedId, setSelectedId] = useState<string>(initialSubmissions[0]?.id ?? "");

  // Keep a stable ref for highlight; avoids jitter when users click fast.
  const highlightTimerRef = useRef<number | null>(null);
  const [caseHighlightToken, setCaseHighlightToken] = useState(0);

  const [search, setSearch] = useState("");
  const [filterQuickLine, setFilterQuickLine] = useState<Line | "Todas">("Todas");
  const [filterQuickStatus, setFilterQuickStatus] = useState<
    SubmissionStatus | "Todas"
  >("Todas");
  const [filterQuickPriority, setFilterQuickPriority] = useState<Priority | "Todas">("Todas");

  const [filterBroker, setFilterBroker] = useState<string | "Todos">("Todos");
  const [filterAssigned, setFilterAssigned] = useState<string | "Todos">("Todos");

  const [nowMs, setNowMs] = useState(() => Date.now());

  const [toast, setToast] = useState<{ id: string; title: string; detail?: string } | null>(null);

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignDraftId, setAssignDraftId] = useState<string>("");

  const [openDocModal, setOpenDocModal] = useState<null | { docId: string }>(null);
  const [docModalStatus, setDocModalStatus] = useState<"idle" | "loading">("idle");

  // Load animation for premium feel.
  useEffect(() => {
    // #region agent log
    debugWorkbenchLog("H1", "component-mounted", { locale });
    // #endregion
    const t = window.setTimeout(() => setIsLoading(false), 900);
    // #region agent log
    debugWorkbenchLog("H1", "loading-timeout-scheduled", { delayMs: 900, locale });
    // #endregion
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    // #region agent log
    debugWorkbenchLog("H1", "isLoading-changed", { isLoading, locale });
    // #endregion
  }, [isLoading, locale]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // #region agent log
    debugWorkbenchLog("H2", "observer-disabled", { locale, isLoading }, "post-fix");
    // #endregion
    if (isLoading) return;
    const startedAt = performance.now();
    translateWorkbenchDom(root, locale);
    const elapsed = Math.round(performance.now() - startedAt);
    // #region agent log
    debugWorkbenchLog("H3", "translate-run-once", { locale, elapsedMs: elapsed, isLoading }, "post-fix");
    // #endregion
  }, [locale, isLoading, selectedId, activeTab]);

  // SLA / "Hace 2h" updates.
  useEffect(() => {
    const i = window.setInterval(() => setNowMs(Date.now()), 60 * 1000);
    return () => window.clearInterval(i);
  }, []);

  const underwritersById = useMemo(() => {
    const m: Record<string, Underwriter> = {};
    for (const u of BASE_UNDERWRITERS) m[u.id] = u;
    return m;
  }, []);

  const allBrokerOptions = useMemo(() => {
    const set = new Set(submissions.map((s) => s.broker));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [submissions]);

  const allAssignedOptions = useMemo(() => {
    const set = new Set(submissions.map((s) => underwritersById[s.assignedUnderwriterId]?.name ?? ""));
    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [submissions, underwritersById]);

  const selected = useMemo(
    () => submissions.find((s) => s.id === selectedId) ?? submissions[0],
    [submissions, selectedId]
  );
 
  const visibleSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filterLine = filterQuickLine;
    const filterStatus = filterQuickStatus;
    const filterPriority = filterQuickPriority;
    const filterBrokerLocal = filterBroker;
    const filterAssignedLocal = filterAssigned;

    const result = submissions
      .filter((s) => {
        if (filterLine !== "Todas" && s.line !== filterLine) return false;
        if (filterStatus !== "Todas" && s.status !== filterStatus) return false;
        if (filterPriority !== "Todas" && s.priority !== filterPriority) return false;
        if (filterBrokerLocal !== "Todos" && s.broker !== filterBrokerLocal) return false;
        if (filterAssignedLocal !== "Todos") {
          const assignedName = underwritersById[s.assignedUnderwriterId]?.name ?? "";
          if (assignedName !== filterAssignedLocal) return false;
        }
        if (!q) return true;
        return `${s.insuredName} ${s.broker} ${s.line} ${s.status} ${s.appetite}`.toLowerCase().includes(q);
      })
      .map((s) => {
        const remaining = remainingSlaMs(s, nowMs);
        return { s, remaining };
      })
      .sort((a, b) => {
        // Prioritize SLA first (lowest remaining = next to review).
        if (a.remaining !== b.remaining) return a.remaining - b.remaining;
        // Then by priority order.
        return PRIORITY_ORDER.indexOf(a.s.priority) - PRIORITY_ORDER.indexOf(b.s.priority);
      })
      .map((x) => x.s);

    return result;
  }, [
    submissions,
    search,
    filterQuickLine,
    filterQuickStatus,
    filterQuickPriority,
    filterBroker,
    filterAssigned,
    underwritersById,
    nowMs,
  ]);

  // Sync selectedId with visible list when it first loads.
  useEffect(() => {
    if (isLoading) return;
    if (!visibleSubmissions.length) return;
    if (!visibleSubmissions.some((s) => s.id === selectedId)) {
      setSelectedId(visibleSubmissions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, visibleSubmissions]);

  function pushToast(title: string, detail?: string) {
    const id = uid("toast");
    setToast({ id, title, detail });
    window.setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 2600);
  }

  function onSelectSubmission(id: string) {
    setSelectedId(id);
    setActiveTab("Resumen");
    if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    setCaseHighlightToken((t) => t + 1);
  }

  function onRefreshTray() {
    setIsRefreshing(true);
    setIsLoading(true);
    window.setTimeout(() => {
      setSubmissions((prev) => {
        const cloned = [...prev];
        const pick = cloned.find((s) => s.status === "Nuevo") ?? cloned[0];
        if (!pick) return cloned;
        // Move case forward in the workflow.
        const updatedAtMs = Date.now();
        const receivedDeltaHours = pick.priority === "Alta" ? 2.3 : 3.8;
        const newReceivedAt = new Date(updatedAtMs - receivedDeltaHours * 60 * 60 * 1000).toISOString();

        pick.receivedAtISO = newReceivedAt;
        if (pick.status === "Nuevo") pick.status = "En revisión";
        if (pick.appetite === "En apetito" && pick.priority === "Alta") pick.appetite = "Revisar";
        // Add audit trail.
        pick.activity = [
          ...pick.activity,
          {
            id: uid("ev"),
            kind: "Archivos procesados",
            user: "Data Extractor",
            timestampISO: new Date(updatedAtMs - 25 * 60 * 1000).toISOString(),
          },
        ];
        // If it moved, adjust suggested next steps.
        pick.nextStepAlerts = [
          {
            id: uid("na"),
            tone: "neutral",
            title: "Bandeja actualizada",
            detail: "Se procesaron documentos adicionales (mock).",
          },
          ...pick.nextStepAlerts.slice(0, 2),
        ];
        return cloned;
      });

      setIsRefreshing(false);
      setIsLoading(false);
      pushToast("Bandeja actualizada", "Se recalcularon prioridades y SLA (mock).");
    }, 760);
  }

  function setDecisionForSelected(finalDecision: FinalDecision) {
    if (!selected) return;
    const user = underwritersById[selected.assignedUnderwriterId]?.name ?? "Underwriting Desk";
    const newTimestampISO = new Date().toISOString();
    const decisionEventKind: ActivityEvent["kind"] =
      finalDecision === "Aprobar para cotizar"
        ? "Decisión emitida"
        : finalDecision === "Declinar"
          ? "Decisión emitida"
          : "Solicitud de información";

    const updatedStatus: SubmissionStatus =
      finalDecision === "Aprobar para cotizar"
        ? "Cotizado"
        : finalDecision === "Declinar"
          ? "Declinado"
          : "Pendiente información";

    const updatedAppetite: Appetite =
      finalDecision === "Aprobar para cotizar"
        ? "En apetito"
        : finalDecision === "Declinar"
          ? "Fuera de apetito"
          : selected.appetite === "Fuera de apetito"
            ? "Revisar"
            : selected.appetite;

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== selected.id) return s;
        return {
          ...s,
          status: updatedStatus,
          appetite: updatedAppetite,
          finalDecision,
          activity: [
            ...s.activity,
            {
              id: uid("ev"),
              kind: decisionEventKind,
              user,
              timestampISO: newTimestampISO,
            },
          ],
          notes: [
            ...s.notes,
            {
              id: uid("note"),
              user,
              timestampISO: newTimestampISO,
              body:
                finalDecision === "Aprobar para cotizar"
                  ? "Decisión emitida: aprobar para cotizar. Rationale: encaje con apetito y validación documental suficiente (mock)."
                  : finalDecision === "Declinar"
                    ? "Decisión emitida: declinar. Rationale: fuera de apetito y datos críticos pendientes (mock)."
                    : "Solicitud de información enviada. Rationale: completar loss runs y siniestralidad para decisión (mock).",
            },
          ],
        };
      })
    );

    setCaseHighlightToken((t) => t + 1);
    setActiveTab("Decisión");
    pushToast("Acción registrada", finalDecision);
  }

  function onAddNote(body: string) {
    if (!selected) return;
    const trimmed = body.trim();
    if (!trimmed) return;
    const user = underwritersById[selected.assignedUnderwriterId]?.name ?? "Underwriting Desk";
    const timestampISO = new Date().toISOString();
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== selected.id) return s;
        return {
          ...s,
          activity: [
            ...s.activity,
            {
              id: uid("ev"),
              kind: "Comentario agregado",
              user,
              timestampISO,
            },
          ],
          notes: [
            ...s.notes,
            {
              id: uid("note"),
              user,
              timestampISO,
              body: trimmed,
            },
          ],
        };
      })
    );
    pushToast("Nota agregada", "Trazabilidad actualizada (mock).");
  }

  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    setNoteDraft("");
  }, [selectedId]);

  const selectedAssignedName = selected ? underwritersById[selected.assignedUnderwriterId]?.name ?? "" : "";

  const selectedRemainingSlaMs = selected ? remainingSlaMs(selected, nowMs) : 0;
  const selectedSlaRemainingLabel = selected ? msToCompactDuration(selectedRemainingSlaMs) : "";
  const selectedSlaRisk = selected ? selectedRemainingSlaMs <= 60 * 60 * 1000 : false;

  function openAssignModalDialog() {
    if (!selected) return;
    setAssignDraftId(selected.assignedUnderwriterId);
    setOpenAssignModal(true);
  }

  function applyAssign() {
    if (!selected) return;
    const nextId = assignDraftId || selected.assignedUnderwriterId;
    const newTimestampISO = new Date().toISOString();
    const fromName = underwritersById[selected.assignedUnderwriterId]?.name ?? "Underwriting Desk";
    const toName = underwritersById[nextId]?.name ?? fromName;

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== selected.id) return s;
        return {
          ...s,
          assignedUnderwriterId: nextId,
          activity: [
            ...s.activity,
            {
              id: uid("ev"),
              kind: "Asignado a underwriter",
              user: "Underwriting Desk",
              timestampISO: newTimestampISO,
            },
          ],
          notes: [
            ...s.notes,
            {
              id: uid("note"),
              user: toName,
              timestampISO: newTimestampISO,
              body: `Reasignado desde ${fromName} a ${toName} (mock).`,
            },
          ],
        };
      })
    );

    setOpenAssignModal(false);
    setCaseHighlightToken((t) => t + 1);
    pushToast("Asignación actualizada", `${fromName} -> ${toName}`);
  }

  const quickLineOptions: Array<Line | "Todas"> = ["Todas", "Marine Cargo", "Construction", "Aviation", "Property"];
  const quickStatusOptions: Array<SubmissionStatus | "Todas"> = [
    "Todas",
    "Nuevo",
    "En revisión",
    "Pendiente información",
    "Recomendado",
  ];
  const quickPriorityOptions: Array<Priority | "Todas"> = ["Todas", "Alta", "Media", "Baja"];

  const docsEmpty = selected?.documents.length === 0;
  const activityEmpty = selected?.activity.length === 0;
  const notesEmpty = selected?.notes.length === 0;

  const docById = (docId: string) => selected?.documents.find((d) => d.id === docId) ?? null;
  const openDoc = openDocModal ? docById(openDocModal.docId) : null;

  if (isLoading) {
    return (
      <div ref={rootRef} className="min-h-screen bg-[#F7F2EC]">
        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div>
                <Skeleton className="h-4 w-40 rounded-lg" />
                <Skeleton className="mt-2 h-3 w-64 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr_360px]">
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-white/70 p-4">
                    <Skeleton className="h-4 w-48 rounded-lg" />
                    <div className="mt-3 flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                    <Skeleton className="mt-3 h-3 w-64 rounded-lg" />
                    <Skeleton className="mt-2 h-3 w-40 rounded-lg" />
                  </div>
                ))}
              </div>
            </aside>

            <main className="space-y-4">
              <div className="relative rounded-2xl border border-border bg-white/70 p-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-intelligence/10 to-accent/10 animate-pulse" />
                <div className="relative">
                  <Skeleton className="h-3.5 w-52 rounded-lg" />
                  <Skeleton className="mt-2 h-7 w-72 rounded-lg" />
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-28 rounded-xl" />
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <Skeleton className="h-4 w-40 rounded-lg" />
                <Skeleton className="mt-2 h-3 w-72 rounded-lg" />
                <Skeleton className="mt-4 h-24 w-full rounded-xl" />
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <Skeleton className="h-4 w-36 rounded-lg" />
                <Skeleton className="mt-2 h-3 w-60 rounded-lg" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <Skeleton className="h-4 w-36 rounded-lg" />
                <Skeleton className="mt-2 h-3 w-52 rounded-lg" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              </div>
            </main>

            <section className="space-y-4">
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <Skeleton className="h-4 w-40 rounded-lg" />
                <div className="mt-3 space-y-3">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <Skeleton className="h-4 w-36 rounded-lg" />
                <Skeleton className="mt-3 h-24 w-full rounded-xl" />
              </div>
              <div className="rounded-2xl border border-border bg-white/70 p-4">
                <Skeleton className="h-4 w-36 rounded-lg" />
                <Skeleton className="mt-3 h-28 w-full rounded-xl" />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <EmptyState
        icon={<Users className="h-5 w-5" />}
        title="No hay submissions"
        description="Actualizá la bandeja o ajustá los filtros."
      />
    );
  }

  const stTone = statusTone(selected.status);

  const finalDecision = selected.finalDecision ?? null;

  const activeCases = visibleSubmissions.length;
  const unassignedCount = visibleSubmissions.filter(
    (s) => !s.assignedUnderwriterId || !underwritersById[s.assignedUnderwriterId]
  ).length;
  const inReviewCount = visibleSubmissions.filter((s) => s.status === "En revisión").length;
  const readyForDecisionCount = visibleSubmissions.filter((s) => s.status === "Recomendado").length;
  const slaRiskCount = visibleSubmissions.filter((s) => remainingSlaMs(s, nowMs) <= 60 * 60 * 1000).length;

  const missingDataCount =
    (selected.missingDataFlags.hasLossRuns ? 0 : 1) +
    (selected.missingDataFlags.hasHistorySiniestros ? 0 : 1) +
    (selected.missingDataFlags.hasRegionalExposure ? 0 : 1);

  const missingDataLabels: string[] = [];
  if (!selected.missingDataFlags.hasLossRuns) missingDataLabels.push("loss runs");
  if (!selected.missingDataFlags.hasHistorySiniestros) missingDataLabels.push("historial de siniestros");
  if (!selected.missingDataFlags.hasRegionalExposure) missingDataLabels.push("exposición regional");

  const missingDataSummary =
    missingDataLabels.length > 0
      ? `Faltan: ${missingDataLabels.join(", ")}`
      : "Evidencia suficiente para decidir";

  const isArcticCase = selected.insuredName.toLowerCase().includes("arctic drilling group colombia");

  const riskLevel: "Bajo" | "Medio" | "Alto" =
    selected.appetite === "Fuera de apetito"
      ? "Alto"
      : selected.appetite === "Revisar"
        ? missingDataCount >= 2 || selected.capacityUtilizationPct > 80
          ? "Alto"
          : "Medio"
        : missingDataCount >= 2 || selected.capacityUtilizationPct > 85
          ? "Medio"
          : "Bajo";

  const effectiveRiskLevel: "Bajo" | "Medio" | "Alto" = isArcticCase ? "Bajo" : riskLevel;
  const effectivePriority: Priority = isArcticCase ? "Alta" : selected.priority;
  const modelConfidencePct = isArcticCase ? 95 : 60;

  const recTone: "good" | "warn" | "risk" =
    effectiveRiskLevel === "Bajo" ? "good" : effectiveRiskLevel === "Medio" ? "warn" : "risk";

  const recToneStyles =
    recTone === "good"
      ? { border: "border-positive/25", bg: "bg-positive/10", text: "text-positive", bar: "bg-positive" }
      : recTone === "warn"
        ? { border: "border-accent/25", bg: "bg-accent/10", text: "text-accent", bar: "bg-accent" }
        : { border: "border-risk/25", bg: "bg-risk/10", text: "text-risk", bar: "bg-risk" };

  const recommendationAction =
    selected.appetite === "En apetito"
      ? "Participar"
      : selected.appetite === "Revisar"
        ? "Validar y participar"
        : "Evitar / pedir info";

  const recommendationExplanation =
    selected.appetite === "En apetito"
      ? "Alineado con el apetito. Requiere validación de siniestralidad regional y consistencia de límites antes de emitir."
      : selected.appetite === "Revisar"
        ? "Dentro de la zona de revisión. Completar loss runs y revisar agregación reduce incertidumbre y mejora consistencia."
        : "Fuera de apetito. Sin evidencia robusta aumenta el riesgo de cola; avanzar solo con datos completos.";

  const workflowStepIdx = activeTab === "Resumen" ? 0 : activeTab === "Decisión" ? 2 : 1;

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F7F2EC]">
      <div className="mx-auto max-w-[1600px] px-4 pt-2 md:px-6 md:pt-3">
        <div className="rounded-2xl border border-border/65 bg-[#DAD7D2]/65 p-3 shadow-soft backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative flex-1 min-w-[360px]">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-secondary" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por asegurado, broker o ID"
                  className="w-full rounded-full border border-border bg-white/80 py-2.5 pl-11 pr-4 text-sm text-primary outline-none ring-accent focus:ring-2"
                />
              </div>

              <div className="hidden md:flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap">
                <div className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/60 px-3 py-2 transition-colors hover:border-border/80">
                  <span className="text-xs font-semibold text-secondary">Línea</span>
                  <select
                    value={filterQuickLine}
                    onChange={(e) => setFilterQuickLine(e.target.value as any)}
                    aria-label="Filtro Línea"
                    className="appearance-none bg-transparent pr-5 text-xs font-semibold text-primary outline-none cursor-pointer focus:ring-0"
                  >
                    {quickLineOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "Todas" ? "Todos" : opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-secondary" />
                  {filterQuickLine !== "Todas" ? (
                    <button
                      type="button"
                      aria-label="Reset Línea"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFilterQuickLine("Todas");
                      }}
                      className="text-secondary hover:text-primary text-sm leading-none"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <div className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/60 px-3 py-2 transition-colors hover:border-border/80">
                  <span className="text-xs font-semibold text-secondary">Estado</span>
                  <select
                    value={filterQuickStatus}
                    onChange={(e) => setFilterQuickStatus(e.target.value as any)}
                    aria-label="Filtro Estado"
                    className="appearance-none bg-transparent pr-5 text-xs font-semibold text-primary outline-none cursor-pointer focus:ring-0"
                  >
                    {quickStatusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "Todas" ? "Todos" : opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-secondary" />
                  {filterQuickStatus !== "Todas" ? (
                    <button
                      type="button"
                      aria-label="Reset Estado"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFilterQuickStatus("Todas");
                      }}
                      className="text-secondary hover:text-primary text-sm leading-none"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <div className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/60 px-3 py-2 transition-colors hover:border-border/80">
                  <span className="text-xs font-semibold text-secondary">Prioridad</span>
                  <select
                    value={filterQuickPriority}
                    onChange={(e) => setFilterQuickPriority(e.target.value as any)}
                    aria-label="Filtro Prioridad"
                    className="appearance-none bg-transparent pr-5 text-xs font-semibold text-primary outline-none cursor-pointer focus:ring-0"
                  >
                    {quickPriorityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "Todas" ? "Todos" : opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-secondary" />
                  {filterQuickPriority !== "Todas" ? (
                    <button
                      type="button"
                      aria-label="Reset Prioridad"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFilterQuickPriority("Todas");
                      }}
                      className="text-secondary hover:text-primary text-sm leading-none"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <div className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/60 px-3 py-2 transition-colors hover:border-border/80">
                  <span className="text-xs font-semibold text-secondary">Broker</span>
                  <select
                    value={filterBroker}
                    onChange={(e) => setFilterBroker(e.target.value)}
                    aria-label="Filtro Broker"
                    className="appearance-none bg-transparent pr-5 text-xs font-semibold text-primary outline-none cursor-pointer focus:ring-0"
                  >
                    <option value="Todos">Todos</option>
                    {allBrokerOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-secondary" />
                  {filterBroker !== "Todos" ? (
                    <button
                      type="button"
                      aria-label="Reset Broker"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFilterBroker("Todos");
                      }}
                      className="text-secondary hover:text-primary text-sm leading-none"
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <div className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/60 px-3 py-2 transition-colors hover:border-border/80">
                  <span className="text-xs font-semibold text-secondary">Asignado</span>
                  <select
                    value={filterAssigned}
                    onChange={(e) => setFilterAssigned(e.target.value)}
                    aria-label="Filtro Asignado"
                    className="appearance-none bg-transparent pr-5 text-xs font-semibold text-primary outline-none cursor-pointer focus:ring-0"
                  >
                    <option value="Todos">Todos</option>
                    {allAssignedOptions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none h-3.5 w-3.5 text-secondary" />
                  {filterAssigned !== "Todos" ? (
                    <button
                      type="button"
                      aria-label="Reset Asignado"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFilterAssigned("Todos");
                      }}
                      className="text-secondary hover:text-primary text-sm leading-none"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden xl:block">
                <button
                  type="button"
                  onClick={onRefreshTray}
                  disabled={isRefreshing}
                  className="inline-flex items-center justify-center rounded-full border border-border/60 bg-white/60 px-3 py-1.5 text-sm font-semibold text-secondary shadow-none transition-all hover:bg-white hover:text-primary active:scale-[0.99] disabled:opacity-60"
                >
                  <RefreshCw className="mr-2 h-4.5 w-4.5 text-secondary" />
                  {isRefreshing ? "Actualizando..." : "Actualizar"}
                </button>
              </div>

              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={onRefreshTray}
                  disabled={isRefreshing}
                  className="inline-flex items-center justify-center rounded-full border border-border/60 bg-white/60 px-3 py-1.5 text-sm font-semibold text-secondary shadow-none transition-all hover:bg-white hover:text-primary active:scale-[0.99] disabled:opacity-60"
                >
                  <RefreshCw className="h-4.5 w-4.5 text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
        {toast ? (
          <div className="mb-4 rounded-2xl border border-border bg-white/85 px-4 py-3 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-bold text-primary">{toast.title}</div>
                {toast.detail ? <div className="mt-0.5 text-sm text-secondary">{toast.detail}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="rounded-xl border border-border bg-white px-3 py-1 text-sm font-semibold text-secondary hover:bg-muted"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[280px_1.25fr_340px]">
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-white/55 p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <div className="text-xs font-semibold text-secondary">INBOX</div>
                  <div className="text-lg font-bold text-primary">{activeCases} casos activos</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-secondary" aria-hidden />
                    <span className="text-sm font-semibold text-secondary">Sin asignar</span>
                  </div>
                  <div className="text-sm font-bold text-primary">{unassignedCount}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-accent" aria-hidden />
                    <span className="text-sm font-semibold text-secondary">En revisión</span>
                  </div>
                  <div className="text-sm font-bold text-primary">{inReviewCount}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-positive" aria-hidden />
                    <span className="text-sm font-semibold text-secondary">Listo para decisión</span>
                  </div>
                  <div className="text-sm font-bold text-primary">{readyForDecisionCount}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-risk" aria-hidden />
                    <span className="text-sm font-semibold text-secondary">En riesgo SLA</span>
                  </div>
                  <div className="text-sm font-bold text-primary">{slaRiskCount}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 min-h-0 flex-1 overflow-auto pr-1">
              {visibleSubmissions.length === 0 ? (
                <EmptyState
                  icon={<Filter className="h-5 w-5" />}
                  title="Sin resultados"
                  description="Probá cambiar filtros o buscar por broker/insured."
                />
              ) : null}

              {visibleSubmissions.map((s) => {
                const isSelected = s.id === selected.id;
                const stToneLocal = statusTone(s.status);
                const remaining = remainingSlaMs(s, nowMs);
                const risk = remaining <= 60 * 60 * 1000;
                const assignedName = underwritersById[s.assignedUnderwriterId]?.name ?? "";
                const missingParts: string[] = [];
                if (!s.missingDataFlags.hasLossRuns) missingParts.push("loss runs");
                if (!s.missingDataFlags.hasHistorySiniestros) missingParts.push("siniestralidad");
                if (!s.missingDataFlags.hasRegionalExposure) missingParts.push("exposicion regional");

                const problemLabel =
                  missingParts.length > 0
                    ? missingParts.includes("siniestralidad")
                      ? "Falta siniestralidad"
                      : missingParts.includes("loss runs")
                        ? "Faltan loss runs"
                        : "Falta info clave"
                    : s.status === "Pendiente información"
                      ? "Informacion incompleta"
                      : s.status === "En revisión"
                        ? "En evaluacion tecnica"
                        : "Listo para decision";
                const problemDetail =
                  missingParts.length > 0
                    ? `Pendiente: ${missingParts.join(", ")}`
                    : s.status === "En revisión"
                      ? "Validar limites y consistencia documental."
                      : "Evidencia suficiente para tomar decision.";

                const priorityLabel =
                  s.priority === "Alta" ? "Prioridad alta" : s.priority === "Media" ? "Prioridad media" : "Prioridad baja";
                const appetiteLabel = s.appetite === "Fuera de apetito" ? "No alineado con apetito" : `Apetito: ${s.appetite}`;
                const slaLabel = risk
                  ? !assignedName
                    ? "SLA en riesgo · sin asignacion"
                    : `SLA en riesgo · ${relativeTime(s.receivedAtISO, nowMs)} sin accion`
                  : `SLA estable · ${msToCompactDuration(remaining)} restantes`;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSubmission(s.id)}
                    className={`w-full rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2EC] ${
                      isSelected
                        ? "border-accent/25 bg-white ring-1 ring-accent/25 shadow-soft"
                        : "border-border bg-white/55 hover:bg-white hover:ring-1 hover:ring-accent/20 hover:shadow-soft hover:-translate-y-[1px]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-2.5 w-2.5 rounded-full ${
                              s.priority === "Alta"
                                ? "bg-accent"
                                : s.priority === "Media"
                                  ? "bg-[#B45309]"
                                  : "bg-secondary"
                            }`}
                            aria-hidden
                          />
                          <div className="truncate text-base font-bold text-primary">{s.insuredName}</div>
                        </div>
                        <div className="mt-1 truncate text-xs text-secondary">
                          {s.broker} · {s.line}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <BadgePill
                          toneBorder={stToneLocal.border}
                          toneBg={stToneLocal.bg}
                          toneText={stToneLocal.text}
                        >
                          {problemLabel}
                        </BadgePill>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] font-semibold text-secondary">Prima</div>
                        <div className="mt-1 text-sm font-bold text-primary">{formatMoneyUSD(s.estimatedPremiumUSD)}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-secondary">{priorityLabel}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm font-bold text-primary">
                          <Clock className={`h-4 w-4 ${risk ? "text-risk" : "text-secondary"}`} />
                          {relativeTime(s.receivedAtISO, nowMs)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-border/70 bg-white/75 px-3 py-2">
                      <div className="text-[11px] font-semibold text-secondary">Problema del caso</div>
                      <div className="mt-1 text-xs font-semibold text-primary">{problemDetail}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 text-xs text-secondary">
                      <div className="min-w-0 truncate">{appetiteLabel}</div>
                      <div className="shrink-0">Asignado: {assignedName || "—"}</div>
                    </div>

                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          risk
                            ? "border border-risk/40 bg-risk/15 text-risk"
                            : "border border-border bg-white/60 text-secondary"
                        }`}
                      >
                        <AlertTriangle className={`h-3.5 w-3.5 ${risk ? "text-risk" : "text-secondary"}`} />
                        {slaLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-4">
            <motion.div
              key={`${selected.id}_${caseHighlightToken}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-border/65 bg-[#DAD7D2]/85 p-5 pb-4 shadow-card-lift backdrop-blur-sm"
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-35"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 90% 60% at 20% 0%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 90% 40%, rgba(124,58,237,0.14) 0%, transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-intelligence/25 bg-intelligence/8 px-2 py-0.5 text-[11px] font-semibold text-intelligence">
                        Caso activo
                      </span>
                    </div>
                    <div className="mt-1 text-2xl font-bold tracking-tight text-primary leading-tight">
                      {selected.insuredName}
                    </div>
                    <div className="mt-1 text-sm text-secondary">
                      {selected.broker} · {selected.line}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <div className="px-2 py-1.5 text-center">
                      <div className="text-[10px] font-semibold text-secondary">Prima</div>
                      <div className="mt-1 text-lg font-bold text-primary leading-tight">{formatMoneyUSD(selected.estimatedPremiumUSD)}</div>
                    </div>
                    <div className="px-2 py-1.5 text-center">
                      <div className="text-[10px] font-semibold text-secondary">Efectiva</div>
                      <div className="mt-1 text-sm font-bold text-primary leading-tight">{formatShortDate(selected.effectiveDateISO)}</div>
                    </div>
                  </div>
                </div>

                <SystemRecommendationCard
                  recToneStyles={recToneStyles}
                  riskLevel={effectiveRiskLevel}
                  recommendationAction={recommendationAction}
                  recommendationExplanation={recommendationExplanation}
                  suggestedParticipationPct={selected.suggestedParticipationPct}
                  modelConfidencePct={modelConfidencePct}
                />

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                  <div className="rounded-xl border border-border/60 bg-white/55 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-secondary/80">
                        Estado operativo
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                    <BadgePill toneBorder={stTone.border} toneBg={stTone.bg} toneText={stTone.text}>
                      {selected.status}
                    </BadgePill>
                    {selected.status === "Pendiente información" ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-2 py-0.5 text-[11px] font-semibold text-accent">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Faltan datos
                      </span>
                    ) : null}
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div>
                        <div className="text-[10px] font-semibold text-secondary">Prioridad</div>
                        <div className="mt-0.5 text-sm font-bold text-primary">{effectivePriority}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-secondary">Underwriter</div>
                        <div className="mt-0.5 flex items-center gap-2 text-sm font-bold text-primary">
                          <User className="h-4 w-4 text-secondary" />
                          {selectedAssignedName}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-secondary">SLA restante</div>
                        <div className={`mt-0.5 text-sm font-bold ${selectedSlaRisk ? "text-risk" : "text-primary"}`}>
                          {selectedSlaRemainingLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center md:items-start">
                    <button
                      type="button"
                      onClick={() => onSelectSubmission(selected.id)}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold text-secondary transition-all hover:bg-white hover:text-primary active:scale-[0.99]"
                    >
                      <RefreshCw className="mr-2 h-4.5 w-4.5" />
                      Re-sincronizar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="rounded-2xl border border-border bg-white/60 p-3 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-secondary">Flujo de trabajo</div>
                  <div className="mt-1 text-sm font-bold text-primary">
                    {workflowStepIdx === 0 ? "Comprensión" : workflowStepIdx === 1 ? "Evaluación" : "Decisión"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { n: 1, label: "Comprensión" },
                    { n: 2, label: "Evaluación" },
                    { n: 3, label: "Decisión" },
                  ].map((st, idx) => {
                    const isActive = idx === workflowStepIdx;
                    return (
                      <div key={st.label} className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-2xl border ${
                            isActive
                              ? "border-accent/40 bg-accent/10 text-accent"
                              : "border-border bg-white/70 text-secondary"
                          } text-xs font-bold`}
                        >
                          {st.n}
                        </div>
                        <div className={`text-xs font-semibold ${isActive ? "text-primary" : "text-secondary"}`}>
                          {st.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white/75 p-2 shadow-soft">
              <div className="flex flex-wrap items-center gap-1">
                {(["Resumen", "Documentos", "Actividad", "Decisión"] as TabKey[]).map((t) => (
                  <TabButton key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>
                    {t}
                  </TabButton>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "Resumen" ? (
                <motion.section
                  key={`tab_${activeTab}_${selected.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-border bg-white/75 p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-secondary">Resumen estructurado</div>
                        <div className="mt-1 text-lg font-bold text-primary">Comprensión</div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-semibold text-secondary">
                        {selected.priority} · {APPETITE_ORDER.indexOf(selected.appetite) + 1}/3
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-1.5">
                      <SummaryField label="Broker" value={selected.broker} />
                      <SummaryField label="Asegurado" value={selected.insuredName} />
                      <SummaryField label="Riesgo" value={selected.riskType} />
                      <SummaryField label="Región" value={selected.countryRegion} />
                      <SummaryField label="Límite" value={formatMoneyUSD(selected.limitUSD)} />
                      <SummaryField label="Deducible" value={formatMoneyUSD(selected.deductibleUSD)} />
                      <SummaryField label="Prima" value={formatMoneyUSD(selected.estimatedPremiumUSD)} />
                      <SummaryField
                        label="Fechas"
                        value={`${formatShortDate(selected.dates.bindingStartISO)} · due ${formatShortDate(selected.dates.quoteDueISO)}`}
                      />
                      <SummaryField
                        label="Lead/Follow"
                        value={`${selected.suggestedLeadFollowPct}% follow`}
                      />
                      <SummaryField
                        label="Participación"
                        value={`${selected.suggestedParticipationPct}%`}
                      />
                      <SummaryField label="Asignado" value={selectedAssignedName} />
                    </div>

                    <div className="mt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-secondary">Insights clave</div>
                          <div className="mt-1 text-lg font-bold text-primary">Para decidir</div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-white/35 px-3 py-1 text-[11px] font-semibold text-secondary">
                          <Sparkles className="h-3.5 w-3.5 text-accent" />
                          IA accionable
                        </div>
                      </div>

                      <KeyInsightsList insights={selected.insights} />
                    </div>

                    <AutoSummaryCard executiveSummary={selected.executiveSummary} />
                  </div>
                </motion.section>
              ) : null}

              {activeTab === "Documentos" ? (
                <motion.section
                  key={`tab_${activeTab}_${selected.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-border bg-white/75 p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-secondary">Documentos</div>
                        <div className="mt-1 text-lg font-bold text-primary">Gestor liviano (preview + descarga)</div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                        {selected.documents.length} archivos
                      </span>
                    </div>

                    {docsEmpty ? (
                      <div className="mt-4">
                        <EmptyState
                          icon={<FileText className="h-5 w-5" />}
                          title="Sin documentos"
                          description="Este submission no tiene archivos asociados (mock)."
                        />
                      </div>
                    ) : (
                      <div className="mt-4 grid grid-cols-1 gap-3">
                        {selected.documents.map((d, idx) => {
                          const tone =
                            d.processing === "Extraído"
                              ? { border: "border-positive/25", bg: "bg-positive/10", text: "text-positive" }
                              : d.processing === "Pendiente lectura"
                                ? { border: "border-accent/25", bg: "bg-accent/10", text: "text-accent" }
                                : { border: "border-intelligence/25", bg: "bg-intelligence/10", text: "text-intelligence" };
                          return (
                            <div
                              key={d.id}
                              className={`group rounded-2xl border border-border bg-white/70 p-4 transition-all hover:bg-white`}
                            >
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/50 text-primary">
                                    <FileText className="h-5 w-5 text-secondary" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className="truncate text-sm font-bold text-primary">{d.name}</div>
                                      {idx === 0 ? (
                                        <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
                                          Preview
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="mt-1 text-xs text-secondary">
                                      {d.type} · {d.sizeMB.toFixed(1)} MB · {formatShortDate(d.dateISO)}
                                    </div>
                                    <div className="mt-2">
                                      <BadgePill toneBorder={tone.border} toneBg={tone.bg} toneText={tone.text}>
                                        {d.processing}
                                      </BadgePill>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenDocModal({ docId: d.id });
                                      setDocModalStatus("loading");
                                      window.setTimeout(() => setDocModalStatus("idle"), 450);
                                    }}
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-white/85 px-4 py-2.5 text-sm font-semibold text-primary shadow-soft transition-all hover:bg-white active:scale-[0.99]"
                                  >
                                    <Eye className="mr-2 h-4.5 w-4.5 text-secondary" />
                                    Ver
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => pushToast("Descarga simulada", `${d.name}`)}
                                    className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.99]"
                                  >
                                    <FileDown className="mr-2 h-4.5 w-4.5" />
                                    Descargar
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {openDocModal && openDoc ? (
                      <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpenDocModal(null)}
                      >
                        <motion.div
                          className="w-full max-w-xl rounded-2xl border border-border bg-white p-5 shadow-card-lift"
                          initial={{ y: 10, scale: 0.98 }}
                          animate={{ y: 0, scale: 1 }}
                          exit={{ y: 10, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-xs font-semibold text-secondary">Preview (mock)</div>
                              <div className="mt-1 text-lg font-bold text-primary">{openDoc.name}</div>
                              <div className="mt-1 text-sm text-secondary">
                                {openDoc.type} · {openDoc.sizeMB.toFixed(1)} MB · {formatCompactDate(openDoc.dateISO)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOpenDocModal(null)}
                              className="rounded-2xl border border-border bg-white px-3 py-2 text-sm font-semibold text-secondary hover:bg-muted"
                            >
                              Cerrar
                            </button>
                          </div>

                          <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
                            {docModalStatus === "loading" ? (
                              <div className="space-y-3">
                                <Skeleton className="h-4 w-56 rounded-lg" />
                                <Skeleton className="h-3 w-full rounded-lg" />
                                <Skeleton className="h-3 w-4/6 rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white/70">
                                    <FileText className="h-5 w-5 text-secondary" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-primary">Documento listo</div>
                                    <div className="text-sm text-secondary">Se muestra un preview simulado.</div>
                                  </div>
                                </div>
                                <div className="rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-secondary">
                                  Campos extractables:
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold text-secondary">
                                      Prima
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold text-secondary">
                                      Límites
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold text-secondary">
                                      Siniestralidad
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => pushToast("Descarga simulada", `${openDoc.name}`)}
                              className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.99]"
                            >
                              <FileDown className="mr-2 h-4.5 w-4.5" />
                              Descargar
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpenDocModal(null)}
                              className="inline-flex items-center justify-center rounded-full border border-border bg-white/85 px-4 py-2.5 text-sm font-semibold text-primary shadow-soft transition-all hover:bg-white active:scale-[0.99]"
                            >
                              OK
                              <ArrowRight className="ml-2 h-4.5 w-4.5 text-secondary" />
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.section>
              ) : null}

              {activeTab === "Actividad" ? (
                <motion.section
                  key={`tab_${activeTab}_${selected.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-border bg-white/75 p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-secondary">Actividad</div>
                        <div className="mt-1 text-lg font-bold text-primary">Audit trail operativo</div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                        {selected.activity.length} eventos
                      </span>
                    </div>

                    {activityEmpty ? (
                      <div className="mt-4">
                        <EmptyState
                          icon={<Activity className="h-5 w-5" />}
                          title="Sin actividad"
                          description="Este caso aún no tiene eventos registrados."
                        />
                      </div>
                    ) : (
                      <div className="mt-4 space-y-0">
                        <div className="space-y-3">
                          {[...selected.activity]
                            .sort((a, b) => new Date(a.timestampISO).getTime() - new Date(b.timestampISO).getTime())
                            .map((ev, idx, arr) => {
                              const isLast = idx === arr.length - 1;

                              const iconTone =
                                ev.kind === "Decisión emitida"
                                  ? { border: "border-positive/30", bg: "bg-positive/10", icon: "text-positive", iconEl: <CheckCircle2 className="h-5 w-5" /> }
                                  : ev.kind === "Solicitud de información"
                                    ? { border: "border-accent/30", bg: "bg-accent/10", icon: "text-accent", iconEl: <AlertTriangle className="h-5 w-5" /> }
                                    : { border: "border-border", bg: "bg-white/70", icon: "text-secondary", iconEl: <Clock className="h-5 w-5" /> };

                              return (
                                <div key={ev.id} className="flex items-start gap-3">
                                  <div className="relative mt-1 flex w-10 justify-center">
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${iconTone.border} ${iconTone.bg}`}
                                    >
                                      <div className={iconTone.icon}>{iconTone.iconEl}</div>
                                    </div>
                                    {!isLast ? (
                                      <div className="absolute left-1/2 top-[46px] h-[calc(100%+6px)] w-[2px] -translate-x-1/2 rounded-full bg-border" />
                                    ) : null}
                                  </div>

                                  <div className="flex-1 rounded-2xl border border-border bg-white/70 p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="text-sm font-bold text-primary leading-tight">{ev.kind}</div>
                                        <div className="mt-1 text-sm text-secondary">{ev.user}</div>
                                      </div>
                                      <div className="shrink-0 text-right">
                                        <div className="text-xs font-semibold text-secondary">
                                          {formatCompactDate(ev.timestampISO)} · {formatTime(ev.timestampISO)}
                                        </div>
                                        <div className="mt-1 text-xs text-secondary">{relativeTime(ev.timestampISO, nowMs)}</div>
                                      </div>
                                    </div>

                                    {isLast ? (
                                      <div className="mt-2 text-xs text-secondary">
                                        Última actualización del caso.
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              ) : null}

              {activeTab === "Decisión" ? (
                <motion.section
                  key={`tab_${activeTab}_${selected.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl border border-border bg-white/75 p-4 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-secondary">Decisión</div>
                        <div className="mt-1 text-sm font-bold text-primary">
                          {selected.appetite === "En apetito"
                            ? "Emitir"
                            : selected.appetite === "Revisar"
                              ? "Validar"
                              : "Pedir info"}
                        </div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                        {selected.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-border bg-white/70 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-secondary">Recomendación</div>
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${
                              selected.appetite === "En apetito"
                                ? "border-positive/20 bg-positive/8 text-positive"
                                : selected.appetite === "Revisar"
                                  ? "border-accent/20 bg-accent/8 text-accent"
                                  : "border-risk/20 bg-risk/8 text-risk"
                            }`}
                          >
                            {selected.appetite === "En apetito"
                              ? "Emitir"
                              : selected.appetite === "Revisar"
                                ? "Validar"
                                : "Info"}
                          </span>
                        </div>
                        <div className="mt-1 text-sm font-bold text-primary leading-snug">
                          {selected.appetite === "En apetito"
                            ? "Cotizar"
                            : selected.appetite === "Revisar"
                              ? "Solicitar datos"
                              : "Revisión requerida"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-white/70 p-3">
                        <div className="text-xs font-semibold text-secondary">Capacidad</div>
                        <div className="mt-1 text-[clamp(1rem,2.2vw,1.4rem)] font-bold leading-tight text-primary">
                          {formatMoneyUSD(selected.capacityAvailableUSD)}
                        </div>
                        <div className="mt-0.5 text-xs text-secondary">Uso {selected.capacityUtilizationPct}%</div>
                      </div>

                      <div className="rounded-2xl border border-border bg-white/70 p-3">
                        <div className="text-xs font-semibold text-secondary">Participación</div>
                        <div className="mt-1 text-2xl font-bold text-primary">
                          {selected.suggestedParticipationPct}%
                        </div>
                        <div className="mt-0.5 text-xs text-secondary">Lead {selected.suggestedLeadFollowPct}%</div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-border bg-white/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-secondary">Emitir</div>
                          {finalDecision ? (
                            <div className="mt-1 text-sm font-bold text-primary">{finalDecision}</div>
                          ) : (
                            <div className="mt-1 text-sm font-bold text-primary">Sin emisión</div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                        <DecisionSelectorButton
                          tone="good"
                          active={finalDecision === "Aprobar para cotizar"}
                          title="Aprobar"
                          detail="Emitir quote"
                          onClick={() => setDecisionForSelected("Aprobar para cotizar")}
                        />
                        <DecisionSelectorButton
                          tone="risk"
                          active={finalDecision === "Declinar"}
                          title="Declinar"
                          detail="Cerrar caso"
                          onClick={() => setDecisionForSelected("Declinar")}
                        />
                        <DecisionSelectorButton
                          tone="warn"
                          active={finalDecision === "Solicitar más información"}
                          title="Pedir info"
                          detail="Solicitar datos"
                          onClick={() => setDecisionForSelected("Solicitar más información")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-white/75 p-5 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-secondary">Notas</div>
                        <div className="mt-1 text-lg font-bold text-primary">Audit trail</div>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                        {selected.notes.length} notas
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-border bg-white/70 p-4">
                      <label className="text-xs font-semibold text-secondary" htmlFor="note">
                        Nueva nota
                      </label>
                      <textarea
                        id="note"
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Nota interna: qué falta y qué emitir."
                        className="mt-2 min-h-[92px] w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
                      />
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNoteDraft("");
                            pushToast("Borrador descartado");
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-border bg-white/85 px-4 py-2.5 text-sm font-semibold text-secondary transition-all hover:bg-muted active:scale-[0.99]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddNote(noteDraft)}
                          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.99] disabled:opacity-60"
                          disabled={!noteDraft.trim()}
                        >
                          <PencilLine className="mr-2 h-4.5 w-4.5" />
                          Agregar nota
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {notesEmpty ? (
                        <EmptyState
                          icon={<MessageSquare className="h-5 w-5" />}
                          title="Sin notas"
                          description="Agrega una nota operativa."
                        />
                      ) : (
                        selected.notes
                          .slice()
                          .sort((a, b) => new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime())
                          .map((n) => (
                            <div key={n.id} className="rounded-2xl border border-border bg-white/70 p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-bold text-primary">{n.user}</div>
                                  <div className="mt-1 text-xs text-secondary">
                                    {formatCompactDate(n.timestampISO)} · {formatTime(n.timestampISO)}
                                  </div>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-semibold text-secondary">
                                  Interno
                                </span>
                              </div>
                              <div className="mt-2 max-h-[2.3em] overflow-hidden text-xs text-secondary">{n.body}</div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </motion.section>
              ) : null}
            </AnimatePresence>
          </main>

          <section className="space-y-0">
            <div className="rounded-2xl border border-border bg-white/65 p-4 shadow-soft">
              <div className="p-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-secondary">Decisiones</div>
                  <div className="mt-1 text-lg font-bold text-primary">Acciones sobre este riesgo</div>
                  <div className="mt-2 text-xs text-secondary">
                    Sistema:{" "}
                    <span className={recToneStyles.text}>{recommendationAction}</span> ·{" "}
                    <span className={recToneStyles.text}>{selected.suggestedParticipationPct}%</span> · Riesgo{" "}
                    <span className={recToneStyles.text}>{riskLevel}</span>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                  {selected.id}
                </span>
              </div>

              <DecisionActionsGrid
                selected={selected}
                missingDataCount={missingDataCount}
                missingDataSummary={missingDataSummary}
                onSetDecision={setDecisionForSelected}
                onOpenAssign={openAssignModalDialog}
              />
              </div>

              <div className="mt-4 pt-4 border-t border-border/60 p-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-secondary">Notas internas</div>
                  <div className="mt-1 text-lg font-bold text-primary">Notas del equipo</div>
                </div>
                <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                  {selectedAssignedName}
                </span>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-secondary" htmlFor="right_note">
                  Comentarios internos
                </label>
                <textarea
                  id="right_note"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Escribí una nota accionable: qué falta, qué validaste y la acción siguiente."
                  className="mt-2 min-h-[84px] w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none ring-accent focus:ring-2"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onAddNote(noteDraft)}
                    disabled={!noteDraft.trim()}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.99] disabled:opacity-60"
                  >
                    <MessageSquare className="mr-2 h-4.5 w-4.5" />
                    Agregar nota
                  </button>
                </div>
              </div>

              {notesEmpty ? (
                <div className="mt-4">
                  <EmptyState
                    icon={<MessageSquare className="h-5 w-5" />}
                    title="Sin notas"
                    description="Este caso no tiene notas internas aún."
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-2 max-h-[190px] overflow-auto pr-1">
                  {[...selected.notes]
                    .slice()
                    .sort((a, b) => new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime())
                    .slice(0, 3)
                    .map((n) => (
                      <div key={n.id} className="rounded-2xl border border-border bg-white/70 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-primary">{n.user}</div>
                            <div className="mt-1 text-xs text-secondary">
                              {formatCompactDate(n.timestampISO)} · {formatTime(n.timestampISO)}
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-semibold text-secondary">
                            Interno
                          </span>
                        </div>
                        <div className="mt-2 max-h-[2.8em] overflow-hidden text-sm text-secondary">{n.body}</div>
                      </div>
                    ))}
                </div>
              )}
              </div>

              <div className="mt-4 pt-4 border-t border-border/60 p-0">
                <div className="text-xs font-semibold text-secondary">Estado del proceso</div>
                <div className="mt-1 text-lg font-bold text-primary">Trazabilidad del caso</div>
                <div className="mt-4">
                  <Stepper status={selected.status} />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/60 p-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-secondary">Próximos pasos</div>
                    <div className="mt-1 text-lg font-bold text-primary">Próximos movimientos</div>
                  </div>
                  {selectedSlaRisk ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-risk/45 bg-risk/15 px-3 py-1 text-[11px] font-semibold text-risk">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      SLA en riesgo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
                      <Clock className="h-3.5 w-3.5 text-secondary" />
                      SLA ok
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {selected.nextStepAlerts.length === 0 ? (
                    <EmptyState
                      icon={<AlertTriangle className="h-5 w-5" />}
                      title="Sin alertas"
                      description="Este caso no tiene próximos pasos pendientes (mock)."
                    />
                  ) : (
                    selected.nextStepAlerts.slice(0, 3).map((a) => {
                      const styles = toneToStyles(a.tone);
                      return (
                        <div
                          key={a.id}
                          className={`rounded-2xl border ${styles.border} ${styles.bg} p-3`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <ToneDot tone={a.tone} />
                                <div className="text-sm font-bold text-primary">{a.title}</div>
                              </div>
                              <div className="mt-1 text-sm text-secondary">{a.detail}</div>
                            </div>
                            {a.etaISO ? (
                              <div className="shrink-0 text-right">
                                <div className="text-[11px] font-semibold text-secondary">ETA</div>
                                <div className="mt-1 text-sm font-bold text-primary">
                                  {formatTime(a.etaISO)}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-white/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-secondary">SLA vence en</div>
                      <div className="mt-1 text-sm font-bold text-primary">
                        {selectedSlaRemainingLabel}{" "}
                        <span className={`text-xs font-semibold ${selectedSlaRisk ? "text-risk" : "text-secondary"}`}>
                          {selectedSlaRisk ? "(riesgo)" : "(controlado)"}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/mesa-de-trabajo"
                      className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-secondary hover:bg-muted transition-colors"
                    >
                      Detalle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {openAssignModal ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenAssignModal(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl border border-border bg-white p-5 shadow-card-lift"
              initial={{ y: 10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-secondary">Asignación</div>
                  <div className="mt-1 text-lg font-bold text-primary">Asignar / Reasignar underwriter</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenAssignModal(false)}
                  className="rounded-2xl border border-border bg-white px-3 py-2 text-sm font-semibold text-secondary hover:bg-muted"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {BASE_UNDERWRITERS.map((u) => {
                  const active = u.id === assignDraftId;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setAssignDraftId(u.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-accent/40 bg-accent/10 shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
                          : "border-border bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-primary">{u.name}</div>
                          <div className="mt-1 text-xs text-secondary">Underwriting Desk</div>
                        </div>
                        {active ? (
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        ) : (
                          <div className="h-5 w-5 rounded-xl border border-border bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenAssignModal(false)}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white/85 px-4 py-2.5 text-sm font-semibold text-secondary transition-all hover:bg-muted active:scale-[0.99]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={applyAssign}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-[0.99]"
                >
                  Confirmar
                  <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-h-[64px] rounded-2xl border border-border bg-white/60 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-primary break-words leading-snug">
        {value}
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="py-1">
      <div className="flex items-baseline gap-x-2">
        <span className="text-[11px] font-semibold text-secondary whitespace-nowrap">
          {label}:
        </span>
        <span className="min-w-0 flex-1 text-sm font-bold text-primary leading-snug break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

function DecisionSelectorButton({
  tone,
  active,
  title,
  detail,
  onClick,
}: {
  tone: "good" | "warn" | "risk";
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  const styles = toneToStyles(tone);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2EC] ${
        active
          ? `bg-white/90 ${styles.border} ring-2 ring-accent/15`
          : `border-border bg-white/70 hover:bg-white`
      }`}
      style={{
        borderColor: undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ToneDot tone={tone} />
            <div className="text-sm font-bold text-primary">{title}</div>
          </div>
          <div className="mt-1 text-sm text-secondary">{detail}</div>
        </div>
        {active ? <CheckCircle2 className="h-5 w-5 text-accent" /> : null}
      </div>
      <div className={`mt-3 rounded-xl border ${styles.border} ${styles.bg} px-3 py-2 text-xs font-semibold ${styles.text}`}>
        {tone === "good" ? "Apetito alineado" : tone === "warn" ? "Requiere validación" : "Riesgo controlado"}
      </div>
    </button>
  );
}

function DecisionActionsPanel({
  selected,
  recToneStyles,
  recommendationAction,
  riskLevel,
  missingDataCount,
  missingDataSummary,
  onSetDecision,
  onOpenAssign,
}: {
  selected: Submission;
  recToneStyles: { border: string; bg: string; text: string; bar: string };
  recommendationAction: string;
  riskLevel: "Bajo" | "Medio" | "Alto";
  missingDataCount: number;
  missingDataSummary: string;
  onSetDecision: (decision: FinalDecision) => void;
  onOpenAssign: () => void;
}) {
  const disabledDecision = selected.status === "Cotizado" || selected.status === "Declinado";

  return (
    <div className="rounded-2xl border border-border bg-white/65 p-4 shadow-soft">
      <div className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-secondary">Decisiones</div>
            <div className="mt-1 text-lg font-bold text-primary">Acciones sobre este riesgo</div>
            <div className="mt-2 text-xs text-secondary">
              Sistema: <span className={recToneStyles.text}>{recommendationAction}</span> ·{" "}
              <span className={recToneStyles.text}>{selected.suggestedParticipationPct}%</span> · Riesgo{" "}
              <span className={recToneStyles.text}>{riskLevel}</span>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full border border-border bg-white/60 px-3 py-1 text-[11px] font-semibold text-secondary">
            {selected.id}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <ActionButton
            tone="good"
            label="Participar"
            detail={
              selected.appetite === "En apetito"
                ? `Sugerido: ${selected.suggestedParticipationPct}% del riesgo`
                : `Participación sugerida: ${selected.suggestedParticipationPct}%`
            }
            icon={<CheckCircle2 className="h-4.5 w-4.5" />}
            onClick={() => onSetDecision("Aprobar para cotizar")}
            disabled={disabledDecision}
          />
          <ActionButton
            tone="risk"
            label="Rechazar"
            detail={
              selected.appetite === "Fuera de apetito"
                ? "Fuera de apetito/estrategia. Evitar exposición."
                : "No alineado con apetito/estrategia. Cerrar caso."
            }
            icon={<XCircle className="h-4.5 w-4.5" />}
            onClick={() => onSetDecision("Declinar")}
            disabled={disabledDecision}
          />
          <ActionButton
            tone="warn"
            label="Solicitar info"
            detail={
              missingDataCount > 0
                ? `Bloquea validación final: ${missingDataSummary}`
                : "Revisión adicional por estrategia operativa"
            }
            icon={<AlertTriangle className="h-4.5 w-4.5" />}
            onClick={() => onSetDecision("Solicitar más información")}
            disabled={disabledDecision}
          />
          <ActionButton
            tone="neutral"
            label="Asignar / Reasignar"
            detail="Alinear ownership para optimizar SLA y trazabilidad"
            icon={<Users className="h-4.5 w-4.5" />}
            onClick={onOpenAssign}
          />
        </div>
      </div>
    </div>
  );
}

function DecisionActionsGrid({
  selected,
  missingDataCount,
  missingDataSummary,
  onSetDecision,
  onOpenAssign,
}: {
  selected: Submission;
  missingDataCount: number;
  missingDataSummary: string;
  onSetDecision: (decision: FinalDecision) => void;
  onOpenAssign: () => void;
}) {
  const disabledDecision = selected.status === "Cotizado" || selected.status === "Declinado";

  return (
    <div className="mt-4 grid grid-cols-1 gap-2">
      <ActionButton
        tone="good"
        label="Participar"
        detail={
          selected.appetite === "En apetito"
            ? `Sugerido: ${selected.suggestedParticipationPct}% del riesgo`
            : `Participación sugerida: ${selected.suggestedParticipationPct}%`
        }
        icon={<CheckCircle2 className="h-4.5 w-4.5" />}
        onClick={() => onSetDecision("Aprobar para cotizar")}
        disabled={disabledDecision}
      />
      <ActionButton
        tone="risk"
        label="Rechazar"
        detail={
          selected.appetite === "Fuera de apetito"
            ? "Fuera de apetito/estrategia. Evitar exposición."
            : "No alineado con apetito/estrategia. Cerrar caso."
        }
        icon={<XCircle className="h-4.5 w-4.5" />}
        onClick={() => onSetDecision("Declinar")}
        disabled={disabledDecision}
      />
      <ActionButton
        tone="warn"
        label="Solicitar info"
        detail={
          missingDataCount > 0
            ? `Bloquea validación final: ${missingDataSummary}`
            : "Revisión adicional por estrategia operativa"
        }
        icon={<AlertTriangle className="h-4.5 w-4.5" />}
        onClick={() => onSetDecision("Solicitar más información")}
        disabled={disabledDecision}
      />
      <ActionButton
        tone="neutral"
        label="Asignar / Reasignar"
        detail="Alinear ownership para optimizar SLA y trazabilidad"
        icon={<Users className="h-4.5 w-4.5" />}
        onClick={onOpenAssign}
      />
    </div>
  );
}

function ActionButton({
  tone,
  label,
  detail,
  icon,
  disabled,
  onClick,
}: {
  tone: "good" | "warn" | "risk" | "neutral";
  label: string;
  detail?: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  const styles = toneToStyles(tone);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-center justify-between rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2EC] ${
        disabled
          ? "border-border opacity-60 cursor-not-allowed"
          : `border ${styles.border} bg-white/70 hover:bg-white hover:shadow-soft`
      }`}
    >
      <span className="flex items-start gap-3 min-w-0">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles.border} ${styles.bg}`}
        >
          <span className={`text-sm ${styles.text}`}>{icon}</span>
        </span>
        <span className="min-w-0">
          <span className="text-sm font-bold text-primary">{label}</span>
          {detail ? <span className="mt-1 block text-xs font-semibold text-secondary leading-snug">{detail}</span> : null}
        </span>
      </span>
      <ArrowRight className="h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

