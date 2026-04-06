import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { components, spacing } from "@/styles/design-system";

type SectionProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  /** Vertical rhythm: default matches marketing sections */
  density?: "default" | "compact";
  /** Optional full-bleed background */
  background?: "none" | "subtle" | "muted";
};

const backgrounds = {
  none: "",
  subtle: "bg-backgroundSecondary/60",
  muted: "bg-muted/40",
} as const;

export function Section({
  children,
  className,
  as: Tag = "section",
  density = "default",
  background = "none",
}: SectionProps) {
  return (
    <Tag
      className={cn(
        density === "default" ? components.section : spacing.sectionYSm,
        backgrounds[background],
        className
      )}
    >
      {children}
    </Tag>
  );
}
