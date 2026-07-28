import { useEffect, useState } from "react";

import { useAppLanguage } from "../../../hooks/useAppLanguage";
import { navigateTo } from "../../../services/navigation";
import vicBaking from "../../../assets/lessons/vic-baking.png";
import malPensive from "../../../assets/lessons/mal-pensive.png";
import { XSSError, XSSLoading } from "./XSSPageState";
import { useCrossSiteScriptingLesson } from "./useCrossSiteScriptingLesson";

function BredditBox({
  copy,
  isAttacker = false,
  currentStep,
  isPersian = false,
}) {
  const [inputText, setInputText] = useState("");
  const threadTitle = copy.threadTitle || copy.thread_title || "";
  const siteUrl = copy.siteUrl || copy.site_url || "";
  const isScriptInput =
    (isAttacker && (currentStep === 4 || currentStep === 5)) ||
    inputText.trimStart().startsWith("<script");
  const inputDirection = isScriptInput ? "ltr" : isPersian ? "rtl" : "ltr";

  useEffect(() => {
    const attacks = copy.attacks || {};

    if (isAttacker && (currentStep === 4 || currentStep === 5)) {
      const attackPayload = attacks[String(currentStep)] || "";
      let index = 0;
      setInputText("");

      const interval = setInterval(() => {
        setInputText(attackPayload.slice(0, index + 1));
        index += 1;

        if (index >= attackPayload.length) {
          clearInterval(interval);

          if (currentStep === 4) {
            setTimeout(() => {
              alert(copy.alert);
            }, 500);
          }
        }
      }, 40);

      return () => clearInterval(interval);
    }

    if (currentStep < 4) {
      setInputText("");
    }
  }, [copy, currentStep, isAttacker]);

  return (
    <div className="flex h-[400px] w-full max-w-[244px] flex-col overflow-hidden rounded-xl border border-gray-300 bg-white text-slate-950 shadow-xl sm:h-[440px]">
      <div className="flex items-center gap-2 border-b border-gray-300 bg-gray-200 px-2 py-2 sm:gap-3 sm:px-3">
        <div className="flex items-center gap-1 text-gray-500">
          <button className="flex h-7 w-7 items-center justify-center rounded text-lg font-bold hover:bg-gray-300">
            ‹
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded text-lg font-bold hover:bg-gray-300">
            ›
          </button>
        </div>
        <div className="min-w-0 flex-1 truncate rounded border border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-500 sm:px-3">
          {siteUrl}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border border-gray-400 bg-gray-50 p-3 sm:p-4">
        <h2
          dir={isPersian ? "rtl" : "ltr"}
          className={`mb-4 border-b border-gray-200 pb-2 text-base font-bold text-gray-800 sm:text-lg ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          {threadTitle}
        </h2>

        <div className="flex flex-col gap-3 sm:gap-4">
          {(copy.comments || []).map((comment) => (
            <div
              key={comment.author}
              dir={isPersian ? "rtl" : "ltr"}
              className={`rounded-xl border border-black bg-white p-3 shadow-sm ${
                isPersian ? "text-right" : "text-left"
              }`}
            >
              <div className="mb-1 text-xs font-semibold text-blue-600" dir="ltr">
                {comment.author}
              </div>
              <div className="break-words text-sm text-gray-700">{comment.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-300 bg-white p-3">
        <textarea
          className={`w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 ${
            inputDirection === "ltr" ? "text-left" : "text-right"
          }`}
          placeholder={copy.placeholder}
          dir={inputDirection}
          rows={2}
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
      </div>
    </div>
  );
}

function CrossSiteScripting() {
  const [step, setStep] = useState(0);
  const { language } = useAppLanguage();
  const { lesson, error } = useCrossSiteScriptingLesson();
  const isPersian = language === "fa";

  if (error) return <XSSError message={error.message} />;
  if (!lesson) return <XSSLoading />;

  const nextStep = () => {
    if (step < lesson.finalStep) setStep(step + 1);
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
          className={`relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 text-text transition active:scale-[0.99] sm:p-5 md:p-6 ${
            isPersian ? "text-right" : "text-left"
          }`}
          dir={isPersian ? "rtl" : "ltr"}
          onClick={() => {
            if (step === lesson.finalStep) {
              navigateTo(lesson.guidePath);
            } else {
              nextStep();
            }
          }}
        >
          <div
            className={`break-words text-sm leading-7 sm:text-base ${
              isPersian ? "pl-6" : "pr-6"
            }`}
          >
            <LessonStepText parts={lesson.steps[step]} />
          </div>

          <span
            className={`absolute bottom-3 text-sm text-text-muted sm:bottom-4 sm:text-base ${
              isPersian ? "left-3 sm:left-4" : "right-3 sm:right-4"
            }`}
          >
            {isPersian ? "←" : "→"}
          </span>
        </button>

        <div className="mt-2 flex w-full justify-center sm:mt-4">
          <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 xl:flex-row xl:items-start 2xl:max-w-7xl">
            {step >= 0 && step <= 5 && (
              <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 xl:w-auto">
                <img
                  src={vicBaking}
                  alt="Vic Baking"
                  className="w-36 max-w-full object-contain rounded-xl sm:w-48 lg:w-56 xl:w-60 2xl:w-64"
                />
                <BredditBox
                  copy={lesson.simulation}
                  currentStep={step}
                  isPersian={isPersian}
                />
              </div>
            )}

            {step >= 2 && step <= 5 && (
              <div className="flex w-full flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:gap-6 xl:w-auto">
                <BredditBox
                  copy={lesson.simulation}
                  isAttacker
                  currentStep={step}
                  isPersian={isPersian}
                />
                <img
                  src={malPensive}
                  alt="Attacker"
                  className="w-36 max-w-full object-contain rounded-xl sm:w-48 lg:w-56 xl:w-60 2xl:w-64"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonStepText({ parts }) {
  return (
    <p>
      {parts.map((part, index) => {
        if (part.type === "strong") {
          return (
            <strong
              key={`${part.text}-${index}`}
              dir={part.dir}
              className={part.dir === "ltr" ? "inline-block" : undefined}
            >
              {part.text}
            </strong>
          );
        }

        return <span key={`${part.text}-${index}`}>{part.text}</span>;
      })}
    </p>
  );
}

export default CrossSiteScripting;
