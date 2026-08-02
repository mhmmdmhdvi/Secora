const STEP_BLOCK_PATTERN = /^step-\d+$/;

export function mapApiLessonToXxeLesson(apiLesson) {
  const interactive = section(apiLesson, "interactive-demo");
  const guideSection = section(apiLesson, "guide");
  const blocks = interactive.blocks || [];
  const stepBlocks = blocks
    .filter((block) => STEP_BLOCK_PATTERN.test(block.key))
    .sort(bySortOrder);
  const simulation = requiredBlock(blocks, "xml-external-entities-demo");
  const completion = requiredBlock(blocks, "completion");
  const guide = requiredBlock(guideSection.blocks || [], "xml-external-entities-guide");
  const initialState =
    simulation.content?.initial_state ||
    simulation.content?.initialState ||
    simulation.config.initial_state;

  if (!initialState) {
    throw new Error("XML External Entities API lesson is missing simulation initial state.");
  }

  return {
    slug: apiLesson.slug,
    title: apiLesson.title,
    totalSteps: initialState.total_steps,
    finalStep: initialState.final_step,
    guidePath: initialState.guide_path || completion.config.action_path,
    quizPath: initialState.quiz_path,
    quizStartPath: initialState.quiz_start_path,
    lessonsPath: initialState.lessons_path,
    simulation: initialState.simulation,
    quizIntro: mapQuizIntro(initialState.quiz_intro),
    completion: richParts(completion),
    steps: stepBlocks.map(richParts),
    guide: guide.content.guide,
    quiz: mapQuiz(apiLesson.quiz),
  };
}

function section(apiLesson, key) {
  const found = apiLesson.sections?.find((candidate) => candidate.key === key);
  if (!found) {
    throw new Error(`XML External Entities API lesson is missing ${key} section.`);
  }
  return found;
}

function requiredBlock(blocks, key) {
  const block = blocks.find((candidate) => candidate.key === key);
  if (!block) {
    throw new Error(`XML External Entities API lesson is missing ${key} block.`);
  }
  return block;
}

function richParts(block) {
  const parts = block.content?.parts;
  if (!Array.isArray(parts)) {
    throw new Error(`XML External Entities API block ${block.key} is missing rich parts.`);
  }
  return parts;
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
  if (!apiQuiz) return null;

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
    questions,
  };
}

function bySortOrder(left, right) {
  return left.sortOrder - right.sortOrder;
}
