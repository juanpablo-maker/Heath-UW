import { cn } from "@/lib/cn";
import { classes } from "@/styles/design-system";

export const overviewFilterLabelClass =
  "mb-0.5 block text-[9px] font-medium uppercase tracking-wide text-secondary";

/** Compact dropdown / input — light, toolbar-style */
export const overviewFilterControlClass = cn(
  "h-8 min-w-0 max-w-[11rem] rounded-md border border-border/35 bg-white px-2 text-[13px] font-medium text-primary",
  "shadow-none transition-colors hover:border-border/50",
  "focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/10",
  classes.focusRing,
  "placeholder:text-secondary"
);

export const overviewFilterDateInputClass = cn(
  "h-8 min-w-0 rounded-md border border-border/35 bg-white px-2 text-[13px] text-primary",
  "focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/10",
  classes.focusRing
);

/** White bar, soft shadow — compact toolbar */
export const overviewFilterBarClass =
  "rounded-xl border border-border/20 bg-white px-3 py-2 shadow-[0_1px_4px_-1px_rgba(15,23,42,0.08)] sm:px-4 sm:py-2";

export const overviewFilterResetClass = cn(
  "h-8 shrink-0 rounded-full border border-border/30 bg-transparent px-3 text-[11px] font-medium text-secondary",
  "transition-colors hover:border-border/50 hover:bg-backgroundSecondary/50 hover:text-primary",
  classes.focusRing
);
