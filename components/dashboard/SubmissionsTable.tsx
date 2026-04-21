"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardSubmissionRow } from "@/types/dashboard";
import { formatDateTime, formatLimit } from "@/lib/format";
import { translateDataLabel } from "@/lib/dashboard/translate-data-label";
import { DecisionBadge, ReplySentBadge } from "@/components/dashboard/badges";

export function SubmissionsTable({
  rows,
  subtitle: subtitleOverride,
}: {
  rows: DashboardSubmissionRow[];
  /** When set, replaces the default submissions table description (e.g. filtered overview). */
  subtitle?: string;
}) {
  const { locale, dict } = useI18n();
  const s = dict.dashboard.submissions;
  const [selectedRow, setSelectedRow] = useState<DashboardSubmissionRow | null>(null);

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
        <p className="mt-0.5 text-xs text-secondary">
          {subtitleOverride ?? s.subtitle}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-backgroundSecondary">
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
                className="cursor-pointer border-b border-border/80 transition-colors hover:bg-backgroundSecondary"
                onClick={() => setSelectedRow(row)}
              >
                <td className="px-4 py-3 font-medium text-primary">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRow(row);
                    }}
                    className="text-left text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
                  >
                    {row.insured ?? "—"}
                  </button>
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

      {selectedRow ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-primary/30 backdrop-blur-[1px]"
            aria-label="Close submission details"
            onClick={() => setSelectedRow(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Submission details"
            className="relative h-full w-full max-w-[32rem] overflow-y-auto border-l border-border/50 bg-card px-5 py-5 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary/75">
                  Submissions pipeline
                </p>
                <h3 className="mt-1 text-lg font-semibold text-primary">
                  {selectedRow.insured ?? "—"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className="rounded-full p-2 text-secondary transition-colors hover:bg-backgroundSecondary hover:text-primary"
                aria-label="Close submission details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colInsured}</dt>
                <dd className="font-medium text-primary">{selectedRow.insured ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colBroker}</dt>
                <dd className="text-primary">{selectedRow.broker_name ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colLine}</dt>
                <dd className="text-primary">{selectedRow.line_of_business ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colCountry}</dt>
                <dd className="text-primary">{selectedRow.country ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colCurrency}</dt>
                <dd className="text-primary">{selectedRow.currency ?? "—"}</dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colLimit}</dt>
                <dd className="text-primary">
                  {formatLimit(selectedRow.insured_limit_raw, locale)}
                </dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colDecision}</dt>
                <dd>
                  <DecisionBadge value={selectedRow.decision} />
                </dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colReason}</dt>
                <dd className="text-primary">
                  {translateDataLabel(selectedRow.decision_reason, locale) ??
                    selectedRow.decision_reason ??
                    "—"}
                </dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colStatus}</dt>
                <dd className="text-primary">
                  {translateDataLabel(selectedRow.decision_status, locale) ??
                    selectedRow.decision_status ??
                    "—"}
                </dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-border/40 pb-2.5">
                <dt className="text-secondary">{s.colReply}</dt>
                <dd>
                  <ReplySentBadge value={selectedRow.reply_sent} />
                </dd>
              </div>
              <div className="grid grid-cols-[8.5rem_1fr] gap-3 pb-2.5">
                <dt className="text-secondary">{s.colCreated}</dt>
                <dd className="text-primary">
                  {formatDateTime(selectedRow.created_at, locale)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
