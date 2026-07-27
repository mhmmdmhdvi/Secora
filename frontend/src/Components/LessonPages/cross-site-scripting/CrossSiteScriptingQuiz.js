import QuizIntroExperience from "../shared/QuizIntroExperience";
import { useCrossSiteScriptingLesson } from "./useCrossSiteScriptingLesson";

function CrossSiteScriptingQuiz() {
  const lesson = useCrossSiteScriptingLesson();

  return <QuizIntroExperience lesson={lesson} />;
}

export default CrossSiteScriptingQuiz;
