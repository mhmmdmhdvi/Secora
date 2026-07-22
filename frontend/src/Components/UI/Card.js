import { classNames } from "./classNames";

function Card({ as: Component = "div", children, className = "", ...props }) {
  return (
    <Component
      className={classNames(
        "rounded-2xl border border-border bg-surface shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
