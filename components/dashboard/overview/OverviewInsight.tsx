"use client";

import { Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { overviewMotion } from "@/components/dashboard/overview/overview-visual";

export function OverviewInsight({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { dict } = useI18n();
  const o = dict.dashboard.overview;

  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-xl border border-border/50 bg-gradient-to-br from-slate-50/90 to-backgroundSecondary/50 px-3 py-2.5 sm:gap-3 sm:px-3.5 sm:py-3",
        overviewMotion,
        "hover:border-border/70",
        className
      )}
      role="status"
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary"
        aria-hidden
      >
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary">
          {o.insightLabel}
        </p>
        <p className="mt-1 max-w-4xl text-xs leading-relaxed text-primary">
          {text}
        </p>
      </div>
    </div>
  );
}
