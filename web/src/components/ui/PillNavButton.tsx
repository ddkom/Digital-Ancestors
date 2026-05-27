import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  active?: boolean;
  children: ReactNode;
};

export function PillNavButton({ active, children, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      className={[active ? "primary" : "", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
