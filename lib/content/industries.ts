/**
 * Canonical industry slugs — keep in sync with locale files under `locales` (pages.sectores.industries).
 * Used for static generation and validation; swap route prefix in `lib/routes/marketing` when adding localized industry routes.
 */
export const INDUSTRY_SLUGS = [
  "aviation",
  "marine",
  "construction",
  "property",
  "political-violence-terrorism",
  "enterprise-multi-line",
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export function isIndustrySlug(value: string): value is IndustrySlug {
  return (INDUSTRY_SLUGS as readonly string[]).includes(value);
}
