"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import type { DashboardData } from "@/lib/dashboard/fetch-dashboard";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export type DashboardFetchResult =
  | { ok: true; data: DashboardData }
  | { ok: false; reason: "missing_env" }
  | { ok: false; reason: "fatal"; message: string };

export function DashboardPageClient({
  result,
}: {
  result: DashboardFetchResult;
}) {
  const { dict } = useI18n();
  const d = dict.dashboard;

  if (!result.ok) {
    if (result.reason === "missing_env") {
      return (
        <div className="mx-auto min-h-[50vh] max-w-lg px-6 py-16 text-center">
          <div className="mb-6 flex justify-center">
            <LanguageSwitcher />
          </div>
          <div className="rounded-xl border border-border bg-card px-6 py-10 shadow-card">
            <h1 className="text-lg font-semibold text-primary">{d.config.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              {d.errors.missingEnvBody}
            </p>
            <p className="mt-4 text-xs text-secondary">{d.config.envHint}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="mx-auto min-h-[50vh] max-w-lg px-6 py-16 text-center">
        <div className="mb-6 flex justify-center">
          <LanguageSwitcher />
        </div>
        <div className="rounded-xl border border-border bg-card px-6 py-10 shadow-card">
          <h1 className="text-lg font-semibold text-primary">
            {d.errors.loadFailed}
          </h1>
          <p className="mt-3 text-sm text-secondary">
            {result.message || d.errors.unexpected}
          </p>
        </div>
      </div>
    );
  }

  return <DashboardView data={result.data} />;
}
