import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import { typography } from "@/styles/design-system";

type FeatureSectionProps = {
  kicker?: string;
  title: string;
  description?: string;
  bullets?: readonly string[];
  children?: ReactNode;
  className?: string;
};

export function FeatureSection({
  kicker,
  title,
  description,
  bullets,
  children,
  className,
}: FeatureSectionProps) {
  return (
    <Section background="none" className={className}>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
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
          <Heading as="h2" variant="h2" className={cn(kicker && "mt-3")}>
            {title}
          </Heading>
          {description && (
            <Text size="lg" className="mt-4">
              {description}
            </Text>
          )}
        </div>

        {bullets && bullets.length > 0 && (
          <ul className="mx-auto mt-10 max-w-2xl list-disc space-y-3 pl-5 text-left text-secondary md:text-lg">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {children}
      </Container>
    </Section>
  );
}
