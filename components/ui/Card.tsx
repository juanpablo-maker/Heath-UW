import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { components } from "@/styles/design-system";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "default" | "sm" | "none";
};

const paddingMap = {
  default: "p-6 md:p-8",
  sm: "p-5 md:p-6",
  none: "",
} as const;

export function Card({ children, className, padding = "default" }: CardProps) {
  return (
    <div className={cn(components.card.base, "backdrop-blur-sm", paddingMap[padding], className)}>
      {children}
    </div>
  );
}
