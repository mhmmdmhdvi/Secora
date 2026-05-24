import React from "react";

export default function SQLInjectionGuide() {
  return (
    <div className="w-full min-h-screen bg-white text-gray-900 px-16 py-12">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10">SQL Injection</h1>

      {/* Section 1: Overview Boxes */}
      <div className="flex justify-center gap-6 mb-12">
        {/* Prevalence */}
        <div className="w-64 bg-orange-50 border border-orange-300 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
          <svg
            className="w-6 h-6 text-orange-500 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <h2 className="text-lg font-semibold mb-1">Prevalence</h2>
          <p className="text-xl font-bold text-orange-600">Occasional</p>
        </div>

        {/* Exploitability */}
        <div className="w-64 bg-red-50 border border-red-300 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
          <svg
            className="w-6 h-6 text-red-500 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l7 7-7 7-7-7z" />
            <path d="M12 9v6" />
          </svg>
          <h2 className="text-lg font-semibold mb-1">Exploitability</h2>
          <p className="text-xl font-bold text-red-600">Easy</p>
        </div>

        {/* Impact */}
        <div className="w-64 bg-[#fdf2f2] border border-[#d8a2a2] rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
          <svg
            className="w-6 h-6 text-[#a94442] mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <h2 className="text-lg font-semibold mb-1">Impact</h2>
          <p className="text-xl font-bold text-[#a94442]">Devastating</p>
        </div>
      </div>

      {/* Section 1: Description */}
      <div className="max-w-4xl mx-auto space-y-6 mb-16">
        <p className="text-lg leading-relaxed">
          <strong>SQL Injection</strong> is a type of injection attack. Injection
          attacks occur when maliciously crafted inputs are submitted by an
          attacker, causing an application to perform an unintended action.
          Because of the ubiquity of SQL databases, SQL injection is one of the
          most common types of attack on the internet.
        </p>

        <p className="text-lg font-semibold">
          <strong>
            If you only have time to protect yourself against one vulnerability,
            you should be checking for SQL injection vulnerabilities in your
            codebase!
          </strong>
        </p>
      </div>

      {/* Section 2: Risks */}
<div className="max-w-4xl mx-auto">

  {/* Section label with icon */}
<div className="flex items-center gap-3 mb-4">
  <svg
    className="w-10 h-10 text-yellow-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.14A1.5 1.5 0 003.07 20h17.86a1.5 1.5 0 001.26-2.24L13.71 3.86a1.5 1.5 0 00-2.42 0z"
    />
  </svg>

  <h2 className="text-4xl font-bold text-gray-700">Risks</h2>
</div>



  {/* Light blue question box */}
  <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 mb-6">
    <p className="text-lg font-semibold text-black">
      What&apos;s the worst thing that could happen when you suffer a SQL
      injection attack?
    </p>
  </div>

  {/* Body text */}
  <p className="text-lg leading-relaxed mb-4">
    Our example hack showed you how to bypass the login page: a huge
    security flaw for a banking site. More complex attacks will allow an
    attacker to run arbitrary statements on the database. In the past,
    hackers have used injection attacks to:
  </p>

  {/* Bullet-style list */}
  <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed mb-6">
    <li>
      <strong>Extract sensitive information</strong>, like Social
      Security numbers, or credit card details.
    </li>
    <li>
      <strong>
        Enumerate the authentication details of users registered on a
        website,
      </strong>{" "}
      so these logins can be used in attacks on other sites.
    </li>
    <li>
      <strong>Delete data or drop tables</strong>, corrupting the
      database, and making the website unusable.
    </li>
    <li>
      <strong>Inject further malicious code</strong> to be executed when
      users visit the site.
    </li>
  </ul>

  {/* Closing emphasis */}
  <p className="text-lg leading-relaxed">
    <strong>SQL injection attacks are astonishingly common.</strong> Major
    companies like Yahoo and Sony have had their applications compromised.
    In other cases, hacker groups targeted specific applications or wrote
    scripts intended to harvest authentication details. Not even security
    firms are immune!
  </p>

</div>

{/* Section 3: Protection */}
<div className="max-w-4xl mx-auto mt-20">

  {/* Protection Header */}
  <div className="flex items-center gap-3 mb-6">
    <svg
      className="w-10 h-10 text-blue-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
      />
    </svg>

    <h2 className="text-4xl font-bold text-gray-700">
      Protection
    </h2>
  </div>

  {/* Blue emphasis box */}
  <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-5 mb-10">
    <p className="text-lg font-semibold text-black">
      So SQL Injection is a serious risk. How can you protect yourself?
    </p>
  </div>

  {/* Subsection Title */}
  <h3 className="text-2xl font-bold mb-4">
    Parameterized Statements
  </h3>

  {/* Explanation */}
  <p className="text-lg leading-relaxed mb-4">
    Programming languages talk to SQL databases using 
    <strong> database drivers.</strong> A driver allows an application to 
    construct and run SQL statements against a database, extracting and 
    manipulating data as needed. <strong>Parameterized statements</strong> 
    make sure that the parameters (i.e. inputs) passed into SQL statements 
    are treated in a safe manner.
  </p>

  <p className="text-lg leading-relaxed mb-6">
    For example, a secure way of running a SQL query in JDBC using a 
    parameterized statement would be:
  </p>

  {/* Fake macOS Terminal */}
  <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden mb-12">

    {/* Mac top bar */}
    <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2a]">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>

    {/* Code area */}
    <div className="px-6 py-6 font-mono text-sm leading-7">

      <p className="text-gray-400">// Connect to the database.</p>
      <p>
        <span className="text-orange-400">Connection</span>{" "}
        <span className="text-green-400">conn</span>{" "}
        <span className="text-white">= DriverManager.getConnection(URL, USER, PASS);</span>
      </p>

      <br />

      <p className="text-gray-400">// Construct the SQL statement we want to run, specifying the parameter.</p>
      <p>
        <span className="text-orange-400">String</span>{" "}
        <span className="text-green-400">sql</span>{" "}
        <span className="text-white">= </span>
        <span className="text-green-400">"SELECT * FROM users WHERE email = ?"</span>
        <span className="text-white">;</span>
      </p>

      <br />

      <p className="text-gray-400">// Generate a prepared statement with the placeholder parameter.</p>
      <p>
        <span className="text-orange-400">PreparedStatement</span>{" "}
        <span className="text-green-400">stmt</span>{" "}
        <span className="text-white">= conn.prepareStatement(sql);</span>
      </p>

      <br />

      <p className="text-gray-400">// Bind email value into the statement at parameter index 1.</p>
      <p>
        <span className="text-white">stmt.setString(</span>
        <span className="text-orange-400">1</span>
        <span className="text-white">, email);</span>
      </p>

      <br />

      <p className="text-gray-400">// Run the query...</p>
      <p>
        <span className="text-orange-400">ResultSet</span>{" "}
        <span className="text-green-400">results</span>{" "}
        <span className="text-white">= stmt.executeQuery(sql);</span>
      </p>

      <br />

      <p>
        <span className="text-blue-400">while</span>
        <span className="text-white"> (results.next())</span>
      </p>
      <p className="text-white">{`{`}</p>
      <p className="text-gray-400 pl-6">// ...do something with the data returned.</p>
      <p className="text-white">{`}`}</p>

    </div>
  </div>

</div>


    </div>
  );
}
