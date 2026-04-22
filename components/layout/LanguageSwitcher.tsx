"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      className="relative z-[60] inline-flex items-center gap-1 rounded-full border border-border/80 bg-card p-1 shadow-soft"
      role="group"
      aria-label={dict.languageSwitcher.ariaLabel}
    >
      {(["es", "en", "zh"] as Locale[]).map((item) => {
        const active = locale === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            className={`rounded-full px-3 py-1 text-xs font-semibold tabular-nums leading-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 ${
              active
                ? "bg-gradient-to-r from-[#6d28d9] to-[#f97316] text-white shadow-soft"
                : "text-secondary hover:bg-backgroundSecondary hover:text-primary"
            }`}
            aria-pressed={active}
          >
            {item === "es"
              ? dict.languageSwitcher.es
              : item === "en"
                ? dict.languageSwitcher.en
                : dict.languageSwitcher.zh}
          </button>
        );
      })}
    </div>
  );
}
