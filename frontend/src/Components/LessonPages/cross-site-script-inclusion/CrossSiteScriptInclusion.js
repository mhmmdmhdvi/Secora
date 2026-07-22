import XSSIExperience from "./XSSIExperience";
import { XSSIError, XSSILoading } from "./XSSIPageState";
import { useXSSILesson } from "./useXSSILesson";

function CrossSiteScriptInclusion() {
  const { lesson, error } = useXSSILesson();

  if (error) return <XSSIError message={error.message} />;
  if (!lesson) return <XSSILoading />;

  return <XSSIExperience lesson={lesson} />;
}

export default CrossSiteScriptInclusion;
