import { useState } from "react";
import { useNavigate } from "react-router-dom";

import GuideTerminalBox from "./GuideTerminalBox";

export default function GuideCodeSamples({ codeSamples }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState({});

  const toggle = (section) => {
    setOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-20">
      <div className="w-full max-w-4xl px-4 sm:px-0 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl text-text-muted">
            {codeSamples.icon}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            {codeSamples.title}
          </h2>
        </div>

        <p className="text-base sm:text-lg text-text-muted">{codeSamples.intro}</p>

        <div className="space-y-4">
          {codeSamples.items.map((item) => (
            <AccordionItem
              key={item.title}
              item={item}
              isOpen={!!open[item.title]}
              onToggle={() => toggle(item.title)}
            />
          ))}

          <div
            onClick={() => navigate(codeSamples.quiz_cta.path)}
            className="mt-10 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl
            p-6 sm:p-8 active:scale-[0.98] transition shadow-md hover:shadow-xl border-4 border-black text-center"
          >
            <p className="text-sm font-semibold opacity-90 mb-2">
              {codeSamples.quiz_cta.eyebrow}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
              <span>{codeSamples.quiz_cta.icon}</span>
              <span className="text-indigo-950 dark:text-white">{codeSamples.quiz_cta.label}</span>
              <span className="text-white">{codeSamples.quiz_cta.title}</span>
            </h2>

            <p className="text-md opacity-95">{codeSamples.quiz_cta.summary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all duration-300 bg-surface">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 sm:px-6 py-5 text-left font-semibold
        text-text bg-surface hover:bg-surface-muted active:scale-[0.98] transition"
      >
        <span>{item.title}</span>
        <span
          className={`transform transition-transform duration-300 text-text-muted ${
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
        <div className="px-6 pb-6 pt-2 text-text-muted">
          {item.samples.map((sample) => (
            <div key={sample.heading}>
              <h3 className="font-semibold mt-6 mb-2">{sample.heading}</h3>
              <GuideTerminalBox code={sample.code} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
