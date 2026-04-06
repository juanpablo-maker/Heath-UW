import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type IndustryGridProps = {
  children: ReactNode;
  className?: string;
};

export function IndustryGrid({ children, className }: IndustryGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
