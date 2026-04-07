import {
  isAcceptDecision,
  isDeclineDecision,
  isReviewDecision,
  normalizeDecisionKey,
} from "@/lib/dashboard/decision-normalize";
import type {
  ChartLabelValue,
  DashboardKpisRow,
  DashboardSubmissionRow,
} from "@/types/dashboard";

function groupCount(
  rows: DashboardSubmissionRow[],
  labelOf: (r: DashboardSubmissionRow) => string
): ChartLabelValue[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const label = labelOf(r).trim() || "—";
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .filter((x) => x.value > 0 || x.label !== "—");
}

/**
 * KPIs derived from the filtered submission set (portfolio view).
 */
export function computeKpisFromSubmissions(
  rows: DashboardSubmissionRow[]
): DashboardKpisRow {
  let totalDecline = 0;
  let totalAccept = 0;
  let totalWithoutDecision = 0;
  let totalMissingCountry = 0;

  for (const r of rows) {
    const k = normalizeDecisionKey(r.decision);
    if (!k) totalWithoutDecision += 1;
    if (isDeclineDecision(k)) totalDecline += 1;
    if (isAcceptDecision(k)) totalAccept += 1;
    if (!(r.country ?? "").trim()) totalMissingCountry += 1;
  }

  return {
    total_submissions: rows.length,
    total_in_review: rows.filter((r) =>
      isReviewDecision(normalizeDecisionKey(r.decision))
    ).length,
    total_decline: totalDecline,
    total_refer: null,
    total_accept: totalAccept,
    total_reply_sent: rows.filter((r) => r.reply_sent === true).length,
    total_without_decision: totalWithoutDecision,
    total_missing_country: totalMissingCountry,
  };
}

export function aggregateDecisionDistribution(
  rows: DashboardSubmissionRow[]
): ChartLabelValue[] {
  return groupCount(rows, (r) => (r.decision ?? "").trim() || "—");
}

export function aggregateDeclineReasons(
  rows: DashboardSubmissionRow[]
): ChartLabelValue[] {
  const declines = rows.filter((r) =>
    isDeclineDecision(normalizeDecisionKey(r.decision))
  );
  return groupCount(declines, (r) => (r.decision_reason ?? "").trim() || "—");
}

export function aggregateBrokerDistribution(
  rows: DashboardSubmissionRow[]
): ChartLabelValue[] {
  return groupCount(rows, (r) => (r.broker_name ?? "").trim() || "—");
}
