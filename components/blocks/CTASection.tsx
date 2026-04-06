import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import { typography } from "@/styles/design-system";

type CTASectionProps = {
  kicker?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
  className?: string;
};

export function CTASection({
  kicker,
  title,
  titleAccent,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border bg-background px-6 py-24 md:px-8 md:py-32",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-90" aria-hidden />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-56 w-56 rounded-full bg-intelligence/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <Container size="prose" className="relative text-center">
        {kicker && (
          <p
            className={cn(
              typography.sizes.xs,
              "font-bold uppercase tracking-[0.22em] text-intelligence"
            )}
          >
            {kicker}
          </p>
        )}
        <Heading as="h2" variant="h2" className="mt-4 lg:leading-[1.1]">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-accent">{titleAccent}</span>
            </>
          )}
        </Heading>
        {description && (
          <Text size="lg" className="mt-6 md:text-xl">
            {description}
          </Text>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button href={primaryHref} variant="primary" size="lg">
            {primaryLabel}
          </Button>
          {secondaryHref && secondaryLabel && (
            <Button href={secondaryHref} variant="secondary" size="lg">
              {secondaryLabel}
            </Button>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
