import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-label-caps transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  // Solid cobalt fill, white label.
  primary: "bg-primary text-on-primary hover:brightness-110",
  // Bordered with blue bracket corners.
  secondary:
    "bracket-corners border border-outline bg-surface-container text-on-surface hover:border-primary",
  ghost:
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
};

type ButtonProps = {
  variant?: Variant;
  href?: string;
} & ComponentProps<"a"> &
  ComponentProps<"button">;

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
