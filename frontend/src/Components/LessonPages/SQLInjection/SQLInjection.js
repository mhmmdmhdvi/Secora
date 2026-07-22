import SQLInjectionExperience from "./SQLInjectionExperience";
import { SQLInjectionError, SQLInjectionLoading } from "./SQLInjectionPageState";
import { useSQLInjectionLesson } from "./useSQLInjectionLesson";

function SQLInjection() {
  const { lesson, error } = useSQLInjectionLesson();

  if (error) return <SQLInjectionError message={error.message} />;
  if (!lesson) return <SQLInjectionLoading />;

  return <SQLInjectionExperience lesson={lesson} />;
}

export default SQLInjection;
