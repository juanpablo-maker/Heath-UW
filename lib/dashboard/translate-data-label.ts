import type { Locale } from "@/lib/i18n";
import { dashboardDataTranslationsEn } from "@/locales/dashboard-data-translations-en";

function lookup(map: Record<string, string>, raw: string): string | undefined {
  if (raw in map) return map[raw];
  const t = raw.trim();
  if (t !== raw && t in map) return map[t];
  return undefined;
}

/** When UI is EN, maps known Spanish DB strings to English; otherwise returns input. */
export function translateDataLabel(
  text: string | null | undefined,
  locale: Locale
): string | null | undefined {
  if (text === null || text === undefined) return text;
  if (locale !== "en") return text;
  const mapped = lookup(dashboardDataTranslationsEn, text);
  return mapped ?? text;
}
