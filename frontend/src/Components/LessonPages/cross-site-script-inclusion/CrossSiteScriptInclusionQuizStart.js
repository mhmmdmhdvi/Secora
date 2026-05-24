import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    type: "multi",
    text: "What is Cross-Site Script Inclusion (XSSI)?",
    options: [
        "When a malicious site imports JavaScript from a third-party domain and is able to extract sensitive details like user credentials from the imported script.",
        "When an attacker manages to execute malicious JavaScript in a victims browser.",
        "when an attacker is able to execute malicious code on your web-server.",
    ],
    answer: 0,
  },
  {
    type: "multi",
    text: "What is a safe way of loading state into the browsers JavaScript engine from the server?",
    options: [
      "Loading JSON data via the fetch API.",
      "Interpolating data in JavaScript files.",
      "Including every users credentials in a publicly available XML feed.",
    ],
    answer: 0,
  },
];

function SQLInjectionQuizStart() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);

  const question = questions[current];

  function selectAnswer(index) {
    if (selected !== null) return;

    setSelected(index);

    const correct = index === question.answer;

    setResults((prev) => {
      const copy = [...prev];
      copy[current] = correct;
      return copy;
    });

    if (correct) {
      setScore((s) => s + 1);
    }

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
    const passed = score === questions.length;

    return (
      <div className="min-h-screen pt-8 sm:pt-10 px-4 sm:px-5 flex flex-col items-center">
        <div className="text-center mt-8 max-w-xl w-full">
          <div className={`text-5xl sm:text-6xl mb-4 ${passed ? "text-green-500" : "text-red-500"}`}>
            {passed ? "✔" : "✖"}
          </div>

          {passed ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                You passed the quiz!
              </h2>

              <button
                className="w-full sm:w-auto bg-[#7756ff] hover:bg-[#684ae7] text-white px-6 py-3 rounded-xl font-semibold transition"
                onClick={() => navigate("/lessons")}
              >
                Go back to lessons
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                You scored {score} out of {questions.length}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mt-6">
                <button
                  className="w-full sm:w-auto bg-[#7756ff] hover:bg-[#684ae7] text-white px-6 py-3 rounded-xl font-semibold transition"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>

                <button
                  className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition"
                  onClick={() => navigate("/lessons")}
                >
                  Never mind
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
      {/* progress dots */}
      <div className="relative flex justify-center gap-4 sm:gap-6 mt-3 mb-8">
        <div className="absolute top-1/2 w-[150px] sm:w-[180px] h-[4px] bg-gray-300 -translate-y-1/2 z-0"></div>

        {questions.map((_, i) => {
          const result = results[i];

          return (
            <div
              key={i}
              className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full border-[3px] border-gray-400 flex items-center justify-center font-bold z-10"
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
        Question {current + 1}
      </h2>

      <p className="text-center max-w-2xl text-base sm:text-lg text-gray-600 mt-2 mb-8 leading-7">
        {question.type === "truefalse" && <strong>True or False: </strong>}
        {question.text}
      </p>

      <div className="flex flex-col gap-4 sm:gap-[18px] w-full items-center">
        {question.options.map((option, i) => {
          let base =
            "w-full max-w-[420px] bg-white py-4 px-5 rounded-[32px] border-2 border-gray-300 text-center text-base sm:text-[17px] cursor-pointer transition select-none";

          if (selected !== null) {
            if (i === question.answer)
              base += " bg-green-100 border-green-500 text-green-800";
            else if (i === selected)
              base += " bg-red-100 border-red-500 text-red-800";
          }

          return (
            <div
              key={i}
              className={base}
              onClick={() => selectAnswer(i)}
            >
              {option.toLowerCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SQLInjectionQuizStart;
