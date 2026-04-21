"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, Users } from "lucide-react";
import type { ChartLabelValue } from "@/types/dashboard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useI18n } from "@/components/providers/LanguageProvider";
import { translateDataLabel } from "@/lib/dashboard/translate-data-label";

const FALLBACK_COLORS = [
  "#6B7280",
  "#8B5E3C",
  "#64748B",
  "#A16207",
  "#0F766E",
  "#9CA3AF",
];

function decisionColor(label: string): string {
  const k = label.toLowerCase().trim();
  if (k.includes("decline") || k.includes("declin")) return "#B9382F";
  if (k.includes("review") || k.includes("revis")) return "#C98A2B";
  if (k.includes("accept") || k.includes("acept")) return "#2F7A58";
  if (k.includes("reply") || k.includes("respuesta")) return "#5B6473";
  return FALLBACK_COLORS[Math.abs(k.length) % FALLBACK_COLORS.length];
}

type DashboardChartsProps = {
  decisionDistribution: ChartLabelValue[];
  declineReasons: ChartLabelValue[];
  brokerDistribution: ChartLabelValue[];
  previousDecisionDistribution: ChartLabelValue[];
  previousDeclineReasons: ChartLabelValue[];
  previousBrokerDistribution: ChartLabelValue[];
};

type BarLabelPayload = {
  fullName?: string;
};

type BarLabelProps = {
  x?: unknown;
  y?: unknown;
  width?: unknown;
  height?: unknown;
  value?: unknown;
  payload?: BarLabelPayload | null;
};

