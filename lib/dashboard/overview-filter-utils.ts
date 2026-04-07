import {
  DEFAULT_OVERVIEW_FILTERS,
  type OverviewFilterState,
} from "@/lib/dashboard/overview-filter-types";

export function countActiveOverviewFilters(f: OverviewFilterState): number {
  let c = 0;
  if (f.datePreset !== DEFAULT_OVERVIEW_FILTERS.datePreset) c++;
  if (f.lineOfBusiness !== DEFAULT_OVERVIEW_FILTERS.lineOfBusiness) c++;
  if (f.brokerQuery.trim()) c++;
  if (f.country !== DEFAULT_OVERVIEW_FILTERS.country) c++;
  if (f.decisionStatus !== DEFAULT_OVERVIEW_FILTERS.decisionStatus) c++;
  if (f.declineReason !== DEFAULT_OVERVIEW_FILTERS.declineReason) c++;
  return c;
}
