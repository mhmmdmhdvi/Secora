import { useEffect, useState } from "react";

import { useLessonProgress } from "../../../hooks/useLessonProgress";
import SQLInjectionBankDemo from "./SQLInjectionBankDemo";
import SQLInjectionCompletionCard from "./SQLInjectionCompletionCard";
import SQLInjectionInstructionCard from "./SQLInjectionInstructionCard";
import SQLInjectionLogs from "./SQLInjectionLogs";
import SQLInjectionQueryBox from "./SQLInjectionQueryBox";
import SQLInjectionStepDots from "./SQLInjectionStepDots";

function SQLInjectionExperience({ lesson }) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState([]);
  const [showError, setShowError] = useState(false);
  const [canSaveProgress, setCanSaveProgress] = useState(false);
  const { isAuthenticated, isReady, progress, saveProgress } = useLessonProgress(
    lesson.slug
  );

  const nextStep = () => {
    if (step < lesson.finalStep) setStep(step + 1);
  };

  useEffect(() => {
    setCanSaveProgress(false);
  }, [lesson.slug]);

  useEffect(() => {
    if (!isReady) return;

    if (progress) {
      const savedStep = Math.min(progress.currentStep || 0, lesson.finalStep);
      if (savedStep > 0) setStep(savedStep);
    }

    setCanSaveProgress(true);
  }, [isReady, lesson.finalStep, progress]);

  useEffect(() => {
    if (!canSaveProgress || !isAuthenticated) return;

    saveProgress({
      currentStep: step,
      totalSteps: lesson.totalSteps,
      interactiveCompleted: step >= lesson.finalStep,
    }).catch(() => {});
  }, [
    canSaveProgress,
    isAuthenticated,
    lesson.finalStep,
    lesson.totalSteps,
    saveProgress,
    step,
  ]);

  useEffect(() => {
    if (step >= 1) setLogs([lesson.logs.initialized]);
  }, [lesson.logs.initialized, step]);

  const handleLogin = (event) => {
    event.preventDefault();
    const query = `SELECT * FROM users WHERE email = '${username}' AND password = '${password}'`;
    const normalizedPassword = password
      .trim()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u2010-\u2015]/g, "-");

    if (step < lesson.successfulLoginStep) {
      setLogs([
        `${lesson.logs.initialized} ${lesson.logs.attemptingLogin}`,
        `${lesson.logs.invalidPrefix} ${query}`,
      ]);
      setShowError(true);
      return;
    }

    if (normalizedPassword === lesson.credentials.injectionPassword) {
      setLogs([
        lesson.logs.initialized,
        lesson.logs.attemptingLogin,
        lesson.logs.sqlCommentDetected,
        lesson.logs.authenticated,
      ]);
      setShowError(false);
    } else {
      setLogs([
        `${lesson.logs.initialized} ${lesson.logs.attemptingLogin}`,
        `${lesson.logs.invalidPrefix} ${query}`,
      ]);
      setShowError(true);
    }
  };

  return (
    <div className="mx-auto mt-5 w-full max-w-[90rem] overflow-hidden px-3 pb-12 sm:mt-8 sm:px-5 lg:px-8 2xl:px-10">
      <h1 className="mb-5 break-words text-center text-xl font-bold text-text sm:mb-7 sm:text-2xl md:text-3xl">
        {lesson.title}
      </h1>

      <SQLInjectionStepDots
        step={step}
        setStep={setStep}
        totalSteps={lesson.totalSteps}
      />

      {step === lesson.finalStep && <SQLInjectionCompletionCard lesson={lesson} />}

      {step !== lesson.finalStep && (
        <div className="flex flex-col items-center justify-center gap-6 xl:flex-row xl:items-start xl:gap-8 2xl:gap-10">
          <div className="flex w-full max-w-2xl flex-col items-center xl:max-w-xl xl:items-stretch">
            <SQLInjectionInstructionCard
              step={step}
              nextStep={nextStep}
              steps={lesson.steps}
            />
            <SQLInjectionQueryBox
              lesson={lesson}
              step={step}
              username={username}
              password={password}
            />
          </div>

          <div className="w-full max-w-md xl:max-w-[27rem]">
            <SQLInjectionBankDemo
              lesson={lesson}
              step={step}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              showError={showError}
              setShowError={setShowError}
            />
            <SQLInjectionLogs step={step} logs={logs} />
          </div>
        </div>
      )}
    </div>
  );
}

export default SQLInjectionExperience;
