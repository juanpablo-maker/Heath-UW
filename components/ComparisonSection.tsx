"use client";

import React from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { SectionContainer } from "./ui/SectionContainer";

type Tone = "positive" | "negative";

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function ComparisonColumn({
  tone,
  title,
  bullets,
}: {
  tone: Tone;
  title: string;
  bullets: readonly string[];
}) {
  const isPositive = tone === "positive";

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-border p-8 shadow-soft transition-all duration-300 hover:shadow-card-lift md:p-10",
        isPositive
          ? "bg-gradient-to-b from-background to-backgroundSecondary/80"
          : "bg-gradient-to-b from-muted/40 to-background",
      ].join(" ")}
    >
      <div
        className={[
          "absolute left-0 top-0 h-full w-1 rounded-l-2xl",
          isPositive ? "bg-positive" : "bg-risk/80",
        ].join(" ")}
        aria-hidden
      />
      <div
        className={[
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70",
          isPositive ? "bg-positive/25" : "bg-risk/20",
        ].join(" ")}
        aria-hidden
      />

      <h2 className="relative text-3xl font-bold tracking-tight text-primary md:text-4xl">
        {title}
      </h2>

      <ul className="relative mt-7 space-y-4">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-3 rounded-xl py-1 transition-colors hover:bg-white/60"
          >
            {isPositive ? (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-positive/10">
                <IconCheck className="text-positive" />
              </span>
            ) : (
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-risk/10">
                <IconX className="text-risk" />
              </span>
            )}
            <span className="pt-0.5 text-base font-medium text-secondary">
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonSection() {
  const { dict } = useI18n();

  return (
    <section
      className="relative border-y border-border/80 bg-backgroundSecondary/30"
      aria-labelledby="comparison-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />
      <SectionContainer as="div" className="py-20 md:py-28">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-intelligence">
            {dict.landing.comparison.kicker}
          </p>
          <h2
            id="comparison-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-primary md:text-4xl"
          >
            {dict.landing.comparison.title}
          </h2>
          <p className="mt-4 text-lg text-secondary">
            {dict.landing.comparison.subtitle}
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-8">
          <ComparisonColumn
            tone="positive"
            title={dict.landing.comparison.positiveTitle}
            bullets={dict.landing.comparison.positiveBullets}
          />

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            aria-hidden
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-white text-xs font-black uppercase tracking-wider text-secondary shadow-card">
              vs
            </span>
          </div>

          <ComparisonColumn
            tone="negative"
            title={dict.landing.comparison.negativeTitle}
            bullets={dict.landing.comparison.negativeBullets}
          />
        </div>
      </SectionContainer>
    </section>
  );
}
