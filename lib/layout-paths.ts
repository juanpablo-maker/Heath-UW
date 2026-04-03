/** Routes where the global marketing header is hidden (full-bleed app shells). */
export function isFullBleedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/dashboard") || pathname.startsWith("/panel-de-suscripcion-dashboard")
  );
}
