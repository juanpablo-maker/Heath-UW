"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/LanguageProvider";

export function FinalCTA() {
  const { dict } = useI18n();

  return (
    <section className="relative overflow-hidden border-y border-border bg-background px-6 py-24 md:px-8 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-hero-glow opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-56 w-56 rounded-full bg-intelligence/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-intelligence">
          {dict.landing.finalCta.kicker}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl lg:leading-[1.1]">
          {dict.landing.finalCta.title}{" "}
          <span className="text-accent">{dict.landing.finalCta.titleAccent}</span>
        </h2>
        <p className="mt-6 text-lg text-secondary md:text-xl">
          {dict.landing.finalCta.description}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/reservar-demo"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-accent px-10 py-4 text-sm font-bold text-white shadow-accent-glow transition-all hover:brightness-105 active:scale-[0.98]"
          >
            {dict.landing.finalCta.primary}
          </Link>
          <Link
            href="/mesa-de-trabajo"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full border-2 border-border bg-white px-10 py-4 text-sm font-bold text-primary shadow-soft transition-all hover:border-intelligence/30 hover:shadow-card"
          >
            {dict.landing.finalCta.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
