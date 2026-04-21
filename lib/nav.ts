/** Legacy flat list — prefer `dict.nav` in i18n for labels. */
export const mainNav = [
  { label: "Sectores", href: "/sectores" },
  { label: "Panel de Underwriting", href: "/mesa-de-trabajo" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Empresa", href: "/empresa" },
] as const;

export const ctaNav = {
  label: "Ingresá al dashboard",
  href: "/iniciar-sesion?redirect=/dashboard",
} as const;

export const footerNav = [
  ...mainNav,
  {
    label: "Ingresá al dashboard",
    href: "/iniciar-sesion?redirect=/dashboard",
  },
] as const;
