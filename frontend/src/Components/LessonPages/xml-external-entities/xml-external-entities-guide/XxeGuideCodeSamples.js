import { useState } from "react";

import GuideCodeBlock from "../../reflected-xss/reflected-xss-guide/GuideCodeBlock";

export default function XxeGuideCodeSamples({ codeSamples }) {
  const [openByTitle, setOpenByTitle] = useState({});

  if (!codeSamples) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <span className="text-4xl text-orange-500" aria-hidden="true">
            {codeSamples.icon}
          </span>
          <h2 className="text-3xl font-bold text-text-muted">
            {codeSamples.title}
          </h2>
        </div>

        <p className="mb-8 text-base leading-8 text-text sm:text-lg">
          {codeSamples.intro}
        </p>

        <div className="space-y-4">
          {codeSamples.items.map((item) => {
            const isOpen = !!openByTitle[item.title];

            return (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
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
                      <CodeSampleBlock
                        key={`${item.title}-${block.heading || "code"}-${index}`}
                        block={block}
                      />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CodeSampleBlock({ block }) {
  return (
    <div className="space-y-4">
      {block.heading && (
        <h3 dir="ltr" className="pt-2 text-left text-lg font-bold text-text">
          {block.heading}
        </h3>
      )}

      {block.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-base leading-8 text-text sm:text-lg">
          {paragraph}
        </p>
      ))}

      <GuideCodeBlock code={block.code} />

      {block.closing?.map((paragraph) => (
        <p key={paragraph} className="text-base leading-8 text-text sm:text-lg">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
