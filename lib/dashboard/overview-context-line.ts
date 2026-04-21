import type {
  LineOfBusinessFilter,
  OverviewDecisionStatusFilter,
  OverviewFilterState,
} from "@/lib/dashboard/overview-filter-types";

/** English chip label for the active date window. */
export function getOverviewDateChipLabel(filters: OverviewFilterState): string {
  switch (filters.datePreset) {
    case "last_7d":
      return "Last 7 days";
    case "last_30d":
      return "Last 30 days";
    case "this_month":
      return "This month";
    case "last_quarter":
      return "Last quarter";
    case "custom":
      return filters.customFrom && filters.customTo
        ? `${filters.customFrom} → ${filters.customTo}`
        : "Custom range";
    default:
      return "Last 7 days";
  }
}

/** English chip label for line of business. */
export function getOverviewLobChipLabel(v: LineOfBusinessFilter): string {
  const map: Record<LineOfBusinessFilter, string> = {
    all: "All lines",
    aviation: "Aviation",
    marine: "Marine",
    property: "Property",
    construction: "Construction",
    pvt: "Political Violence & Terrorism",
    multi_line: "Multi-line",
  };
  return map[v];
}

function decisionPhrase(v: OverviewDecisionStatusFilter): string {
  const map: Record<OverviewDecisionStatusFilter, string> = {
    all: "All decisions",
    review: "Review",
    decline: "Decline",
    accept: "Accept",
    reply_sent: "Reply sent",
  };
  return map[v];
}

/**
 * Compact second line for the Overview hero, e.g.
 * "Last 30 days • All lines • Colombia"
 */
export function getOverviewCountryChipLabel(filters: OverviewFilterState): string {
  return filters.country === "all"
    ? "All countries"
    : filters.country.trim();
}

export function buildOverviewContextLine(filters: OverviewFilterState): string {
  const parts: string[] = [];
  parts.push(getOverviewDateChipLabel(filters));
  parts.push(getOverviewLobChipLabel(filters.lineOfBusiness));
  parts.push(getOverviewCountryChipLabel(filters));

  if (filters.brokerQuery.trim()) {
    parts.push(`Broker: ${filters.brokerQuery.trim()}`);
  }
  if (filters.decisionStatus !== "all") {
    parts.push(decisionPhrase(filters.decisionStatus));
  }
  if (filters.declineReason !== "all") {
    parts.push(`Reason: ${filters.declineReason}`);
  }

  return parts.join(" • ");
}
