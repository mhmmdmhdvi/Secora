import QuizIntroExperience from "../shared/QuizIntroExperience";
import { XSSError, XSSLoading } from "./XSSPageState";
import { useCrossSiteScriptingLesson } from "./useCrossSiteScriptingLesson";

function CrossSiteScriptingQuiz() {
  const { lesson, error } = useCrossSiteScriptingLesson();

  if (error) return <XSSError message={error.message} />;
  if (!lesson) return <XSSLoading />;

  return <QuizIntroExperience lesson={lesson} />;
}

export default CrossSiteScriptingQuiz;
