import { useAppLanguage } from "../../../../hooks/useAppLanguage";
import QuizCta from "../../reflected-xss/reflected-xss-guide/QuizCta";
import SectionOverview from "../../reflected-xss/reflected-xss-guide/SectionOverview";
import SectionProtection from "../../reflected-xss/reflected-xss-guide/SectionProtection";
import SectionRisks from "../../reflected-xss/reflected-xss-guide/SectionRisks";
import { XxeError, XxeLoading } from "../XxePageState";
import { useXxeLesson } from "../useXxeLesson";
import XxeGuideCodeSamples from "./XxeGuideCodeSamples";

function XmlExternalEntitiesGuide() {
  const { language } = useAppLanguage();
  const { lesson, error } = useXxeLesson();
  const isPersian = language === "fa";

  if (error) return <XxeError message={error.message} />;
  if (!lesson) return <XxeLoading label="Loading XML External Entities guide..." />;

  return (
    <main className="min-h-screen bg-app px-4 py-10 text-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 sm:gap-16 lg:gap-20">
        <SectionOverview overview={lesson.guide.overview} isPersian={isPersian} />
        <SectionRisks risks={lesson.guide.risks} isPersian={isPersian} />
        <SectionProtection protection={lesson.guide.protection} isPersian={isPersian} />
        <XxeGuideCodeSamples codeSamples={lesson.guide.code_samples} />
        <QuizCta cta={lesson.guide.quiz_cta} />
      </div>
    </main>
  );
}

export default XmlExternalEntitiesGuide;
