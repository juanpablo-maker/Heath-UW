"use client";

import { useEffect } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useI18n();
  const d = dict.dashboard.errors;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto min-h-[50vh] max-w-lg px-6 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <LanguageSwitcher />
      </div>
      <div className="rounded-xl border border-border bg-card px-6 py-10 shadow-card">
        <h1 className="text-lg font-semibold text-primary">{d.loadFailed}</h1>
        <p className="mt-3 text-sm text-secondary">
          {error.message || d.unexpected}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-primary shadow-soft transition hover:bg-muted"
        >
          {d.retry}
        </button>
      </div>
    </div>
  );
}
