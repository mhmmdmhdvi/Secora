import SQLInjection from "./SQLInjection/SQLInjection";
import SQLInjectionGuide from "./SQLInjection/sql-injection-guide/SQLInjectionGuide";
import SQLInjectionQuiz from "./SQLInjection/sql-injection-quiz";
import SQLInjectionQuizStart from "./SQLInjection/sql-injection-quiz-start";
import CrossSiteScriptInclusion from "./cross-site-script-inclusion/CrossSiteScriptInclusion";
import CrossSiteScriptInclusionGuide from "./cross-site-script-inclusion/cross-site-script-inclusion-guide/cross-site-script-inclusion-guide";
import CrossSiteScriptInclusionQuiz from "./cross-site-script-inclusion/CrossSiteScriptInclusionQuiz"
import CrossSiteScriptInclusionQuizStart from "./cross-site-script-inclusion/CrossSiteScriptInclusionQuizStart"
import CrossSiteScripting from "./cross-site-scripting/cross-site-scripting"
import CrossSiteScriptingGuide from "./cross-site-scripting/cross-site-scripting-guide/cross-site-scripting-guide"

const lessonComponents = {
  "sql-injection": SQLInjection,
  "sql-injection-guide": SQLInjectionGuide,
  "sql-injection-quiz": SQLInjectionQuiz,
  "sql-injection-quiz-start": SQLInjectionQuizStart,
  "cross-site-script-inclusion": CrossSiteScriptInclusion,
  "cross-site-script-inclusion-guide": CrossSiteScriptInclusionGuide,
  "cross-site-script-inclusion-quiz": CrossSiteScriptInclusionQuiz,
  "cross-site-script-inclusion-quiz-start": CrossSiteScriptInclusionQuizStart,
  "cross-site-scripting": CrossSiteScripting,
  "cross-site-scripting-guide": CrossSiteScriptingGuide,
};

export default lessonComponents;
