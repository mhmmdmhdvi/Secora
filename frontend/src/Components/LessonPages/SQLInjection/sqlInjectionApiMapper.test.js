import { mapApiLessonToSQLInjectionLesson } from "./sqlInjectionApiMapper";

test("maps the SQL Injection API payload into the shared lesson experience shape", () => {
  const lesson = mapApiLessonToSQLInjectionLesson(apiLessonPayload());

  expect(lesson.title).toBe("SQL Injection");
  expect(lesson.totalSteps).toBe(3);
  expect(lesson.finalStep).toBe(2);
  expect(lesson.successfulLoginStep).toBe(10);
  expect(lesson.steps[0][1]).toEqual({
    type: "strong",
    text: "SQL injection",
    breakAll: false,
  });
  expect(lesson.completion[0].text).toBe("Phew");
  expect(lesson.bank.usernameLabel).toBe("Username");
  expect(lesson.credentials.injectionPassword).toBe("' or 1=1--");
  expect(lesson.logs.sqlCommentDetected).toBe("SQL comment detected: --");
});

test("requires rich parts for SQL Injection API parity", () => {
  const payload = apiLessonPayload();
  delete payload.sections[0].blocks[0].content;

  expect(() => mapApiLessonToSQLInjectionLesson(payload)).toThrow(
    "missing rich parts"
  );
});

test("maps guide and quiz content from the SQL Injection API payload", () => {
  const lesson = mapApiLessonToSQLInjectionLesson(apiLessonPayload());

  expect(lesson.quizIntro.title).toBe("Quiz: SQL Injection");
  expect(lesson.quiz.questions[0].answer).toBe(1);
  expect(lesson.quiz.passScore).toBe(1);
  expect(lesson.guide.overview.title).toBe("SQL Injection");
});

function apiLessonPayload() {
  return {
    title: "SQL Injection",
    sections: [
      {
        key: "interactive-demo",
        blocks: [
          {
            key: "step-01",
            sortOrder: 1,
            content: {
              parts: [
                { type: "text", text: "This is " },
                { type: "strong", text: "SQL injection" },
              ],
            },
          },
          {
            key: "step-02",
            sortOrder: 2,
            content: {
              parts: [{ type: "text", text: "Second step" }],
            },
          },
          {
            key: "secure-bank-demo",
            sortOrder: 3,
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
            sortOrder: 4,
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
            content: {
              guide: {
                overview: { title: "SQL Injection" },
                risks: {},
                protection: {},
                code_samples: {},
              },
            },
          },
        ],
      },
    ],
    quiz: {
      passPercentage: 100,
      questions: [
        {
          prompt: "Question?",
          answers: [
            { text: "True", isCorrect: false },
            { text: "False", isCorrect: true },
          ],
        },
      ],
    },
  };
}
