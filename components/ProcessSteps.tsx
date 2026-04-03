"use client";

import React from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { SectionContainer } from "./ui/SectionContainer";

export function ProcessSteps() {
  const { dict } = useI18n();

  return (
    <section
      className="relative overflow-hidden border-y border-border/80 bg-background"
      aria-labelledby="process-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(124,58,237,0.06),transparent)]"
        aria-hidden
      />
      <SectionContainer as="div" className="relative py-20 md:py-28">
        <div className="mb-14 text-center md:mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {dict.landing.process.kicker}
          </p>
          <h2
            id="process-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-[2.35rem]"
          >
            {dict.landing.process.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-secondary">
            {dict.landing.process.subtitle}
          </p>
        </div>

        <div className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Línea conectora (desktop) */}
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-[2.25rem] hidden h-0.5 bg-gradient-to-r from-accent/20 via-intelligence/25 to-positive/20 lg:block"
            aria-hidden
          />

          {dict.landing.process.steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-accent bg-white text-lg font-black text-accent shadow-accent-glow transition-transform duration-300 hover:scale-105">
                {index + 1}
              </div>
              <h3 className="mt-5 text-base font-bold text-primary">
                {step.label}
              </h3>
              <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-secondary">
                {step.subline}
              </p>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
