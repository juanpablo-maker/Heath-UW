"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/LanguageProvider";

export function Hero() {
  const { dict } = useI18n();

  return (
    <section className="relative overflow-hidden bg-background px-6 pb-14 pt-8 md:px-8 md:pb-18 md:pt-10">
      {/* Fondo: rejilla + halos (paleta existente) */}
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow"
        aria-hidden
      />
      <div
        className="landing-hero-grid pointer-events-none absolute inset-0 opacity-[0.85]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="max-w-xl text-left">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-primary shadow-soft backdrop-blur-sm">
                <span
                  className="h-1.5 w-1.5 animate-landing-pulse rounded-full bg-positive motion-reduce:animate-none"
                  aria-hidden
                />
                {dict.hero.badge}
              </span>
              <span className="hidden text-xs font-medium text-secondary sm:inline">
                {dict.hero.subBadge}
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl lg:text-[4.25rem] lg:leading-[1.02]">
              {dict.hero.title}{" "}
              <span className="bg-gradient-to-r from-accent via-[#ea580c] to-intelligence bg-clip-text text-transparent">
                {dict.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-3 max-w-[48ch] text-lg leading-relaxed text-secondary md:text-xl">
              {dict.hero.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/mesa-de-trabajo"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-soft transition-all hover:border-intelligence/25 hover:shadow-card active:scale-[0.98]"
              >
                {dict.hero.primaryCta}
              </Link>
              <Link
                href="/iniciar-sesion?redirect=/panel-de-suscripcion-dashboard"
                className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-orange-700 active:scale-[0.98]"
              >
                {dict.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative lg:pl-2 lg:pt-0 lg:mt-[41px]">
            <div
              className="pointer-events-none absolute -right-6 -top-10 hidden h-36 w-36 rounded-full bg-accent/15 blur-3xl lg:block"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-4 hidden h-32 w-32 rounded-full bg-intelligence/15 blur-3xl lg:block"
              aria-hidden
            />

            <div className="relative pt-0 motion-reduce:animate-none lg:animate-landing-float">
              <div className="absolute -right-1 -top-6 z-10 rounded-lg border border-border bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-intelligence shadow-soft">
                {dict.hero.mock.tag}
              </div>
              <MockTradingDesk />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockTradingDesk() {
  const { dict } = useI18n();
  const submissions = [
    {
      broker: "Broker A",
      deal: dict.hero.mock.rows[0]?.deal ?? "",
      status: dict.hero.mock.rows[0]?.status ?? "",
      riskLabel: dict.hero.mock.rows[0]?.riskLabel ?? "",
      riskTone: "positive" as const,
    },
    {
      broker: "Broker B",
      deal: dict.hero.mock.rows[1]?.deal ?? "",
      status: dict.hero.mock.rows[1]?.status ?? "",
      riskLabel: dict.hero.mock.rows[1]?.riskLabel ?? "",
      riskTone: "risk" as const,
    },
    {
      broker: "Broker C",
      deal: dict.hero.mock.rows[2]?.deal ?? "",
      status: dict.hero.mock.rows[2]?.status ?? "",
      riskLabel: dict.hero.mock.rows[2]?.riskLabel ?? "",
      riskTone: "positive" as const,
    },
    {
      broker: "Broker D",
      deal: dict.hero.mock.rows[3]?.deal ?? "",
      status: dict.hero.mock.rows[3]?.status ?? "",
      riskLabel: dict.hero.mock.rows[3]?.riskLabel ?? "",
      riskTone: "risk" as const,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/95 p-2.5 shadow-card-lift ring-1 ring-primary/[0.04] backdrop-blur-sm transition-shadow duration-300 hover:shadow-card-lift md:p-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{dict.hero.mock.title}</p>
          <p className="mt-1 text-xs text-secondary">
            {dict.hero.mock.subtitle}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {dict.hero.mock.realtime}
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background/50">
        <div className="grid grid-cols-[1fr_1.4fr_0.9fr_0.7fr] gap-0 border-b border-border bg-muted/40 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary">
          <span>{dict.hero.mock.columns.submission}</span>
          <span>{dict.hero.mock.columns.operation}</span>
          <span>{dict.hero.mock.columns.status}</span>
          <span>{dict.hero.mock.columns.risk}</span>
        </div>

        <div className="divide-y divide-border bg-card">
          {submissions.map((s) => (
            <div
              key={`${s.broker}-${s.deal}`}
              className="grid grid-cols-[1fr_1.4fr_0.9fr_0.7fr] gap-0 px-3 py-2.5 transition-colors hover:bg-muted/30"
            >
              <div className="min-w-0 pr-2 text-sm font-semibold text-primary">
                {s.broker}
              </div>
              <div className="min-w-0 pr-2 text-sm text-secondary">{s.deal}</div>
              <div className="min-w-0 pr-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-secondary">
                  {s.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    s.riskTone === "positive" ? "bg-positive" : "bg-risk"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-bold ${
                    s.riskTone === "positive" ? "text-positive" : "text-risk"
                  }`}
                >
                  {s.riskLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-gradient-to-r from-muted/50 to-backgroundSecondary/80 px-3 py-2.5">
        <div className="text-xs font-medium text-secondary">
          {dict.hero.mock.capacityLabel}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-positive" aria-hidden />
          <span className="text-primary">{dict.hero.mock.capacityValue}</span>
        </div>
      </div>
    </div>
  );
}
