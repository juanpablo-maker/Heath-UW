"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";

export default function SectoresPage() {
  const { dict } = useI18n();

  return (
    <MarketingPageLayout title={dict.pages.sectores.title} subtitle={dict.pages.sectores.subtitle}>
      <div className="prose prose-slate mx-auto max-w-none text-secondary">
        <p>
          {dict.pages.sectores.intro}
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5">
          {dict.pages.sectores.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </MarketingPageLayout>
  );
}
