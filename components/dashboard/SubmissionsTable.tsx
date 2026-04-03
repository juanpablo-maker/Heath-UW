"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardSubmissionRow } from "@/types/dashboard";
import { formatDateTime, formatLimit } from "@/lib/format";
import { translateDataLabel } from "@/lib/dashboard/translate-data-label";
import { DecisionBadge, ReplySentBadge } from "@/components/dashboard/badges";

export function SubmissionsTable({
  rows,
}: {
  rows: DashboardSubmissionRow[];
}) {
  const { locale, dict } = useI18n();
  const s = dict.dashboard.submissions;

  const columns = useMemo(
    () =>
      [
        { key: "insured" as const, label: s.colInsured, width: "min-w-[140px]" },
        { key: "broker_name" as const, label: s.colBroker, width: "min-w-[120px]" },
        {
          key: "line_of_business" as const,
          label: s.colLine,
          width: "min-w-[100px]",
        },
        { key: "country" as const, label: s.colCountry, width: "min-w-[80px]" },
        { key: "currency" as const, label: s.colCurrency, width: "min-w-[72px]" },
        {
          key: "insured_limit_raw" as const,
          label: s.colLimit,
          width: "min-w-[96px]",
        },
        { key: "decision" as const, label: s.colDecision, width: "min-w-[100px]" },
        { key: "decision_reason" as const, label: s.colReason, width: "min-w-[140px]" },
        {
          key: "decision_status" as const,
          label: s.colStatus,
          width: "min-w-[100px]",
        },
        { key: "reply_sent" as const, label: s.colReply, width: "min-w-[88px]" },
        { key: "created_at" as const, label: s.colCreated, width: "min-w-[160px]" },
      ] as const,
    [s]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-primary">{s.title}</h2>
        <p className="mt-0.5 text-xs text-secondary">{s.subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-backgroundSecondary/90">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-secondary ${col.width}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={`${row.created_at ?? ""}-${row.insured ?? ""}-${i}`}
                className="border-b border-border/80 transition-colors hover:bg-backgroundSecondary/50"
              >
                <td className="px-4 py-3 font-medium text-primary">
                  {row.insured ?? "—"}
                </td>
                <td className="px-4 py-3 text-secondary">{row.broker_name ?? "—"}</td>
                <td className="px-4 py-3 text-secondary">
                  {row.line_of_business ?? "—"}
                </td>
                <td className="px-4 py-3 text-secondary">{row.country ?? "—"}</td>
                <td className="px-4 py-3 tabular-nums text-secondary">
                  {row.currency ?? "—"}
                </td>
                <td className="px-4 py-3 tabular-nums text-primary">
                  {formatLimit(row.insured_limit_raw, locale)}
                </td>
                <td className="px-4 py-3">
                  <DecisionBadge value={row.decision} />
                </td>
                <td
                  className="max-w-[220px] truncate px-4 py-3 text-secondary"
                  title={
                    translateDataLabel(row.decision_reason, locale) ??
                    row.decision_reason ??
                    undefined
                  }
                >
                  {translateDataLabel(row.decision_reason, locale) ??
                    row.decision_reason ??
                    "—"}
                </td>
                <td className="px-4 py-3 text-secondary">
                  {translateDataLabel(row.decision_status, locale) ??
                    row.decision_status ??
                    "—"}
                </td>
                <td className="px-4 py-3">
                  <ReplySentBadge value={row.reply_sent} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-secondary">
                  {formatDateTime(row.created_at, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-secondary">{s.empty}</p>
      ) : null}
    </div>
  );
}
