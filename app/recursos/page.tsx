"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";

export default function RecursosPage() {
  const { dict } = useI18n();
  return (
    <MarketingPageLayout title={dict.pages.recursos.title} subtitle={dict.pages.recursos.subtitle}>
      <div className="space-y-8 text-secondary">
        <p>{dict.pages.recursos.intro}</p>
        <ul className="space-y-4 border-t border-border pt-8">
          {dict.pages.recursos.items.map((item) => (
            <li key={item.t} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0">
              <span className="font-semibold text-primary">{item.t}</span>
              <span>{item.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </MarketingPageLayout>
  );
}
