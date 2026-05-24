import TerminalBox from "../../SQLInjection/sql-injection-guide/TerminalBox";

export default function SectionProtection() {
  return (
    <section className="w-full flex flex-col items-center mt-6 sm:mt-8">
      <div className="w-full max-w-4xl px-2 sm:px-0">

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl text-gray-700" aria-hidden="true">🛡️</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-500">Protection</h2>
        </div>

        {/* Intro box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-lg font-semibold text-gray-900">
            To protect against stored XSS attacks, make sure any dynamic content coming
            from the data store cannot be used to inject JavaScript on a page.
          </p>
        </div>

        <div className="text-black text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6">

          <p><strong>Escape Dynamic Content</strong></p>

          <p>
            Web pages are made up of HTML, usually described in template files,
            with dynamic content woven in when the page is rendered.
            <strong> Stored XSS attacks </strong>
            make use of the improper treatment of dynamic content coming from a backend
            data store. The attacker abuses an editable field by inserting some
            JavaScript code, which is evaluated in the browser when another user
            visits that page.
          </p>

          <p>
            Unless your site is a content‑management system, it is rare that you want
            your users to author raw HTML. Instead, you should <strong>escape</strong>{" "}
            all dynamic content coming from a data store, so the browser knows it is
            to be treated as the contents of HTML tags, as opposed to raw HTML.
          </p>

          <p>
            Escaping dynamic content generally consists of replacing significant
            characters with the HTML entity encoding:
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-left text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Character</th>
                  <th className="border px-4 py-2">Encoding</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">&lt;</td>
                  <td className="border px-4 py-2">&amp;#60</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">&gt;</td>
                  <td className="border px-4 py-2">&amp;#62</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">&amp;</td>
                  <td className="border px-4 py-2">&amp;#38</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">"</td>
                  <td className="border px-4 py-2">&amp;#34</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">'</td>
                  <td className="border px-4 py-2">&amp;#39</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Most modern frameworks will escape dynamic content by default — see
            the code samples below for details.
          </p>

          <p>
            Escaping editable content in this way means it will never be treated
            as executable code by the browser. This closes the door on most XSS
            attacks.
          </p>

          <p><strong>Allowlist Values</strong></p>

          <p>
            If a particular dynamic data item can only take a handful of valid
            values, the best practice is to restrict the values in the data store,
            and have your rendering logic only permit known good values.
            For instance, instead of asking a user to type in their country of
            residence, have them select from a drop‑down list.
          </p>

          <p><strong>Implement a Content‑Security Policy</strong></p>

          <p>
            Browsers support Content‑Security Policies that allow the author of a
            web page to control where JavaScript (and other resources) can be
            loaded and executed from. XSS attacks rely on the attacker being able
            to run malicious scripts on a user's web page — either by injecting
            inline <code>&lt;script&gt;</code> tags somewhere within the HTML of a
            page, or by tricking the browser into loading JavaScript from a
            malicious third‑party domain.
          </p>

          <p>
            By setting a content security policy in the response header, you can
            tell the browser to never execute inline JavaScript, and to lock down
            which domains can host JavaScript for a page:
          </p>

          <TerminalBox>
            <p>
              <span className="text-pink-400">Content-Security-Policy</span>
              <span className="text-white">: script-src 'self' https://apis.google.com</span>
            </p>
          </TerminalBox>

          <p>
            <strong>
              By listing the URIs from which scripts can be loaded, you are
              implicitly stating that inline JavaScript is not allowed.
            </strong>
          </p>

          <p>
            The content security policy can also be set in a meta tag in the
            <code> head </code> element of the page:
          </p>

          <TerminalBox>
            <p>
              <span className="text-white">&lt;meta http-equiv=</span>
              <span className="text-green-400">"Content-Security-Policy"</span>
              <span className="text-white"> content=</span>
              <span className="text-green-400">"script-src 'self' https://apis.google.com"</span>
              <span className="text-white"> /&gt;</span>
            </p>
          </TerminalBox>

          <p>
            <strong>This approach will protect your users very effectively!</strong>{" "}
            However, it may take a considerable amount of discipline to make your
            site ready for such a header. Inline script tags are considered bad
            practice in modern web development, but are common in older sites.
          </p>

          <p>
            To migrate away from inline scripts incrementally, consider making use
            of CSP Violation Reports. By adding a report‑to directive in your
            policy header, the browser will notify you of any policy violations
            rather than preventing inline JavaScript from executing:
          </p>

          <TerminalBox>
            <p>
              <span className="text-pink-400">Reporting-Endpoints</span>
              <span className="text-white">: csp-endpoint="https://example.com/csp-reports"</span>
            </p>
            <p className="mt-2">
              <span className="text-pink-400">Content-Security-Policy-Report-Only</span>
              <span className="text-white">: script-src 'self'; report-to csp-endpoint</span>
            </p>
          </TerminalBox>

          <p>
            This will give you reassurance that there are no lingering inline
            scripts before you ban them outright.
          </p>

          <p><strong>Sanitize HTML</strong></p>

          <p>
            Some sites have a legitimate need to store and render raw HTML. If
            your site stores and renders rich content, you need to use an HTML
            sanitization library to ensure malicious users cannot inject scripts
            in their HTML submissions.
          </p>

        </div>
      </div>
    </section>
  );
}
