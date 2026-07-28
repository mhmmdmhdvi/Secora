import { useAppLanguage } from "../../../../hooks/useAppLanguage";
import TerminalBox from "../../shared/TerminalBox";

const HTML_ENCODINGS = [
  ["<", "&#60"],
  [">", "&#62"],
  ["&", "&#38"],
  ['"', "&#34"],
  ["'", "&#39"],
];

export default function SectionProtection({ protection }) {
  const { language } = useAppLanguage();
  const isPersian = language === "fa";

  return (
    <section className="mt-6 flex w-full flex-col items-center sm:mt-8">
      <div className="w-full max-w-4xl px-1 sm:px-0">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl text-text-muted" aria-hidden="true">
            🛡️
          </span>
          <h2 className="break-words text-2xl font-bold text-text-muted sm:text-3xl">
            {protection.title}
          </h2>
        </div>

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className={`mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/40 sm:mb-8 sm:p-6 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          <p className="text-base font-semibold text-text sm:text-lg">
            {protection.intro}
          </p>
        </div>

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className={`space-y-5 text-base leading-relaxed text-text sm:text-lg sm:space-y-6 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          {protection.sections.map((section, index) => (
            <GuideSection
              key={section.heading}
              section={section}
              isFirst={index === 0}
              protection={protection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideSection({ section, isFirst, protection }) {
  return (
    <>
      <p>
        <strong>{section.heading}</strong>
      </p>

      {section.paragraphs.map((paragraph, index) => (
        <p key={`${section.heading}-paragraph-${index}`}>
          <RichText parts={paragraph} />
        </p>
      ))}

      {isFirst && (
        <>
          <EncodingTable headings={protection.tableHeadings} />
          <p>{protection.frameworkNote}</p>
          <p>{protection.escapeClosing}</p>
        </>
      )}

      {section.terminal && <TerminalSnippet name={section.terminal} />}

      {section.afterTerminal?.map((paragraph, index) => (
        <p key={`${section.heading}-after-${index}`}>
          <RichText parts={paragraph} />
        </p>
      ))}

      {section.secondTerminal && <TerminalSnippet name={section.secondTerminal} />}

      {section.closing?.map((paragraph, index) => (
        <p key={`${section.heading}-closing-${index}`}>
          <RichText parts={paragraph} />
        </p>
      ))}

      {section.thirdTerminal && <TerminalSnippet name={section.thirdTerminal} />}

      {section.finalParagraph && <p>{section.finalParagraph}</p>}
    </>
  );
}

function EncodingTable({ headings }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        dir="ltr"
        className="w-full min-w-[24rem] border border-border text-left text-sm sm:text-base"
      >
        <thead className="bg-surface-muted">
          <tr>
            <th className="border border-border px-4 py-2">{headings[0]}</th>
            <th className="border border-border px-4 py-2">{headings[1]}</th>
          </tr>
        </thead>
        <tbody>
          {HTML_ENCODINGS.map(([character, encoding]) => (
            <tr key={encoding}>
              <td className="border border-border px-4 py-2">{character}</td>
              <td className="border border-border px-4 py-2">{encoding}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TerminalSnippet({ name }) {
  if (name === "policyHeader") {
    return (
      <TerminalBox>
        <p>
          <span className="text-pink-400">Content-Security-Policy</span>
          <span className="text-white">: script-src 'self' https://apis.google.com</span>
        </p>
      </TerminalBox>
    );
  }

  if (name === "metaPolicy") {
    return (
      <TerminalBox>
        <p>
          <span className="text-white">&lt;meta http-equiv=</span>
          <span className="text-green-400">"Content-Security-Policy"</span>
          <span className="text-white"> content=</span>
          <span className="text-green-400">"script-src 'self' https://apis.google.com"</span>
          <span className="text-white"> /&gt;</span>
        </p>
      </TerminalBox>
    );
  }

  if (name === "reportPolicy") {
    return (
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
    );
  }

  return null;
}

function RichText({ parts }) {
  return parts.map((part, index) => {
    if (part.type === "strong") {
      return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
    }

    if (part.type === "code") {
      return (
        <code
          key={`${part.text}-${index}`}
          dir="ltr"
          className="inline-block max-w-full break-words rounded bg-surface-muted px-1.5 py-0.5"
        >
          {part.text}
        </code>
      );
    }

    return <span key={`${part.text}-${index}`}>{part.text}</span>;
  });
}
