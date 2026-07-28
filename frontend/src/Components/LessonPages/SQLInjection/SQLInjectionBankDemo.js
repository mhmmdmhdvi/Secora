function SQLInjectionBankDemo({
  lesson,
  step,
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  showError,
  setShowError,
}) {
  return (
    <div
      dir="ltr"
      className="mx-auto w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left text-slate-900 shadow-[0_24px_70px_-34px_rgba(30,41,59,0.45)] dark:border-border dark:bg-surface dark:text-text dark:shadow-black/30"
    >
      <div className="border-b border-slate-200 bg-slate-50 px-2.5 py-3 dark:border-border dark:bg-surface-muted sm:px-3">
        <div className="flex items-center gap-2">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm dark:border-border dark:bg-app dark:text-text-muted">
            <span className="block truncate">{lesson.bank.url}</span>
          </div>
        </div>
      </div>

      <div className="relative min-h-[340px] bg-gradient-to-b from-white via-slate-50 to-indigo-50/50 p-3 dark:bg-none dark:bg-surface sm:min-h-[360px] sm:p-5">
        <div
          className={`transition-all duration-700 ${
            step >= 11
              ? "pointer-events-none -translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-border dark:bg-app sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300 sm:text-xs sm:tracking-[0.24em]">
                  Secure portal
                </p>
                <h2 className="break-words text-lg font-bold tracking-tight text-slate-950 dark:text-text sm:text-xl">
                  {lesson.bank.title}
                </h2>
              </div>

              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 dark:bg-primary/15 dark:text-indigo-200 dark:ring-primary/20"
                aria-hidden="true"
              >
                <span className="text-xs font-black tracking-tight">SB</span>
              </div>
            </div>

            <p className="mb-5 break-words text-sm leading-6 text-slate-600 dark:text-text-muted">
              {lesson.bank.tagline}
            </p>

            <form className="flex flex-col gap-2" onSubmit={handleLogin}>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-text-muted">
                {lesson.bank.usernameLabel}
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/25 dark:border-border dark:bg-surface dark:text-text dark:placeholder:text-text-muted"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />

              <label className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-text-muted">
                {lesson.bank.passwordLabel}
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/25 dark:border-border dark:bg-surface dark:text-text dark:placeholder:text-text-muted"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="submit"
                className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl dark:bg-primary dark:hover:bg-primary-hover"
              >
                {lesson.bank.loginButton}
              </button>
            </form>
          </div>
        </div>

        <div
          className={`absolute inset-x-3 top-4 transition-all duration-700 sm:inset-x-5 sm:top-5 ${
            step >= 11
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="rounded-3xl border border-emerald-100 bg-white p-4 text-center shadow-sm dark:border-emerald-900/70 dark:bg-app sm:p-6">
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800"
              aria-hidden="true"
            >
              ✓
            </div>

            <p className="break-words text-sm font-semibold text-slate-900 dark:text-text sm:text-base">
              {lesson.bank.welcomeMessage}
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-border dark:bg-surface">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-text-muted">
                {lesson.bank.balanceMessage}
              </p>
              <p className="mt-1 break-words text-2xl font-bold text-slate-950 dark:text-text">
                {lesson.bank.balance}
              </p>
            </div>

            <button className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl">
              {lesson.bank.transferButton}
            </button>
          </div>
        </div>
      </div>

      {showError && (
        <div className="relative mx-3 mb-4 rounded-xl border border-red-200 bg-red-50 p-3 pr-9 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-950/50 dark:text-red-100 sm:mx-4">
          <span
            className="absolute right-3 top-2 cursor-pointer text-lg"
            onClick={() => setShowError(false)}
          >
            ×
          </span>
          <span className="break-words">{lesson.bank.errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default SQLInjectionBankDemo;
