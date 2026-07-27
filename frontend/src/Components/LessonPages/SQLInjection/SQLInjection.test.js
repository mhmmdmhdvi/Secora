import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthProvider } from "../../../contexts/AuthContext";
import { clearAuthTokens, setAuthTokens } from "../../../services/authTokens";
import SQLInjectionExperience from "./SQLInjectionExperience";
import { mapApiLessonToSQLInjectionLesson } from "./sqlInjectionApiMapper";

const originalFetch = global.fetch;

beforeEach(() => {
  clearAuthTokens();
});

afterEach(() => {
  clearAuthTokens();
  global.fetch = originalFetch;
});

test("renders the original SQL Injection lesson experience", () => {
  renderLesson();

  expect(screen.getByRole("heading", { name: "SQL Injection" })).toBeInTheDocument();
  expect(
    screen.getByText(/This is the vulnerable application we will be trying to hack/i)
  ).toBeInTheDocument();
  expect(screen.getByText("SECURE BANK")).toBeInTheDocument();
});

test("preserves the original successful SQL injection interaction", () => {
  renderLesson();

  fireEvent.click(screen.getByLabelText("Go to step 11"));

  const fields = screen.getAllByRole("textbox");
  fireEvent.change(fields[0], { target: { value: "user@email.com" } });
  fireEvent.change(fields[1], { target: { value: "' or 1=1--" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  expect(screen.getByText("Authentication successful.")).toBeInTheDocument();
});

test("accepts the step 11 SQL injection payload when pasted with smart punctuation", () => {
  renderLesson();

  fireEvent.click(screen.getByLabelText("Go to step 11"));

  const fields = screen.getAllByRole("textbox");
  fireEvent.change(fields[0], { target: { value: " user@email.com " } });
  fireEvent.change(fields[1], { target: { value: "\u2019 or 1=1\u2013-" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  expect(screen.getByText("Authentication successful.")).toBeInTheDocument();
});

test("treats the step 11 injection as successful even when the email is different", () => {
  renderLesson();

  fireEvent.click(screen.getByLabelText("Go to step 11"));

  const fields = screen.getAllByRole("textbox");
  fireEvent.change(fields[0], { target: { value: "user@gmail.com" } });
  fireEvent.change(fields[1], { target: { value: "' or 1=1--" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  expect(screen.getByText("Authentication successful.")).toBeInTheDocument();
});

test("resumes and saves SQL Injection progress for authenticated users", async () => {
  setAuthTokens({ access: "access-token", refresh: "refresh-token" });
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ currentStep: 10 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ currentStep: 10 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    .mockResolvedValue(
      new Response(JSON.stringify({ currentStep: 11 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

  renderLesson();

  await waitFor(() => {
    expect(screen.getByText("Step 11")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Step 11"));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/learning/progress/sql-injection/",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          currentStep: 11,
          totalSteps: 14,
          interactiveCompleted: false,
        }),
      })
    );
  });
});

test("keeps SQL Injection content mapped to the original step and quiz counts", () => {
  const lesson = testLesson();

  expect(lesson.totalSteps).toBe(14);
  expect(lesson.steps).toHaveLength(13);
  expect(lesson.quiz.questions).toHaveLength(3);
});

function renderLesson(lesson = testLesson()) {
  return render(
    <AuthProvider>
      <SQLInjectionExperience lesson={lesson} />
    </AuthProvider>
  );
}

function testLesson() {
  return mapApiLessonToSQLInjectionLesson({
    slug: "sql-injection",
    title: "SQL Injection",
    sections: [
      {
        key: "interactive-demo",
        blocks: [
          ...Array.from({ length: 13 }).map((_, index) => ({
            key: `step-${String(index + 1).padStart(2, "0")}`,
            sortOrder: index + 1,
            content: {
              parts:
                index === 0
                  ? [
                      {
                        type: "text",
                        text: "This is the vulnerable application we will be trying to hack with an ",
                      },
                      { type: "strong", text: "SQL injection" },
                      { type: "text", text: " attack." },
                    ]
                  : [{ type: "text", text: `Step ${index + 1}` }],
            },
          })),
          {
            key: "secure-bank-demo",
            sortOrder: 14,
            config: {
              initial_state: {
                successful_login_step: 10,
                guide_path: "/lessons/sql-injection-guide",
                quiz_path: "/lessons/sql-injection-quiz",
                quiz_start_path: "/lessons/sql-injection-quiz-start",
                lessons_path: "/lessons",
                quiz_intro: {
                  eyebrow: "Test your knowledge",
                  icon: "✏️",
                  title: "Quiz: SQL Injection",
                  summary: "Take this quick quiz to show you were paying attention.",
                  start_button: "Start the quiz",
                  review_button: "Review the material one more time →",
                },
                bank: {
                  url: "www.securebank.com",
                  title: "SECURE BANK",
                  tagline:
                    "You can trust us with your money, we almost never get hacked.",
                  username_label: "Username",
                  password_label: "Password",
                  login_button: "Log in",
                  error_message: "An error occurred.",
                  welcome_message: "Welcome back user@gmail.com!",
                  balance_message: "Your current balance is",
                  balance: "$8,266",
                  transfer_button: "Initiate a transfer",
                },
                credentials: {
                  email: "user@email.com",
                  password: "password",
                  quoted_password: "password'",
                  injection_password: "' or 1=1--",
                },
                logs: {
                  initialized: "Application initialized.",
                  attempting_login: "User is attempting to login...",
                  invalid_prefix: "Invalid SQL:",
                  sql_comment_detected: "SQL comment detected: --",
                  authenticated: "Authentication successful.",
                },
                query: {
                  title: "SQL Query",
                  injection_highlight: " or 1=1--",
                },
              },
            },
          },
          {
            key: "completion",
            sortOrder: 15,
            config: { action_path: "/lessons/sql-injection-guide" },
            content: {
              parts: [{ type: "strong", text: "Phew" }],
            },
          },
        ],
      },
      {
        key: "guide",
        blocks: [
          {
            key: "sql-injection-guide",
            content: { guide: { overview: {}, risks: {}, protection: {}, code_samples: {} } },
          },
        ],
      },
    ],
    quiz: {
      passPercentage: 100,
      questions: [
        quizQuestion("one", 1, ["True", "False"]),
        quizQuestion("two", 1, ["True", "False"]),
        quizQuestion("three", 0, ["A", "B", "C", "D"]),
      ],
    },
  });
}

function quizQuestion(key, answerIndex, answers) {
  return {
    key,
    prompt: key,
    answers: answers.map((text, index) => ({
      text,
      isCorrect: index === answerIndex,
    })),
  };
}
