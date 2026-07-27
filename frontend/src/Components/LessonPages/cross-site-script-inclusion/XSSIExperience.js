import { useState } from "react";
import { useTranslation } from "react-i18next";

import { XSSIRichText } from "./XSSIRichText";
import { normalizeLanguage } from "../../../i18n";
import { navigateTo } from "../../../services/navigation";

function XSSIExperience({ lesson }) {
  const { i18n } = useTranslation();
  const isPersian = normalizeLanguage(i18n.language) === "fa";
  const [step, setStep] = useState(0);
  const textPaddingClass = isPersian ? "pl-6" : "pr-6";
  const arrowPositionClass = isPersian
    ? "left-3 sm:left-4"
    : "right-3 sm:right-4";
  const arrow = isPersian ? "←" : "→";

  const nextStep = () => {
    if (step < lesson.finalStep) setStep(step + 1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 pb-12">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">
        {lesson.title}
      </h1>

      <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 flex-wrap">
        {Array.from({ length: lesson.totalSteps }).map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full transition-transform
            ${i === step ? "bg-blue-500 scale-125" : ""}
            ${i < step ? "bg-gray-600" : "bg-gray-300"}`}
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {step === lesson.finalStep && (
        <div className="flex justify-center">
          <div
            className="w-full max-w-2xl p-6 sm:p-7 bg-surface-muted text-text rounded-2xl cursor-pointer
            border border-border hover:shadow-xl active:scale-[0.98] transition text-center"
            onClick={() => navigateTo(lesson.guidePath)}
          >
            <p className="text-sm sm:text-base">
              <XSSIRichText parts={lesson.completion} />
            </p>
          </div>
        </div>
      )}

      {step !== lesson.finalStep && (
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-full max-w-2xl p-5 sm:p-6 bg-surface text-text border rounded-2xl cursor-pointer
            border-border active:scale-[0.98] transition touch-manipulation relative"
            onClick={nextStep}
          >
            <p className={`leading-7 text-sm sm:text-base ${textPaddingClass}`}>
              <XSSIRichText parts={lesson.steps[step] || []} />
            </p>

            <span
              className={`absolute ${arrowPositionClass} bottom-3 sm:bottom-4 text-text-muted text-sm sm:text-base`}
            >
              {arrow}
            </span>
          </div>

          {step === 0 && <OriginTable table={lesson.originTable} />}
          {lesson.codeExamples[String(step)] && (
            <CodeBlock example={lesson.codeExamples[String(step)]} />
          )}
        </div>
      )}
    </div>
  );
}

function OriginTable({ table }) {
  const rows = parseOriginRows(table.body);

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-100 bg-white text-slate-800 shadow-xl shadow-amber-900/5 dark:border-border dark:bg-surface dark:text-text dark:shadow-black/20">
      <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-center text-sm font-semibold text-amber-900 dark:border-border dark:bg-none dark:bg-surface-muted dark:text-text">
        {table.intro}
      </div>
      <div dir="ltr" className="p-4 font-mono text-[11px] sm:p-6 sm:text-sm">
        <div className="min-w-[34rem] overflow-hidden rounded-xl border border-amber-100 dark:border-border">
          {rows.map((row, index) => (
            <div
              key={`${row.url}-${index}`}
              className={`grid grid-cols-[minmax(15rem,1fr)_minmax(12rem,0.85fr)] gap-4 px-4 py-3 ${
                index === 0
                  ? "bg-amber-50 font-semibold text-amber-950 dark:bg-surface-muted dark:text-text"
                  : "border-t border-amber-100 text-slate-700 dark:border-border dark:text-text-muted"
              }`}
            >
              <span className="text-left" dir="ltr">{row.url}</span>
              <span className="text-right" dir="auto">{row.origin}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ example }) {
  return (
    <div dir="ltr" className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg text-left">
      <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
        {example.filename}
      </div>

      <pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-gray-100 overflow-x-auto text-left">
        {example.code}
      </pre>
    </div>
  );
}

function parseOriginRows(body = "") {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, ...originParts] = line.split(/\s{2,}/);

      return {
        url: url || "",
        origin: originParts.join(" ") || "",
      };
    });
}

export default XSSIExperience;
