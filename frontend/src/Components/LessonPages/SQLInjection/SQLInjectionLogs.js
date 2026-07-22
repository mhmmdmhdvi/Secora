function SQLInjectionLogs({ step, logs }) {
  if (step < 1) return null;

  return (
    <div dir="ltr" className="mt-4 w-full overflow-x-auto rounded-2xl border border-slate-700 bg-slate-950 p-4 text-left font-mono text-xs text-amber-300 shadow-lg shadow-black/10 dark:border-slate-600 dark:shadow-black/30 sm:text-sm">
      {logs.map((log, index) => (
        <div key={index} className="mb-1 break-words">
          {log}
        </div>
      ))}
    </div>
  );
}

export default SQLInjectionLogs;
