export default function SectionOverview() {
  return (
    <section className="w-full flex flex-col items-center">

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 sm:mb-12 text-center">
        SQL Injection
      </h1>

      {/* Risk Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 mb-10 sm:mb-12 w-full max-w-3xl">

        {/* Prevalence */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">📊</div>
          <p className="text-sm sm:text-lg font-semibold">Prevalence</p>
          <p className="text-orange-600 font-bold text-sm sm:text-base">
            Occasional
          </p>
        </div>

        {/* Exploitability */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">💣</div>
          <p className="text-sm sm:text-lg font-semibold">Exploitability</p>
          <p className="text-red-600 font-bold text-sm sm:text-base">
            Easy
          </p>
        </div>

        {/* Impact */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">🔥</div>
          <p className="text-sm sm:text-lg font-semibold">Impact</p>
          <p className="text-rose-600 font-bold text-sm sm:text-base">
            Devastating
          </p>
        </div>

      </div>

      {/* Description */}
      <div className="max-w-4xl px-4 sm:px-0 text-black text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6 text-left">
        <p>
          <strong>SQL Injection</strong> is a type of injection attack. Injection attacks occur when
          maliciously crafted inputs are submitted by an attacker, causing an application to perform
          an unintended action. Because of the ubiquity of SQL databases, SQL injection is one of the
          most common types of attack on the internet.
        </p>

        <p>
          <strong>
            If you only have time to protect yourself against one vulnerability, you should be
            checking for SQL injection vulnerabilities in your codebase!
          </strong>
        </p>
      </div>

    </section>
  );
}
