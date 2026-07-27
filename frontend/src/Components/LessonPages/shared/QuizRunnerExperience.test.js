import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthProvider } from "../../../contexts/AuthContext";
import { clearAuthTokens, setAuthTokens } from "../../../services/authTokens";
import QuizRunnerExperience from "./QuizRunnerExperience";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

const originalFetch = global.fetch;

beforeEach(() => {
  jest.useFakeTimers();
  clearAuthTokens();
});

afterEach(() => {
  clearAuthTokens();
  global.fetch = originalFetch;
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("does not save quiz attempts for guests", () => {
  global.fetch = jest.fn();

  renderQuiz();

  fireEvent.click(screen.getByText("correct"));
  act(() => {
    jest.runOnlyPendingTimers();
  });

  expect(screen.getByText("آزمون رو با موفقیت گذروندی!")).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test("saves a passed quiz attempt for authenticated users", async () => {
  setAuthTokens({ access: "access-token", refresh: "refresh-token" });
  global.fetch = jest.fn().mockResolvedValue(
    new Response(JSON.stringify({ attempt: { passed: true } }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  );

  renderQuiz();

  fireEvent.click(screen.getByText("correct"));
  act(() => {
    jest.runOnlyPendingTimers();
  });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/learning/quiz-attempts/sql-injection/?locale=fa",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          score: 1,
          totalQuestions: 1,
          answers: {
            "safe-query": {
              selectedIndex: 0,
              correct: true,
            },
          },
        }),
      })
    );
  });
});

function renderQuiz() {
  return render(
    <AuthProvider>
      <QuizRunnerExperience lesson={lesson()} />
    </AuthProvider>
  );
}

function lesson() {
  return {
    slug: "sql-injection",
    lessonsPath: "/lessons",
    quiz: {
      passScore: 1,
      questions: [
        {
          key: "safe-query",
          type: "multi",
          text: "Pick the safe query.",
          options: ["Correct", "Wrong"],
          answer: 0,
        },
      ],
    },
  };
}
