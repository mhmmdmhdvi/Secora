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
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-4 sm:px-0 space-y-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-text text-center">
          {guide.overview.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 mb-10 sm:mb-12 w-full max-w-3xl">
          {guide.overview.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        {guide.overview.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-base sm:text-lg text-text leading-relaxed"
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
      className={`border rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm transition-colors ${tone}`}
    >
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{metric.icon}</div>
      <p className="text-sm sm:text-lg font-semibold text-text">
        {metric.label}
      </p>
      <p className="font-bold text-sm sm:text-base">{metric.value}</p>
    </div>
  );
}

function GuideSection({ section }) {
  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
        {section.icon && (
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            {section.icon}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold text-text-muted">
          {section.title}
        </h2>
      </div>

      {section.blocks.map((block, index) => (
        <GuideBlock key={index} block={block} />
      ))}
    </>
  );
}

function GuideBlock({ block }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-base sm:text-lg text-text leading-relaxed">
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
          className="border border-border bg-surface rounded-xl overflow-hidden transition-all duration-300"
        >
          <summary
            className="w-full flex justify-between items-center px-5 sm:px-6 py-5 text-left font-semibold
            text-text bg-surface hover:bg-surface-muted active:scale-[0.98] transition cursor-pointer"
          >
            {item.title}
          </summary>
          <div className="px-6 pb-6 pt-2 text-text">
            {item.samples.map((sample) => (
              <div key={sample.heading}>
                <h3 className="font-semibold mt-6 mb-2">{sample.heading}</h3>
                <TerminalBox>{sample.code}</TerminalBox>
              </div>
            ))}
          </div>
        </details>
      ))}

      <div
        onClick={() => navigate(codeSamples.quiz_cta.path)}
        className="mt-10 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl
        p-6 sm:p-8 active:scale-[0.98] transition shadow-md hover:shadow-xl border-4 border-black text-center"
      >
        <p className="text-sm font-semibold opacity-90 mb-2">
          {codeSamples.quiz_cta.eyebrow}
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
          <span>{codeSamples.quiz_cta.icon}</span>
          <span className="text-indigo-950 dark:text-white">{codeSamples.quiz_cta.label}</span>
          <span className="text-white">{codeSamples.quiz_cta.title}</span>
        </h2>

        <p className="text-md opacity-95">{codeSamples.quiz_cta.summary}</p>
      </div>
    </div>
  );
}

export default XSSIGuideExperience;
