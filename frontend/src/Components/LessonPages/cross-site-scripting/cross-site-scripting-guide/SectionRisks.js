export default function SectionRisks() {
  return (
    <section className="w-full flex flex-col items-center mt-2 sm:mt-4">
      <div className="w-full max-w-4xl px-2 sm:px-0">

        {/* Title with warning icon */}
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">⚠️</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-muted">
            Risks
          </h2>
        </div>

        {/* Blue question box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 mb-4 text-left shadow-sm dark:bg-blue-950/40 dark:border-blue-800">
          <p className="text-base sm:text-lg font-medium text-blue-900 dark:text-blue-100">
            What could a determined hacker do when exploiting a XSS vulnerability?
          </p>
        </div>

        {/* Main content */}
        <div className="text-text text-base sm:text-lg leading-relaxed space-y-3 sm:space-y-4">
          <p>
            XSS allows arbitrary execution of JavaScript code, so the damage that
            can be done by an attacker depends on the sensitivity of the data being handled by your site.
            Some of the things hackers have done by exploiting XSS include:
          </p>

          {/* Bullet list */}
          <ul className="list-disc list-outside pl-6 sm:pl-10 space-y-2">
            <li>
              <strong>Spreading</strong> worms <strong>on social media sites.</strong>{" "}
              Facebook, Twitter and YouTube have all been successfully attacked in this way.
            </li>
            <li>
              <strong>Session hijacking.</strong> Malicious JavaScript may be able to
              send the session ID to a remote site under the hacker's control,
              allowing the hacker to impersonate that user by hijacking a session in progress.
            </li>
            <li>
              <strong>Identity theft.</strong> If the user enters confidential
              information such as credit card numbers into a compromised website,
              these details can be stolen using malicious JavaScript.
            </li>
            <li>
              Denial of service attacks <strong>and website vandalism.</strong>
            </li>
            <li>
              <strong>Theft of sensitive data</strong> like passwords.
            </li>
            <li>
              <strong>Financial fraud</strong> on banking sites.
            </li>
          </ul>

          {/* Closing emphasis */}
          <p>
            <strong>
              XSS vulnerabilities continue to be among the most exploited web application flaws worldwide,
              impacting even major social networks and financial institutions.
            </strong>
          </p>
        </div>

      </div>
    </section>
  );
}
