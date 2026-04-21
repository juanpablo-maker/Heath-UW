"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/LanguageProvider";

export function Footer() {
  const { dict } = useI18n();

  return (
    <footer className="border-t border-border bg-backgroundSecondary px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-primary md:text-2xl"
            >
              Heath
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              {dict.footer.description}
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {dict.footer.contact}
            </Link>
            <a
              href="mailto:sales@heathuw.com"
              className="mt-2 block text-sm text-secondary transition-colors hover:text-primary"
            >
              sales@heathuw.com
            </a>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
            {(
              [
                ...dict.nav.footerLinks,
                {
                  href: "/contact",
                  label: dict.nav.cta,
                },
              ] as {
                href: string;
                label: string;
              }[]
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-secondary">
          {dict.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
