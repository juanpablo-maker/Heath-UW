import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { layout, spacing } from "@/styles/design-system";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Narrower max width for long-form content */
  size?: "default" | "prose";
};

export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto",
        spacing.containerX,
        size === "prose" ? layout.maxWidthProse : layout.maxWidth,
        className
      )}
    >
      {children}
    </div>
  );
}
