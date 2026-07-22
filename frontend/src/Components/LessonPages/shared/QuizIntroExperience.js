import { useNavigate } from "react-router-dom";

function QuizIntroExperience({ lesson }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app text-text pt-20 sm:pt-24 md:pt-28 flex justify-center px-4">
      <div className="text-center max-w-3xl w-full">
        <div className="text-base sm:text-lg font-bold text-text-muted mb-3">
          {lesson.quizIntro.eyebrow}
        </div>

        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-text flex justify-center items-center gap-2 sm:gap-3 mb-6 flex-wrap">
          <span className="text-3xl sm:text-4xl">{lesson.quizIntro.icon}</span>
          <span>{lesson.quizIntro.title}</span>
        </div>

        <div className="text-base sm:text-lg text-text-muted mb-8 sm:mb-10 leading-7">
          {lesson.quizIntro.summary}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-2">
          <button
            className="w-full sm:w-auto bg-[#7c5cff] hover:bg-[#6a4ee6] text-white text-base sm:text-lg px-8 sm:px-10 py-3.5 rounded-xl transition"
            onClick={() => navigate(lesson.quizStartPath)}
          >
            {lesson.quizIntro.startButton}
          </button>

          <button
            className="text-text-muted text-sm sm:text-base hover:text-text transition font-semibold"
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
