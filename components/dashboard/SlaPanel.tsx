"use client";

import { Timer } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardSlaRow } from "@/types/dashboard";
import { formatDateTime, formatMinutes } from "@/lib/format";
import { DecisionBadge, ReplySentBadge } from "@/components/dashboard/badges";
import { EmptyState } from "@/components/dashboard/EmptyState";

function ageSeverity(age: number | null | undefined): "high" | "mid" | "ok" {
  if (age === null || age === undefined || Number.isNaN(Number(age))) {
    return "ok";
  }
  const m = Number(age);
  if (m >= 480) return "high";
  if (m >= 120) return "mid";
  return "ok";
}

function rowClass(age: number | null | undefined): string {
  const sev = ageSeverity(age);
  if (sev === "high") {
    return "bg-rose-50/80 ring-1 ring-rose-100/90";
  }
  if (sev === "mid") {
    return "bg-amber-50/70 ring-1 ring-amber-100/90";
  }
  return "bg-backgroundSecondary/40";
}

export function SlaPanel({ rows }: { rows: DashboardSlaRow[] }) {
  const { locale, dict } = useI18n();
  const s = dict.dashboard.sla;
  const minSuf = dict.dashboard.minutesSuffix;

  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-primary">{s.title}</h2>
          <p className="mt-0.5 text-xs text-secondary">{s.subtitleEmpty}</p>
        </div>
        <EmptyState
          icon={Timer}
          title={s.emptyTitle}
          description={s.emptyDesc}
        />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-primary">{s.title}</h2>
          <p className="mt-0.5 text-xs text-secondary">{s.subtitleFull}</p>
        </div>
        <div className="flex gap-3 text-[10px] text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />{" "}
            {s.legendOver2h}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" aria-hidden />{" "}
            {s.legendOver8h}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-backgroundSecondary/90">
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colInsured}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colBroker}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colDecision}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colReply}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colAge}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colReplyTime}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                {s.colCreated}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={`${row.created_at ?? ""}-${row.insured ?? ""}-${i}`}
                className={`border-b border-border/70 transition-colors ${rowClass(row.age_minutes)}`}
              >
                <td className="px-3 py-2.5 font-medium text-primary">
                  {row.insured ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-secondary">
                  {row.broker_name ?? "—"}
                </td>
                <td className="px-3 py-2.5">
                  <DecisionBadge value={row.decision} />
                </td>
                <td className="px-3 py-2.5">
                  <ReplySentBadge value={row.reply_sent} />
                </td>
                <td
                  className={`px-3 py-2.5 tabular-nums font-medium ${
                    ageSeverity(row.age_minutes) === "high"
                      ? "text-rose-800"
                      : ageSeverity(row.age_minutes) === "mid"
                        ? "text-amber-900"
                        : "text-primary"
                  }`}
                >
                  {formatMinutes(row.age_minutes, locale, minSuf)}
                </td>
                <td className="px-3 py-2.5 tabular-nums text-secondary">
                  {formatMinutes(row.reply_time_minutes, locale, minSuf)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-secondary">
                  {formatDateTime(row.created_at, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
