"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";
import {
  OverviewContextChips,
  OverviewFilters,
  type OverviewFiltersHandle,
  OverviewInsight,
  OverviewKpiSection,
} from "@/components/dashboard/overview";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { UnderwritingWorkbench } from "@/components/dashboard/UnderwritingWorkbench";
import {
  aggregateBrokerDistribution,
  aggregateDeclineReasons,
  aggregateDecisionDistribution,
  computeKpisFromSubmissions,
} from "@/lib/dashboard/aggregate-overview";
import {
  applyOverviewFilters,
  applyOverviewFiltersInDateRange,
} from "@/lib/dashboard/apply-overview-filters";
import { buildOverviewInsight } from "@/lib/dashboard/overview-insight";
import {
  getPriorPeriodRange,
  resolveOverviewDateRange,
} from "@/lib/dashboard/overview-date-range";
import {
  DEFAULT_OVERVIEW_FILTERS,
  type OverviewFilterState,
} from "@/lib/dashboard/overview-filter-types";
import type { DashboardData } from "@/lib/dashboard/fetch-dashboard";
import {
  parseDashboardViewParam,
  type DashboardViewMode,
} from "@/lib/dashboard-view-mode";
import { overviewMetricsSurface } from "@/components/dashboard/overview/overview-visual";

function DashboardViewSkeleton() {
  return (
    <div className="min-h-screen bg-backgroundSecondary/60">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 h-20 animate-pulse rounded-xl bg-muted/80" />
        <div className="mb-5 h-12 animate-pulse rounded-xl bg-muted/65" />
        <div className="mb-5 h-24 animate-pulse rounded-xl bg-muted/55" />
        <div className="h-72 animate-pulse rounded-xl bg-muted/45" />
      </div>
    </div>
  );
}

