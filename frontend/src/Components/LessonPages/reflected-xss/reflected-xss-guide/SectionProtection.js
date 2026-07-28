import GuideCodeBlock from "./GuideCodeBlock";
import ReflectedGuideRichText from "./ReflectedGuideRichText";

export default function SectionProtection({ protection, isPersian = false }) {
  return (
    <section className="w-full">
      <div
        dir={isPersian ? "rtl" : "ltr"}
        className="mx-auto mb-5 flex max-w-4xl items-center gap-3 sm:mb-6"
      >
        <span className="text-4xl text-indigo-500" aria-hidden="true">
          {protection.icon}
        </span>
        <h2 className="text-3xl font-bold text-text-muted">{protection.title}</h2>
      </div>

      <div
        dir={isPersian ? "rtl" : "ltr"}
        className={`mx-auto max-w-4xl space-y-5 text-base leading-8 text-text sm:text-lg ${
          isPersian ? "text-right" : "text-left"
        }`}
      >
        {protection.intro.map((paragraph, index) => (
          <p key={`intro-${index}`}>
            <ReflectedGuideRichText parts={paragraph} />
          </p>
        ))}

        {protection.sections.map((section) => (
          <ProtectionSection key={section.heading} section={section} />
        ))}
      </div>
    </section>
  );
}

function ProtectionSection({ section }) {
  return (
    <div className="space-y-5 pt-2">
      <p className="font-bold italic">{section.heading}</p>

      {section.paragraphs.map((paragraph, index) => (
        <p key={`${section.heading}-paragraph-${index}`}>
          <ReflectedGuideRichText parts={paragraph} />
        </p>
      ))}

      {section.table && <EncodingTable table={section.table} />}

      {section.after_table?.map((paragraph, index) => (
        <p key={`${section.heading}-after-table-${index}`}>
          <ReflectedGuideRichText parts={paragraph} />
        </p>
      ))}

      {section.terminal && <GuideCodeBlock code={section.terminal} />}

      {section.after_terminal?.map((paragraph, index) => (
        <p key={`${section.heading}-after-terminal-${index}`}>
          <ReflectedGuideRichText parts={paragraph} />
        </p>
      ))}

      {section.second_terminal && <GuideCodeBlock code={section.second_terminal} />}

      {section.closing?.map((paragraph, index) => (
        <p key={`${section.heading}-closing-${index}`}>
          <ReflectedGuideRichText parts={paragraph} />
        </p>
      ))}

      {section.third_terminal && <GuideCodeBlock code={section.third_terminal} />}

      {section.final_paragraph && <p>{section.final_paragraph}</p>}
    </div>
  );
}

function EncodingTable({ table }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm dark:shadow-black/10">
      <div className="border-b border-border bg-surface-muted px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-text-muted">
          HTML entity encoding
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table
          dir="ltr"
          className="w-full min-w-[20rem] border-collapse text-left text-sm sm:min-w-[28rem] sm:text-base"
        >
          <thead>
            <tr className="border-b border-border bg-app/60">
              {table.headings.map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 font-bold text-text sm:px-5"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map(([character, encoding]) => (
              <tr
                key={encoding}
                className="border-b border-border last:border-b-0 hover:bg-surface-muted/70"
              >
                <td className="px-4 py-3 font-mono text-text sm:px-5">
                  {character}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-text sm:px-5">
                  {encoding}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
