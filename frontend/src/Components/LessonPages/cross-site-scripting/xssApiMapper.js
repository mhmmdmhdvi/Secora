const STEP_BLOCK_PATTERN = /^step-\d+$/;

export function mapApiLessonToCrossSiteScriptingLesson(apiLesson) {
  const interactive = section(apiLesson, "interactive-demo");
  const guideSection = section(apiLesson, "guide");
  const blocks = interactive.blocks || [];
  const stepBlocks = blocks
    .filter((block) => STEP_BLOCK_PATTERN.test(block.key))
    .sort(bySortOrder);
  const simulation = requiredBlock(blocks, "breddit-demo");
  const completion = requiredBlock(blocks, "completion");
  const guideBlock = requiredBlock(guideSection.blocks || [], "xss-guide");
  const initialState =
    simulation.content?.initial_state ||
    simulation.content?.initialState ||
    simulation.config.initial_state;

  if (!initialState) {
    throw new Error("XSS API lesson is missing simulation initial state.");
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
    quizIntro: mapQuizIntro(initialState.quiz_intro),
    quiz: mapQuiz(apiLesson.quiz),
    simulation: initialState.simulation,
    completion: richParts(completion),
    steps: stepBlocks.map(richParts),
    guide: mapGuide(guideBlock.content.guide),
  };
}

function section(apiLesson, key) {
  const found = apiLesson.sections?.find((candidate) => candidate.key === key);
  if (!found) throw new Error(`XSS API lesson is missing ${key} section.`);
  return found;
}

function requiredBlock(blocks, key) {
  const block = blocks.find((candidate) => candidate.key === key);
  if (!block) throw new Error(`XSS API lesson is missing ${key} block.`);
  return block;
}

function richParts(block) {
  const parts = block.content?.parts;
  if (!Array.isArray(parts)) {
    throw new Error(`XSS API block ${block.key} is missing rich parts.`);
  }
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
    questions,
  };
}

function mapGuide(guide) {
  return {
    overview: guide.overview,
    risks: guide.risks,
    protection: mapProtection(guide.protection),
    codeSamples: mapCodeSamples(guide.code_samples),
  };
}

function mapProtection(protection) {
  return {
    title: protection.title,
    intro: protection.intro,
    tableHeadings: protection.table_headings,
    frameworkNote: protection.framework_note,
    escapeClosing: protection.escape_closing,
    sections: protection.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
      terminal: section.terminal,
      afterTerminal: section.after_terminal,
      secondTerminal: section.second_terminal,
      closing: section.closing,
      thirdTerminal: section.third_terminal,
      finalParagraph: section.final_paragraph,
    })),
  };
}

function mapCodeSamples(codeSamples) {
  return {
    icon: codeSamples.icon,
    title: codeSamples.title,
    intro: codeSamples.intro,
    quizCta: {
      eyebrow: codeSamples.quiz_cta.eyebrow,
      icon: codeSamples.quiz_cta.icon,
      label: codeSamples.quiz_cta.label,
      title: codeSamples.quiz_cta.title,
      summary: codeSamples.quiz_cta.summary,
      path: codeSamples.quiz_cta.path,
    },
    items: codeSamples.items,
  };
}

function bySortOrder(left, right) {
  return left.sortOrder - right.sortOrder;
}
