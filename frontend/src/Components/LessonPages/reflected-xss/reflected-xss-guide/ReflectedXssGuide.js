import { useAppLanguage } from "../../../../hooks/useAppLanguage";
import { ReflectedXssError, ReflectedXssLoading } from "../ReflectedXssPageState";
import { useReflectedXssLesson } from "../useReflectedXssLesson";
import QuizCta from "./QuizCta";
import SectionOverview from "./SectionOverview";
import SectionProtection from "./SectionProtection";
import SectionRisks from "./SectionRisks";

function ReflectedXssGuide() {
  const { language } = useAppLanguage();
  const { lesson, error } = useReflectedXssLesson();
  const isPersian = language === "fa";

  if (error) return <ReflectedXssError message={error.message} />;
  if (!lesson) return <ReflectedXssLoading label="Loading Reflected XSS guide..." />;

  return (
    <main className="min-h-screen bg-app px-4 py-10 text-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 sm:gap-16 lg:gap-20">
        <SectionOverview overview={lesson.guide.overview} isPersian={isPersian} />
        <SectionRisks risks={lesson.guide.risks} isPersian={isPersian} />
        <SectionProtection protection={lesson.guide.protection} isPersian={isPersian} />
        <QuizCta cta={lesson.guide.quiz_cta} />
      </div>
    </main>
  );
}

export default ReflectedXssGuide;
