import SectionOverview from "./SectionOverview";
import SectionRisks from "./SectionRisks";
import SectionProtection from "./SectionProtection";
import SectionCodeSamples from "./SectionCodeSamples";
import { XSSError, XSSLoading } from "../XSSPageState";
import { useCrossSiteScriptingLesson } from "../useCrossSiteScriptingLesson";


export default function CrossSiteScriptingGuide() {
  const { lesson, error } = useCrossSiteScriptingLesson();

  if (error) return <XSSError message={error.message} />;
  if (!lesson) return <XSSLoading />;

  return (
    <div className="min-h-screen bg-app px-3 py-8 text-text sm:px-5 sm:py-10 lg:px-8">

      <div className="mx-auto flex max-w-6xl flex-col gap-12 sm:gap-16 lg:gap-20">
        <SectionOverview overview={lesson.guide.overview} />
        <SectionRisks risks={lesson.guide.risks} />
        <SectionProtection protection={lesson.guide.protection} />
        <SectionCodeSamples codeSamples={lesson.guide.codeSamples} />

      </div>
    </div>
  );
}
