import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { components } from "@/styles/design-system";

type HeadingLevel = "h1" | "h2" | "h3";

type HeadingProps = {
  as?: HeadingLevel;
  variant?: HeadingLevel;
  children: ReactNode;
  className?: string;
};

const variantClass: Record<HeadingLevel, string> = {
  h1: components.heading.h1,
  h2: components.heading.h2,
  h3: components.heading.h3,
};

export function Heading({ as, variant = "h2", children, className }: HeadingProps) {
  const Tag = as ?? variant;
  return <Tag className={cn(variantClass[variant], className)}>{children}</Tag>;
}
