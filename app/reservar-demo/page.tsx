"use client";

import { Suspense } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";
import { ReservarDemoForm } from "@/components/ReservarDemoForm";

export default function ReservarDemoPage() {
  const { dict, t } = useI18n();

  return (
    <MarketingPageLayout title={dict.pages.demo.title} subtitle={dict.pages.demo.subtitle}>
      <div className="mx-auto max-w-md space-y-6 text-center text-secondary">
        <p>{dict.pages.demo.intro}</p>
        <Suspense
          fallback={
            <div className="py-4 text-center text-secondary">{t("common.loading")}</div>
          }
        >
          <ReservarDemoForm />
        </Suspense>
      </div>
    </MarketingPageLayout>
  );
}
