import { useNavigate } from "react-router-dom";

function QuizIntroExperience({ lesson }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-app px-3 pt-14 text-text sm:px-4 sm:pt-20 md:pt-24">
      <div className="w-full max-w-3xl text-center">
        <div className="mb-3 text-sm font-bold text-text-muted sm:text-base md:text-lg">
          {lesson.quizIntro.eyebrow}
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-center gap-2 break-words text-3xl font-bold text-text sm:mb-6 sm:gap-3 sm:text-4xl md:text-5xl">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">
            {lesson.quizIntro.icon}
          </span>
          <span className="min-w-0">{lesson.quizIntro.title}</span>
        </div>

        <div className="mb-8 text-base leading-7 text-text-muted sm:mb-10 sm:text-lg">
          {lesson.quizIntro.summary}
        </div>

        <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <button
            className="w-full rounded-xl bg-[#7c5cff] px-8 py-3.5 text-base text-white transition hover:bg-[#6a4ee6] sm:w-auto sm:px-10 sm:text-lg"
            onClick={() => navigate(lesson.quizStartPath)}
          >
            {lesson.quizIntro.startButton}
          </button>

          <button
            className="text-sm font-semibold text-text-muted transition hover:text-text sm:text-base"
            onClick={() => navigate(lesson.guidePath)}
          >
            {lesson.quizIntro.reviewButton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizIntroExperience;
