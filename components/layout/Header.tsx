"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/components/providers/LanguageProvider";
import { isFullBleedPath } from "@/lib/layout-paths";

function navTextLinkClass(active: boolean) {
  return [
    "rounded-md px-1 py-2 text-sm font-medium transition-colors",
    active
      ? "text-primary underline decoration-primary/30 underline-offset-[8px]"
      : "text-secondary/90 hover:text-primary hover:underline hover:decoration-border hover:underline-offset-[8px]",
  ].join(" ");
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { dict } = useI18n();

  const links = useMemo(
    () => [
      dict.nav.home,
      dict.nav.portfolio,
      dict.nav.company,
      dict.nav.contact,
    ],
    [dict]
  );

  if (isFullBleedPath(pathname)) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-6 px-6 md:h-16 md:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-primary md:text-2xl"
          onClick={() => setOpen(false)}
        >
          Heath
        </Link>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <nav className="flex items-center gap-8" aria-label={dict.nav.ariaMain}>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navTextLinkClass(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 pl-2">
            <Link
              href="/iniciar-sesion?redirect=/panel-de-suscripcion-dashboard"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
            >
              {dict.nav.signIn}
            </Link>

            <LanguageSwitcher />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/80 text-primary"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{dict.nav.menu}</span>
            {open ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-0.5" aria-label={dict.nav.ariaMobile}>
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-3 text-sm font-normal ${
                  pathname === item.href ? "bg-muted/50 text-primary" : "text-primary hover:bg-muted/50"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/iniciar-sesion?redirect=/panel-de-suscripcion-dashboard"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
              onClick={() => setOpen(false)}
            >
              {dict.nav.signIn}
            </Link>

            <div className="mt-4 flex justify-start">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
