import { cn } from "@/lib/cn";

/** Shared motion: respect reduced-motion preferences */
export const overviewMotion = cn(
  "transition-[box-shadow,transform,border-color] duration-200 ease-out",
  "motion-reduce:transition-none motion-reduce:hover:transform-none"
);

/** Primary surface for KPI + insight block */
export const overviewMetricsSurface = cn(
  "relative overflow-hidden rounded-2xl border border-border/70",
  "bg-white/85 backdrop-blur-sm",
  "shadow-soft"
);
