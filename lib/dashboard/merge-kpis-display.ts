import { countSubmissionsInReview } from "@/lib/dashboard/count-in-review";
import type { DashboardKpisRow, DashboardSubmissionRow } from "@/types/dashboard";

const emptyKpis = (): DashboardKpisRow => ({
  total_submissions: null,
  total_decline: null,
  total_refer: null,
  total_accept: null,
  total_reply_sent: null,
  total_without_decision: null,
  total_missing_country: null,
});

/** KPIs para la UI: conserva la fila de Supabase y añade `total_in_review` (filas con `decision` = REVIEW). */
export function mergeKpisForDisplay(
  kpis: DashboardKpisRow | null,
  submissions: DashboardSubmissionRow[]
): DashboardKpisRow {
  const base = kpis ?? emptyKpis();
  return {
    ...base,
    total_in_review: countSubmissionsInReview(submissions),
  };
}
