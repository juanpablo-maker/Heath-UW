/** Legacy flat list — prefer `dict.nav` in i18n for labels. */
export const mainNav = [
  { label: "Sectores", href: "/sectores" },
  { label: "Panel de Underwriting", href: "/mesa-de-trabajo" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Empresa", href: "/empresa" },
] as const;

export const ctaNav = { label: "Requerir Demo", href: "/reservar-demo" } as const;

export const footerNav = [
  ...mainNav,
  { label: "Requerir Demo", href: "/reservar-demo" },
] as const;
