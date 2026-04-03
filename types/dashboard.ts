/**
 * Tipos alineados con las columnas expuestas por las views de Supabase.
 * Ajusta aquí si el esquema real difiere (nombres snake_case de Postgres).
 */

export type DashboardKpisRow = {
  total_submissions: number | null;
  total_decline: number | null;
  total_refer: number | null;
  total_accept: number | null;
  total_reply_sent: number | null;
  total_without_decision: number | null;
  total_missing_country: number | null;
  /** Suele calcularse en cliente a partir de `dashboard_submissions_table`. */
  total_in_review?: number | null;
};

export type DashboardSubmissionRow = {
  insured: string | null;
  broker_name: string | null;
  line_of_business: string | null;
  country: string | null;
  currency: string | null;
  insured_limit_raw: string | number | null;
  decision: string | null;
  decision_reason: string | null;
  decision_status: string | null;
  reply_sent: boolean | null;
  created_at: string | null;
};

export type DashboardAlertRow = {
  insured: string | null;
  broker_name: string | null;
  line_of_business: string | null;
  country: string | null;
  decision: string | null;
  reply_sent: boolean | null;
  alert_type: string | null;
  created_at: string | null;
};

export type DashboardSlaRow = {
  insured: string | null;
  broker_name: string | null;
  decision: string | null;
  reply_sent: boolean | null;
  age_minutes: number | null;
  reply_time_minutes: number | null;
  created_at: string | null;
};

/** Punto normalizado para gráficos (después de mapear columnas de la view). */
export type ChartLabelValue = {
  label: string;
  value: number;
};
