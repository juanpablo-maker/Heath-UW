"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Footer } from "@/components/Footer";

interface MarketingPageLayoutProps {
  title?: string;
  subtitle?: string;
  titleKey?: string;
  subtitleKey?: string;
  children?: ReactNode;
}

export function MarketingPageLayout({
  title,
  subtitle,
  titleKey,
  subtitleKey,
  children,
}: MarketingPageLayoutProps) {
  const { dict, t } = useI18n();
  const resolvedTitle = titleKey ? t(titleKey) : title ?? "";
  const resolvedSubtitle = subtitleKey ? t(subtitleKey) : subtitle;

  return (
    <>
      <article className="border-b border-border bg-backgroundSecondary/60 px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl lg:text-5xl">
            {resolvedTitle}
          </h1>
          {resolvedSubtitle && (
            <p className="mt-4 text-lg text-secondary md:text-xl">{resolvedSubtitle}</p>
          )}
        </div>
      </article>
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-16">
        {children}
        <p className="mt-12 text-center text-sm text-secondary">
          <Link href="/" className="font-medium text-accent hover:underline">
            {dict.marketingLayout.backHome}
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
}
