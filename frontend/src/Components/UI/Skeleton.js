import { classNames } from "./classNames";

function Skeleton({ className = "", label = "Loading" }) {
  return (
    <div
      aria-label={label}
      role="status"
      className={classNames(
        "animate-pulse rounded-xl bg-surface-muted",
        className
      )}
    />
  );
}

export default Skeleton;
