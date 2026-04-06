/**
 * Heath design tokens — single source of truth for semantic styling.
 * Values mirror `tailwind.config.ts` and `app/globals.css` so product and marketing stay aligned.
 *
 * Use `classes.*` for Tailwind class strings in components; use `palette` for non-Tailwind contexts (charts, emails).
 */

import { cn } from "@/lib/cn";

export const palette = {
  primary: "#0F172A",
  secondary: "#6B7280",
  background: "#FFFFFF",
  backgroundSecondary: "#FAFAFA",
  card: "#FFFFFF",
  muted: "#F5F5F5",
  border: "#E5E7EB",
  accent: "#F97316",
  intelligence: "#7C3AED",
  positive: "#10B981",
  risk: "#EF4444",
} as const;

export const typography = {
  fontFamily: "var(--font-general-sans), sans-serif",
  /** Tailwind-aligned scale */
  sizes: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  },
  weights: {
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
  leading: {
    tight: "leading-tight",
    relaxed: "leading-relaxed",
  },
  tracking: {
    tight: "tracking-tight",
    wide: "tracking-wide",
  },
} as const;

export const spacing = {
  sectionY: "py-16 md:py-24",
  sectionYSm: "py-12 md:py-16",
  containerX: "px-6 md:px-8",
  stackSm: "space-y-4",
  stackMd: "space-y-6",
  stackLg: "space-y-8",
} as const;

export const layout = {
  maxWidth: "max-w-6xl",
  /** Narrower readable column for long-form */
  maxWidthProse: "max-w-3xl",
} as const;

export const radii = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
} as const;

export const shadows = {
  soft: "shadow-soft",
  card: "shadow-card",
  cardLift: "shadow-card-lift",
} as const;

export const borders = {
  default: "border border-border",
  subtle: "border border-border/80",
} as const;

/**
 * Pre-composed class groups for primitives — keeps Button/Card/Section visually consistent.
 */
export const classes = {
  text: {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-secondary",
    onAccent: "text-white",
  },
  surface: {
    page: "bg-background",
    subtle: "bg-backgroundSecondary",
    muted: "bg-muted",
    card: "bg-card",
  },
  focusRing:
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
} as const;

export const components = {
  container: cn(layout.maxWidth, "mx-auto", spacing.containerX),
  section: spacing.sectionY,
  heading: {
    /** Primary page title — marketing routes, hero sections, auth when it’s the only page heading */
    h1: cn(
      typography.sizes["5xl"],
      "font-bold",
      typography.tracking.tight,
      classes.text.primary,
      "md:text-6xl",
      "lg:text-7xl",
      "leading-[1.05] md:leading-[1.04]"
    ),
    /** Section / CTA titles */
    h2: cn(
      typography.sizes["3xl"],
      "font-bold",
      typography.tracking.tight,
      classes.text.primary,
      "md:text-4xl",
      "lg:text-5xl"
    ),
    /** Cards, subsections */
    h3: cn(
      typography.sizes["2xl"],
      "font-bold",
      typography.tracking.tight,
      classes.text.primary,
      "md:text-3xl",
      "lg:text-4xl"
    ),
  },
  button: {
    base: cn(
      "inline-flex items-center justify-center rounded-full transition-all duration-200",
      "disabled:pointer-events-none disabled:opacity-50",
      classes.focusRing,
      "active:scale-[0.98]"
    ),
    /** Default actions (forms, inline UI) */
    sizeDefault: "px-6 py-3 text-sm font-semibold",
    /** Marketing / hero CTAs — matches home `FinalCTA` */
    sizeLg: "min-w-[220px] px-10 py-4 text-sm font-bold",
    primary: cn("bg-accent text-white shadow-sm hover:bg-orange-700"),
    /** Primary at large size (accent glow) */
    primaryLg: cn("shadow-accent-glow hover:brightness-105"),
    secondary: cn("border border-border bg-white text-primary hover:border-secondary hover:bg-muted"),
    secondaryLg: cn("border-2 border-border shadow-soft hover:border-intelligence/30 hover:shadow-card"),
  },
  card: {
    base: cn(
      radii.lg,
      borders.default,
      classes.surface.card,
      shadows.cardLift,
      "ring-1 ring-primary/[0.04]",
      "transition-shadow duration-300 hover:shadow-card-lift"
    ),
  },
} as const;
