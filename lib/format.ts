const localeTag = (locale: string) => (locale === "en" ? "en-US" : "es");

export function formatDateTime(
  iso: string | null | undefined,
  locale = "es"
): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(localeTag(locale), {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

export function formatLimit(
  raw: string | number | null | undefined,
  locale = "es"
): string {
  if (raw === null || raw === undefined) return "—";
  const loc = localeTag(locale);
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw.toLocaleString(loc);
  }
  const s = String(raw).trim();
  if (!s) return "—";
  const n = Number(s);
  if (Number.isFinite(n)) return n.toLocaleString(loc);
  return s;
}

export function formatMinutes(
  n: number | null | undefined,
  locale = "es",
  suffix = "min"
): string {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return `${Math.round(Number(n))} ${suffix}`;
}
