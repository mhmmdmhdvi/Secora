import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";

import { useAppLanguage } from "../../../hooks/useAppLanguage";
import { useAuth } from "../../../hooks/useAuth";
import { useRewards } from "../../Rewards/RewardProvider";
import { saveQuizAttempt } from "../../../services/learningApi";
import LessonFeedbackCard from "./LessonFeedbackCard";

function QuizRunnerExperience({ lesson }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { language } = useAppLanguage();
  const { showRewards } = useRewards();
  const { questions } = lesson.quiz;
  const isPersian = language === "fa";

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  const question = questions[current];

  function resetQuiz() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setResults([]);
    setAnswers({});
    setRecommendation(null);
  }

  function selectAnswer(index) {
    if (selected !== null) return;

    setSelected(index);

    const correct = index === question.answer;
    setResults((previous) => {
      const copy = [...previous];
      copy[current] = correct;
      return copy;
    });

    const updatedAnswers = {
      ...answers,
      [question.key || current]: {
        selectedIndex: index,
        correct,
      },
    };
    setAnswers(updatedAnswers);

    const nextScore = score + (correct ? 1 : 0);
    if (correct) setScore(nextScore);

    setTimeout(() => {
      const next = current + 1;
      if (next < questions.length) {
        setCurrent(next);
        setSelected(null);
      } else {
        setFinished(true);
        recordQuizAttempt(nextScore, updatedAnswers);
      }
    }, 1200);
  }

  function recordQuizAttempt(finalScore, finalAnswers) {
    if (!isAuthenticated || !lesson.slug) return;

    saveQuizAttempt(
      lesson.slug,
      {
        score: finalScore,
        totalQuestions: questions.length,
        answers: finalAnswers,
      },
      { locale: language }
    )
      .then((payload) => {
        showRewards(payload?.rewards);
        if (payload?.recommendation) {
          setRecommendation(payload.recommendation);
        }
      })
      .catch(() => {});
  }

  if (finished) {
    const passed = score === lesson.quiz.passScore;

    return (
      <div className="flex min-h-screen flex-col items-center px-3 pt-8 sm:px-5 sm:pt-10">
        <div className="mt-6 w-full max-w-xl text-center sm:mt-8">
          <div
            className={`mb-4 flex justify-center ${
              passed ? "text-green-500" : "text-red-500"
            }`}
          >
            {passed ? (
              <FiCheckCircle className="h-12 w-12 sm:h-14 sm:w-14" aria-hidden="true" />
            ) : (
              <FiXCircle className="h-12 w-12 sm:h-14 sm:w-14" aria-hidden="true" />
            )}
          </div>

          {passed ? (
            <>
              <h2 className="mb-6 break-words text-2xl font-bold sm:text-3xl">
                {t("quiz.passed")}
              </h2>

              {recommendation && (
                <RecommendedNextCard
                  onOpen={() => navigate(`/lessons/${recommendation.lesson.slug}`)}
                  recommendation={recommendation}
                />
              )}

              <LessonFeedbackCard
                lessonSlug={lesson.slug}
                source="quiz"
              />

              <button
                className="mt-5 w-full rounded-xl bg-surface-muted px-6 py-3 font-semibold text-text transition hover:bg-border/60 sm:w-auto"
                onClick={() => navigate(lesson.lessonsPath)}
              >
                {t("quiz.backToLessons")}
              </button>
            </>
          ) : (
            <>
              <h2 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
                {t("quiz.score", { score, total: questions.length })}
              </h2>

              <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:gap-5">
                <button
                  className="w-full rounded-xl bg-[#7756ff] px-6 py-3 font-semibold text-white transition hover:bg-[#684ae7] sm:w-auto"
                  onClick={resetQuiz}
                >
                  {t("quiz.tryAgain")}
                </button>

                <button
                  className="w-full rounded-xl bg-surface-muted px-6 py-3 font-semibold text-text transition hover:bg-border/60 sm:w-auto"
                  onClick={() => navigate(lesson.lessonsPath)}
                >
                  {t("quiz.neverMind")}
                </button>
              </div>

              <LessonFeedbackCard
                lessonSlug={lesson.slug}
                source="quiz"
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-3 pt-8 sm:px-5 sm:pt-10">
      <div className="relative mb-7 mt-3 flex max-w-full justify-center gap-4 sm:mb-8 sm:gap-6">
        <div className="absolute top-1/2 z-0 h-1 w-[min(11rem,70vw)] -translate-y-1/2 bg-border" />

        {questions.map((_, index) => {
          const result = results[index];

          return (
            <div
              key={index}
              className="z-10 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-border bg-surface font-bold sm:h-7 sm:w-7"
            >
              {result === true && (
                <span className="text-sm text-green-500 sm:text-base">✓</span>
              )}
              {result === false && (
                <span className="text-sm text-red-500 sm:text-base">×</span>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
        {t("quiz.question")} {current + 1}
      </h2>

      <p
        dir={isPersian ? "rtl" : "ltr"}
        className="mb-7 mt-2 max-w-2xl break-words text-center text-base leading-7 text-text-muted sm:mb-8 sm:text-lg"
      >
        {question.type === "truefalse" && (
          <strong>{t("quiz.trueFalsePrefix")}</strong>
        )}
        {question.text}
      </p>

      <div className="flex w-full flex-col items-center gap-4 sm:gap-[18px]">
        {question.options.map((option, index) => {
          let base =
            "w-full max-w-[420px] cursor-pointer select-none rounded-[28px] border-2 border-border bg-surface px-4 py-4 text-center text-base text-text transition hover:bg-surface-muted sm:rounded-[32px] sm:px-5 sm:text-[17px] break-words";

          if (selected !== null) {
            if (index === question.answer) {
              base +=
                " bg-green-100 border-green-500 text-green-800 dark:bg-green-950/60 dark:border-green-400 dark:text-green-100";
            } else if (index === selected) {
              base +=
                " bg-red-100 border-red-500 text-red-800 dark:bg-red-950/60 dark:border-red-400 dark:text-red-100";
            }
          }

          return (
            <div
              key={index}
              dir={isPersian ? "rtl" : "ltr"}
              className={base}
              onClick={() => selectAnswer(index)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendedNextCard({ onOpen, recommendation }) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-2 w-full max-w-lg rounded-2xl border border-border bg-surface p-5 text-start shadow-sm">
      <p className="text-sm font-semibold text-primary">
        {t("quiz.recommendedNext")}
      </p>
      <h3 className="mt-2 break-words text-xl font-semibold text-text">
        {recommendation.lesson.title}
      </h3>
      {recommendation.path?.title && (
        <p className="mt-1 text-sm text-text-muted">
          {t("quiz.fromPath", { path: recommendation.path.title })}
        </p>
      )}
      {recommendation.lesson.summary && (
        <p className="mt-3 break-words text-sm leading-6 text-text-muted">
          {recommendation.lesson.summary}
        </p>
      )}
      <button
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-text-inverted transition hover:bg-primary-hover sm:w-auto"
        onClick={onOpen}
      >
        {t("quiz.startRecommended")}
        <FiArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default QuizRunnerExperience;
