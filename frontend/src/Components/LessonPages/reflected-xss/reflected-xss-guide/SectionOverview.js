import ReflectedGuideRichText from "./ReflectedGuideRichText";

const METRIC_TONES = {
  orange:
    "bg-orange-50 border-orange-200 text-orange-600 dark:bg-surface dark:border-border dark:text-orange-300 dark:shadow-[inset_0_3px_0_rgb(251_146_60)]",
  red:
    "bg-red-50 border-red-200 text-red-600 dark:bg-surface dark:border-border dark:text-red-300 dark:shadow-[inset_0_3px_0_rgb(248_113_113)]",
  rose:
    "bg-rose-50 border-rose-200 text-rose-600 dark:bg-surface dark:border-border dark:text-rose-300 dark:shadow-[inset_0_3px_0_rgb(251_113_133)]",
};

export default function SectionOverview({ overview, isPersian = false }) {
  return (
    <section className="flex w-full flex-col items-center">
      <h1 className="mb-6 break-words text-center text-3xl font-bold text-text sm:mb-8 sm:text-4xl lg:text-5xl">
        {overview.title}
      </h1>

      <div
        dir={isPersian ? "rtl" : "ltr"}
        className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-3 sm:gap-6 lg:gap-10"
      >
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div
        dir={isPersian ? "rtl" : "ltr"}
        className={`w-full max-w-4xl space-y-5 px-1 text-base leading-relaxed text-text sm:px-0 sm:text-lg sm:space-y-6 ${
          isPersian ? "text-right" : "text-left"
        }`}
      >
        {overview.paragraphs.map((paragraph, index) => (
          <p key={index} className="break-words">
            <ReflectedGuideRichText parts={paragraph} />
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
