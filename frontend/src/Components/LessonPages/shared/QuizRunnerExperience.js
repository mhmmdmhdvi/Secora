import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function QuizRunnerExperience({ lesson }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { questions } = lesson.quiz;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);

  const question = questions[current];

  function resetQuiz() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setResults([]);
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

    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      const next = current + 1;
      if (next < questions.length) {
        setCurrent(next);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  }

  if (finished) {
    const passed = score === lesson.quiz.passScore;

    return (
      <div className="min-h-screen pt-8 sm:pt-10 px-4 sm:px-5 flex flex-col items-center">
        <div className="text-center mt-8 max-w-xl w-full">
          <div
            className={`text-5xl sm:text-6xl mb-4 ${
              passed ? "text-green-500" : "text-red-500"
            }`}
          >
            {passed ? "✔" : "✖"}
          </div>

          {passed ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                {t("quiz.passed")}
              </h2>

              <button
                className="w-full sm:w-auto bg-[#7756ff] hover:bg-[#684ae7] text-white px-6 py-3 rounded-xl font-semibold transition"
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
                <span className="text-green-500 text-sm sm:text-base">✔</span>
              )}
              {result === false && (
                <span className="text-red-500 text-sm sm:text-base">✖</span>
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
              {option.toLowerCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuizRunnerExperience;
