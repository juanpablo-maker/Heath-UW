"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function CompanyPage() {
  const { dict, locale } = useI18n();
  const copy = dict.pagesV2.company;

  return (
    <>
      <section className="border-b border-border bg-background px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">{copy.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-secondary md:text-xl">{copy.subtitle}</p>
          <p className="mt-8 max-w-4xl text-base leading-relaxed text-secondary md:text-lg">{copy.intro}</p>
        </div>
      </section>
      <section className="bg-backgroundSecondary px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            locale === "es" ? "Gobernanza de suscripción" : "Underwriting governance",
            locale === "es" ? "Alineación con capacidad" : "Capacity alignment",
            locale === "es" ? "Compromiso de largo plazo" : "Long-term partnership commitment",
          ].map((item) => (
            <article key={item} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
              <p className="text-sm leading-relaxed text-primary md:text-base">{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-background px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-3 rounded-2xl border border-border bg-backgroundSecondary p-6 md:items-center md:justify-between md:p-8">
          <p className="text-sm font-medium text-primary md:text-base">
            {locale === "es" ? "Conozcamos oportunidades de colaboración institucional." : "Let's explore institutional collaboration opportunities."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white">
              {dict.nav.contact.label}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
