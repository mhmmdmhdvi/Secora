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
    <div className="mx-auto mt-5 w-full max-w-[90rem] overflow-hidden px-3 pb-12 sm:mt-8 sm:px-5 lg:px-8 2xl:px-10">
      <h1 className="mb-5 break-words text-center text-xl font-bold text-text sm:mb-7 sm:text-2xl md:text-3xl">
        {lesson.title}
      </h1>

      <div className="mx-auto mb-5 flex max-w-2xl flex-wrap justify-center gap-2 sm:mb-8 sm:gap-3">
        {Array.from({ length: lesson.totalSteps }).map((_, index) => (
          <button
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-transform sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${
              index === step
                ? "scale-125 bg-blue-500"
                : index < step
                  ? "bg-gray-600"
                  : "bg-gray-300"
            }`}
            onClick={() => setStep(index)}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      {step === lesson.finalStep && (
        <div className="flex justify-center">
          <button
            type="button"
            className="w-full max-w-2xl rounded-2xl border border-border bg-surface-muted p-5 text-center text-text transition hover:shadow-xl active:scale-[0.98] sm:p-7"
            onClick={() => navigateTo(lesson.guidePath)}
          >
            <p className="break-words text-sm leading-7 sm:text-base">
              <XSSIRichText parts={lesson.completion} />
            </p>
          </button>
        </div>
      )}

      {step !== lesson.finalStep && (
        <div className="flex flex-col items-center gap-5 sm:gap-6">
          <button
            type="button"
            className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 text-text transition active:scale-[0.98] sm:p-5 md:p-6"
            dir={isPersian ? "rtl" : "ltr"}
            onClick={nextStep}
          >
            <p
              className={`break-words text-sm leading-7 sm:text-base ${textPaddingClass} ${
                isPersian ? "text-right" : "text-left"
              }`}
            >
              <XSSIRichText parts={lesson.steps[step] || []} />
            </p>

            <span
              className={`absolute ${arrowPositionClass} bottom-3 text-sm text-text-muted sm:bottom-4 sm:text-base`}
            >
              {arrow}
            </span>
          </button>

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
      <div dir="ltr" className="overflow-x-auto p-3 font-mono text-[10px] sm:p-5 sm:text-xs md:text-sm">
        <div className="min-w-[30rem] overflow-hidden rounded-xl border border-amber-100 dark:border-border sm:min-w-[34rem]">
          {rows.map((row, index) => (
            <div
              key={`${row.url}-${index}`}
              className={`grid grid-cols-[minmax(13rem,1fr)_minmax(11rem,0.85fr)] gap-3 px-3 py-3 sm:grid-cols-[minmax(15rem,1fr)_minmax(12rem,0.85fr)] sm:gap-4 sm:px-4 ${
                index === 0
                  ? "bg-amber-50 font-semibold text-amber-950 dark:bg-surface-muted dark:text-text"
                  : "border-t border-amber-100 text-slate-700 dark:border-border dark:text-text-muted"
              }`}
            >
              <span className="break-words text-left" dir="ltr">
                {row.url}
              </span>
              <span className="break-words text-right" dir="auto">
                {row.origin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ example }) {
  return (
    <div
      dir="ltr"
      className="w-full max-w-2xl overflow-hidden rounded-2xl bg-gray-900 text-left shadow-lg"
    >
      <div className="truncate bg-gray-800 px-4 py-2 font-mono text-xs text-gray-300 sm:text-sm">
        {example.filename}
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap break-words p-3 text-left font-mono text-[10px] leading-relaxed text-gray-100 sm:p-4 sm:text-xs md:text-sm">
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
