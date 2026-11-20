
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`app-button ${variant} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