function DashboardViewInner({
  data,
  initialView,
}: {
  data: DashboardData;
  initialView: DashboardViewMode;
}) {
  const { dict, locale } = useI18n();
  const d = dict.dashboard;
  const { common } = dict;
  const { queryErrors } = data;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const param = searchParams.get("view");
  const view =
    param === null ? initialView : parseDashboardViewParam(param);

  const setView = useCallback(
    (next: DashboardViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const [overviewFilters, setOverviewFilters] = useState<OverviewFilterState>(
    () => ({ ...DEFAULT_OVERVIEW_FILTERS })
  );
  const overviewFiltersRef = useRef<OverviewFiltersHandle>(null);

  const filteredSubmissions = useMemo(
    () => applyOverviewFilters(data.submissions, overviewFilters),
    [data.submissions, overviewFilters]
  );

  const kpisDisplay = useMemo(
    () => computeKpisFromSubmissions(filteredSubmissions),
    [filteredSubmissions]
  );

  const chartDecision = useMemo(
    () => aggregateDecisionDistribution(filteredSubmissions),
    [filteredSubmissions]
  );
  const chartDecline = useMemo(
    () => aggregateDeclineReasons(filteredSubmissions),
    [filteredSubmissions]
  );
  const chartBroker = useMemo(
    () => aggregateBrokerDistribution(filteredSubmissions),
    [filteredSubmissions]
  );

  const currentDateRange = useMemo(
    () =>
      resolveOverviewDateRange(
        overviewFilters.datePreset,
        overviewFilters.customFrom,
        overviewFilters.customTo
      ),
    [
      overviewFilters.datePreset,
      overviewFilters.customFrom,
      overviewFilters.customTo,
    ]
  );

  const priorDateRange = useMemo(
    () => (currentDateRange ? getPriorPeriodRange(currentDateRange) : null),
    [currentDateRange]
  );

  const previousSubmissions = useMemo(() => {
    if (!priorDateRange) return [];
    return applyOverviewFiltersInDateRange(
      data.submissions,
      overviewFilters,
      priorDateRange
    );
  }, [data.submissions, overviewFilters, priorDateRange]);

  const previousKpis = useMemo(
    () => computeKpisFromSubmissions(previousSubmissions),
    [previousSubmissions]
  );
  const previousChartDecision = useMemo(
    () => aggregateDecisionDistribution(previousSubmissions),
    [previousSubmissions]
  );
  const previousChartDecline = useMemo(
    () => aggregateDeclineReasons(previousSubmissions),
    [previousSubmissions]
  );
  const previousChartBroker = useMemo(
    () => aggregateBrokerDistribution(previousSubmissions),
    [previousSubmissions]
  );

  const ov = d.overview;

  const insightText = useMemo(
    () =>
      buildOverviewInsight(
        kpisDisplay,
        chartDecline,
        ov.insightCopy,
        locale === "es" ? "es-ES" : "en-US"
      ),
    [kpisDisplay, chartDecline, locale, ov.insightCopy]
  );

  const segmentOptions = useMemo(
    () =>
      [
        { value: "overview" as const, label: d.views.overview },
        { value: "operations" as const, label: d.views.operations },
      ] as const,
    [d.views.overview, d.views.operations]
  );

  const pageSubtitle =
    view === "operations" ? d.views.operationsSubtitle : d.views.overviewSubtitle;

  return (
    <div className="min-h-screen bg-[#F7F2EC]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 border-b border-border/60 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary/75">
            {d.brand}
          </p>
          <div className="mt-1.5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {view === "overview" ? (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-[1.65rem]">
                    {ov.pageTitle}
                  </h1>
                  <p className="mt-1 max-w-2xl text-[13px] leading-snug text-secondary/88">
                    {ov.pageSubtitle}
                  </p>
                  <OverviewContextChips
                    filters={overviewFilters}
                    onOpenFilter={(field) =>
                      overviewFiltersRef.current?.focusField(field)
                    }
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-[1.65rem]">
                    {d.title}
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm leading-snug text-secondary">
                    {pageSubtitle}
                  </p>
                </>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {view === "operations" ? (
                <Button href="/" variant="secondary">
                  {common.backToHome}
                </Button>
              ) : null}
              <SegmentedControl
                ariaLabel={d.views.modeSwitchLabel}
                options={segmentOptions}
                value={view}
                onChange={setView}
                size="compact"
                className="w-auto max-w-none"
              />
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

        {view === "overview" ? (
          <>
            <div className="mb-6">
              <OverviewFilters
                ref={overviewFiltersRef}
                value={overviewFilters}
                onChange={setOverviewFilters}
                submissions={data.submissions}
              />
            </div>

            <section className={cn(overviewMetricsSurface, "mb-8 p-4 sm:p-5")}>
              <div className="mb-5 border-b border-border/30 pb-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary/90">
                  {ov.kpiSectionTitle}
                </h2>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-secondary/75">
                  {ov.kpiSectionDesc}
                </p>
              </div>
              <OverviewKpiSection
                current={kpisDisplay}
                previous={previousKpis}
              />
              <OverviewInsight text={insightText} className="mt-5" />
            </section>

            <section className="space-y-5 border-t border-border/35 pt-8">
              <div className="max-w-2xl">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary/90">
                  {d.sections.chartsTitle}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-secondary/75">
                  {d.sections.chartsDesc}
                </p>
              </div>
              <DashboardCharts
                decisionDistribution={chartDecision}
                declineReasons={chartDecline}
                brokerDistribution={chartBroker}
                previousDecisionDistribution={previousChartDecision}
                previousDeclineReasons={previousChartDecline}
                previousBrokerDistribution={previousChartBroker}
              />
            </section>

            <section className="mt-8 border-t border-border/50 pt-8">
              <SubmissionsTable
                rows={filteredSubmissions}
                subtitle={d.overviewFilters.submissionsTableSubtitle}
              />
            </section>
          </>
        ) : (
          <UnderwritingWorkbench sourceSubmissions={data.submissions} />
        )}
      </div>
    </div>
  );
}

export function DashboardView({
  data,
  initialView = "overview",
}: {
  data: DashboardData;
  initialView?: DashboardViewMode;
}) {
  return (
    <Suspense fallback={<DashboardViewSkeleton />}>
      <DashboardViewInner data={data} initialView={initialView} />
    </Suspense>
  );
}
