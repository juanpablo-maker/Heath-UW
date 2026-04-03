import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-secondary/40 hover:shadow-card md:p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-accent">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-primary">
        {title}
      </h3>
      <p className="mt-2 text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
