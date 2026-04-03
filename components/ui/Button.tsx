import React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50";
  const variants = {
    primary:
      "bg-accent text-white shadow-sm hover:bg-orange-700 active:scale-[0.98]",
    secondary:
      "border border-border bg-white text-primary hover:border-secondary hover:bg-muted active:scale-[0.98]",
  };

  const combinedClassName = `${base} ${variants[variant]} ${className}`.trim();

  return (
    <button type="button" className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
