"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { formatIsoDate } from "@/lib/dashboard/overview-date-range";
import {
  DEFAULT_OVERVIEW_FILTERS,
  type LineOfBusinessFilter,
  type OverviewDatePreset,
  type OverviewDecisionStatusFilter,
  type OverviewFilterFocusField,
  type OverviewFilterState,
} from "@/lib/dashboard/overview-filter-types";
import { countActiveOverviewFilters } from "@/lib/dashboard/overview-filter-utils";
import type { DashboardSubmissionRow } from "@/types/dashboard";
import {
  overviewFilterBarClass,
  overviewFilterControlClass,
  overviewFilterDateInputClass,
  overviewFilterLabelClass,
  overviewFilterResetClass,
} from "@/components/dashboard/overview/overview-filter-styles";

const FILTER_DESKTOP_PREFIX = "overview-filter-d";
const FILTER_MOBILE_PREFIX = "overview-filter-m";

export type OverviewFiltersHandle = {
  focusField: (field: OverviewFilterFocusField) => void;
};

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const v of values) {
    const t = (v ?? "").trim();
    if (t) set.add(t);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function datePresetLabel(
  v: OverviewFilterState,
  t: ReturnType<typeof useI18n>["dict"]["dashboard"]["overviewFilters"]
): string {
  switch (v.datePreset) {
    case "last_7d":
      return t.dateLast7d;
    case "last_30d":
      return t.dateLast30d;
    case "this_month":
      return t.dateThisMonth;
    case "last_quarter":
      return t.dateLastQuarter;
    case "custom":
      return v.customFrom && v.customTo
        ? `${v.customFrom} → ${v.customTo}`
        : t.dateCustom;
    default:
      return t.dateLast30d;
  }
}

function lobLabel(
  v: LineOfBusinessFilter,
  t: ReturnType<typeof useI18n>["dict"]["dashboard"]["overviewFilters"]
): string {
  const map: Record<LineOfBusinessFilter, string> = {
    all: t.lobAll,
    aviation: t.lobAviation,
    marine: t.lobMarine,
    property: t.lobProperty,
    construction: t.lobConstruction,
    pvt: t.lobPvt,
    multi_line: t.lobMulti,
  };
  return map[v];
}

function decisionLabel(
  v: OverviewDecisionStatusFilter,
  t: ReturnType<typeof useI18n>["dict"]["dashboard"]["overviewFilters"]
): string {
  const map: Record<OverviewDecisionStatusFilter, string> = {
    all: t.decisionAll,
    review: t.decisionReview,
    decline: t.decisionDecline,
    accept: t.decisionAccept,
    reply_sent: t.decisionReplySent,
  };
  return map[v];
}

type OverviewFiltersProps = {
  value: OverviewFilterState;
  onChange: (next: OverviewFilterState) => void;
  submissions: DashboardSubmissionRow[];
};

export const OverviewFilters = forwardRef<
  OverviewFiltersHandle,
  OverviewFiltersProps
>(function OverviewFilters({ value, onChange, submissions }, ref) {
  const { dict } = useI18n();
  const t = dict.dashboard.overviewFilters;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const brokers = useMemo(
    () => uniqueSorted(submissions.map((r) => r.broker_name)),
    [submissions]
  );
  const countries = useMemo(
    () => uniqueSorted(submissions.map((r) => r.country)),
    [submissions]
  );
  const declineReasons = useMemo(
    () => uniqueSorted(submissions.map((r) => r.decision_reason)),
    [submissions]
  );

  const activeCount = countActiveOverviewFilters(value);

  const patch = (partial: Partial<OverviewFilterState>) => {
    onChange({ ...value, ...partial });
  };

  const reset = () => onChange({ ...DEFAULT_OVERVIEW_FILTERS });

  useImperativeHandle(ref, () => ({
    focusField(field: OverviewFilterFocusField) {
      const ids: Record<OverviewFilterFocusField, string> = {
        date: "-date-preset",
        lob: "-lob",
        country: "-country",
      };
      const focusWithPrefix = (prefix: string) => {
        const bar = document.getElementById("overview-filter-bar");
        bar?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const id = `${prefix}${ids[field]}`;
        const el = document.getElementById(id) as
          | (HTMLElement & { focus?: () => void })
          | null;
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        el?.focus?.();
      };

      const desktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;

      if (desktop) {
        focusWithPrefix(FILTER_DESKTOP_PREFIX);
      } else {
        setDrawerOpen(true);
        window.setTimeout(() => focusWithPrefix(FILTER_MOBILE_PREFIX), 220);
      }
    },
  }));

  const onDatePresetChange = (preset: OverviewDatePreset) => {
    if (preset === "custom") {
      const now = new Date();
      const from = new Date(now);
      from.setDate(from.getDate() - 29);
      onChange({
        ...value,
        datePreset: "custom",
        customFrom: formatIsoDate(from),
        customTo: formatIsoDate(now),
      });
      return;
    }
    onChange({
      ...value,
      datePreset: preset,
      customFrom: null,
      customTo: null,
    });
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const chips: {
    key: string;
    label: string;
    onRemove: () => void;
  }[] = [];

  if (value.datePreset !== DEFAULT_OVERVIEW_FILTERS.datePreset) {
    chips.push({
      key: "date",
      label: `${t.dateRange}: ${datePresetLabel(value, t)}`,
      onRemove: () =>
        patch({
          datePreset: DEFAULT_OVERVIEW_FILTERS.datePreset,
          customFrom: null,
          customTo: null,
        }),
    });
  }
  if (value.lineOfBusiness !== "all") {
    chips.push({
      key: "lob",
      label: `${t.lob}: ${lobLabel(value.lineOfBusiness, t)}`,
      onRemove: () => patch({ lineOfBusiness: "all" }),
    });
  }
  if (value.brokerQuery.trim()) {
    chips.push({
      key: "broker",
      label: `${t.broker}: ${value.brokerQuery.trim()}`,
      onRemove: () => patch({ brokerQuery: "" }),
    });
  }
  if (value.country !== "all") {
    chips.push({
      key: "country",
      label: `${t.country}: ${value.country}`,
      onRemove: () => patch({ country: "all" }),
    });
  }
  if (value.decisionStatus !== "all") {
    chips.push({
      key: "decision",
      label: `${t.decision}: ${decisionLabel(value.decisionStatus, t)}`,
      onRemove: () => patch({ decisionStatus: "all" }),
    });
  }
  if (value.declineReason !== "all") {
    chips.push({
      key: "decline",
      label: `${t.declineReason}: ${value.declineReason}`,
      onRemove: () => patch({ declineReason: "all" }),
    });
  }

  const filterFields = (compact: boolean) => {
    const pre = compact ? FILTER_MOBILE_PREFIX : FILTER_DESKTOP_PREFIX;
    return (
    <div
      className={cn(
        compact ? "space-y-5" : "flex flex-wrap items-center gap-x-2 gap-y-2.5"
      )}
    >
      <div className={cn(!compact && "min-w-[min(100%,11rem)] flex-1")}>
        <label className={overviewFilterLabelClass} htmlFor={`${pre}-date-preset`}>
          {t.dateRange}
        </label>
        <select
          id={`${pre}-date-preset`}
          className={overviewFilterControlClass}
          value={value.datePreset}
          onChange={(e) =>
            onDatePresetChange(e.target.value as OverviewDatePreset)
          }
        >
          <option value="last_7d">{t.dateLast7d}</option>
          <option value="last_30d">{t.dateLast30d}</option>
          <option value="this_month">{t.dateThisMonth}</option>
          <option value="last_quarter">{t.dateLastQuarter}</option>
          <option value="custom">{t.dateCustom}</option>
        </select>
      </div>

      {value.datePreset === "custom" ? (
        <div
          className={cn(
            "flex flex-wrap gap-3",
            !compact && "min-w-[min(100%,16rem)] flex-[1.2]"
          )}
        >
          <div className="min-w-[8.5rem] flex-1">
            <label className={overviewFilterLabelClass} htmlFor={`${pre}-date-from`}>
              {t.dateFrom}
            </label>
            <input
              id={`${pre}-date-from`}
              type="date"
              className={overviewFilterDateInputClass}
              value={value.customFrom ?? ""}
              onChange={(e) =>
                patch({ customFrom: e.target.value || null })
              }
            />
          </div>
          <div className="min-w-[8.5rem] flex-1">
            <label className={overviewFilterLabelClass} htmlFor={`${pre}-date-to`}>
              {t.dateTo}
            </label>
            <input
              id={`${pre}-date-to`}
              type="date"
              className={overviewFilterDateInputClass}
              value={value.customTo ?? ""}
              onChange={(e) => patch({ customTo: e.target.value || null })}
            />
          </div>
        </div>
      ) : null}

      <div className={cn(!compact && "min-w-[min(100%,10rem)] flex-1")}>
        <label className={overviewFilterLabelClass} htmlFor={`${pre}-lob`}>
          {t.lob}
        </label>
        <select
          id={`${pre}-lob`}
          className={overviewFilterControlClass}
          value={value.lineOfBusiness}
          onChange={(e) =>
            patch({ lineOfBusiness: e.target.value as LineOfBusinessFilter })
          }
        >
          <option value="all">{t.lobAll}</option>
          <option value="aviation">{t.lobAviation}</option>
          <option value="marine">{t.lobMarine}</option>
          <option value="property">{t.lobProperty}</option>
          <option value="construction">{t.lobConstruction}</option>
          <option value="pvt">{t.lobPvt}</option>
          <option value="multi_line">{t.lobMulti}</option>
        </select>
      </div>

      <div className={cn(!compact && "min-w-[min(100%,12rem)] flex-[1.2]")}>
        <label className={overviewFilterLabelClass} htmlFor={`${pre}-broker`}>
          {t.broker}
        </label>
        <input
          id={`${pre}-broker`}
          className={overviewFilterControlClass}
          list={`overview-broker-datalist-${pre}`}
          placeholder={t.brokerPlaceholder}
          value={value.brokerQuery}
          onChange={(e) => patch({ brokerQuery: e.target.value })}
          autoComplete="off"
        />
        <datalist id={`overview-broker-datalist-${pre}`}>
          {brokers.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
      </div>

      <div className={cn(!compact && "min-w-[min(100%,9rem)] flex-1")}>
        <label className={overviewFilterLabelClass} htmlFor={`${pre}-country`}>
          {t.country}
        </label>
        <select
          id={`${pre}-country`}
          className={overviewFilterControlClass}
          value={value.country}
          onChange={(e) => patch({ country: e.target.value })}
        >
          <option value="all">{t.countryAll}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={cn(!compact && "min-w-[min(100%,10rem)] flex-1")}>
        <label className={overviewFilterLabelClass} htmlFor={`${pre}-decision`}>
          {t.decision}
        </label>
        <select
          id={`${pre}-decision`}
          className={overviewFilterControlClass}
          value={value.decisionStatus}
          onChange={(e) =>
            patch({
              decisionStatus: e.target
                .value as OverviewDecisionStatusFilter,
            })
          }
        >
          <option value="all">{t.decisionAll}</option>
          <option value="review">{t.decisionReview}</option>
          <option value="decline">{t.decisionDecline}</option>
          <option value="accept">{t.decisionAccept}</option>
          <option value="reply_sent">{t.decisionReplySent}</option>
        </select>
      </div>

      <details
        className={cn(
          "rounded-xl border border-dashed border-border/45 bg-backgroundSecondary/25 p-3",
          !compact &&
            "min-w-[min(100%,12rem)] flex-none [&[open]]:border-border/55 [&[open]]:bg-backgroundSecondary/40"
        )}
      >
        <summary
          className={cn(
            "cursor-pointer list-none text-sm font-semibold text-primary",
            "marker:content-none [&::-webkit-details-marker]:hidden",
            compact && "mb-3"
          )}
        >
          {t.moreFilters}
        </summary>
        <div className={cn("mt-3", compact && "mt-0")}>
          <label
            className={overviewFilterLabelClass}
            htmlFor={`${pre}-decline-reason`}
          >
            {t.declineReason}
          </label>
          <select
            id={`${pre}-decline-reason`}
            className={overviewFilterControlClass}
            value={value.declineReason}
            onChange={(e) => patch({ declineReason: e.target.value })}
          >
            <option value="all">{t.declineReasonAll}</option>
            {declineReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </details>

      {!compact && activeCount > 0 ? (
        <div className="ml-auto flex shrink-0 items-center">
          <button
            type="button"
            onClick={reset}
            className={overviewFilterResetClass}
          >
            {t.reset}
          </button>
        </div>
      ) : null}
    </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Desktop */}
      <div
        id="overview-filter-bar"
        className={cn(overviewFilterBarClass, "hidden md:block")}
        role="region"
        aria-label={t.barAria}
      >
        {filterFields(false)}
      </div>

      {/* Mobile trigger + drawer */}
      <div className="md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border/40 bg-backgroundSecondary/40 px-4 text-sm font-semibold text-primary/95",
              "shadow-none transition-colors hover:border-border/55 hover:bg-backgroundSecondary/60"
            )}
            aria-expanded={drawerOpen}
          >
            <SlidersHorizontal className="h-4 w-4 text-secondary" aria-hidden />
            {t.filtersButton}
            {activeCount > 0 ? (
              <span
                className="min-w-[1.25rem] rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white"
                aria-label={`${activeCount} ${t.filtersActiveAria}`}
              >
                {activeCount}
              </span>
            ) : null}
          </button>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={reset}
              className={cn(overviewFilterResetClass, "h-11")}
            >
              {t.reset}
            </button>
          ) : null}
        </div>

        {drawerOpen ? (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <button
              type="button"
              className="absolute inset-0 bg-primary/25 backdrop-blur-[2px]"
              aria-label={t.close}
              onClick={() => setDrawerOpen(false)}
            />
            <div
              className="relative max-h-[88vh] overflow-y-auto rounded-t-2xl border border-border/40 bg-card/95 px-4 pb-8 pt-5 shadow-lg"
              role="dialog"
              aria-modal="true"
              aria-label={t.filtersButton}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-primary">
                  {t.filtersButton}
                </p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full p-2 text-secondary hover:bg-backgroundSecondary hover:text-primary"
                  aria-label={t.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className={overviewFilterBarClass}>{filterFields(true)}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Active chips */}
      {chips.length > 0 ? (
        <div className="space-y-2.5 pt-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-secondary/70">
            {t.activeFilters}
          </p>
          <ul className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c.key}>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/45 bg-backgroundSecondary/50 py-1 pl-3 pr-1 text-xs font-medium text-primary/95">
                  {c.label}
                  <button
                    type="button"
                    onClick={c.onRemove}
                    className="rounded-full p-1 text-secondary hover:bg-border/40 hover:text-primary"
                    aria-label={t.removeFilterAria}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

OverviewFilters.displayName = "OverviewFilters";
