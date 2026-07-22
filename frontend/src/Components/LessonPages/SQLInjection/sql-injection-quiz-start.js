import { SQLInjectionError, SQLInjectionLoading } from "./SQLInjectionPageState";
import QuizRunnerExperience from "../shared/QuizRunnerExperience";
import { useSQLInjectionLesson } from "./useSQLInjectionLesson";
import { useTranslation } from "react-i18next";

function SQLInjectionQuizStart() {
  const { lesson, error } = useSQLInjectionLesson();
  const { t } = useTranslation();

  if (error) return <SQLInjectionError message={error.message} />;
  if (!lesson) return <SQLInjectionLoading label={t("lessons.loadingSqlQuiz")} />;

  return <QuizRunnerExperience lesson={lesson} />;
}

export default SQLInjectionQuizStart;
