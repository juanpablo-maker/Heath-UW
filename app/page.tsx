"use client";

import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function Home() {
  const { dict } = useI18n();
  const copy = dict.home;

  return (
    <>
      <section className="border-b border-border bg-background px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              {copy.hero.kicker}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-primary md:text-6xl">
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-secondary md:text-xl">
              {copy.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {copy.hero.primaryCta}
              </Link>
              <Link
                href="/underwriting"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-muted/40"
              >
                {copy.hero.secondaryCta}
              </Link>
            </div>
          </div>
          <aside className="rounded-3xl border border-border bg-backgroundSecondary p-6 shadow-soft md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              {copy.credibility.title}
            </p>
            <div className="mt-4 space-y-3">
              {copy.credibility.items.map((item) => (
                <div key={item} className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-border bg-backgroundSecondary px-6 py-7 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {copy.quickTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-background px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.3fr] md:items-start">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.whoWeAre.title}
          </h2>
          <p className="text-base leading-relaxed text-secondary md:text-lg">
            {copy.whoWeAre.body}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-backgroundSecondary px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.model.title}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {copy.model.pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-soft"
              >
                <h3 className="text-xl font-semibold text-primary">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary md:text-base">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.edge.title}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.edge.items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary md:text-base">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-8 text-center shadow-card md:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {copy.finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-secondary md:text-lg">
            {copy.finalCta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {copy.finalCta.primary}
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-muted/40"
            >
              {copy.finalCta.secondary}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
