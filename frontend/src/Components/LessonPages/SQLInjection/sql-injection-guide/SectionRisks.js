export default function SectionRisks() {
  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-2 sm:px-0">

        {/* Title with warning icon */}
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">⚠️</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-500">
            Risks
          </h2>
        </div>

        {/* Intro paragraph */}
        <div className="text-black text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6">
          <p>
            Our example hack showed you how to bypass the login page: a huge security flaw for a banking site.
            More complex attacks will allow an attacker to run arbitrary statements on the database. In the past,
            hackers have used injection attacks to:
          </p>

          {/* Bullet list */}
          <ul className="list-disc list-outside pl-6 sm:pl-10 space-y-2">
            <li>
              <strong>Extract sensitive information</strong>, like Social Security numbers, or credit card details.
            </li>
            <li>
              <strong>Enumerate the authentication details of users registered on a website,</strong>
              so these logins can be used in attacks on other sites.
            </li>
            <li>
              <strong>Delete data or drop tables</strong>, corrupting the database, and making the website unusable.
            </li>
            <li>
              <strong>Inject further malicious code</strong> to be executed when users visit the site.
            </li>
          </ul>

          {/* Closing paragraph */}
          <p>
            <strong>SQL injection attacks are astonishingly common.</strong> Major companies like Yahoo and Sony
            have had their applications compromised. In other cases, hacker groups targeted specific applications
            or wrote scripts intended to harvest authentication details. Not even security firms are immune!
          </p>
        </div>

      </div>
    </section>
  );
}
