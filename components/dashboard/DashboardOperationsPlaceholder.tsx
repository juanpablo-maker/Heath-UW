"use client";

import { Filter, ListOrdered, Rows3 } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";

/**
 * Base layout for the future Operations view: filters, prioritization, submissions list.
 * Content is placeholder until the operational workflow is implemented.
 */
export function DashboardOperationsPlaceholder() {
  const { dict } = useI18n();
  const o = dict.dashboard.operations;

  return (
    <div className="space-y-6">
      <section
        className="rounded-xl border border-border bg-card p-5 shadow-soft"
        aria-labelledby="ops-filters-heading"
      >
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-secondary" aria-hidden />
          <h2
            id="ops-filters-heading"
            className="text-sm font-semibold text-primary"
          >
            {o.filtersLabel}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[o.filtersPlaceholder, o.filtersPlaceholder, o.filtersPlaceholder].map(
            (label, i) => (
              <div
                key={i}
                className="min-h-[40px] min-w-[140px] flex-1 rounded-lg border border-dashed border-border/90 bg-backgroundSecondary/50 px-3 py-2 text-xs text-secondary sm:max-w-[200px]"
              >
                {label}
              </div>
            )
          )}
        </div>
      </section>

      <section
        className="rounded-xl border border-border bg-card p-5 shadow-soft"
        aria-labelledby="ops-priority-heading"
      >
        <div className="mb-4 flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-secondary" aria-hidden />
          <h2
            id="ops-priority-heading"
            className="text-sm font-semibold text-primary"
          >
            {o.priorityLabel}
          </h2>
        </div>
        <div className="rounded-lg border border-dashed border-border/90 bg-backgroundSecondary/40 px-4 py-6 text-center text-xs text-secondary">
          {o.priorityPlaceholder}
        </div>
      </section>

      <section
        className="rounded-xl border border-border bg-card shadow-soft"
        aria-labelledby="ops-list-heading"
      >
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Rows3 className="h-4 w-4 text-secondary" aria-hidden />
            <h2 id="ops-list-heading" className="text-sm font-semibold text-primary">
              {o.listLabel}
            </h2>
          </div>
          <p className="mt-1 text-xs text-secondary">{o.listPlaceholder}</p>
        </div>
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-16">
          <p className="rounded-full border border-border bg-backgroundSecondary/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
            {o.comingSoon}
          </p>
        </div>
      </section>
    </div>
  );
}
