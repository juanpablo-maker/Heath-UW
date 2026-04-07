"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { overviewMotion } from "@/components/dashboard/overview/overview-visual";
import type { DashboardKpisRow } from "@/types/dashboard";

function formatInt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-US");
}

type DeltaKind = "neutral" | "positive" | "negative";

function KpiDelta({
  prev,
  curr,
  kind,
  priorLabel,
  newPeriodLabel,
}: {
  prev: number;
  curr: number;
  kind: DeltaKind;
  priorLabel: string;
  newPeriodLabel: string;
}) {
  if (prev === 0 && curr === 0) {
    return (
      <p className="mt-1 text-[10px] tabular-nums leading-tight text-secondary/65">
        — {priorLabel}
      </p>
    );
  }
  if (prev === 0) {
    return (
      <p className="mt-1 text-[10px] leading-tight text-secondary/75">
        {newPeriodLabel}
      </p>
    );
  }
  const raw = ((curr - prev) / prev) * 100;
  const up = raw >= 0;
  const pct = Math.abs(raw).toFixed(0);

  if (kind === "neutral") {
    return (
      <p className="mt-1 text-[10px] tabular-nums leading-tight text-secondary/75">
        {up ? "↑" : "↓"} {pct}% {priorLabel}
      </p>
    );
  }
  if (kind === "positive") {
    const good = up;
    return (
      <p
        className={cn(
          "mt-1 text-[10px] font-medium leading-tight tabular-nums",
          good ? "text-emerald-700/95" : "text-rose-700/90"
        )}
      >
        {up ? "↑" : "↓"} {pct}% {priorLabel}
      </p>
    );
  }
  const good = !up;
  return (
    <p
      className={cn(
        "mt-1 text-[10px] font-medium leading-tight tabular-nums",
        good ? "text-emerald-700/95" : "text-rose-700/90"
      )}
    >
      {up ? "↑" : "↓"} {pct}% {priorLabel}
    </p>
  );
}

const cardBase = cn(
  "group relative min-w-0 overflow-hidden rounded-xl border px-2.5 py-2.5 sm:px-3 sm:py-3",
  overviewMotion,
  "hover:-translate-y-px hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
);

const variants = {
  neutral:
    "border-border/40 bg-card/90 shadow-[0_1px_0_rgba(15,23,42,0.04)] before:bg-slate-400/25",
  review:
    "border-slate-200/65 bg-slate-50/50 before:bg-slate-400/25",
  decline:
    "border-rose-100/75 bg-rose-50/35 before:bg-rose-400/40",
  accept:
    "border-emerald-100/75 bg-emerald-50/35 before:bg-emerald-500/35",
} as const;

type KpiKey = keyof Pick<
  DashboardKpisRow,
  | "total_submissions"
  | "total_in_review"
  | "total_decline"
  | "total_accept"
  | "total_reply_sent"
>;

export function OverviewKpiSection({
  current,
  previous,
}: {
  current: DashboardKpisRow;
  previous: DashboardKpisRow;
}) {
  const { dict } = useI18n();
  const o = dict.dashboard.overview;

  const metrics: {
    key: KpiKey;
    label: string;
    variant: keyof typeof variants;
    delta: DeltaKind;
  }[] = [
    {
      key: "total_submissions",
      label: o.totalSubmissions,
      variant: "neutral",
      delta: "neutral",
    },
    {
      key: "total_in_review",
      label: o.inReview,
      variant: "review",
      delta: "neutral",
    },
    {
      key: "total_decline",
      label: o.decline,
      variant: "decline",
      delta: "negative",
    },
    {
      key: "total_accept",
      label: o.accept,
      variant: "accept",
      delta: "positive",
    },
    {
      key: "total_reply_sent",
      label: o.replySent,
      variant: "neutral",
      delta: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2.5">
      {metrics.map(({ key, label, variant, delta }) => {
        const cur = current[key] ?? 0;
        const prev = previous[key] ?? 0;
        return (
          <div
            key={key}
            className={cn(
              cardBase,
              variants[variant],
              "before:pointer-events-none before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:content-[''] before:opacity-90"
            )}
          >
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-secondary/80">
              {label}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums leading-none tracking-tight text-primary sm:text-[1.35rem]">
              {formatInt(cur as number)}
            </p>
            <KpiDelta
              prev={Number(prev)}
              curr={Number(cur)}
              kind={delta}
              priorLabel={o.priorPeriod}
              newPeriodLabel={o.priorPeriodNew}
            />
          </div>
        );
      })}
    </div>
  );
}
