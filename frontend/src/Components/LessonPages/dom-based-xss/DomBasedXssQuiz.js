import QuizIntroExperience from "../shared/QuizIntroExperience";
import { DomBasedXssError, DomBasedXssLoading } from "./DomBasedXssPageState";
import { useDomBasedXssLesson } from "./useDomBasedXssLesson";

function DomBasedXssQuiz() {
  const { lesson, error } = useDomBasedXssLesson();

  if (error) return <DomBasedXssError message={error.message} />;
  if (!lesson) return <DomBasedXssLoading label="Loading DOM-based XSS quiz..." />;

  return <QuizIntroExperience lesson={lesson} />;
}

export default DomBasedXssQuiz;
