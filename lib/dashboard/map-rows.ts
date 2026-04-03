import type { ChartLabelValue } from "@/types/dashboard";

function num(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

/**
 * Normaliza filas de `dashboard_decision_distribution` a label + value numérico.
 * Acepta alias habituales de columnas en views agregadas.
 */
export function mapDecisionDistribution(
  rows: Record<string, unknown>[]
): ChartLabelValue[] {
  return rows
    .map((r) => {
      const label = str(
        r.decision ?? r.decision_label ?? r.label ?? r.name ?? r.category
      );
      const value = num(
        r.count ?? r.total ?? r.cnt ?? r.n ?? r.value ?? r.submissions
      );
      return { label: label || "—", value };
    })
    .filter((x) => x.value > 0 || x.label !== "—");
}

/**
 * Normaliza filas de `dashboard_decline_reasons`.
 */
export function mapDeclineReasons(
  rows: Record<string, unknown>[]
): ChartLabelValue[] {
  return rows
    .map((r) => {
      const label = str(
        r.decision_reason ??
          r.reason ??
          r.decline_reason ??
          r.label ??
          r.name
      );
      const value = num(r.count ?? r.total ?? r.cnt ?? r.n ?? r.value);
      return { label: label || "—", value };
    })
    .filter((x) => x.value > 0 || x.label !== "—");
}

/**
 * Normaliza filas de `dashboard_broker_distribution`.
 */
export function mapBrokerDistribution(
  rows: Record<string, unknown>[]
): ChartLabelValue[] {
  return rows
    .map((r) => {
      const label = str(
        r.broker_name ?? r.broker ?? r.name ?? r.label
      );
      const value = num(r.count ?? r.total ?? r.cnt ?? r.n ?? r.submissions);
      return { label: label || "—", value };
    })
    .filter((x) => x.value > 0 || x.label !== "—");
}
