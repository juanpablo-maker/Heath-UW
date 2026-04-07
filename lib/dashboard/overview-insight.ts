import type { ChartLabelValue } from "@/types/dashboard";
import type { DashboardKpisRow } from "@/types/dashboard";

/** Placeholders: `{pct}`, `{driver}`, `{label}` (in declineDriverNamed), `{count}`. */
export type OverviewInsightCopy = {
  empty: string;
  highDecline: string;
  declineDriverNamed: string;
  declineDriverFallback: string;
  strongAccept: string;
  largeReview: string;
  balanced: string;
};

/**
 * One-line narrative from current KPIs + decline breakdown (locale-aware).
 */
export function buildOverviewInsight(
  kpis: DashboardKpisRow,
  declineReasons: ChartLabelValue[],
  copy: OverviewInsightCopy,
  numberLocale: string
): string {
  const total = kpis.total_submissions ?? 0;
  if (total === 0) {
    return copy.empty;
  }

  const decline = kpis.total_decline ?? 0;
  const accept = kpis.total_accept ?? 0;
  const review = kpis.total_in_review ?? 0;
  const declineRate = decline / total;
  const acceptRate = accept / total;

  const topDecline =
    declineReasons.length > 0
      ? declineReasons.reduce((a, b) => (a.value >= b.value ? a : b))
      : null;

  if (declineRate >= 0.35 && decline > 0) {
    const pct = Math.round(declineRate * 100);
    const driver =
      topDecline &&
      topDecline.label &&
      topDecline.label !== "—" &&
      topDecline.value > 0
        ? copy.declineDriverNamed.replace("{label}", topDecline.label)
        : copy.declineDriverFallback;
    return copy.highDecline.replace("{pct}", String(pct)).replace("{driver}", driver);
  }

  if (acceptRate >= 0.45 && accept > 0) {
    return copy.strongAccept.replace("{pct}", String(Math.round(acceptRate * 100)));
  }

  if (review / total >= 0.45 && review > 0) {
    return copy.largeReview.replace("{pct}", String(Math.round((review / total) * 100)));
  }

  return copy.balanced.replace("{count}", total.toLocaleString(numberLocale));
}
