import { useNavigate } from "react-router-dom";

import TerminalBox from "../shared/TerminalBox";
import { XSSIRichText } from "./XSSIRichText";

const METRIC_TONES = {
  orange:
    "bg-orange-50 border-orange-200 text-orange-600 dark:bg-surface dark:border-border dark:text-orange-300 dark:shadow-[inset_0_3px_0_rgb(251_146_60)]",
  red:
    "bg-red-50 border-red-200 text-red-600 dark:bg-surface dark:border-border dark:text-red-300 dark:shadow-[inset_0_3px_0_rgb(248_113_113)]",
  rose:
    "bg-rose-50 border-rose-200 text-rose-600 dark:bg-surface dark:border-border dark:text-rose-300 dark:shadow-[inset_0_3px_0_rgb(251_113_133)]",
};

function XSSIGuideExperience({ guide }) {
  return (
    <section className="mt-8 flex w-full flex-col items-center px-3 sm:mt-12 sm:px-5 lg:px-8">
      <div className="w-full max-w-4xl space-y-8 sm:space-y-10">
        <h1 className="break-words text-center text-3xl font-bold text-text sm:text-4xl">
          {guide.overview.title}
        </h1>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {guide.overview.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        {guide.overview.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="break-words text-base leading-relaxed text-text sm:text-lg"
          >
            <XSSIRichText parts={paragraph} />
          </p>
        ))}

        {guide.sections.map((section) => (
          <GuideSection key={section.title} section={section} />
        ))}

        <CodeSamples codeSamples={guide.code_samples} />
      </div>
    </section>
  );
}

function MetricCard({ metric }) {
  const tone = METRIC_TONES[metric.tone] || METRIC_TONES.orange;

  return (
    <div
      className={`flex min-w-0 flex-col items-center rounded-2xl border p-4 text-center shadow-sm transition-colors sm:p-5 lg:p-6 ${tone}`}
    >
      <div className="mb-2 text-3xl sm:mb-4 sm:text-4xl">{metric.icon}</div>
      <p className="break-words text-sm font-semibold text-text sm:text-base lg:text-lg">
        {metric.label}
      </p>
      <p className="text-sm font-bold sm:text-base">{metric.value}</p>
    </div>
  );
}

function GuideSection({ section }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
        {section.icon && (
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            {section.icon}
          </span>
        )}
        <h2 className="break-words text-xl font-semibold text-text-muted sm:text-2xl">
          {section.title}
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {section.blocks.map((block, index) => (
          <GuideBlock key={index} block={block} />
        ))}
      </div>
    </section>
  );
}

function GuideBlock({ block }) {
  if (block.type === "paragraph") {
    return (
      <p className="break-words text-base leading-relaxed text-text sm:text-lg">
        <XSSIRichText parts={block.parts} />
      </p>
    );
  }

  return null;
}

function CodeSamples({ codeSamples }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {codeSamples.items.map((item) => (
        <details
          key={item.title}
          className="overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300"
        >
          <summary className="flex w-full cursor-pointer items-center justify-between gap-4 bg-surface px-4 py-4 text-left font-semibold text-text transition hover:bg-surface-muted active:scale-[0.98] sm:px-6 sm:py-5">
            <span dir="ltr" className="min-w-0 break-words">
              {item.title}
            </span>
          </summary>
          <div className="px-4 pb-5 pt-2 text-text sm:px-6 sm:pb-6">
            {item.samples.map((sample) => (
              <div key={sample.heading}>
                <h3 className="mb-2 mt-5 break-words font-semibold sm:mt-6">
                  {sample.heading}
                </h3>
                <TerminalBox>{sample.code}</TerminalBox>
              </div>
            ))}
          </div>
        </details>
      ))}

      <button
        type="button"
        onClick={() => navigate(codeSamples.quiz_cta.path)}
        className="mt-8 w-full cursor-pointer rounded-xl border-4 border-black bg-indigo-500 p-5 text-center text-white shadow-md transition hover:bg-indigo-600 hover:shadow-xl active:scale-[0.98] sm:mt-10 sm:p-8"
      >
        <p className="mb-2 text-sm font-semibold opacity-90">
          {codeSamples.quiz_cta.eyebrow}
        </p>

        <h2 className="mb-3 flex flex-wrap items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
          <span aria-hidden="true">{codeSamples.quiz_cta.icon}</span>
          <span className="text-indigo-950 dark:text-white">
            {codeSamples.quiz_cta.label}
          </span>
          <span className="text-white">{codeSamples.quiz_cta.title}</span>
        </h2>

        <p className="text-sm opacity-95 sm:text-base">{codeSamples.quiz_cta.summary}</p>
      </button>
    </div>
  );
}

export default XSSIGuideExperience;
