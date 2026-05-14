import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        loading && "is-loading",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      <span className="btn__content" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {icon && <span className="btn__icon">{icon}</span>}
        {children}
      </span>
    </button>
  );
};
