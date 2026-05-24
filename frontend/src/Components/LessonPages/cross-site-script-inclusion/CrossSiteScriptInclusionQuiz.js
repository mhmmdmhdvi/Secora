import { useNavigate } from "react-router-dom";

function SQLInjectionQuiz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 flex justify-center px-4">
      <div className="text-center max-w-3xl w-full">
        <div className="text-base sm:text-lg font-bold text-gray-500 mb-3">
          Test your knowledge
        </div>

        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black flex justify-center items-center gap-2 sm:gap-3 mb-6 flex-wrap">
          <span className="text-3xl sm:text-4xl">✏️</span>
          <span>Quiz: XSSI</span>
        </div>

        <div className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 leading-7">
          Take this quick quiz to show you were paying attention.
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-2">
          <button
            className="w-full sm:w-auto bg-[#7c5cff] hover:bg-[#6a4ee6] text-white text-base sm:text-lg px-8 sm:px-10 py-3.5 rounded-xl transition"
            onClick={() => navigate("/lessons/cross-site-script-inclusion-quiz-start")}
          >
            Start the quiz
          </button>

          <button
            className="text-gray-500 text-sm sm:text-base hover:text-black transition font-semibold"
            onClick={() => navigate("/lessons/cross-site-script-inclusion-guide")}
          >
            Review the material one more time →
          </button>
        </div>
      </div>
    </div>
  );
}

export default SQLInjectionQuiz;
