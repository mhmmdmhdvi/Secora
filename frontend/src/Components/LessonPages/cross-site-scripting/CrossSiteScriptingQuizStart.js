import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { XSSError, XSSLoading } from "./XSSPageState";
import { useCrossSiteScriptingLesson } from "./useCrossSiteScriptingLesson";

function CrossSiteScriptingQuizStart() {
  const { lesson, error } = useCrossSiteScriptingLesson();

  if (error) return <XSSError message={error.message} />;
  if (!lesson) return <XSSLoading />;

  return <QuizRunnerExperience lesson={lesson} />;
}

export default CrossSiteScriptingQuizStart;
