"use client";

import { cn } from "@/lib/cn";
import { classes } from "@/styles/design-system";

export type SegmentedControlOption<T extends string = string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the radiogroup */
  ariaLabel: string;
  className?: string;
  /** Denser control for toolbars / dashboard headers */
  size?: "default" | "compact";
};

/**
 * Pill-style segmented control for switching between a small set of modes (e.g. dashboard views).
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
  size = "default",
}: SegmentedControlProps<T>) {
  const isCompact = size === "compact";
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "flex min-w-0 rounded-full border border-border/80 bg-backgroundSecondary/80 p-0.5 shadow-inner",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative min-w-0 flex-1 rounded-full text-center font-semibold transition-colors duration-200 sm:flex-none",
              isCompact
                ? "px-3 py-1.5 text-xs sm:min-w-[5.5rem]"
                : "px-4 py-2 text-sm sm:min-w-[7rem]",
              classes.focusRing,
              active
                ? "bg-card text-primary shadow-sm ring-1 ring-border/70"
                : "text-secondary hover:text-primary"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
