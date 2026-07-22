const STEP_BLOCK_PATTERN = /^step-\d+$/;

export function mapApiLessonToSQLInjectionLesson(apiLesson) {
  const blocks = interactiveBlocks(apiLesson);
  const stepBlocks = blocks
    .filter((block) => STEP_BLOCK_PATTERN.test(block.key))
    .sort(bySortOrder);
  const simulation = requiredBlock(blocks, "secure-bank-demo");
  const completion = requiredBlock(blocks, "completion");
  const initialState =
    simulation.content?.initial_state ||
    simulation.content?.initialState ||
    simulation.config.initial_state;

  requireInitialState(initialState);

  return {
    title: apiLesson.title,
    totalSteps: stepBlocks.length + 1,
    finalStep: stepBlocks.length,
    successfulLoginStep: initialState.successful_login_step,
    guidePath: initialState.guide_path || completion.config.action_path,
    quizPath: initialState.quiz_path,
    quizStartPath: initialState.quiz_start_path,
    lessonsPath: initialState.lessons_path,
    quizIntro: mapQuizIntro(initialState.quiz_intro),
    quiz: mapQuiz(apiLesson.quiz),
    guide: mapGuide(apiLesson),
    bank: mapBank(initialState.bank),
    credentials: mapCredentials(initialState.credentials),
    logs: mapLogs(initialState.logs),
    query: mapQuery(initialState.query),
    completion: richParts(completion),
    steps: stepBlocks.map(richParts),
  };
}

export function mapApiLessonToSQLInjectionQuiz(apiLesson) {
  const lesson = mapApiLessonToSQLInjectionLesson(apiLesson);
  return {
    title: lesson.title,
    guidePath: lesson.guidePath,
    quizStartPath: lesson.quizStartPath,
    lessonsPath: lesson.lessonsPath,
    quizIntro: lesson.quizIntro,
    quiz: lesson.quiz,
  };
}

export function mapApiLessonToSQLInjectionGuide(apiLesson) {
  const lesson = mapApiLessonToSQLInjectionLesson(apiLesson);
  return {
    title: lesson.title,
    quizPath: lesson.quizPath,
    guide: lesson.guide,
  };
}

function interactiveBlocks(apiLesson) {
  const section = apiLesson.sections?.find(
    (candidate) => candidate.key === "interactive-demo"
  );

  if (!section) {
    throw new Error("SQL Injection API lesson is missing interactive-demo section.");
  }

  return section.blocks || [];
}

function requiredBlock(blocks, key) {
  const block = blocks.find((candidate) => candidate.key === key);
  if (!block) throw new Error(`SQL Injection API lesson is missing ${key} block.`);
  return block;
}

function requireInitialState(initialState) {
  if (!initialState) {
    throw new Error("SQL Injection API lesson is missing simulation initial state.");
  }
}

function guideBlock(apiLesson) {
  const section = apiLesson.sections?.find((candidate) => candidate.key === "guide");
  const block = section?.blocks?.find(
    (candidate) => candidate.key === "sql-injection-guide"
  );

  if (!block?.content?.guide) {
    throw new Error("SQL Injection API lesson is missing guide content.");
  }

  return block;
}

function richParts(block) {
  const parts = block.content?.parts;
  if (!Array.isArray(parts)) {
    throw new Error(`SQL Injection API block ${block.key} is missing rich parts.`);
  }
  return parts.map(mapPart);
}

function mapPart(part) {
  const { break_all: breakAllFromApi, ...rest } = part;

  return {
    ...rest,
    breakAll: part.breakAll || breakAllFromApi || false,
  };
}

function mapBank(bank) {
  return {
    url: bank.url,
    title: bank.title,
    tagline: bank.tagline,
    usernameLabel: bank.username_label,
    passwordLabel: bank.password_label,
    loginButton: bank.login_button,
    errorMessage: bank.error_message,
    welcomeMessage: bank.welcome_message,
    balanceMessage: bank.balance_message,
    balance: bank.balance,
    transferButton: bank.transfer_button,
  };
}

function mapCredentials(credentials) {
  return {
    email: credentials.email,
    password: credentials.password,
    quotedPassword: credentials.quoted_password,
    injectionPassword: credentials.injection_password,
  };
}

function mapLogs(logs) {
  return {
    initialized: logs.initialized,
    attemptingLogin: logs.attempting_login,
    invalidPrefix: logs.invalid_prefix,
    sqlCommentDetected: logs.sql_comment_detected,
    authenticated: logs.authenticated,
  };
}

function mapQuery(query) {
  return {
    title: query.title,
    injectionHighlight: query.injection_highlight,
  };
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
  const questions = apiQuiz.questions.map((question) => {
    const correctIndex = question.answers.findIndex((answer) => answer.isCorrect);
    return {
      type: question.answers.length === 2 ? "truefalse" : "multi",
      text: question.prompt,
      options: question.answers.map((answer) => answer.text),
      answer: correctIndex,
    };
  });

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

function mapGuide(apiLesson) {
  return guideBlock(apiLesson).content.guide;
}

function bySortOrder(left, right) {
  return left.sortOrder - right.sortOrder;
}
