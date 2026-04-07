/** Shared normalization for matching `decision` values from Supabase (ES/EN). */
export function normalizeDecisionKey(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase().replace(/\s+/g, "_");
}

export function isDeclineDecision(key: string): boolean {
  return key === "decline" || key === "declined" || key === "declinar";
}

export function isAcceptDecision(key: string): boolean {
  return (
    key === "accept" ||
    key === "accepted" ||
    key === "approved" ||
    key === "aceptar" ||
    key === "aceptado" ||
    key === "aprobado"
  );
}

/** Review / refer / pending review bucket for analysis filters. */
export function isReviewDecision(key: string): boolean {
  return (
    key === "review" ||
    key === "refer" ||
    key === "pending" ||
    key === "revisar" ||
    key === "derivar" ||
    key.includes("revis") ||
    key.includes("pendiente")
  );
}
