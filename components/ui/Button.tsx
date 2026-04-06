import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { components } from "@/styles/design-system";

type ButtonVariant = "primary" | "secondary";

type ButtonSize = "default" | "lg";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeClasses =
    size === "lg" ? components.button.sizeLg : components.button.sizeDefault;
  const variantClasses =
    variant === "primary"
      ? cn(components.button.primary, size === "lg" && components.button.primaryLg)
      : cn(components.button.secondary, size === "lg" && components.button.secondaryLg);

  const styles = cn(components.button.base, sizeClasses, variantClasses, className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={styles} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type="button" className={styles} {...buttonProps}>
      {children}
    </button>
  );
}
