function normalizeKey(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
}

export function alertTypeAccent(alertType: string | null | undefined): {
  bar: string;
  text: string;
} {
  const key = normalizeKey(alertType);
  const map: Record<string, { bar: string; text: string }> = {
    sla: { bar: "bg-amber-500", text: "text-primary" },
    sla_breach: { bar: "bg-rose-500", text: "text-primary" },
    sla_risk: { bar: "bg-amber-500", text: "text-primary" },
    timeout: { bar: "bg-orange-500", text: "text-primary" },
    missing_data: { bar: "bg-violet-500", text: "text-primary" },
    missing_country: { bar: "bg-violet-500", text: "text-primary" },
    no_reply: { bar: "bg-sky-500", text: "text-primary" },
    error: { bar: "bg-rose-600", text: "text-primary" },
    warning: { bar: "bg-amber-500", text: "text-primary" },
    info: { bar: "bg-slate-400", text: "text-primary" },
  };
  return (
    map[key] ?? {
      bar: "bg-slate-400",
      text: "text-primary",
    }
  );
}
