import { useId } from "react";
import { classNames } from "./classNames";

function Field({
  className = "",
  error,
  hint,
  id,
  label,
  labelClassName = "",
  type = "text",
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const descriptionId = `${fieldId}-description`;
  const hasDescription = Boolean(error || hint);

  return (
    <div className={classNames("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={classNames("text-sm font-medium text-text", labelClassName)}
        >
          {label}
        </label>
      )}

      <input
        id={fieldId}
        type={type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={classNames(
          "rounded-lg border px-4 py-3 outline-none transition",
          "border-border bg-surface text-text placeholder:text-text-muted",
          "focus:border-primary focus:ring-2 focus:ring-primary/30"
        )}
        {...props}
      />

      {hasDescription && (
        <p
          id={descriptionId}
          className={classNames(
            "text-sm",
            error ? "text-danger" : "text-text-muted"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default Field;
