"use client";

import { Bell } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardAlertRow } from "@/types/dashboard";
import { formatDateTime } from "@/lib/format";
import { DecisionBadge, ReplySentBadge } from "@/components/dashboard/badges";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { alertTypeAccent } from "@/components/dashboard/alert-styles";

export function AlertsPanel({ rows }: { rows: DashboardAlertRow[] }) {
  const { locale, dict } = useI18n();
  const a = dict.dashboard.alerts;

  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-primary">{a.title}</h2>
          <p className="mt-0.5 text-xs text-secondary">{a.subtitle}</p>
        </div>
        <EmptyState
          icon={Bell}
          title={a.emptyTitle}
          description={a.emptyDesc}
        />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-primary">{a.title}</h2>
        <p className="mt-0.5 text-xs text-secondary">{a.subtitle}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map((row, i) => {
          const tone = alertTypeAccent(row.alert_type);
          return (
            <li
              key={`${row.created_at ?? ""}-${row.insured ?? ""}-${i}`}
              className={`relative overflow-hidden rounded-lg border border-border bg-backgroundSecondary/60 pl-3 ${tone.text}`}
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 ${tone.bar}`}
                aria-hidden
              />
              <div className="grid gap-2 px-3 py-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                    {a.labelType}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-primary">
                    {row.alert_type?.trim() || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                    {a.labelInsuredBroker}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-primary">
                    {row.insured ?? "—"}
                  </p>
                  <p className="text-xs text-secondary">{row.broker_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                    {a.labelLineCountry}
                  </p>
                  <p className="mt-0.5 text-xs text-primary">
                    {row.line_of_business ?? "—"}
                  </p>
                  <p className="text-xs text-secondary">{row.country ?? "—"}</p>
                </div>
                <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-1">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
                      {a.labelDecisionReply}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <DecisionBadge value={row.decision} />
                      <ReplySentBadge value={row.reply_sent} />
                    </div>
                  </div>
                  <p className="ml-auto text-xs tabular-nums text-secondary">
                    {formatDateTime(row.created_at, locale)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
