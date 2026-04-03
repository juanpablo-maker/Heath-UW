"use client";

import { Suspense } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function IniciarSesionPage() {
  const { dict, t } = useI18n();

  return (
    <MarketingPageLayout title={dict.pages.login.title} subtitle={dict.pages.login.subtitle}>
      <Suspense
        fallback={
          <div className="py-4 text-center text-secondary">{t("common.loading")}</div>
        }
      >
        <LoginForm />
      </Suspense>
    </MarketingPageLayout>
  );
}

