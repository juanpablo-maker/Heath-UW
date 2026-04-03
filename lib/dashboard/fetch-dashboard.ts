import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  mapBrokerDistribution,
  mapDecisionDistribution,
  mapDeclineReasons,
} from "@/lib/dashboard/map-rows";
import type {
  DashboardAlertRow,
  DashboardKpisRow,
  DashboardSlaRow,
  DashboardSubmissionRow,
  ChartLabelValue,
} from "@/types/dashboard";

export type DashboardQueryError = { view: string; message: string };

export type DashboardData = {
  kpis: DashboardKpisRow | null;
  submissions: DashboardSubmissionRow[];
  decisionDistribution: ChartLabelValue[];
  declineReasons: ChartLabelValue[];
  brokerDistribution: ChartLabelValue[];
  alerts: DashboardAlertRow[];
  sla: DashboardSlaRow[];
  queryErrors: DashboardQueryError[];
};

const VIEWS = {
  kpis: "dashboard_kpis",
  submissions: "dashboard_submissions_table",
  decisionDistribution: "dashboard_decision_distribution",
  declineReasons: "dashboard_decline_reasons",
  brokerDistribution: "dashboard_broker_distribution",
  alerts: "dashboard_alerts",
  sla: "dashboard_sla_table",
} as const;

export async function fetchDashboardData(): Promise<
  | { ok: true; data: DashboardData }
  | { ok: false; reason: "missing_env" }
  | { ok: false; reason: "fatal"; message: string }
> {
  const client = createSupabaseServerClient();
  if (!client) {
    return { ok: false, reason: "missing_env" };
  }

  const queryErrors: DashboardQueryError[] = [];

  const [
    kpisRes,
    submissionsRes,
    decisionRes,
    declineRes,
    brokerRes,
    alertsRes,
    slaRes,
  ] = await Promise.all([
    client.from(VIEWS.kpis).select("*").maybeSingle(),
    client.from(VIEWS.submissions).select("*"),
    client.from(VIEWS.decisionDistribution).select("*"),
    client.from(VIEWS.declineReasons).select("*"),
    client.from(VIEWS.brokerDistribution).select("*"),
    client.from(VIEWS.alerts).select("*"),
    client.from(VIEWS.sla).select("*"),
  ]);

  if (kpisRes.error) {
    queryErrors.push({
      view: VIEWS.kpis,
      message: kpisRes.error.message,
    });
  }
  if (submissionsRes.error) {
    queryErrors.push({
      view: VIEWS.submissions,
      message: submissionsRes.error.message,
    });
  }
  if (decisionRes.error) {
    queryErrors.push({
      view: VIEWS.decisionDistribution,
      message: decisionRes.error.message,
    });
  }
  if (declineRes.error) {
    queryErrors.push({
      view: VIEWS.declineReasons,
      message: declineRes.error.message,
    });
  }
  if (brokerRes.error) {
    queryErrors.push({
      view: VIEWS.brokerDistribution,
      message: brokerRes.error.message,
    });
  }
  if (alertsRes.error) {
    queryErrors.push({ view: VIEWS.alerts, message: alertsRes.error.message });
  }
  if (slaRes.error) {
    queryErrors.push({ view: VIEWS.sla, message: slaRes.error.message });
  }

  const rawDecision = (decisionRes.data ?? []) as Record<string, unknown>[];
  const rawDecline = (declineRes.data ?? []) as Record<string, unknown>[];
  const rawBroker = (brokerRes.data ?? []) as Record<string, unknown>[];

  const data: DashboardData = {
    kpis: (kpisRes.data as DashboardKpisRow | null) ?? null,
    submissions: (submissionsRes.data ?? []) as DashboardSubmissionRow[],
    decisionDistribution: mapDecisionDistribution(rawDecision),
    declineReasons: mapDeclineReasons(rawDecline),
    brokerDistribution: mapBrokerDistribution(rawBroker),
    alerts: (alertsRes.data ?? []) as DashboardAlertRow[],
    sla: (slaRes.data ?? []) as DashboardSlaRow[],
    queryErrors,
  };

  return { ok: true, data };
}
