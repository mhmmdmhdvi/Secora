import { useState } from "react";
import TerminalBox from "../../SQLInjection/sql-injection-guide/TerminalBox";
import { useNavigate } from "react-router-dom";

export default function CrossSiteScriptInclusionGuide() {
    const navigate = useNavigate();
  const [open, setOpen] = useState({
    React: false,
    Angular: false,
  });

  const toggle = (section) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionCode = ({ title, children }) => {
    const isOpen = open[title];

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
        <button
          onClick={() => toggle(title)}
          className="w-full flex justify-between items-center px-5 sm:px-6 py-5 text-left font-semibold
            text-gray-800 bg-white hover:bg-gray-50 active:scale-[0.98] transition"
        >
          <span>{title}</span>
          <span
            className={`transform transition-transform duration-300 text-gray-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6 pt-2 text-black">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-4 sm:px-0 space-y-10">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
          Cross-Site Script Inclusion (XSSI)
        </h1>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 mb-10 sm:mb-12 w-full max-w-3xl">

  {/* Prevalence */}
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
    <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">📊</div>
    <p className="text-sm sm:text-lg font-semibold text-black">Prevalence:</p>
    <p className="text-orange-600 font-bold text-sm sm:text-base">
      Occasional
    </p>
  </div>

  {/* Exploitability */}
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
    <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">💣</div>
    <p className="text-sm sm:text-lg font-semibold text-black">Exploitability:</p>
    <p className="text-red-600 font-bold text-sm sm:text-base">
      Easy
    </p>
  </div>

  {/* Impact */}
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
    <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">🔥</div>
    <p className="text-sm sm:text-lg font-semibold text-black">Impact:</p>
    <p className="text-orange-600 font-bold text-sm sm:text-base">
      Harmful
    </p>
  </div>

</div>


        {/* Intro */}
        <p className="text-base sm:text-lg text-black leading-relaxed">
          A Cross-Site Script Inclusion (XSSI) attack occurs when a malicious
          site imports JavaScript from a third-party domain and is able to
          extract sensitive details like user credentials from the imported script.
        </p>

        {/* Risks Title */}
<div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
  <span className="text-2xl sm:text-3xl" aria-hidden="true">⚠️</span>
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-500">
    Risks
  </h2>
</div>

        <p className="text-base sm:text-lg text-black leading-relaxed">
          If your website stores sensitive data in JavaScript files, an attacker
          can trick users into visiting a malicious site which imports your JavaScript
          code, allowing the attacker to scoop up any sensitive data included within
          that code.
        </p>

        {/* Anatomy */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-500">
          Anatomy of an XSSI Attack
        </h2>
        <p className="text-base sm:text-lg text-black leading-relaxed space-y-4">
          JavaScript files are not subject to the same-origin policy in browsers
          in the same way that other content types (like JSON and HTML) are. This
          allows JavaScript files to be included from different domains, but also
          creates an opportunity for attackers to steal sensitive data written
          inside those files.
          <br /><br />
          Developers often embed state directly into JavaScript files for
          Single Page Apps (SPAs), giving scripts contextual information even
          before loading additional data. However, any website can import your
          transpiled JavaScript files with a simple {"<script>"} tag.
          <br /><br />
          A malicious website can include your JavaScript bundles, harvest the
          sensitive data embedded within them, and even lure victims by posting
          links inside comments on your legitimate site.
        </p>

        {/* Mitigation */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-500">
          Mitigation
        </h2>

        <p className="text-base sm:text-lg text-black leading-relaxed">
          To avoid XSSI attacks, do not interpolate sensitive data directly into
          JavaScript files. Instead, load state using JSON endpoints or encode
          data in HTML where the browser’s same-origin policy provides protection.
          Below are safe examples showing how to initialize page state in React
          and Angular by loading configuration from a JSON URL.
        </p>

        {/* Code Accordion */}
        <div className="space-y-4">

          {/* React */}
          <SectionCode title="React">
            <TerminalBox>
              <span className="text-gray-400">// Retrieve configuration information from the server.</span>{"\n"}
              <span className="text-blue-400">async</span>{" "}
              <span className="text-orange-400">componentDidMount</span>
              <span className="text-white">()</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"  "}
              <span className="text-blue-400">const</span>{" "}
              <span className="text-white">response</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-blue-400">await</span>{" "}
              <span className="text-orange-400">fetch</span>
              <span className="text-white">(</span>
              <span className="text-green-400">'/api/config'</span>
              <span className="text-white">)</span>{"\n"}
              {"  "}
              <span className="text-blue-400">const</span>{" "}
              <span className="text-white">data</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-blue-400">await</span>{" "}
              <span className="text-white">response.</span>
              <span className="text-orange-400">json</span>
              <span className="text-white">()</span>{"\n\n"}
              {"  "}
              <span className="text-green-400">this</span>
              <span className="text-white">.</span>
              <span className="text-orange-400">setState</span>
              <span className="text-white">({`{`}</span>{"\n"}
              {"    "}
              <span className="text-white">loading:</span>{" "}
              <span className="text-orange-400">false</span>
              <span className="text-white">,</span>{"\n"}
              {"    "}
              <span className="text-white">user:</span>{" "}
              <span className="text-white">data.user</span>
              <span className="text-white">,</span>{"\n"}
              {"    "}
              <span className="text-white">accessToken:</span>{" "}
              <span className="text-white">data.accessToken</span>{"\n"}
              <span className="text-white">{`  }`}</span>{"\n"}
              <span className="text-white">{`}`}</span>
            </TerminalBox>
          </SectionCode>

          {/* AngularJS */}
          <SectionCode title="Angular JS">
            <TerminalBox>
              <span className="text-gray-400">// The configuration information we will retrieve from the server.</span>{"\n"}
              <span className="text-blue-400">export interface</span>{" "}
              <span className="text-orange-400">Config</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"  "}
              <span className="text-blue-400">username</span>
              <span className="text-white">:</span>{" "}
              <span className="text-orange-400">string</span>
              <span className="text-white">;</span>{"\n"}
              {"  "}
              <span className="text-blue-400">accessToken</span>
              <span className="text-white">:</span>{" "}
              <span className="text-orange-400">string</span>
              <span className="text-white">;</span>{"\n"}
              {"  "}
              <span className="text-blue-400">role</span>
              <span className="text-white">:</span>{" "}
              <span className="text-orange-400">string</span>
              <span className="text-white">;</span>{"\n"}
              <span className="text-white">{`}`}</span>{"\n\n"}

              <span className="text-blue-400">@Injectable</span>
              <span className="text-white">()</span>{"\n"}
              <span className="text-blue-400">export class</span>{" "}
              <span className="text-orange-400">ConfigService</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"  "}
              <span className="text-orange-400">constructor</span>
              <span className="text-white">(</span>
              <span className="text-blue-400">private</span>{" "}
              <span className="text-white">http:</span>{" "}
              <span className="text-orange-400">HttpClient</span>
              <span className="text-white">)</span>{" "}
              <span className="text-white">{`{}`}</span>{"\n\n"}
              {"  "}
              <span className="text-gray-400">// Retrieve configuration information from the server.</span>{"\n"}
              {"  "}
              <span className="text-orange-400">getConfig</span>
              <span className="text-white">()</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"    "}
              <span className="text-blue-400">return</span>{" "}
              <span className="text-green-400">this</span>
              <span className="text-white">.http.get&lt;</span>
              <span className="text-orange-400">Config</span>
              <span className="text-white">&gt;(</span>
              <span className="text-green-400">'api/config'</span>
              <span className="text-white">).</span>
              <span className="text-orange-400">pipe</span>
              <span className="text-white">(</span>
              <span className="text-orange-400">catchError</span>
              <span className="text-white">(</span>
              <span className="text-green-400">this</span>
              <span className="text-white">.</span>
              <span className="text-orange-400">handleError</span>
              <span className="text-white">)</span>
              <span className="text-white">)</span>
              {"\n"}
              {"  "}
              <span className="text-white">{`}`}</span>{"\n\n"}

              {"  "}
              <span className="text-blue-400">private</span>{" "}
              <span className="text-orange-400">handleError</span>
              <span className="text-white">(error:</span>{" "}
              <span className="text-orange-400">HttpErrorResponse</span>
              <span className="text-white">)</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"    "}
              <span className="text-blue-400">if</span>
              <span className="text-white">(error.status === </span>
              <span className="text-orange-400">0</span>
              <span className="text-white">)</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"      "}
              <span className="text-gray-400">// A client-side or network error occurred.</span>{"\n"}
              {"      "}
              <span className="text-white">log.</span>
              <span className="text-orange-400">error</span>
              <span className="text-white">(</span>
              <span className="text-green-400">'An error occurred:'</span>
              <span className="text-white">, error.error)</span>
              <span className="text-white">;</span>{"\n"}
              {"    "}
              <span className="text-white">{`}`}</span>{" "}
              <span className="text-blue-400">else</span>{" "}
              <span className="text-white">{`{`}</span>{"\n"}
              {"      "}
              <span className="text-gray-400">// The server returned an unsuccessful response code.</span>{"\n"}
              {"      "}
              <span className="text-white">log.</span>
              <span className="text-orange-400">error</span>
              <span className="text-white">(</span>
              <span className="text-green-400">`Backend returned code </span>
              <span className="text-white">${`{`}</span>error.status{`}`}<span className="text-green-400">, body was: `</span>
              <span className="text-white">, error.error)</span>
              <span className="text-white">;</span>{"\n"}
              {"    "}
              <span className="text-white">{`}`}</span>{"\n\n"}
              {"    "}
              <span className="text-blue-400">return</span>{" "}
              <span className="text-orange-400">throwError</span>
              <span className="text-white">(</span>
              <span className="text-green-400">'An unexpected error occurred loading configuration.'</span>
              <span className="text-white">)</span>
              <span className="text-white">;</span>{"\n"}
              {"  "}
              <span className="text-white">{`}`}</span>{"\n"}
              <span className="text-white">{`}`}</span>
            </TerminalBox>
          </SectionCode>
          <div
  onClick={() => navigate("/lessons/cross-site-script-inclusion-quiz")}
  className="mt-10 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl
    p-6 sm:p-8 active:scale-[0.98] transition shadow-md hover:shadow-xl border-4 border-black text-center"
>
  <p className="text-sm font-semibold opacity-90 mb-2">
    Got all that?
  </p>

  <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
    <span>🧠</span>
    <span className="text-black">Quiz:</span>
    <span className="text-white">XSSI</span>
  </h2>

  <p className="text-md opacity-95">
    Take a quick quiz to show you were paying attention →
  </p>
</div>
<br />
<br />
        </div>
      </div>
    </section>
  );
}
