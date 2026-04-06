/**
 * Marketing routes — centralize paths so adding locale prefixes or `/industries/*` aliases is one change.
 */
export const ROUTES = {
  home: "/",
  demo: "/reservar-demo",
  desk: "/mesa-de-trabajo",
  industries: {
    /** Current industries listing (ES path; EN nav label is still "Industries") */
    list: "/sectores",
    detail: (slug: string) => `/sectores/${slug}`,
  },
} as const;

/** @deprecated Use `ROUTES.industries.detail` — kept for explicit migration to `/industries/[slug]` */
export function industryDetailPath(slug: string): string {
  return ROUTES.industries.detail(slug);
}
