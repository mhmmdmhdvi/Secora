import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { XxeError, XxeLoading } from "./XxePageState";
import { useXxeLesson } from "./useXxeLesson";

function XmlExternalEntitiesQuizStart() {
  const { lesson, error } = useXxeLesson();

  if (error) return <XxeError message={error.message} />;
  if (!lesson) return <XxeLoading label="Loading XML External Entities quiz..." />;

  return <QuizRunnerExperience lesson={lesson} />;
}

export default XmlExternalEntitiesQuizStart;
