function SQLInjectionQueryBox({ lesson, step, username, password }) {
  if (step < 6) return null;

  return (
    <div dir="ltr" className="w-full mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-left shadow-lg shadow-black/10 dark:border-slate-600 dark:shadow-black/30">
      <div className="border-b border-slate-700 bg-slate-900 px-3 py-2 text-sm font-mono text-slate-300">
        {lesson.query.title}
      </div>
      <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words p-4 text-left font-mono text-xs leading-relaxed text-sky-300 sm:text-sm">
        {password === lesson.credentials.injectionPassword ? (
          <>
            {`SELECT *
FROM users
WHERE email = '${username}'
AND password = ''`}
            <span className="font-bold text-red-400">
              {lesson.query.injectionHighlight}
            </span>
          </>
        ) : (
          <>
            {`SELECT *
FROM users
WHERE email = '${username}'
AND password = '${password}'`}
          </>
        )}
      </pre>
    </div>
  );
}

export default SQLInjectionQueryBox;
