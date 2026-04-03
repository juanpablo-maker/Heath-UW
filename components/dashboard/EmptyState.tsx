import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-backgroundSecondary/80 px-6 py-12 text-center">
      <Icon
        className="mb-3 h-9 w-9 text-secondary/70"
        strokeWidth={1.25}
        aria-hidden
      />
      <p className="text-sm font-medium text-primary">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-xs text-secondary">{description}</p>
      ) : null}
    </div>
  );
}
