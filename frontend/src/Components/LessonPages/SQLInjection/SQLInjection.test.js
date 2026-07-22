import { fireEvent, render, screen } from "@testing-library/react";

import SQLInjectionExperience from "./SQLInjectionExperience";
import { mapApiLessonToSQLInjectionLesson } from "./sqlInjectionApiMapper";

test("renders the original SQL Injection lesson experience", () => {
  render(<SQLInjectionExperience lesson={testLesson()} />);

  expect(screen.getByRole("heading", { name: "SQL Injection" })).toBeInTheDocument();
  expect(
    screen.getByText(/This is the vulnerable application we will be trying to hack/i)
  ).toBeInTheDocument();
  expect(screen.getByText("SECURE BANK")).toBeInTheDocument();
});

test("preserves the original successful SQL injection interaction", () => {
  render(<SQLInjectionExperience lesson={testLesson()} />);

  fireEvent.click(screen.getByLabelText("Go to step 11"));

  const fields = screen.getAllByRole("textbox");
  fireEvent.change(fields[0], { target: { value: "user@email.com" } });
  fireEvent.change(fields[1], { target: { value: "' or 1=1--" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  expect(screen.getByText("Authentication successful.")).toBeInTheDocument();
});

test("keeps SQL Injection content mapped to the original step and quiz counts", () => {
  const lesson = testLesson();

  expect(lesson.totalSteps).toBe(14);
  expect(lesson.steps).toHaveLength(13);
  expect(lesson.quiz.questions).toHaveLength(3);
});

function testLesson() {
  return mapApiLessonToSQLInjectionLesson({
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
