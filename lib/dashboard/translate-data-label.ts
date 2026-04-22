import type { Locale } from "@/lib/i18n";
import { dashboardDataTranslationsEn } from "@/locales/dashboard-data-translations-en";
import { dashboardDataTranslationsZh } from "@/locales/dashboard-data-translations-zh";

function lookup(map: Record<string, string>, raw: string): string | undefined {
  if (raw in map) return map[raw];
  const t = raw.trim();
  if (t !== raw && t in map) return map[t];
  return undefined;
}

/** Maps known Spanish DB strings to the selected UI locale; otherwise returns input. */
export function translateDataLabel(
  text: string | null | undefined,
  locale: Locale
): string | null | undefined {
  if (text === null || text === undefined) return text;
  if (locale === "es") return text;
  const dictionary =
    locale === "zh" ? dashboardDataTranslationsZh : dashboardDataTranslationsEn;
  const mapped = lookup(dictionary, text);
  return mapped ?? text;
}
