"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { NavPlatformDropdown } from "@/components/layout/NavPlatformDropdown";
import { useI18n } from "@/components/providers/LanguageProvider";
import { isFullBleedPath } from "@/lib/layout-paths";

function navTextLinkClass(active: boolean) {
  return [
    "rounded-md px-1 py-2 text-sm font-normal transition-colors",
    active
      ? "text-primary underline decoration-primary/35 underline-offset-[6px]"
      : "text-secondary/90 hover:text-primary hover:underline hover:decoration-border hover:underline-offset-[6px]",
  ].join(" ");
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const pathname = usePathname();
  const { dict } = useI18n();

  if (isFullBleedPath(pathname)) {
    return null;
  }

  const simpleLinks = [dict.nav.company] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/55 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/45">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-6 px-6 md:h-16 md:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-tight text-primary md:text-2xl"
          onClick={() => setOpen(false)}
        >
          Heath
        </Link>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <nav
            className="flex items-center gap-10"
            aria-label={dict.nav.ariaMain}
          >
            <NavPlatformDropdown
              label={dict.nav.platform}
              items={dict.nav.platformItems}
              pathname={pathname ?? null}
              menuId={dict.nav.platformMenuId}
            />
            {simpleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navTextLinkClass(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6 pl-2">
            <Link
              href="/iniciar-sesion"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
            >
              {dict.forms.login.submit}
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
            <div className="border-b border-border/40 pb-2">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-normal text-primary"
                aria-expanded={mobilePlatformOpen}
                onClick={() => setMobilePlatformOpen((v) => !v)}
              >
                <span>{dict.nav.platform}</span>
                <span className="text-secondary/70">{mobilePlatformOpen ? "−" : "+"}</span>
              </button>
              {mobilePlatformOpen && (
                <div className="mt-1 flex flex-col border-l border-border/50 pl-3" role="group" aria-label={dict.nav.platformMenuAria}>
                  {dict.nav.platformItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-md px-3 py-2.5 text-sm font-normal text-secondary/90 hover:bg-muted/60 hover:text-primary"
                      onClick={() => {
                        setOpen(false);
                        setMobilePlatformOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {simpleLinks.map((item) => (
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
              href="/iniciar-sesion"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
              onClick={() => setOpen(false)}
            >
              {dict.forms.login.submit}
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
