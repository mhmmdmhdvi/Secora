import QuizIntroExperience from "../shared/QuizIntroExperience";
import { XxeError, XxeLoading } from "./XxePageState";
import { useXxeLesson } from "./useXxeLesson";

function XmlExternalEntitiesQuiz() {
  const { lesson, error } = useXxeLesson();

  if (error) return <XxeError message={error.message} />;
  if (!lesson) return <XxeLoading label="Loading XML External Entities quiz..." />;

  return <QuizIntroExperience lesson={lesson} />;
}

export default XmlExternalEntitiesQuiz;
