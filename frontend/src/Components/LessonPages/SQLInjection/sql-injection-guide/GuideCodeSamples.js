import { useState } from "react";
import { useNavigate } from "react-router-dom";

import GuideTerminalBox from "./GuideTerminalBox";

export default function GuideCodeSamples({ codeSamples }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState({});

  const toggle = (section) => {
    setOpen((previous) => ({
      ...previous,
      [section]: !previous[section],
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

        <p className="break-words text-base text-text-muted sm:text-lg">
          {codeSamples.intro}
        </p>

        <div className="space-y-4">
          {codeSamples.items.map((item) => (
            <AccordionItem
              key={item.title}
              item={item}
              isOpen={!!open[item.title]}
              onToggle={() => toggle(item.title)}
            />
          ))}

          <button
            type="button"
            onClick={() => navigate(codeSamples.quiz_cta.path)}
            className="mt-8 w-full cursor-pointer rounded-xl border-4 border-black bg-indigo-500 p-5 text-center text-white shadow-md transition hover:bg-indigo-600 hover:shadow-xl active:scale-[0.98] sm:mt-10 sm:p-8"
          >
            <p className="mb-2 text-sm font-semibold opacity-90">
              {codeSamples.quiz_cta.eyebrow}
            </p>

            <h2 className="mb-3 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
              <span aria-hidden="true">{codeSamples.quiz_cta.icon}</span>
              <span className="text-indigo-950 dark:text-white">
                {codeSamples.quiz_cta.label}
              </span>
              <span className="text-white">{codeSamples.quiz_cta.title}</span>
            </h2>

            <p className="text-sm opacity-95 sm:text-base">
              {codeSamples.quiz_cta.summary}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-surface px-4 py-4 text-left font-semibold text-text transition hover:bg-surface-muted active:scale-[0.98] sm:px-6 sm:py-5"
      >
        <span className="min-w-0 break-words">{item.title}</span>
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
        <div className="px-4 pb-5 pt-2 text-text-muted sm:px-6 sm:pb-6">
          {item.samples.map((sample) => (
            <div key={sample.heading}>
              <h3 className="mb-2 mt-5 break-words font-semibold sm:mt-6">
                {sample.heading}
              </h3>
              <GuideTerminalBox code={sample.code} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
