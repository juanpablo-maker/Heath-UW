"use client";

import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function SolucionesPage() {
  const { dict } = useI18n();
  const copy = dict.pages.soluciones;

  return (
    <MarketingPageLayout title={copy.title} subtitle={copy.subtitle}>
      <div className="prose prose-slate mx-auto max-w-none text-secondary">
        <p>{copy.intro}</p>
        <ul className="mt-6 list-disc space-y-2 pl-5">
          {copy.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </MarketingPageLayout>
  );
}
