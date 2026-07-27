const STEP_BLOCK_PATTERN = /^step-\d+$/;

export function mapApiLessonToXSSILesson(apiLesson) {
  const interactive = section(apiLesson, "interactive-demo");
  const guide = section(apiLesson, "guide");
  const blocks = interactive.blocks || [];
  const stepBlocks = blocks
    .filter((block) => STEP_BLOCK_PATTERN.test(block.key))
    .sort(bySortOrder);
  const simulation = requiredBlock(blocks, "xssi-demo");
  const completion = requiredBlock(blocks, "completion");
  const guideBlock = requiredBlock(guide.blocks || [], "xssi-guide");
  const initialState =
    simulation.content?.initial_state ||
    simulation.content?.initialState ||
    simulation.config.initial_state;

  return {
    slug: apiLesson.slug,
    title: apiLesson.title,
    totalSteps: initialState.total_steps,
    finalStep: initialState.final_step,
    guidePath: initialState.guide_path || completion.config.action_path,
    quizPath: initialState.quiz_path,
    quizStartPath: initialState.quiz_start_path,
    lessonsPath: initialState.lessons_path,
    quizIntro: mapQuizIntro(initialState.quiz_intro),
    quiz: mapQuiz(apiLesson.quiz),
    originTable: initialState.origin_table,
    codeExamples: initialState.code_examples,
    completion: richParts(completion),
    steps: stepBlocks.map(richParts),
    guide: guideBlock.content.guide,
  };
}

function section(apiLesson, key) {
  const found = apiLesson.sections?.find((candidate) => candidate.key === key);
  if (!found) throw new Error(`XSSI API lesson is missing ${key} section.`);
  return found;
}

function requiredBlock(blocks, key) {
  const block = blocks.find((candidate) => candidate.key === key);
  if (!block) throw new Error(`XSSI API lesson is missing ${key} block.`);
  return block;
}

function richParts(block) {
  const parts = block.content?.parts;
  if (!Array.isArray(parts)) throw new Error(`XSSI API block ${block.key} is missing rich parts.`);
  return parts.map((part) => {
    const { break_all: breakAllFromApi, ...rest } = part;
    return { ...rest, breakAll: part.breakAll || breakAllFromApi || false };
  });
}

function mapQuizIntro(quizIntro) {
  return {
    eyebrow: quizIntro.eyebrow,
    icon: quizIntro.icon,
    title: quizIntro.title,
    summary: quizIntro.summary,
    startButton: quizIntro.start_button,
    reviewButton: quizIntro.review_button,
  };
}

function mapQuiz(apiQuiz) {
  const questions = apiQuiz.questions.map((question) => ({
    key: question.key,
    type: question.answers.length === 2 ? "truefalse" : "multi",
    text: question.prompt,
    options: question.answers.map((answer) => answer.text),
    answer: question.answers.findIndex((answer) => answer.isCorrect),
  }));

  return {
    passScore:
      apiQuiz.passPercentage === 100
        ? questions.length
        : Math.ceil((questions.length * apiQuiz.passPercentage) / 100),
    passedTitle: "You passed the quiz!",
    backToLessonsButton: "Go back to lessons",
    tryAgainButton: "Try again",
    neverMindButton: "Never mind",
    questionLabel: "Question",
    trueFalsePrefix: "True or False: ",
    questions,
  };
}

function bySortOrder(left, right) {
  return left.sortOrder - right.sortOrder;
}
