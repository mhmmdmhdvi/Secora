import QuizIntroExperience from "../shared/QuizIntroExperience";
import { ReflectedXssError, ReflectedXssLoading } from "./ReflectedXssPageState";
import { useReflectedXssLesson } from "./useReflectedXssLesson";

function ReflectedXssQuiz() {
  const { lesson, error } = useReflectedXssLesson();

  if (error) return <ReflectedXssError message={error.message} />;
  if (!lesson) return <ReflectedXssLoading label="Loading Reflected XSS quiz..." />;

  return <QuizIntroExperience lesson={lesson} />;
}

export default ReflectedXssQuiz;
