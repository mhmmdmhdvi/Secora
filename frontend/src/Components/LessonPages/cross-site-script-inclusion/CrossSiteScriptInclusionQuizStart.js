import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { XSSIError, XSSILoading } from "./XSSIPageState";
import { useXSSILesson } from "./useXSSILesson";
import { useTranslation } from "react-i18next";

function CrossSiteScriptInclusionQuizStart() {
  const { lesson, error } = useXSSILesson();
  const { t } = useTranslation();

  if (error) return <XSSIError message={error.message} />;
  if (!lesson) return <XSSILoading label={t("lessons.loadingXssiQuiz")} />;

  return <QuizRunnerExperience lesson={lesson} />;
}

export default CrossSiteScriptInclusionQuizStart;
