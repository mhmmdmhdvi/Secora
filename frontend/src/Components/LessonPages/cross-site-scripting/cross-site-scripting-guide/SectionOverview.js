import { useAppLanguage } from "../../../../hooks/useAppLanguage";

import { getXssGuideCopy } from "./xssGuideContent";

const METRIC_TONES = {
  orange:
    "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300",
  red:
    "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300",
  rose:
    "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300",
};

export default function SectionOverview() {
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const { overview } = getXssGuideCopy(language);

  return (
    <section className="w-full flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center">
        {overview.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 mb-6 sm:mb-8 w-full max-w-3xl">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div
        dir={isPersian ? "rtl" : "ltr"}
        className={`max-w-4xl px-4 sm:px-0 text-text text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6 ${
          isPersian ? "text-right" : "text-left"
        }`}
      >
        {overview.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <RichText parts={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ metric }) {
  const tone = METRIC_TONES[metric.tone] || METRIC_TONES.orange;

  return (
    <div
      className={`border rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm transition-colors ${tone}`}
    >
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{metric.icon}</div>
      <p className="text-sm sm:text-lg font-semibold text-text">{metric.label}</p>
      <p className="font-bold text-sm sm:text-base">{metric.value}</p>
    </div>
  );
}

function RichText({ parts }) {
  return parts.map((part, index) => {
    if (part.type === "strong") {
      return (
        <strong
          key={`${part.text}-${index}`}
          dir={part.dir}
          className={part.dir === "ltr" ? "inline-block" : undefined}
        >
          {part.text}
        </strong>
      );
    }

    return <span key={`${part.text}-${index}`}>{part.text}</span>;
  });
}
