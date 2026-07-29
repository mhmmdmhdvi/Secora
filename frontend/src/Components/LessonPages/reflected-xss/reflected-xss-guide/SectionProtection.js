import { useState } from "react";

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

      {section.accordions && <FrameworkAccordions items={section.accordions} />}

      {section.bullets && <SimpleBulletList items={section.bullets} />}

      {section.after_bullets?.map((paragraph, index) => (
        <p key={`${section.heading}-after-bullets-${index}`}>
          <ReflectedGuideRichText parts={paragraph} />
        </p>
      ))}

      {section.secondary_bullets && (
        <SimpleBulletList items={section.secondary_bullets} />
      )}

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

function FrameworkAccordions({ items }) {
  const [openByTitle, setOpenByTitle] = useState({});

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = !!openByTitle[item.title];

        return (
          <div key={item.title} className="overflow-hidden rounded-xl border border-border bg-surface">
            <button
              type="button"
              onClick={() =>
                setOpenByTitle((previous) => ({
                  ...previous,
                  [item.title]: !previous[item.title],
                }))
              }
              className="flex w-full items-center justify-between gap-4 bg-surface px-4 py-4 text-left font-semibold text-text transition hover:bg-surface-muted active:scale-[0.99] sm:px-6"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-text text-xs transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                 ⌄
                </span>
                <span dir="ltr" className="break-words text-xl font-bold">
                  {item.title}
                </span>
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-6 px-4 pb-6 text-text sm:px-6">
                {item.blocks.map((block, index) => (
                  <div key={`${item.title}-${index}`} className="space-y-4">
                    <p className="leading-8">
                      <InlineBacktickText text={block.text} />
                    </p>
                    <MarkedCodeBlock code={block.code} tone={block.tone} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InlineBacktickText({ text }) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${part}-${index}`}
          dir="ltr"
          className="inline-block rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-text"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MarkedCodeBlock({ code, tone }) {
  const marker =
    tone === "safe" ? (
      <span className="text-4xl text-slate-300" aria-label="Safe example">
        🔒
      </span>
    ) : (
      <span className="text-4xl text-red-400" aria-label="Dangerous example">
        💀
      </span>
    );

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden rounded-lg border border-gray-800 bg-[#1f1f1f] text-left shadow-sm"
    >
      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 pe-16 text-xs leading-6 text-gray-100 sm:px-5 sm:text-sm">
        <code>{code}</code>
      </pre>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">{marker}</div>
    </div>
  );
}

function SimpleBulletList({ items }) {
  if (!items.length) return null;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
            aria-hidden="true"
          />
          <span className="font-semibold underline decoration-border underline-offset-4">
            {item}
          </span>
        </li>
      ))}
    </ul>
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
