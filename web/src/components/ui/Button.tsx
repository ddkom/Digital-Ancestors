import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  const v = variant === "primary" ? "btn btn-primary" : "btn btn-ghost";
  return (
    <button type="button" className={`${v} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
