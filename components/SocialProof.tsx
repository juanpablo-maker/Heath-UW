"use client";

import React from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { SectionContainer } from "./ui/SectionContainer";

export function SocialProof() {
  const { dict } = useI18n();

  return (
    <SectionContainer className="py-20 md:py-24">
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
          {dict.landing.social.kicker}
        </p>
        <h2 className="mt-3 bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
          {dict.landing.social.title}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {dict.landing.social.logos.map((name) => (
          <div
            key={name}
            className="group relative flex h-[4.5rem] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card text-xs font-bold text-secondary shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:text-primary hover:shadow-card-lift"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(249,115,22,0.06), rgba(124,58,237,0.05))",
              }}
              aria-hidden
            />
            <span className="relative">{name}</span>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