function ChartCard({
  title,
  description,
  children,
  empty,
  icon: Icon,
  emptyTitle,
  emptyDesc,
}: {
  title: string;
  description: string;
  children: ReactNode;
  empty: boolean;
  icon: typeof PieIcon;
  emptyTitle: string;
  emptyDesc: string;
}) {
  return (
    <div className="flex h-full min-h-[390px] flex-col rounded-xl border border-border bg-card p-5 shadow-soft lg:min-h-[410px]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-secondary">{description}</p>
      </div>
      <div className="min-h-[290px] flex-1 overflow-hidden lg:min-h-[310px]">
        {empty ? (
          <EmptyState
            icon={Icon}
            title={emptyTitle}
            description={emptyDesc}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function DashboardCharts({
  decisionDistribution,
  declineReasons,
  brokerDistribution,
  previousDecisionDistribution,
  previousDeclineReasons,
  previousBrokerDistribution,
}: DashboardChartsProps) {
  const { locale, dict } = useI18n();
  const c = dict.dashboard.charts;
  const loc = locale === "en" ? "en-US" : "es";

  const decisionData = decisionDistribution.map((d) => {
    const label = translateDataLabel(d.label, locale) ?? d.label;
    return { name: label, value: d.value };
  });
  const decisionColorByName = new Map(
    decisionData.map((item) => [item.name, decisionColor(item.name)])
  );
  const collapseToTopWithOther = (
    rows: Array<{ name: string; fullName: string; value: number }>,
    topN = 5
  ) => {
    const sorted = [...rows].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const rest = sorted.slice(topN);
    const restSum = rest.reduce((acc, r) => acc + r.value, 0);
    if (restSum <= 0) return top;
    const otherLabel = locale === "es" ? "Otros" : "Other";
    return [
      ...top,
      { name: otherLabel, fullName: otherLabel, value: restSum },
    ];
  };

  const declineRawData = declineReasons.map((d) => {
    const full = translateDataLabel(d.label, locale) ?? d.label;
    return {
      name: full.length > 28 ? `${full.slice(0, 26)}…` : full,
      fullName: full,
      value: d.value,
    };
  });
  const brokerRawData = brokerDistribution.map((d) => ({
    name: d.label.length > 24 ? `${d.label.slice(0, 22)}…` : d.label,
    fullName: d.label,
    value: d.value,
  }));

  const declineData = collapseToTopWithOther(declineRawData);
  const brokerData = collapseToTopWithOther(brokerRawData);
  const previousDecisionData = previousDecisionDistribution.map((d) => ({
    name: translateDataLabel(d.label, locale) ?? d.label,
    value: d.value,
  }));
  const previousDeclineData = collapseToTopWithOther(
    previousDeclineReasons.map((d) => {
      const full = translateDataLabel(d.label, locale) ?? d.label;
      return {
        name: full.length > 28 ? `${full.slice(0, 26)}…` : full,
        fullName: full,
        value: d.value,
      };
    })
  );
  const previousBrokerData = collapseToTopWithOther(
    previousBrokerDistribution.map((d) => ({
      name: d.label.length > 24 ? `${d.label.slice(0, 22)}…` : d.label,
      fullName: d.label,
      value: d.value,
    }))
  );

  const decisionTotal = decisionData.reduce((acc, row) => acc + row.value, 0);
  const declineTotal = declineData.reduce((acc, row) => acc + row.value, 0);
  const brokerTotal = brokerData.reduce((acc, row) => acc + row.value, 0);

  const topDecision = [...decisionData].sort((a, b) => b.value - a.value)[0];
  const topDecline = [...declineData].sort((a, b) => b.value - a.value)[0];
  const top3BrokerShare =
    brokerTotal > 0
      ? ([...brokerData]
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .reduce((acc, row) => acc + row.value, 0) /
          brokerTotal) *
        100
      : 0;

  const pct = (value: number, total: number) =>
    total > 0 ? (value / total) * 100 : 0;
  const fmtPct = (value: number) => `${Math.round(value)}%`;

  const decisionInsight = topDecision
    ? locale === "es"
      ? `Mix dominado por ${topDecision.name} (${fmtPct(
          pct(topDecision.value, decisionTotal)
        )}).`
      : `Decision mix led by ${topDecision.name} (${fmtPct(
          pct(topDecision.value, decisionTotal)
        )}).`
    : "";
  const declineInsight = topDecline
    ? locale === "es"
      ? `Principal motivo: ${topDecline.fullName} (${fmtPct(
          pct(topDecline.value, declineTotal)
        )}).`
      : `Top decline driver: ${topDecline.fullName} (${fmtPct(
          pct(topDecline.value, declineTotal)
        )}).`
    : "";
  const brokerInsight =
    locale === "es"
      ? `Concentración: top 3 brokers = ${fmtPct(top3BrokerShare)} del volumen.`
      : `Concentration: top 3 brokers = ${fmtPct(top3BrokerShare)} of volume.`;

  const previousDecisionTotal = previousDecisionData.reduce(
    (acc, row) => acc + row.value,
    0
  );
  const previousDeclineTotal = previousDeclineData.reduce(
    (acc, row) => acc + row.value,
    0
  );
  const previousBrokerTotal = previousBrokerData.reduce(
    (acc, row) => acc + row.value,
    0
  );
  const previousTop3BrokerShare =
    previousBrokerTotal > 0
      ? ([...previousBrokerData]
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .reduce((acc, row) => acc + row.value, 0) /
          previousBrokerTotal) *
        100
      : 0;

  const deltaPct = (current: number, previous: number) => {
    if (previous <= 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };
  const deltaSign = (value: number) => (value > 0 ? "+" : "");
  const formatDeltaPct = (current: number, previous: number) => {
    const d = Math.round(deltaPct(current, previous));
    return `${deltaSign(d)}${d}%`;
  };
  const compactDelta = (current: number, previous: number) => {
    const d = Math.round(deltaPct(current, previous));
    if (d > 0) return `↑${d}%`;
    if (d < 0) return `↓${Math.abs(d)}%`;
    return "→0%";
  };
  const trendTone = (value: number): "up" | "down" | "flat" => {
    if (value > 0.5) return "up";
    if (value < -0.5) return "down";
    return "flat";
  };
  const trendClass = (tone: "up" | "down" | "flat") =>
    tone === "up"
      ? "border-emerald-300/60 bg-emerald-50 text-emerald-800"
      : tone === "down"
        ? "border-rose-300/60 bg-rose-50 text-rose-800"
        : "border-slate-300/60 bg-slate-50 text-slate-700";
  const trendArrow = (tone: "up" | "down" | "flat") =>
    tone === "up" ? "↑" : tone === "down" ? "↓" : "→";
  const trendColor = (tone: "up" | "down" | "flat") =>
    tone === "up" ? "#166534" : tone === "down" ? "#BE123C" : "#475569";
  const trendBadgeFill = (tone: "up" | "down" | "flat") =>
    tone === "up" ? "#DCFCE7" : tone === "down" ? "#FFE4E6" : "#E2E8F0";
  const businessClass = (state: "good" | "bad" | "neutral") =>
    state === "good"
      ? "border-emerald-300/60 bg-emerald-50 text-emerald-800"
      : state === "bad"
        ? "border-rose-300/60 bg-rose-50 text-rose-800"
        : "border-slate-300/60 bg-slate-50 text-slate-700";

  const summaryLine = (current: number, previous: number) => {
    const delta = deltaPct(current, previous);
    const tone = trendTone(delta);
    const deltaRounded = Math.round(delta);
    const label =
      locale === "es"
        ? `vs periodo previo: ${deltaSign(deltaRounded)}${deltaRounded}%`
        : `vs previous period: ${deltaSign(deltaRounded)}${deltaRounded}%`;
    return { tone, label };
  };

  const decisionSummary = summaryLine(decisionTotal, previousDecisionTotal);
  const declineSummary = summaryLine(declineTotal, previousDeclineTotal);
  const brokerSummary = summaryLine(brokerTotal, previousBrokerTotal);

  const previousDecisionShare = (name: string) => {
    const row = previousDecisionData.find((item) => item.name === name);
    return pct(row?.value ?? 0, previousDecisionTotal);
  };
  const previousDecisionValue = (name: string) =>
    previousDecisionData.find((item) => item.name === name)?.value ?? 0;
  const previousDeclineValue = (fullName: string) =>
    previousDeclineData.find((item) => item.fullName === fullName)?.value ?? 0;
  const previousBrokerValue = (fullName: string) =>
    previousBrokerData.find((item) => item.fullName === fullName)?.value ?? 0;
  const decisionItemTone = (name: string, current: number) =>
    trendTone(deltaPct(current, previousDecisionValue(name)));

  const createDeltaBarLabelRenderer = (
    getPreviousValue: (fullName: string) => number
  ) => {
    const DeltaBarLabel = ({ x, y, width, height, value, payload }: BarLabelProps) => {
      const xNum = typeof x === "number" ? x : Number(x);
      const yNum = typeof y === "number" ? y : Number(y);
      const widthNum = typeof width === "number" ? width : Number(width);
      const heightNum = typeof height === "number" ? height : Number(height);
      const valueNum = typeof value === "number" ? value : Number(value);

      if (
        !Number.isFinite(xNum) ||
        !Number.isFinite(yNum) ||
        !Number.isFinite(widthNum) ||
        !Number.isFinite(heightNum) ||
        !Number.isFinite(valueNum)
      ) {
        return null;
      }
      const previous = getPreviousValue(payload?.fullName ?? "");
      const tone = trendTone(deltaPct(valueNum, previous));
      const label = `${valueNum.toLocaleString(loc)} (${compactDelta(valueNum, previous)})`;
      const xPos = xNum + widthNum + 8;
      const yPos = yNum + heightNum / 2 + 0.5;
      const badgeWidth = Math.max(64, label.length * 6.2 + 10);

      return (
        <g>
          <rect
            x={xPos - 4}
            y={yPos - 8.5}
            rx={6}
            ry={6}
            width={badgeWidth}
            height={17}
            fill={trendBadgeFill(tone)}
          />
          <text
            x={xPos + 1}
            y={yPos}
            textAnchor="start"
            dominantBaseline="middle"
            fill={trendColor(tone)}
            fontSize={10}
            fontWeight={700}
          >
            {label}
          </text>
        </g>
      );
    };
    DeltaBarLabel.displayName = "DeltaBarLabel";
    return DeltaBarLabel;
  };
  const topDecisionShareDelta = topDecision
    ? pct(topDecision.value, decisionTotal) - previousDecisionShare(topDecision.name)
    : 0;
  const topDecisionShareDeltaLabel =
    locale === "es"
      ? `${deltaSign(Math.round(topDecisionShareDelta))}${Math.round(
          topDecisionShareDelta
        )} pp`
      : `${deltaSign(Math.round(topDecisionShareDelta))}${Math.round(
          topDecisionShareDelta
        )} pp`;

  const isDeclineOrReviewLeader = topDecision
    ? /decline|declin|review|revis/i.test(topDecision.name)
    : false;
  const decisionBusinessState: "good" | "bad" | "neutral" =
    decisionSummary.tone === "flat"
      ? "neutral"
      : isDeclineOrReviewLeader
        ? decisionSummary.tone === "up"
          ? "bad"
          : "good"
        : decisionSummary.tone === "up"
          ? "good"
          : "bad";
  const decisionBusinessLabel =
    locale === "es"
      ? decisionBusinessState === "good"
        ? "Señal: mejora de calidad"
        : decisionBusinessState === "bad"
          ? "Señal: alerta de calidad"
          : "Señal: estable"
      : decisionBusinessState === "good"
        ? "Signal: quality improving"
        : decisionBusinessState === "bad"
          ? "Signal: quality alert"
          : "Signal: stable";

  const declineBusinessState: "good" | "bad" | "neutral" =
    declineSummary.tone === "flat"
      ? "neutral"
      : declineSummary.tone === "up"
        ? "bad"
        : "good";
  const declineBusinessLabel =
    locale === "es"
      ? declineBusinessState === "good"
        ? "Señal: cae la declinación"
        : declineBusinessState === "bad"
          ? "Señal: sube la declinación"
          : "Señal: estable"
      : declineBusinessState === "good"
        ? "Signal: declines down"
        : declineBusinessState === "bad"
          ? "Signal: declines up"
          : "Signal: stable";

  const concentrationDelta = top3BrokerShare - previousTop3BrokerShare;
  const concentrationTone = trendTone(concentrationDelta);
  const brokerBusinessState: "good" | "bad" | "neutral" =
    concentrationTone === "flat"
      ? "neutral"
      : concentrationTone === "up"
        ? "bad"
        : "good";
  const brokerBusinessLabel =
    locale === "es"
      ? brokerBusinessState === "good"
        ? "Señal: menor concentración"
        : brokerBusinessState === "bad"
          ? "Señal: concentración en alza"
          : "Señal: concentración estable"
      : brokerBusinessState === "good"
        ? "Signal: concentration easing"
        : brokerBusinessState === "bad"
          ? "Signal: concentration rising"
          : "Signal: concentration stable";

  return (
    <div className="grid gap-5 lg:grid-cols-3" lang={locale}>
      <ChartCard
        title={c.decisionTitle}
        description={c.decisionDesc}
        empty={decisionData.length === 0}
        icon={PieIcon}
        emptyTitle={c.emptyTitle}
        emptyDesc={c.emptyDesc}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-4 inline-flex items-start gap-2 rounded-lg border border-border/50 bg-backgroundSecondary/35 px-2.5 py-2">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
            <div className="space-y-1">
              <p className="text-[11px] leading-snug text-secondary/95">
                {decisionInsight}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${trendClass(
                    decisionSummary.tone
                  )}`}
                >
                  {trendArrow(decisionSummary.tone)} {decisionSummary.label}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${businessClass(
                    decisionBusinessState
                  )}`}
                >
                  {decisionBusinessLabel}
                </span>
                {topDecision ? (
                  <span className="text-[10px] text-secondary/85">
                    {locale === "es" ? "Share líder:" : "Lead share:"}{" "}
                    {topDecisionShareDeltaLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-rows-[minmax(140px,1fr)_auto] gap-3">
            <div className="min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={2}
                  >
                    {decisionData.map((item, i) => (
                      <Cell
                        key={`${item.name}-${i}`}
                        fill={decisionColorByName.get(item.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, _name, item) => {
                      const current = typeof v === "number" ? v : 0;
                      const point = item?.payload as { name?: string } | undefined;
                      const prev = previousDecisionValue(point?.name ?? "");
                      return [
                        `${current.toLocaleString(loc)} (${formatDeltaPct(
                          current,
                          prev
                        )})`,
                        c.countLabel,
                      ];
                    }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      fontSize: 12,
                      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="space-y-2.5 rounded-lg border border-border/40 bg-backgroundSecondary/20 p-2.5">
              {decisionData
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((item, i) => (
                  <li
                    key={`${item.name}-${i}`}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2 text-primary">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: decisionColorByName.get(item.name),
                        }}
                      />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-primary">
                      {fmtPct(pct(item.value, decisionTotal))} ({item.value.toLocaleString(loc)}){" "}
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color: trendColor(decisionItemTone(item.name, item.value)),
                        }}
                      >
                        {formatDeltaPct(item.value, previousDecisionValue(item.name))}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title={c.declineTitle}
        description={c.declineDesc}
        empty={declineData.length === 0}
        icon={BarChart3}
        emptyTitle={c.emptyTitle}
        emptyDesc={c.emptyDesc}
      >
        <div className="mb-3 inline-flex items-start gap-2 rounded-lg border border-border/50 bg-backgroundSecondary/35 px-2.5 py-2">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          <div className="space-y-1">
            <p className="text-[11px] leading-snug text-secondary/95">
              {declineInsight}
            </p>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${trendClass(
                declineSummary.tone
              )}`}
            >
              {trendArrow(declineSummary.tone)} {declineSummary.label}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${businessClass(
                declineBusinessState
              )}`}
            >
              {declineBusinessLabel}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%" minHeight={220}>
          <BarChart
            data={declineData}
            layout="vertical"
            margin={{ top: 2, right: 84, left: 16, bottom: 2 }}
          >
            <CartesianGrid strokeDasharray="2 4" stroke="#d6dce8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#475569" }} stroke="#94a3b8" />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tick={{ fontSize: 10, fill: "#334155" }}
              stroke="#94a3b8"
            />
            <Tooltip
              formatter={(v, _name, item) => {
                const current = typeof v === "number" ? v : 0;
                const point = item?.payload as { fullName?: string } | undefined;
                const prev = previousDeclineValue(point?.fullName ?? "");
                return [
                  `${current.toLocaleString(loc)} (${formatDeltaPct(current, prev)})`,
                  c.countLabel,
                ];
              }}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as { fullName?: string };
                return p?.fullName ?? "";
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontSize: 12,
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#8B5E3C">
              <LabelList
                dataKey="value"
                position="insideRight"
                  content={createDeltaBarLabelRenderer(previousDeclineValue)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={c.brokerTitle}
        description={c.brokerDesc}
        empty={brokerData.length === 0}
        icon={Users}
        emptyTitle={c.emptyTitle}
        emptyDesc={c.emptyDesc}
      >
        <div className="mb-3 inline-flex items-start gap-2 rounded-lg border border-border/50 bg-backgroundSecondary/35 px-2.5 py-2">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          <div className="space-y-1">
            <p className="text-[11px] leading-snug text-secondary/95">
              {brokerInsight}
            </p>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${trendClass(
                brokerSummary.tone
              )}`}
            >
              {trendArrow(brokerSummary.tone)} {brokerSummary.label}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${businessClass(
                brokerBusinessState
              )}`}
            >
              {brokerBusinessLabel}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%" minHeight={220}>
          <BarChart
            data={brokerData}
            layout="vertical"
            margin={{ top: 2, right: 84, left: 16, bottom: 2 }}
          >
            <CartesianGrid strokeDasharray="2 4" stroke="#d6dce8" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#475569" }}
              stroke="#94a3b8"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={102}
              tick={{ fontSize: 10, fill: "#334155" }}
              stroke="#94a3b8"
            />
            <Tooltip
              formatter={(v, _name, item) => {
                const current = typeof v === "number" ? v : 0;
                const point = item?.payload as { fullName?: string } | undefined;
                const prev = previousBrokerValue(point?.fullName ?? "");
                return [
                  `${current.toLocaleString(loc)} (${formatDeltaPct(current, prev)})`,
                  c.countLabel,
                ];
              }}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as { fullName?: string };
                return p?.fullName ?? "";
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontSize: 12,
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#5B6473">
              <LabelList
                dataKey="value"
                position="insideRight"
                  content={createDeltaBarLabelRenderer(previousBrokerValue)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
