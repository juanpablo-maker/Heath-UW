"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";

export default function EmpresaPage() {
  const { dict } = useI18n();
  return (
    <MarketingPageLayout title={dict.pages.empresa.title} subtitle={dict.pages.empresa.subtitle}>
      <div className="space-y-8 text-secondary">
        <p>{dict.pages.empresa.intro}</p>
        <div className="rounded-2xl border border-border bg-muted/50 p-6">
          <h2 className="text-lg font-semibold text-primary">{dict.pages.empresa.upcoming}</h2>
          <p className="mt-2 text-sm">{dict.pages.empresa.upcomingItems}</p>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
