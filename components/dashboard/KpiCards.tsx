"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardKpisRow } from "@/types/dashboard";

/** Subset of KPI fields shown in the dashboard header grid. */
const KPI_KEYS = [
  "total_submissions",
  "total_in_review",
  "total_decline",
  "total_accept",
  "total_reply_sent",
] as const satisfies readonly (keyof DashboardKpisRow)[];

function formatKpi(
  n: number | null | undefined,
  locale: string
): string {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  const loc = locale === "en" ? "en-US" : locale === "zh" ? "zh-CN" : "es";
  return Number(n).toLocaleString(loc);
}

export function KpiCards({ kpis }: { kpis: DashboardKpisRow | null }) {
  const { locale, dict } = useI18n();
  const labels = dict.dashboard.kpi;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {KPI_KEYS.map((key) => {
        const raw = kpis?.[key];
        const label = labels[key];
        return (
          <div
            key={key}
            className="rounded-xl border border-border bg-card px-4 py-4 shadow-soft"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-secondary">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-primary">
              {formatKpi(raw, locale)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
