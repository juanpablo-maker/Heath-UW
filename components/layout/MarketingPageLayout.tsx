"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Heading } from "@/components/ui/Heading";
import { useI18n } from "@/components/providers/LanguageProvider";

interface MarketingPageLayoutProps {
  title?: string;
  subtitle?: string;
  titleKey?: string;
  subtitleKey?: string;
  showHeader?: boolean;
  children?: ReactNode;
}

export function MarketingPageLayout({
  title,
  subtitle,
  titleKey,
  subtitleKey,
  showHeader = true,
  children,
}: MarketingPageLayoutProps) {
  const { dict, t } = useI18n();
  const resolvedTitle = titleKey ? t(titleKey) : title ?? "";
  const resolvedSubtitle = subtitleKey ? t(subtitleKey) : subtitle;

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-16">
        {showHeader && (resolvedTitle || resolvedSubtitle) && (
          <header className="mb-10 text-center md:mb-12">
            {resolvedTitle && <Heading as="h1" variant="h1">{resolvedTitle}</Heading>}
            {resolvedSubtitle && (
              <p className="mt-4 text-lg text-secondary md:text-xl">{resolvedSubtitle}</p>
            )}
          </header>
        )}
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
