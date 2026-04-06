"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { mergeKpisForDisplay } from "@/lib/dashboard/merge-kpis-display";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { SlaPanel } from "@/components/dashboard/SlaPanel";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import type { DashboardData } from "@/lib/dashboard/fetch-dashboard";

export function DashboardView({ data }: { data: DashboardData }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const { common } = dict;
  const { queryErrors } = data;

  const kpisDisplay = useMemo(
    () => mergeKpisForDisplay(data.kpis, data.submissions),
    [data.kpis, data.submissions]
  );

  return (
    <div className="min-h-screen bg-backgroundSecondary/60">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-border/80 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
                {d.brand}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-primary md:text-[2rem]">
                {d.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary">
                {d.subtitle}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 pt-1">
              <Button href="/" variant="secondary">
                {common.backToHome}
              </Button>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {queryErrors.length > 0 ? (
          <div
            className="mb-8 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 shadow-soft"
            role="status"
          >
            <p className="font-medium">{d.partialErrorsTitle}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-900/90">
              {queryErrors.map((e) => (
                <li key={e.view}>
                  <span className="font-mono">{e.view}</span>: {e.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className="mb-10 space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-secondary">
              {d.sections.kpisTitle}
            </h2>
            <p className="mt-1 text-sm text-secondary">{d.sections.kpisDesc}</p>
          </div>
          <KpiCards kpis={kpisDisplay} />
        </section>

        <section className="mb-10 space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-secondary">
              {d.sections.chartsTitle}
            </h2>
            <p className="mt-1 text-sm text-secondary">
              {d.sections.chartsDesc}
            </p>
          </div>
          <DashboardCharts
            decisionDistribution={data.decisionDistribution}
            declineReasons={data.declineReasons}
            brokerDistribution={data.brokerDistribution}
          />
        </section>

        <section className="mb-10">
          <SubmissionsTable rows={data.submissions} />
        </section>

        <div className="grid gap-8 lg:grid-cols-1">
          <AlertsPanel rows={data.alerts} />
          <SlaPanel rows={data.sla} />
        </div>
      </div>
    </div>
  );
}
