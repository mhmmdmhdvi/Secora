import { useState } from "react";
import { useTranslation } from "react-i18next";

import { normalizeLanguage } from "../../../i18n";
import { navigateTo } from "../../../services/navigation";
import { DomBasedXssError, DomBasedXssLoading } from "./DomBasedXssPageState";
import DomBasedXssScene from "./DomBasedXssScene";
import { useDomBasedXssLesson } from "./useDomBasedXssLesson";

function DomBasedXss() {
  const { i18n } = useTranslation();
  const [step, setStep] = useState(0);
  const { lesson, error } = useDomBasedXssLesson();
  const isPersian = normalizeLanguage(i18n.language) === "fa";
  const textPaddingClass = isPersian ? "pl-6" : "pr-6";
  const arrowPositionClass = isPersian
    ? "left-3 sm:left-4"
    : "right-3 sm:right-4";
  const arrow = isPersian ? "←" : "→";

  if (error) return <DomBasedXssError message={error.message} />;
  if (!lesson) return <DomBasedXssLoading />;

  const scene = lesson.simulation.scenes?.[String(step)];
  const isFinalStep = step === lesson.finalStep;

  const handleInstructionClick = () => {
    if (isFinalStep) {
      navigateTo(lesson.guidePath);
      return;
    }
    setStep((current) => Math.min(current + 1, lesson.finalStep));
  };

  return (
    <div className="mx-auto mt-5 w-full max-w-[90rem] overflow-hidden px-3 pb-12 sm:mt-8 sm:px-5 lg:px-8 2xl:px-10">
      <h1 className="mb-5 text-center text-xl font-bold text-text sm:mb-7 sm:text-2xl md:text-3xl">
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
            aria-label={`Go to step ${index + 1}`}
            onClick={() => setStep(index)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 sm:gap-6">
        <button
          type="button"
          dir={isPersian ? "rtl" : "ltr"}
          className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 text-text transition active:scale-[0.99] sm:p-5 md:p-6"
          onClick={handleInstructionClick}
        >
          <div
            className={`break-words text-sm leading-7 sm:text-base ${textPaddingClass} ${
              isPersian ? "text-right" : "text-left"
            }`}
          >
            <LessonStepText parts={lesson.steps[step]} />
          </div>

          <span
            className={`absolute ${arrowPositionClass} bottom-3 text-sm text-text-muted sm:bottom-4 sm:text-base`}
          >
            {arrow}
          </span>
        </button>

        <DomBasedXssScene scene={scene} simulation={lesson.simulation} />
      </div>
    </div>
  );
}

function LessonStepText({ parts }) {
  return (
    <p>
      {parts.map((part, index) => {
        const key = `${part.type}-${part.text || "break"}-${index}`;

        if (part.type === "break") {
          return <br key={key} />;
        }

        if (part.type === "strong") {
          return <strong key={key}>{part.text}</strong>;
        }

        if (part.type === "code") {
          return (
            <code
              key={key}
              dir="ltr"
              className="inline-block max-w-full break-words rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-sm text-primary"
            >
              {part.text}
            </code>
          );
        }

        return <span key={key}>{part.text}</span>;
      })}
    </p>
  );
}

export default DomBasedXss;
