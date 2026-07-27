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

  const handleLogin = (e) => {
    e.preventDefault();
    const query = `SELECT * FROM users WHERE email = '${username}' AND password = '${password}'`;
    const normalizedPassword = password
      .trim()
      .replace(/[‘’]/g, "'")
      .replace(/[‐‑‒–—―]/g, "-");

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
    <div className="w-full max-w-7xl mx-auto mt-10 sm:mt-14 px-4 sm:px-6 lg:px-8 pb-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-text text-center mb-6 sm:mb-8">
        {lesson.title}
      </h1>

      <SQLInjectionStepDots
        step={step}
        setStep={setStep}
        totalSteps={lesson.totalSteps}
      />

      {step === lesson.finalStep && <SQLInjectionCompletionCard lesson={lesson} />}

      {step !== lesson.finalStep && (
        <div className="flex flex-col xl:flex-row justify-center items-start gap-6 lg:gap-10">
          <div className="w-full max-w-xl flex flex-col items-center xl:items-stretch">
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

          <div className="w-full max-w-md">
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
