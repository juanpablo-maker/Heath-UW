"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";

export default function GestionExposicionPage() {
  const { dict } = useI18n();
  return (
    <MarketingPageLayout title={dict.pages.exposicion.title} subtitle={dict.pages.exposicion.subtitle}>
      <div className="space-y-6 text-secondary">
        <p>{dict.pages.exposicion.p1}</p>
        <p>{dict.pages.exposicion.p2}</p>
      </div>
    </MarketingPageLayout>
  );
}
