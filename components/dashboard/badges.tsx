"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { translateDataLabel } from "@/lib/dashboard/translate-data-label";

function normalizeKey(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
}

export function DecisionBadge({ value }: { value: string | null | undefined }) {
  const { dict, locale } = useI18n();
  const b = dict.dashboard.badges;

  const decisionStyles = useMemo(
    () =>
      ({
        accept: {
          className:
            "bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-300",
          label: b.decisionAccept,
        },
        approved: {
          className:
            "bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-300",
          label: b.decisionApproved,
        },
        decline: {
          className:
            "bg-rose-100 text-rose-900 ring-1 ring-inset ring-rose-300",
          label: b.decisionDecline,
        },
        declined: {
          className:
            "bg-rose-100 text-rose-900 ring-1 ring-inset ring-rose-300",
          label: b.decisionDeclined,
        },
        refer: {
          className:
            "bg-amber-100 text-amber-950 ring-1 ring-inset ring-amber-300",
          label: b.decisionRefer,
        },
        pending: {
          className:
            "bg-slate-200 text-slate-800 ring-1 ring-inset ring-slate-300",
          label: b.decisionPending,
        },
      }) as const,
    [b]
  );

  if (!value) {
    return (
      <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-secondary ring-1 ring-inset ring-border">
        —
      </span>
    );
  }
  const resolved = translateDataLabel(value, locale) ?? value;
  const key = normalizeKey(resolved);
  const preset = decisionStyles[key as keyof typeof decisionStyles];
  const display = preset?.label ?? resolved;
  const className =
    preset?.className ??
    "bg-slate-100 text-slate-900 ring-1 ring-inset ring-slate-300";
  return (
    <span
      className={`inline-flex max-w-[10rem] truncate rounded-md px-2 py-0.5 text-xs font-medium ${className}`}
      title={resolved}
    >
      {display}
    </span>
  );
}

export function ReplySentBadge({
  value,
}: {
  value: boolean | null | undefined;
}) {
  const { dict } = useI18n();
  const b = dict.dashboard.badges;

  if (value === null || value === undefined) {
    return (
      <span className="text-xs text-secondary" title={b.noDataTitle}>
        —
      </span>
    );
  }
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
        value
          ? "bg-emerald-100 text-emerald-900 ring-emerald-300"
          : "bg-slate-100 text-slate-700 ring-slate-300"
      }`}
    >
      {value ? b.replySent : b.replyPending}
    </span>
  );
}
