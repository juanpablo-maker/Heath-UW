"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieIcon, Users } from "lucide-react";
import type { ChartLabelValue } from "@/types/dashboard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useI18n } from "@/components/providers/LanguageProvider";
import { translateDataLabel } from "@/lib/dashboard/translate-data-label";

const PIE_COLORS = [
  "#0f172a",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#f97316",
  "#7c3aed",
  "#10b981",
];

type DashboardChartsProps = {
  decisionDistribution: ChartLabelValue[];
  declineReasons: ChartLabelValue[];
  brokerDistribution: ChartLabelValue[];
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
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <p className="mt-0.5 text-xs text-secondary">{description}</p>
      </div>
      <div className="min-h-[260px] flex-1">
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
}: DashboardChartsProps) {
  const { locale, dict } = useI18n();
  const c = dict.dashboard.charts;
  const loc = locale === "en" ? "en-US" : "es";

  const decisionData = decisionDistribution.map((d) => {
    const label = translateDataLabel(d.label, locale) ?? d.label;
    return { name: label, value: d.value };
  });
  const declineData = declineReasons.map((d) => {
    const full = translateDataLabel(d.label, locale) ?? d.label;
    return {
      name: full.length > 32 ? `${full.slice(0, 30)}…` : full,
      fullName: full,
      value: d.value,
    };
  });
  const brokerData = brokerDistribution.map((d) => ({
    name: d.label.length > 18 ? `${d.label.slice(0, 16)}…` : d.label,
    fullName: d.label,
    value: d.value,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3" lang={locale}>
      <ChartCard
        title={c.decisionTitle}
        description={c.decisionDesc}
        empty={decisionData.length === 0}
        icon={PieIcon}
        emptyTitle={c.emptyTitle}
        emptyDesc={c.emptyDesc}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={260}>
          <PieChart>
            <Pie
              data={decisionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={2}
            >
              {decisionData.map((_, i) => (
                <Cell
                  key={`c-${i}`}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [
                typeof v === "number"
                  ? v.toLocaleString(loc)
                  : String(v ?? "—"),
                c.countLabel,
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-primary">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={c.declineTitle}
        description={c.declineDesc}
        empty={declineData.length === 0}
        icon={BarChart3}
        emptyTitle={c.emptyTitle}
        emptyDesc={c.emptyDesc}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={260}>
          <BarChart
            data={declineData}
            layout="vertical"
            margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
            />
            <Tooltip
              formatter={(v) => [
                typeof v === "number"
                  ? v.toLocaleString(loc)
                  : String(v ?? "—"),
                c.countLabel,
              ]}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as { fullName?: string };
                return p?.fullName ?? "";
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#0f172a" />
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
        <ResponsiveContainer width="100%" height="100%" minHeight={260}>
          <BarChart
            data={brokerData}
            margin={{ top: 8, right: 8, left: 0, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              angle={-28}
              textAnchor="end"
              height={56}
            />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              formatter={(v) => [
                typeof v === "number"
                  ? v.toLocaleString(loc)
                  : String(v ?? "—"),
                c.countLabel,
              ]}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as { fullName?: string };
                return p?.fullName ?? "";
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#475569" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
