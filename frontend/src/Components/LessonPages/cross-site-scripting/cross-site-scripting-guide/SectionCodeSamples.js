import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TerminalBox from "../../shared/TerminalBox";

export default function SectionCodeSamples({ codeSamples }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState({});

  const toggle = (title) => {
    setOpen((previous) => ({
      ...previous,
      [title]: !previous[title],
    }));
  };

  return (
    <section className="mt-10 flex w-full flex-col items-center sm:mt-16">
      <div className="w-full max-w-4xl space-y-6 px-1 sm:px-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-text-muted sm:text-3xl" aria-hidden="true">
            {codeSamples.icon}
          </span>
          <h2 className="break-words text-2xl font-bold text-text sm:text-3xl">
            {codeSamples.title}
          </h2>
        </div>

        <p className="text-base leading-relaxed text-text-muted sm:text-lg">
          {codeSamples.intro}
        </p>

        <div className="space-y-4">
          {codeSamples.items.map((group) => (
            <CodeSampleAccordion
              key={group.title}
              group={group}
              isOpen={!!open[group.title]}
              onToggle={() => toggle(group.title)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate(codeSamples.quizCta.path)}
          className="mt-8 w-full cursor-pointer rounded-xl border-4 border-black bg-indigo-500 p-5 text-center text-white shadow-md transition hover:bg-indigo-600 hover:shadow-xl active:scale-[0.98] sm:mt-10 sm:p-8"
        >
          <p className="mb-2 text-sm font-semibold opacity-90">
            {codeSamples.quizCta.eyebrow}
          </p>

          <h2 className="mb-3 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
            <span aria-hidden="true">{codeSamples.quizCta.icon}</span>
            <span className="text-indigo-950 dark:text-white">
              {codeSamples.quizCta.label}
            </span>
            <span className="text-white">{codeSamples.quizCta.title}</span>
          </h2>

          <p className="text-sm opacity-95 sm:text-base">{codeSamples.quizCta.summary}</p>
        </button>
      </div>
    </section>
  );
}

function CodeSampleAccordion({ group, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-surface px-4 py-4 text-left font-semibold text-text transition hover:bg-surface-muted active:scale-[0.98] sm:px-6 sm:py-5"
      >
        <span dir="ltr" className="min-w-0 break-words">
          {group.title}
        </span>
        <span
          className={`shrink-0 transform text-text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-6 px-4 pb-5 pt-2 text-text-muted sm:px-6 sm:pb-6">
          {group.samples.map((sample) => (
            <div key={sample.heading}>
              <h3 className="mb-3 mt-4 break-words font-semibold text-text" dir="ltr">
                {sample.heading}
              </h3>

              <div className="space-y-4">
                {sample.blocks.map((block, index) => (
                  <div key={`${sample.heading}-${index}`}>
                    {block.text && (
                      <p className="break-words leading-relaxed">{block.text}</p>
                    )}
                    {block.code && <TerminalBox>{block.code}</TerminalBox>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
