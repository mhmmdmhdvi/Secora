import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { useCrossSiteScriptingLesson } from "./useCrossSiteScriptingLesson";

function CrossSiteScriptingQuizStart() {
  const lesson = useCrossSiteScriptingLesson();

  return <QuizRunnerExperience lesson={lesson} />;
}

export default CrossSiteScriptingQuizStart;
