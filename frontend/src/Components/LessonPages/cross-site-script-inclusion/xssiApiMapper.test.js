import { mapApiLessonToXSSILesson } from "./xssiApiMapper";

test("maps an XSSI API payload into the interactive, guide, and quiz shape", () => {
  const lesson = mapApiLessonToXSSILesson(apiLessonPayload());

  expect(lesson.title).toBe("Cross‑Site Script Inclusion (XSSI)");
  expect(lesson.totalSteps).toBe(3);
  expect(lesson.finalStep).toBe(2);
  expect(lesson.steps).toHaveLength(2);
  expect(lesson.originTable.body).toContain("Same Origin?");
  expect(lesson.codeExamples["1"].filename).toBe("hack-attempt.js");
  expect(lesson.guide.overview.title).toBe("Cross-Site Script Inclusion (XSSI)");
  expect(lesson.quizIntro.title).toBe("Quiz: XSSI");
  expect(lesson.quiz.questions[0].answer).toBe(0);
});

function apiLessonPayload() {
  return {
    title: "Cross‑Site Script Inclusion (XSSI)",
    sections: [
      {
        key: "interactive-demo",
        blocks: [
          {
            key: "step-01",
            sortOrder: 1,
            content: { parts: [{ type: "text", text: "Step one" }] },
          },
          {
            key: "step-02",
            sortOrder: 2,
            content: { parts: [{ type: "text", text: "Step two" }] },
          },
          {
            key: "xssi-demo",
            sortOrder: 3,
            config: {
              initial_state: {
                total_steps: 3,
                final_step: 2,
                guide_path: "/lessons/cross-site-script-inclusion-guide",
                quiz_path: "/lessons/cross-site-script-inclusion-quiz",
                quiz_start_path: "/lessons/cross-site-script-inclusion-quiz-start",
                lessons_path: "/lessons",
                origin_table: {
                  intro: "Only these URLs...",
                  body: "URL Same Origin?",
                },
                code_examples: {
                  1: { filename: "hack-attempt.js", code: "fetch('/profile')" },
                },
                quiz_intro: {
                  eyebrow: "Test your knowledge",
                  icon: "✏️",
                  title: "Quiz: XSSI",
                  summary: "Take this quick quiz to show you were paying attention.",
                  start_button: "Start the quiz",
                  review_button: "Review the material one more time →",
                },
              },
            },
          },
          {
            key: "completion",
            sortOrder: 4,
            config: { action_path: "/lessons/cross-site-script-inclusion-guide" },
            content: { parts: [{ type: "text", text: "Done" }] },
          },
        ],
      },
      {
        key: "guide",
        blocks: [
          {
            key: "xssi-guide",
            content: {
              guide: {
                overview: { title: "Cross-Site Script Inclusion (XSSI)" },
                sections: [],
                code_samples: { items: [], quiz_cta: {} },
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
          prompt: "What is XSSI?",
          answers: [
            { text: "Correct", isCorrect: true },
            { text: "Wrong", isCorrect: false },
          ],
        },
      ],
    },
  };
}
