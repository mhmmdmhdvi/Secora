import { classNames } from "./classNames";

const TONES = {
  info: "border-primary/30 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  danger: "border-danger/30 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100",
  success: "border-success/30 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-100",
  warning: "border-warning/30 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
};

function Callout({ children, className = "", icon, title, tone = "info" }) {
  return (
    <div
      className={classNames(
        "rounded-2xl border p-5 leading-7",
        TONES[tone] || TONES.info,
        className
      )}
    >
      {(icon || title) && (
        <div className="mb-2 flex items-center gap-2 font-bold">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title && <span>{title}</span>}
        </div>
      )}

      {children}
    </div>
  );
}

export default Callout;
