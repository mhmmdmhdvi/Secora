import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";

import { useAppLanguage } from "../../../hooks/useAppLanguage";
import { useAuth } from "../../../hooks/useAuth";
import { saveQuizAttempt } from "../../../services/learningApi";
import LessonFeedbackCard from "./LessonFeedbackCard";

function QuizRunnerExperience({ lesson }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { language } = useAppLanguage();
  const { questions } = lesson.quiz;

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
    setResults((prev) => {
      const copy = [...prev];
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
        if (payload?.recommendation) {
          setRecommendation(payload.recommendation);
        }
      })
      .catch(() => {});
  }

  if (finished) {
    const passed = score === lesson.quiz.passScore;

    return (
      <div className="min-h-screen pt-8 sm:pt-10 px-4 sm:px-5 flex flex-col items-center">
        <div className="text-center mt-8 max-w-xl w-full">
          <div
            className={`mb-4 flex justify-center ${
              passed ? "text-green-500" : "text-red-500"
            }`}
          >
            {passed ? (
              <FiCheckCircle className="h-14 w-14" aria-hidden="true" />
            ) : (
              <FiXCircle className="h-14 w-14" aria-hidden="true" />
            )}
          </div>

          {passed ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                {t("quiz.passed")}
              </h2>

              {recommendation && (
                <RecommendedNextCard
                  onOpen={() => navigate(`/lessons/${recommendation.lesson.slug}`)}
                  recommendation={recommendation}
                />
              )}

              <LessonFeedbackCard lessonSlug={lesson.slug} source="quiz" />

              <button
                className="mt-5 w-full sm:w-auto bg-surface-muted hover:bg-border/60 text-text px-6 py-3 rounded-xl font-semibold transition"
                onClick={() => navigate(lesson.lessonsPath)}
              >
                {t("quiz.backToLessons")}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                {t("quiz.score", { score, total: questions.length })}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mt-6">
                <button
                  className="w-full sm:w-auto bg-[#7756ff] hover:bg-[#684ae7] text-white px-6 py-3 rounded-xl font-semibold transition"
                  onClick={resetQuiz}
                >
                  {t("quiz.tryAgain")}
                </button>

                <button
                  className="w-full sm:w-auto bg-surface-muted hover:bg-border/60 text-text px-6 py-3 rounded-xl font-semibold transition"
                  onClick={() => navigate(lesson.lessonsPath)}
                >
                  {t("quiz.neverMind")}
                </button>
              </div>

              <LessonFeedbackCard lessonSlug={lesson.slug} source="quiz" />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-10 px-4 sm:px-5 flex flex-col items-center">
      <div className="relative flex justify-center gap-4 sm:gap-6 mt-3 mb-8">
        <div className="absolute top-1/2 w-[150px] sm:w-[180px] h-[4px] bg-border -translate-y-1/2 z-0"></div>

        {questions.map((_, i) => {
          const result = results[i];

          return (
            <div
              key={i}
              className="w-6 h-6 sm:w-7 sm:h-7 bg-surface rounded-full border-[3px] border-border flex items-center justify-center font-bold z-10"
            >
              {result === true && (
                <span className="text-green-500 text-sm sm:text-base">✓</span>
              )}
              {result === false && (
                <span className="text-red-500 text-sm sm:text-base">×</span>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        {t("quiz.question")} {current + 1}
      </h2>

      <p className="text-center max-w-2xl text-base sm:text-lg text-text-muted mt-2 mb-8 leading-7">
        {question.type === "truefalse" && (
          <strong>{t("quiz.trueFalsePrefix")}</strong>
        )}
        {question.text}
      </p>

      <div className="flex flex-col gap-4 sm:gap-[18px] w-full items-center">
        {question.options.map((option, i) => {
          let base =
            "w-full max-w-[420px] bg-surface text-text py-4 px-5 rounded-[32px] border-2 border-border text-center text-base sm:text-[17px] cursor-pointer transition select-none hover:bg-surface-muted";

          if (selected !== null) {
            if (i === question.answer)
              base +=
                " bg-green-100 border-green-500 text-green-800 dark:bg-green-950/60 dark:border-green-400 dark:text-green-100";
            else if (i === selected)
              base +=
                " bg-red-100 border-red-500 text-red-800 dark:bg-red-950/60 dark:border-red-400 dark:text-red-100";
          }

          return (
            <div key={i} className={base} onClick={() => selectAnswer(i)}>
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
      <h3 className="mt-2 text-xl font-semibold text-text">
        {recommendation.lesson.title}
      </h3>
      {recommendation.path?.title && (
        <p className="mt-1 text-sm text-text-muted">
          {t("quiz.fromPath", { path: recommendation.path.title })}
        </p>
      )}
      {recommendation.lesson.summary && (
        <p className="mt-3 text-sm leading-6 text-text-muted">
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
