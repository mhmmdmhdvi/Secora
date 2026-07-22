import { SQLInjectionError, SQLInjectionLoading } from "./SQLInjectionPageState";
import QuizIntroExperience from "../shared/QuizIntroExperience";
import { useSQLInjectionLesson } from "./useSQLInjectionLesson";
import { useTranslation } from "react-i18next";

function SQLInjectionQuiz() {
  const { lesson, error } = useSQLInjectionLesson();
  const { t } = useTranslation();

  if (error) return <SQLInjectionError message={error.message} />;
  if (!lesson) return <SQLInjectionLoading label={t("lessons.loadingSqlQuiz")} />;

  return <QuizIntroExperience lesson={lesson} />;
}

export default SQLInjectionQuiz;
