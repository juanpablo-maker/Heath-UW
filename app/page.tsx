"use client";

import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useI18n } from "@/components/providers/LanguageProvider";
import { FadeInSection } from "@/components/ui/FadeInSection";

export default function Home() {
  const { dict } = useI18n();
  const copy = dict.home;
  const titleParts = copy.hero.title.split("MGA");

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-background px-6 pb-14 pt-20 md:px-10 md:pb-16 md:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="landing-hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <FadeInSection>
            <div>
              <span className="inline-flex rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#c4b5fd]">
                {copy.hero.kicker}
              </span>
              <h1 className="mt-6 max-w-4xl text-[2.75rem] font-semibold leading-[1.04] tracking-tight text-primary md:text-7xl">
                {titleParts.map((part, idx) => (
                  <span key={`${part}-${idx}`}>
                    {part}
                    {idx < titleParts.length - 1 ? (
                      <span className="bg-gradient-to-r from-[#a78bfa] via-[#c084fc] to-[#fb923c] bg-clip-text text-transparent">
                        MGA
                      </span>
                    ) : null}
                  </span>
                ))}
              </h1>
              <p className="mt-7 max-w-[58ch] text-base leading-relaxed text-secondary md:text-xl">
                {copy.hero.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#f97316] px-7 py-3.5 text-sm font-semibold text-white shadow-accent-glow transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  {copy.hero.primaryCta}
                </Link>
                <Link
                  href="/underwriting"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a78bfa]/50 hover:bg-[#181433]"
                >
                  {copy.hero.secondaryCta}
                </Link>
              </div>
            </div>
          </FadeInSection>
          <FadeInSection className="lg:pl-8">
            <aside className="relative rounded-[1.75rem] border border-border bg-card/95 p-5 shadow-card-lift backdrop-blur md:p-6">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#f97316]/20 blur-3xl" aria-hidden />
              <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#7c3aed]/25 blur-3xl" aria-hidden />
              <div className="relative rounded-2xl border border-border bg-[#0b0f24] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Underwriting Desk</p>
                  <span className="rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/20 px-2.5 py-1 text-[11px] font-semibold text-[#c4b5fd]">
                    Live
                  </span>
                </div>
                <div className="mt-4 grid gap-2">
                  {copy.credibility.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-border bg-[#131930] px-3 py-3 text-sm text-primary shadow-soft transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-border bg-gradient-to-r from-[#7c3aed]/20 to-[#f97316]/15 px-3 py-2 text-xs font-medium text-primary">
                  Portfolio utilization: 72% | Pending risk review: 4 submissions
                </div>
              </div>
            </aside>
          </FadeInSection>
        </div>
      </section>

      <section className="border-b border-border bg-backgroundSecondary px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {copy.quickTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#7c3aed]/20 bg-[#1a1636] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[#ddd6fe]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <FadeInSection className="bg-background px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.whoWeAre.title}
          </h2>
          <p className="max-w-[62ch] text-base leading-relaxed text-secondary md:text-lg">
            {copy.whoWeAre.body}
          </p>
        </div>
      </FadeInSection>

      <FadeInSection className="border-y border-border bg-backgroundSecondary px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.model.title}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {copy.model.pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lift"
              >
                <h3 className="text-xl font-semibold text-primary md:text-2xl">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary md:text-base">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="bg-background px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.edge.title}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.edge.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[#7c3aed]/40 hover:shadow-card-lift"
              >
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary md:text-base">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="bg-background px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-8 text-center shadow-card-lift md:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-secondary md:text-lg">
            {copy.finalCta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#f97316] px-7 py-3 text-sm font-semibold text-white shadow-accent-glow transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              {copy.finalCta.primary}
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-7 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a78bfa]/40 hover:bg-[#181433]"
            >
              {copy.finalCta.secondary}
            </Link>
          </div>
        </div>
      </FadeInSection>
      <Footer />
    </>
  );
}
