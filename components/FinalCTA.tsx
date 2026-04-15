"use client";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
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
        <Heading as="h2" variant="h2" className="mt-4 lg:leading-[1.1]">
          {dict.landing.finalCta.title}{" "}
          <span className="text-accent">{dict.landing.finalCta.titleAccent}</span>
        </Heading>
        <p className="mt-6 text-lg text-secondary md:text-xl">
          {dict.landing.finalCta.description}
        </p>
        <div className="mt-12 flex w-full items-center justify-center">
          <Button
            href="/iniciar-sesion"
            variant="primary"
            size="lg"
            className="w-full max-w-[320px] justify-center px-8 text-center whitespace-normal leading-tight sm:w-auto sm:min-w-[260px]"
          >
            {dict.forms.login.submit}
          </Button>
        </div>
      </div>
    </section>
  );
}
