import { cookies } from "next/headers";
import type { Metadata } from "next";
import { fetchDashboardData } from "@/lib/dashboard/fetch-dashboard";
import { DashboardPageClient } from "@/components/dashboard/DashboardPageClient";
import { parseDashboardViewParam } from "@/lib/dashboard-view-mode";
import { isLocale, messages, type Locale } from "@/lib/i18n";
import { LOCALE_COOKIE_NAME } from "@/lib/locale-cookie";

/** Datos reales en cada request; no prerender con HTML obsoleto. */
export const dynamic = "force-dynamic";

async function dashboardLocale(): Promise<Locale> {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE_NAME)?.value;
  return raw && isLocale(raw) ? raw : "es";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await dashboardLocale();
  const meta = messages[locale].dashboard.meta;
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const result = await fetchDashboardData();
  const sp = await searchParams;
  const raw = sp.view;
  const viewParam =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : null;
  const initialView = parseDashboardViewParam(viewParam);

  return (
    <DashboardPageClient result={result} initialView={initialView} />
  );
}
