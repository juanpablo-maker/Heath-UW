import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import { typography } from "@/styles/design-system";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  kicker?: string;
  align?: "center" | "left";
  children?: ReactNode;
  className?: string;
};

export function HeroSection({
  title,
  subtitle,
  kicker,
  align = "center",
  children,
  className,
}: HeroSectionProps) {
  return (
    <Section
      background="subtle"
      density="compact"
      className={cn("border-b border-border", className)}
    >
      <Container>
        <div
          className={cn(
            "mx-auto max-w-3xl",
            align === "center" ? "text-center" : "text-left"
          )}
        >
          {kicker && (
            <p
              className={cn(
                typography.sizes.xs,
                "font-bold uppercase tracking-[0.2em] text-secondary"
              )}
            >
              {kicker}
            </p>
          )}
          <Heading as="h1" variant="h1" className={cn(kicker && "mt-3")}>
            {title}
          </Heading>
          {subtitle && (
            <Text size="lg" className={cn("mt-4 md:text-xl")}>
              {subtitle}
            </Text>
          )}
          {children}
        </div>
      </Container>
    </Section>
  );
}
