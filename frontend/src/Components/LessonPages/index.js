import { lazy } from "react";

const lessonComponents = {
  "sql-injection": lazy(() => import("./SQLInjection/SQLInjection")),
  "sql-injection-guide": lazy(() =>
    import("./SQLInjection/sql-injection-guide/SQLInjectionGuide")
  ),
  "sql-injection-quiz": lazy(() => import("./SQLInjection/sql-injection-quiz")),
  "sql-injection-quiz-start": lazy(() =>
    import("./SQLInjection/sql-injection-quiz-start")
  ),
  "cross-site-script-inclusion": lazy(() =>
    import("./cross-site-script-inclusion/CrossSiteScriptInclusion")
  ),
  "cross-site-script-inclusion-guide": lazy(() =>
    import(
      "./cross-site-script-inclusion/cross-site-script-inclusion-guide/cross-site-script-inclusion-guide"
    )
  ),
  "cross-site-script-inclusion-quiz": lazy(() =>
    import("./cross-site-script-inclusion/CrossSiteScriptInclusionQuiz")
  ),
  "cross-site-script-inclusion-quiz-start": lazy(() =>
    import("./cross-site-script-inclusion/CrossSiteScriptInclusionQuizStart")
  ),
  "cross-site-scripting": lazy(() =>
    import("./cross-site-scripting/cross-site-scripting")
  ),
  "cross-site-scripting-guide": lazy(() =>
    import(
      "./cross-site-scripting/cross-site-scripting-guide/cross-site-scripting-guide"
    )
  ),
  "cross-site-scripting-quiz": lazy(() =>
    import("./cross-site-scripting/CrossSiteScriptingQuiz")
  ),
  "cross-site-scripting-quiz-start": lazy(() =>
    import("./cross-site-scripting/CrossSiteScriptingQuizStart")
  ),
  "reflected-xss": lazy(() =>
    import("./reflected-xss/ReflectedXss")
  ),
  "reflected-xss-guide": lazy(() =>
    import("./reflected-xss/reflected-xss-guide/ReflectedXssGuide")
  ),
  "reflected-xss-quiz": lazy(() =>
    import("./reflected-xss/ReflectedXssQuiz")
  ),
  "reflected-xss-quiz-start": lazy(() =>
    import("./reflected-xss/ReflectedXssQuizStart")
  ),
};

export default lessonComponents;
