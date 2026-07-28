import { useAppLanguage } from "../../../../hooks/useAppLanguage";

const METRIC_TONES = {
  orange:
    "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300",
  red:
    "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300",
  rose:
    "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300",
};

export default function SectionOverview({ overview }) {
  const { language } = useAppLanguage();
  const isPersian = language === "fa";

  return (
    <section className="flex w-full flex-col items-center">
      <h1 className="mb-6 break-words text-center text-3xl font-bold sm:mb-8 sm:text-4xl lg:text-5xl">
        {overview.title}
      </h1>

      <div className="mb-6 grid w-full max-w-3xl grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div
        dir={isPersian ? "rtl" : "ltr"}
        className={`max-w-4xl px-1 text-base leading-relaxed text-text sm:px-0 sm:text-lg space-y-5 sm:space-y-6 ${
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
      className={`flex min-w-0 flex-col items-center rounded-xl border p-4 text-center shadow-sm transition-colors sm:p-5 lg:p-6 ${tone}`}
    >
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{metric.icon}</div>
      <p className="break-words text-sm font-semibold text-text sm:text-base lg:text-lg">{metric.label}</p>
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
