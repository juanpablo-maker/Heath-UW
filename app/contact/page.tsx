"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function ContactPage() {
  const { dict, locale } = useI18n();
  const copy = dict.pagesV2.contact;

  return (
    <>
      <section className="border-b border-border bg-background px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">{copy.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-secondary md:text-xl">{copy.subtitle}</p>
          <p className="mt-8 max-w-4xl text-base leading-relaxed text-secondary md:text-lg">{copy.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="mailto:sales@heathuw.com"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
            >
              {copy.primary}
            </a>
            <Link
              href="/underwriting"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-muted/40"
            >
              {copy.secondary}
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "sales@heathuw.com",
              locale === "es" ? "Respuesta inicial en 24h hábiles" : "Initial response within 24 business hours",
              locale === "es" ? "Alianzas y capacidad" : "Partnerships and capacity",
            ].map((item) => (
              <article key={item} className="rounded-2xl border border-border bg-backgroundSecondary p-5 text-sm text-primary">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
