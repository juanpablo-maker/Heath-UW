import type { OverviewDatePreset } from "@/lib/dashboard/overview-filter-types";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Previous completed calendar quarter relative to `now`. */
export function getPreviousCalendarQuarterRange(now = new Date()): {
  start: Date;
  end: Date;
} {
  const m = now.getMonth();
  const y = now.getFullYear();
  let startYear: number;
  let startMonth: number;
  if (m < 3) {
    startYear = y - 1;
    startMonth = 9;
  } else if (m < 6) {
    startYear = y;
    startMonth = 0;
  } else if (m < 9) {
    startYear = y;
    startMonth = 3;
  } else {
    startYear = y;
    startMonth = 6;
  }
  const start = startOfDay(new Date(startYear, startMonth, 1));
  const end = endOfDay(new Date(startYear, startMonth + 3, 0));
  return { start, end };
}

export type DateRangeBounds = { start: Date; end: Date };

/**
 * Resolves the active [start, end] window for portfolio filters.
 * Returns `null` when custom range is incomplete or invalid.
 */
export function resolveOverviewDateRange(
  preset: OverviewDatePreset,
  customFrom: string | null,
  customTo: string | null,
  now = new Date()
): DateRangeBounds | null {
  switch (preset) {
    case "last_7d": {
      const end = endOfDay(now);
      const start = startOfDay(new Date(now));
      start.setDate(start.getDate() - 6);
      return { start, end };
    }
    case "last_30d": {
      const end = endOfDay(now);
      const start = startOfDay(new Date(now));
      start.setDate(start.getDate() - 29);
      return { start, end };
    }
    case "this_month": {
      const start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      const end = endOfDay(now);
      return { start, end };
    }
    case "last_quarter": {
      return getPreviousCalendarQuarterRange(now);
    }
    case "custom": {
      if (!customFrom?.trim() || !customTo?.trim()) return null;
      const start = startOfDay(new Date(customFrom));
      const end = endOfDay(new Date(customTo));
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
      }
      if (start > end) return null;
      return { start, end };
    }
    default:
      return null;
  }
}

export function formatIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Shifts the same window length backward for period-over-period comparison.
 */
export function getPriorPeriodRange(current: DateRangeBounds): DateRangeBounds {
  const duration = current.end.getTime() - current.start.getTime();
  return {
    start: new Date(current.start.getTime() - duration),
    end: new Date(current.end.getTime() - duration),
  };
}
