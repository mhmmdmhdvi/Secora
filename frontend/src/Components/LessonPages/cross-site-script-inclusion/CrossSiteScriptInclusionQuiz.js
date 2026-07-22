import QuizIntroExperience from "../shared/QuizIntroExperience";
import { XSSIError, XSSILoading } from "./XSSIPageState";
import { useXSSILesson } from "./useXSSILesson";
import { useTranslation } from "react-i18next";

function CrossSiteScriptInclusionQuiz() {
  const { lesson, error } = useXSSILesson();
  const { t } = useTranslation();

  if (error) return <XSSIError message={error.message} />;
  if (!lesson) return <XSSILoading label={t("lessons.loadingXssiQuiz")} />;

  return <QuizIntroExperience lesson={lesson} />;
}

export default CrossSiteScriptInclusionQuiz;
