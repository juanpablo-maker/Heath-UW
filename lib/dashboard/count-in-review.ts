import type { DashboardSubmissionRow } from "@/types/dashboard";

function normDecision(s: string | null | undefined): string {
  return (s ?? "").trim().toUpperCase();
}

/** Cuenta submissions donde `decision` es REVIEW (mayúsculas ignoradas). */
export function countSubmissionsInReview(rows: DashboardSubmissionRow[]): number {
  return rows.filter((r) => normDecision(r.decision) === "REVIEW").length;
}
