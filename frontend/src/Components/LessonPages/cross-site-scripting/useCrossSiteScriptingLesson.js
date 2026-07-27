import { useAppLanguage } from "../../../hooks/useAppLanguage";

import { getCrossSiteScriptingLesson } from "./crossSiteScriptingContent";

export function useCrossSiteScriptingLesson() {
  const { language } = useAppLanguage();

  return getCrossSiteScriptingLesson(language);
}
