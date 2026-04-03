import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Usar `div` cuando ya exista un `<section>` padre (evita sections anidadas). */
  as?: "section" | "div";
}

export function SectionContainer({
  children,
  className = "",
  as: Tag = "section",
}: SectionContainerProps) {
  return (
    <Tag
      className={`mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24 ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
