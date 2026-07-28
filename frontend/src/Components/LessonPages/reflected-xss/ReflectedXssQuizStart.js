import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { ReflectedXssError, ReflectedXssLoading } from "./ReflectedXssPageState";
import { useReflectedXssLesson } from "./useReflectedXssLesson";

function ReflectedXssQuizStart() {
  const { lesson, error } = useReflectedXssLesson();

  if (error) return <ReflectedXssError message={error.message} />;
  if (!lesson) return <ReflectedXssLoading label="Loading Reflected XSS quiz..." />;

  return <QuizRunnerExperience lesson={lesson} />;
}

export default ReflectedXssQuizStart;
