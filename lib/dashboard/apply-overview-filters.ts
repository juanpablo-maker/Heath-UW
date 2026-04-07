import {
  isAcceptDecision,
  isDeclineDecision,
  isReviewDecision,
  normalizeDecisionKey,
} from "@/lib/dashboard/decision-normalize";
import { resolveOverviewDateRange } from "@/lib/dashboard/overview-date-range";
import type {
  LineOfBusinessFilter,
  OverviewDecisionStatusFilter,
  OverviewFilterState,
} from "@/lib/dashboard/overview-filter-types";
import type { DashboardSubmissionRow } from "@/types/dashboard";

function rowInDateRange(
  row: DashboardSubmissionRow,
  start: Date,
  end: Date
): boolean {
  if (!row.created_at) return false;
  const t = new Date(row.created_at).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function matchesLineOfBusiness(
  row: DashboardSubmissionRow,
  filter: LineOfBusinessFilter
): boolean {
  if (filter === "all") return true;
  const raw = (row.line_of_business ?? "").trim().toLowerCase();
  if (!raw) return false;
  switch (filter) {
    case "aviation":
      return raw.includes("aviat");
    case "marine":
      return raw.includes("marine") || raw.includes("marino");
    case "property":
      return raw.includes("property") || raw.includes("propiedad");
    case "construction":
      return raw.includes("construction") || raw.includes("construcc");
    case "pvt":
      return (
        raw.includes("political") ||
        raw.includes("terrorism") ||
        raw.includes("violence") ||
        raw.includes(" pvt") ||
        raw.startsWith("pvt") ||
        raw.includes("terror")
      );
    case "multi_line":
      return (
        (raw.includes("multi") && raw.includes("line")) ||
        raw.includes("multilinea") ||
        raw.includes("multi-line")
      );
    default:
      return true;
  }
}

function matchesDecisionStatus(
  row: DashboardSubmissionRow,
  filter: OverviewDecisionStatusFilter
): boolean {
  if (filter === "all") return true;
  const key = normalizeDecisionKey(row.decision);
  if (filter === "reply_sent") return row.reply_sent === true;
  if (filter === "review") return isReviewDecision(key);
  if (filter === "decline") return isDeclineDecision(key);
  if (filter === "accept") return isAcceptDecision(key);
  return true;
}

function normalizeReason(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

function matchesNonDateFilters(
  row: DashboardSubmissionRow,
  state: OverviewFilterState
): boolean {
  const q = state.brokerQuery.trim().toLowerCase();
  if (!matchesLineOfBusiness(row, state.lineOfBusiness)) return false;
  if (q && !(row.broker_name ?? "").toLowerCase().includes(q)) {
    return false;
  }
  if (state.country !== "all") {
    const c = (row.country ?? "").trim().toLowerCase();
    if (c !== state.country.trim().toLowerCase()) return false;
  }
  if (!matchesDecisionStatus(row, state.decisionStatus)) return false;
  if (state.declineReason !== "all") {
    if (
      normalizeReason(row.decision_reason) !==
      normalizeReason(state.declineReason)
    ) {
      return false;
    }
  }
  return true;
}

/** Same filters as `applyOverviewFilters`, but with an explicit date window (e.g. prior period). */
export function applyOverviewFiltersInDateRange(
  rows: DashboardSubmissionRow[],
  state: OverviewFilterState,
  range: { start: Date; end: Date }
): DashboardSubmissionRow[] {
  return rows.filter(
    (row) =>
      rowInDateRange(row, range.start, range.end) &&
      matchesNonDateFilters(row, state)
  );
}

export function applyOverviewFilters(
  rows: DashboardSubmissionRow[],
  state: OverviewFilterState
): DashboardSubmissionRow[] {
  const range = resolveOverviewDateRange(
    state.datePreset,
    state.customFrom,
    state.customTo
  );
  if (!range) {
    return [];
  }

  return rows.filter(
    (row) =>
      rowInDateRange(row, range.start, range.end) &&
      matchesNonDateFilters(row, state)
  );
}
