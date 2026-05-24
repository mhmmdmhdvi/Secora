export default function SectionOverview() {
  return (
    <section className="w-full flex flex-col items-center">

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center">
        Cross‑Site Scripting
      </h1>

      {/* Risk Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 mb-6 sm:mb-8 w-full max-w-3xl">

        {/* Prevalence */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">📊</div>
          <p className="text-sm sm:text-lg font-semibold">Prevalence</p>
          <p className="text-orange-600 font-bold text-sm sm:text-base">
            Common
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
            Harmful
          </p>
        </div>

      </div>

      {/* Description */}
      <div className="max-w-4xl px-4 sm:px-0 text-black text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6 text-left">
        <p>
          <strong>Cross‑site scripting</strong> (XSS) is one of the most common methods hackers use to attack websites. 
          XSS vulnerabilities permit a malicious user to execute arbitrary chunks of JavaScript when other users visit your site.
        </p>

        <p>
          <strong>
            XSS is the most common publicly reported security vulnerability, and part of every hacker's toolkit.
          </strong>
        </p>
      </div>

    </section>
  );
}
