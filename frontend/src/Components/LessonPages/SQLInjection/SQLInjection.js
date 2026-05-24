import { useState, useEffect } from "react";

function SQLInjection() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState([]);
  const [showError, setShowError] = useState(false);

  const nextStep = () => {
    if (step < 13) setStep(step + 1);
  };

  useEffect(() => {
    if (step >= 1) setLogs(["Application initialized."]);
  }, [step]);

  const handleLogin = (e) => {
    e.preventDefault();
    const query = `SELECT * FROM users WHERE email = '${username}' AND password = '${password}'`;

    if (step < 10) {
      setLogs([
        "Application initialized. User is attempting to login...",
        `Invalid SQL: ${query}`,
      ]);
      setShowError(true);
      return;
    }

    if (username === "user@email.com" && password === "' or 1=1--") {
      setLogs([
        "Application initialized.",
        "User is attempting to login...",
        "SQL comment detected: --",
        "Authentication successful.",
      ]);
      setShowError(false);
    } else {
      setLogs([
        "Application initialized. User is attempting to login...",
        `Invalid SQL: ${query}`,
      ]);
      setShowError(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 sm:mt-14 px-4 sm:px-6 lg:px-8 pb-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
        SQL Injection
      </h1>

      <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
        {Array.from({ length: 14 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full cursor-pointer transition-transform
              ${i === step ? "bg-blue-500 scale-125" : ""}
              ${i < step ? "bg-gray-600" : "bg-gray-300"}
              hover:scale-110 hover:bg-gray-400`}
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {step === 13 && (
        <div className="flex justify-center mt-8 sm:mt-10">
          <div
            className="w-full max-w-2xl px-5 py-6 sm:px-8 sm:py-7 bg-gray-100 rounded-2xl text-base sm:text-lg leading-relaxed cursor-pointer transition-all border border-gray-200 hover:-translate-y-1 hover:shadow-xl"
            onClick={() =>
              (window.location.href = "/lessons/sql-injection-guide")
            }
          >
            <p>
              <strong>Phew</strong>. Now we know how <strong>SQL injection</strong> works,
              let's learn how to protect against this kind of attack.
            </p>
          </div>
        </div>
      )}

      {step !== 13 && (
        <div className="flex flex-col xl:flex-row justify-center items-start gap-6 lg:gap-10">
          {/* Left column */}
          <div className="w-full max-w-xl flex flex-col items-center xl:items-stretch">
            <div
              className="w-full max-w-2xl p-5 sm:p-6 bg-white border rounded-2xl cursor-pointer
              border-black active:scale-[0.98] transition touch-manipulation relative"

              onClick={nextStep}
            >
              <p className="leading-7 text-sm sm:text-base pr-8">
                {step === 0 && (
                  <>
                    This is the vulnerable application we will be trying to hack with an <strong>SQL injection</strong> attack.
                  </>
                )}
                {step === 1 && (
                  <>
                    <strong>Here are the application logs</strong>. Watch what happens here when you interact with the vulnerable application.
                  </>
                )}
                {step === 2 && (
                  <>
                    <strong>Go ahead and try logging in with the following credentials:</strong>
                    <br />
                    <br />
                    Email: <span className="text-gray-500 break-all">user@email.com</span>
                    <br />
                    Password: <span className="text-gray-500">password</span>
                  </>
                )}
                {step === 3 && (
                  <>
                    <strong>Okay, so guessing the password didn't work. </strong> Let's try adding a quote character after the password:
                    <br />
                    <br />
                    Email: <span className="text-gray-500 break-all">user@email.com</span>
                    <br />
                    Password: <span className="text-gray-500">password'</span>
                  </>
                )}
                {step === 4 && (
                  <>
                    <strong>Hmmm.</strong> The application crashed with an unexpected error. What could that mean?
                  </>
                )}
                {step === 5 && (
                  <>
                    <strong>The logs show a SQL syntax error.</strong> This indicates that the quote character messed something up in an unexpected way.
                  </>
                )}
                {step === 6 && (
                  <>
                    <strong>This is what the application code looks like behind the scenes.</strong>
                  </>
                )}
                {step === 7 && (
                  <>
                    <strong>Enter the password</strong> <span className="text-gray-500"> password'</span> and watch the code window.
                  </>
                )}
                {step === 8 && (
                  <>
                    <strong>The quote is inserted directly into the SQL string, and terminates the query early.</strong> This is what caused the syntax error we saw in the logs.
                  </>
                )}
                {step === 9 && (
                  <>
                    This behavior indicates that the application might be vulnerable to <strong>SQL injection</strong>.
                  </>
                )}
                {step === 10 && (
                  <>
                    Enter the following credentials and click Log in:
                    <br />
                    <br />
                    Email: <span className="text-gray-500 break-all">user@email.com</span>
                    <br />
                    Password: <span className="text-gray-500">' or 1=1--</span>
                  </>
                )}
                {step === 11 && (
                  <>
                    <strong>And we are in!</strong> We successfully gained access to the application without having to guess the password, using <strong>SQL injection</strong>.
                  </>
                )}
                {step === 12 && (
                  <>
                    The <span className="text-gray-500">--</span> characters you entered caused the database to ignore the rest of the SQL statement, allowing you to be authenticated without having to supply the real password.
                  </>
                )}
              </p>

              <span className="absolute right-4 bottom-4 text-lg text-gray-400">
                →
              </span>
            </div>

            {step >= 6 && (
              <div className="w-full mt-5 bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-800 text-gray-300 px-3 py-2 text-sm font-mono">
                  SQL Query
                </div>
                <pre className="m-0 p-4 font-mono text-xs sm:text-sm leading-relaxed text-blue-300 text-left whitespace-pre-wrap break-words overflow-x-auto">
                  {password === "' or 1=1--" ? (
                    <>
                      {`SELECT *
FROM users
WHERE email = '${username}'
AND password = ''`}
                      <span className="text-red-500 font-bold"> or 1=1--</span>
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
            )}
          </div>

          {/* Right column */}
          <div className="w-full max-w-xl">
            <div className="w-full bg-indigo-200 rounded-xl overflow-hidden text-left shadow-sm">
              <div className="bg-gray-200 px-4 py-2 text-sm break-all">
                www.securebank.com
              </div>

              <div className="relative min-h-[280px] sm:min-h-[300px]">
                <div
                  className={`transition-all duration-700 ${
                    step >= 11
                      ? "opacity-0 -translate-y-2 pointer-events-none"
                      : "opacity-100 translate-y-0"
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-2">
                      SECURE BANK
                    </h2>
                    <p className="mb-4 text-gray-700 text-sm sm:text-base leading-6">
                      You can trust us with your money, we almost never get hacked.
                    </p>

                    <form className="flex flex-col gap-2" onSubmit={handleLogin}>
                      <label className="text-sm mt-1">Username</label>
                      <input
                        type="text"
                        className="p-2.5 rounded-md border border-gray-300 w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />

                      <label className="text-sm mt-2">Password</label>
                      <input
                        type="text"
                        className="p-2.5 rounded-md border border-gray-300 w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <button
                        type="submit"
                        className="mt-4 p-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Log in
                      </button>
                    </form>
                  </div>
                </div>

                <div
                  className={`absolute top-8 sm:top-10 left-0 right-0 px-5 sm:px-6 transition-all duration-700 ${
                    step >= 11
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <p className="text-sm sm:text-base">
                    <strong>Welcome back user@gmail.com!</strong>
                  </p>
                  <p className="mt-2 text-sm sm:text-base">
                    Your current balance is <strong>$8,266</strong>
                  </p>
                  <button className="mt-5 p-3 bg-blue-600 text-white rounded-md font-medium transition-all shadow-sm hover:-translate-y-1 hover:shadow-lg">
                    Initiate a transfer
                  </button>
                </div>
              </div>

              {showError && (
                <div className="bg-red-200 text-red-700 p-3 mt-3 rounded-md text-sm relative mx-4 mb-4">
                  <span
                    className="absolute right-3 top-1 text-lg cursor-pointer"
                    onClick={() => setShowError(false)}
                  >
                    ×
                  </span>
                  An error occurred.
                </div>
              )}
            </div>

            {step >= 1 && (
              <div className="mt-4 w-full bg-gray-900 text-yellow-400 p-4 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1 break-words">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SQLInjection;
