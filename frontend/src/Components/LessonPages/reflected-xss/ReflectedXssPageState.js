export function ReflectedXssLoading({ label = "Loading Reflected XSS lesson..." }) {
  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-surface p-6 text-center text-text-muted">
      {label}
    </div>
  );
}

export function ReflectedXssError({ message }) {
  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-danger/30 bg-danger/10 p-6 text-center text-danger">
      Reflected XSS lesson failed to load.
      <div className="mt-2 text-sm opacity-80">{message}</div>
    </div>
  );
}
