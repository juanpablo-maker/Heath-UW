/** Presets for the Overview date filter (portfolio analysis). */
export type OverviewDatePreset =
  | "last_7d"
  | "last_30d"
  | "this_month"
  | "last_quarter"
  | "custom";

export type LineOfBusinessFilter =
  | "all"
  | "aviation"
  | "marine"
  | "property"
  | "construction"
  | "pvt"
  | "multi_line";

/** High-level decision bucket for analysis (not operational triage). */
export type OverviewDecisionStatusFilter =
  | "all"
  | "review"
  | "decline"
  | "accept"
  | "reply_sent";

/** Fields exposed as interactive context chips (scroll + focus filter bar). */
export type OverviewFilterFocusField = "date" | "lob" | "country";

export type OverviewFilterState = {
  datePreset: OverviewDatePreset;
  /** ISO date string `yyyy-mm-dd` for custom range start */
  customFrom: string | null;
  /** ISO date string `yyyy-mm-dd` for custom range end */
  customTo: string | null;
  lineOfBusiness: LineOfBusinessFilter;
  /** Substring match on broker name (trimmed, case-insensitive) */
  brokerQuery: string;
  /** Country code / name as stored in data, or `all` */
  country: string;
  decisionStatus: OverviewDecisionStatusFilter;
  /** Exact decline reason string from data, or `all` */
  declineReason: string;
};

export const DEFAULT_OVERVIEW_FILTERS: OverviewFilterState = {
  datePreset: "last_30d",
  customFrom: null,
  customTo: null,
  lineOfBusiness: "all",
  brokerQuery: "",
  country: "all",
  decisionStatus: "all",
  declineReason: "all",
};
