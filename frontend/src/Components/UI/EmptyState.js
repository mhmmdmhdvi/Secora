import Card from "./Card";

function EmptyState({ action, children, description, icon, title }) {
  return (
    <Card className="mx-auto max-w-md px-6 py-10 text-center sm:px-10 sm:py-12">
      {icon && (
        <div className="mb-4 text-5xl sm:text-6xl" aria-hidden="true">
          {icon}
        </div>
      )}

      <h1 className="mb-3 text-2xl font-bold text-text sm:text-3xl">
        {title}
      </h1>

      {description && (
        <p className="mb-6 text-sm leading-7 text-text-muted sm:text-base">
          {description}
        </p>
      )}

      {children}
      {action}
    </Card>
  );
}

export default EmptyState;
