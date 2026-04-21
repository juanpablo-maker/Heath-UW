"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      className="relative z-[60] inline-flex items-center gap-0 rounded-full border border-border/70 bg-background p-0.5 shadow-soft"
      role="group"
      aria-label={dict.languageSwitcher.ariaLabel}
    >
      {(["es", "en"] as Locale[]).map((item) => {
        const active = locale === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 ${
              active
                ? "bg-primary text-white"
                : "text-secondary hover:text-primary"
            }`}
            aria-pressed={active}
          >
            {item === "es" ? dict.languageSwitcher.es : dict.languageSwitcher.en}
          </button>
        );
      })}
    </div>
  );
}
