import { classNames } from "./classNames";

const VARIANTS = {
  primary: "bg-primary text-text-inverted hover:bg-primary-hover",
  secondary: "bg-surface-muted text-text hover:bg-border/60",
  danger: "bg-danger text-text-inverted hover:bg-danger-hover",
  ghost: "bg-transparent text-text-muted hover:bg-surface-muted hover:text-text",
};

const SIZES = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
};

function Button({
  children,
  className = "",
  disabled = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center rounded-xl font-semibold transition",
        "focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
