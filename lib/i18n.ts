import { en } from "@/locales/en";
import { es } from "@/locales/es";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const messages = { es, en } as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getTranslation(locale: Locale, key: string): string {
  const parts = key.split(".");
  let current: unknown = messages[locale];

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : key;
}
