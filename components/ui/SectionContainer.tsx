import React from "react";
import { Container } from "./Container";
import { Section } from "./Section";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Usar `div` cuando ya exista un `<section>` padre (evita sections anidadas). */
  as?: "section" | "div";
}

/**
 * Full-width section with vertical rhythm + centered container (legacy name, same as Section + Container).
 */
export function SectionContainer({
  children,
  className = "",
  as = "section",
}: SectionContainerProps) {
  return (
    <Section as={as} className={className}>
      <Container>{children}</Container>
    </Section>
  );
}
