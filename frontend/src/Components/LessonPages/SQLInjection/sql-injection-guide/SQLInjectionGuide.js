import { SQLInjectionError, SQLInjectionLoading } from "../SQLInjectionPageState";
import SQLInjectionGuideExperience from "./SQLInjectionGuideExperience";
import { useSQLInjectionLesson } from "../useSQLInjectionLesson";
import { useTranslation } from "react-i18next";

export default function SQLInjectionGuide() {
  const { lesson, error } = useSQLInjectionLesson();
  const { t } = useTranslation();

  if (error) return <SQLInjectionError message={error.message} />;
  if (!lesson) return <SQLInjectionLoading label={t("lessons.loadingSqlGuide")} />;

  return <SQLInjectionGuideExperience guide={lesson.guide} />;
}
