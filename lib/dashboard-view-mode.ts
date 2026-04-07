export type DashboardViewMode = "overview" | "operations";

export function parseDashboardViewParam(
  raw: string | null
): DashboardViewMode {
  return raw === "operations" ? "operations" : "overview";
}
