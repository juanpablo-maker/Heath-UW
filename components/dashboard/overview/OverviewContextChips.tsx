"use client";

import { Calendar, ChevronDown, Globe, Layers } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import {
  getOverviewCountryChipLabel,
  getOverviewDateChipLabel,
  getOverviewLobChipLabel,
} from "@/lib/dashboard/overview-context-line";
import { overviewMotion } from "@/components/dashboard/overview/overview-visual";
import type {
  OverviewFilterFocusField,
  OverviewFilterState,
} from "@/lib/dashboard/overview-filter-types";

const iconWrap =
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/[0.04] text-secondary";

const chipClass = cn(
  "group inline-flex max-w-full min-w-0 items-center gap-2 truncate rounded-full border border-border/45 bg-white/90 px-2.5 py-1.5 pl-2 text-left text-xs font-medium text-primary/95",
  "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  overviewMotion,
  "hover:border-primary/20 hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]",
  "active:scale-[0.99] motion-reduce:active:scale-100",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2"
);

type OverviewContextChipsProps = {
  filters: OverviewFilterState;
  onOpenFilter: (field: OverviewFilterFocusField) => void;
};

const fieldIcon = {
  date: Calendar,
  lob: Layers,
  country: Globe,
} as const;

export function OverviewContextChips({
  filters,
  onOpenFilter,
}: OverviewContextChipsProps) {
  const { dict } = useI18n();
  const a = dict.dashboard.overview;

  const items: { field: OverviewFilterFocusField; label: string }[] = [
    { field: "date", label: getOverviewDateChipLabel(filters) },
    { field: "lob", label: getOverviewLobChipLabel(filters.lineOfBusiness) },
    { field: "country", label: getOverviewCountryChipLabel(filters) },
  ];

  return (
    <div className="mt-3">
      <p className="sr-only">{a.quickFiltersLabel}</p>
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label={a.quickFiltersLabel}
      >
        {items.map(({ field, label }) => {
          const Icon = fieldIcon[field];
          return (
            <button
              key={field}
              type="button"
              className={chipClass}
              onClick={() => onOpenFilter(field)}
              title={
                field === "date"
                  ? a.contextChipDateTitle
                  : field === "lob"
                    ? a.contextChipLobTitle
                    : a.contextChipCountryTitle
              }
            >
              <span className={iconWrap} aria-hidden>
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <ChevronDown
                className="h-3.5 w-3.5 shrink-0 text-secondary/40 transition-opacity group-hover:text-secondary/70"
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
