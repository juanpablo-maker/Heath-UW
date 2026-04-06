import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { typography } from "@/styles/design-system";

type TextVariant = "normal" | "muted";

type TextProps = {
  children: ReactNode;
  variant?: TextVariant;
  as?: "p" | "span" | "div";
  className?: string;
  size?: keyof typeof typography.sizes;
};

export function Text({
  children,
  variant = "normal",
  as: Tag = "p",
  className,
  size = "base",
}: TextProps) {
  return (
    <Tag
      className={cn(
        typography.sizes[size],
        variant === "muted" ? "text-secondary/75" : "text-secondary",
        typography.leading.relaxed,
        className
      )}
    >
      {children}
    </Tag>
  );
}
