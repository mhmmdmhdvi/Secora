import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { DomBasedXssError, DomBasedXssLoading } from "./DomBasedXssPageState";
import { useDomBasedXssLesson } from "./useDomBasedXssLesson";

function DomBasedXssQuizStart() {
  const { lesson, error } = useDomBasedXssLesson();

  if (error) return <DomBasedXssError message={error.message} />;
  if (!lesson) return <DomBasedXssLoading label="Loading DOM-based XSS quiz..." />;

  return <QuizRunnerExperience lesson={lesson} />;
}

export default DomBasedXssQuizStart;
