const STEP_BLOCK_PATTERN = /^step-\d+$/;

export function mapApiLessonToDomBasedXssLesson(apiLesson) {
  const interactive = section(apiLesson, "interactive-demo");
  const blocks = interactive.blocks || [];
  const stepBlocks = blocks
    .filter((block) => STEP_BLOCK_PATTERN.test(block.key))
    .sort(bySortOrder);
  const simulation = requiredBlock(blocks, "dom-based-xss-demo");
  const completion = requiredBlock(blocks, "completion");
  const initialState =
    simulation.content?.initial_state ||
    simulation.content?.initialState ||
    simulation.config.initial_state;

  if (!initialState) {
    throw new Error("DOM-based XSS API lesson is missing simulation initial state.");
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
    completion: richParts(completion),
    steps: stepBlocks.map(richParts),
  };
}

function section(apiLesson, key) {
  const found = apiLesson.sections?.find((candidate) => candidate.key === key);
  if (!found) {
    throw new Error(`DOM-based XSS API lesson is missing ${key} section.`);
  }
  return found;
}

function requiredBlock(blocks, key) {
  const block = blocks.find((candidate) => candidate.key === key);
  if (!block) {
    throw new Error(`DOM-based XSS API lesson is missing ${key} block.`);
  }
  return block;
}

function richParts(block) {
  const parts = block.content?.parts;
  if (!Array.isArray(parts)) {
    throw new Error(`DOM-based XSS API block ${block.key} is missing rich parts.`);
  }
  return parts;
}

function bySortOrder(left, right) {
  return left.sortOrder - right.sortOrder;
}
