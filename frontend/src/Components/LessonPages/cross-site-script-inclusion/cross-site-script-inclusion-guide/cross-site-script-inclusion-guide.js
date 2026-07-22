import { XSSIError, XSSILoading } from "../XSSIPageState";
import XSSIGuideExperience from "../XSSIGuideExperience";
import { useXSSILesson } from "../useXSSILesson";
import { useTranslation } from "react-i18next";

export default function CrossSiteScriptInclusionGuide() {
  const { lesson, error } = useXSSILesson();
  const { t } = useTranslation();

  if (error) return <XSSIError message={error.message} />;
  if (!lesson) return <XSSILoading label={t("lessons.loadingXssiGuide")} />;

  return <XSSIGuideExperience guide={lesson.guide} />;
}
