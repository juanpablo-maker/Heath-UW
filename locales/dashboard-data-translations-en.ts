/**
 * Spanish → English for dashboard fields stored in the DB (decision_reason, decisions, etc.).
 * Extend this map as new canonical Spanish phrases appear in your data.
 */
export const dashboardDataTranslationsEn: Record<string, string> = {
  // Reasons (examples from your pipeline)
  "Compromiso con otro canal": "Commitment with another channel",
  "Mercado vigente": "Active market",
  "Fuera de apetito": "Outside appetite",

  // Common decision / status phrases
  Declinar: "Decline",
  Declinado: "Declined",
  Aceptar: "Accept",
  Aceptado: "Accepted",
  Aprobado: "Approved",
  Derivar: "Refer",
  Derivado: "Referred",
  Pendiente: "Pending",
  "Sin decisión": "No decision",
  "En revisión": "Under review",
  "Pendiente información": "Pending information",
  Recomendado: "Recommended",
  Cotizado: "Quoted",

  // Appetite / underwriting
  "En apetito": "Within appetite",
  Revisar: "Review",
  "Fuera de apetito técnico": "Outside technical appetite",
  "Límite excedido": "Limit exceeded",
  "Información incompleta": "Incomplete information",
  "Riesgo no asegurable": "Uninsurable risk",
  Duplicado: "Duplicate",
  Desactualizado: "Outdated",
};
