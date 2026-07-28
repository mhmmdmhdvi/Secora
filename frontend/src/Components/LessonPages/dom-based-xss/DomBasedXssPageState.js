function DomBasedXssLoading({ label = "Loading DOM-based XSS lesson..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4 text-text">
      <p className="text-text-muted">{label}</p>
    </div>
  );
}

function DomBasedXssError({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4 text-text">
      <div className="max-w-md rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {message || "DOM-based XSS lesson failed to load."}
      </div>
    </div>
  );
}

export { DomBasedXssError, DomBasedXssLoading };
