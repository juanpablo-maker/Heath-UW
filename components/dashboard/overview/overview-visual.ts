import { cn } from "@/lib/cn";

/** Shared motion: respect reduced-motion preferences */
export const overviewMotion = cn(
  "transition-[box-shadow,transform,border-color] duration-200 ease-out",
  "motion-reduce:transition-none motion-reduce:hover:transform-none"
);

/** Primary surface for KPI + insight block */
export const overviewMetricsSurface = cn(
  "relative overflow-hidden rounded-2xl border border-border/40",
  "bg-gradient-to-b from-white via-card to-backgroundSecondary/[0.35]",
  "shadow-[0_2px_12px_-4px_rgba(15,23,42,0.07)]",
  "ring-1 ring-black/[0.02]"
);
