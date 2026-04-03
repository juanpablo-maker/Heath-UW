"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      className="relative z-[60] inline-flex items-center gap-0 rounded-md border border-border/40 bg-background/40 p-0.5"
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
            className={`rounded px-1.5 py-0.5 text-[11px] font-normal tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 ${
              active
                ? "text-primary"
                : "text-secondary/50 hover:text-secondary/80"
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
