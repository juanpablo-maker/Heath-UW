"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MarketingPageLayout } from "@/components/layout/MarketingPageLayout";

export default function MesaDeTrabajoPage() {
  const { dict } = useI18n();
  return (
    <MarketingPageLayout title={dict.pages.mesa.title} subtitle={dict.pages.mesa.subtitle}>
      <div className="space-y-8 text-secondary">
        <div className="space-y-3">
          <p className="text-lg">{dict.pages.mesa.p1}</p>
          <p className="text-secondary">{dict.pages.mesa.p2}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {dict.pages.mesa.cards.map((item) => (
            <FeatureCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/iniciar-sesion?redirect=/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-accent-glow transition-all hover:brightness-105 active:scale-[0.98]"
          >
            {dict.pages.mesa.primary}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-soft transition-all hover:border-intelligence/25 hover:shadow-card active:scale-[0.98]"
          >
            {dict.pages.mesa.secondary}
          </Link>
        </div>
      </div>
    </MarketingPageLayout>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card-lift ring-1 ring-primary/[0.03]">
      <div className="text-sm font-bold text-primary">{title}</div>
      <div className="mt-2 text-sm text-secondary">{description}</div>
    </div>
  );
}
