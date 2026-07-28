import GuideCodeSamples from "./GuideCodeSamples";
import GuideTerminalBox from "./GuideTerminalBox";
import { GuideRichText } from "./GuideRichText";

const METRIC_TONES = {
  orange:
    "bg-orange-50 border-orange-200 text-orange-600 dark:bg-surface dark:border-border dark:text-orange-300 dark:shadow-[inset_0_3px_0_rgb(251_146_60)]",
  red:
    "bg-red-50 border-red-200 text-red-600 dark:bg-surface dark:border-border dark:text-red-300 dark:shadow-[inset_0_3px_0_rgb(248_113_113)]",
  rose:
    "bg-rose-50 border-rose-200 text-rose-600 dark:bg-surface dark:border-border dark:text-rose-300 dark:shadow-[inset_0_3px_0_rgb(251_113_133)]",
};

export default function SQLInjectionGuideExperience({ guide }) {
  return (
    <div className="min-h-screen w-full bg-app px-3 py-8 text-text sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12 sm:space-y-16 lg:space-y-20">
        <Overview overview={guide.overview} />
        <Risks risks={guide.risks} />
        <Protection protection={guide.protection} />
        <GuideCodeSamples codeSamples={guide.code_samples} />
      </div>
    </div>
  );
}

function Overview({ overview }) {
  return (
    <section className="flex w-full flex-col items-center">
      <h1 className="mb-6 break-words text-center text-3xl font-bold sm:mb-8 sm:text-4xl lg:text-5xl">
        {overview.title}
      </h1>

      <div className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="max-w-4xl space-y-5 px-1 text-left text-base leading-relaxed text-text sm:px-0 sm:text-lg sm:space-y-6">
        {overview.paragraphs.map((paragraph, index) => (
          <p key={index} className="break-words">
            <GuideRichText parts={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ metric }) {
  const classes = METRIC_TONES[metric.tone] || METRIC_TONES.orange;

  return (
    <div
      className={`flex min-w-0 flex-col items-center rounded-2xl border p-4 text-center shadow-sm transition-colors sm:p-5 lg:p-6 ${classes}`}
    >
      <div className="mb-2 text-3xl sm:mb-4 sm:text-4xl">{metric.icon}</div>
      <p className="break-words text-sm font-semibold text-text sm:text-base lg:text-lg">
        {metric.label}
      </p>
      <p className="text-sm font-bold sm:text-base">{metric.value}</p>
    </div>
  );
}

function Risks({ risks }) {
  return (
    <section className="mt-10 flex w-full flex-col items-center sm:mt-14">
      <div className="w-full max-w-4xl px-1 sm:px-0">
        <SectionTitle icon={risks.icon} title={risks.title} />

        <div className="space-y-5 text-base leading-relaxed text-text sm:text-lg sm:space-y-6">
          <p className="break-words">
            <GuideRichText parts={risks.paragraphs[0]} />
          </p>

          <ul className="list-outside list-disc space-y-2 pl-6 sm:pl-10">
            {risks.bullets.map((bullet, index) => (
              <li key={index}>
                <GuideRichText parts={bullet} />
              </li>
            ))}
          </ul>

          <p className="break-words">
            <GuideRichText parts={risks.paragraphs[1]} />
          </p>
        </div>
      </div>
    </section>
  );
}

function Protection({ protection }) {
  return (
    <section className="mt-10 flex w-full flex-col items-center sm:mt-14">
      <div className="w-full max-w-4xl px-1 sm:px-0">
        <SectionTitle icon={protection.icon} title={protection.title} />

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/40 sm:mb-8 sm:p-6">
          <p className="break-words text-base font-semibold text-text sm:text-lg">
            {protection.callout}
          </p>
        </div>

        <div className="space-y-5 text-base leading-relaxed text-text sm:text-lg sm:space-y-6">
          {protection.blocks.map((block, index) => (
            <GuideBlock key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideBlock({ block }) {
  if (block.type === "heading") {
    return (
      <p className="break-words">
        <strong>{block.text}</strong>
      </p>
    );
  }
  if (block.type === "paragraph") {
    return (
      <p className="break-words">
        <GuideRichText parts={block.parts} />
      </p>
    );
  }
  if (block.type === "terminal") return <GuideTerminalBox code={block.code} />;
  if (block.type === "list") {
    return (
      <ul className="list-outside list-disc space-y-2 pl-6 sm:pl-10">
        {block.items.map((item, index) => (
          <li key={index}>
            <GuideRichText parts={item} />
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
      <span className="text-2xl sm:text-3xl" aria-hidden="true">
        {icon}
      </span>
      <h2 className="break-words text-2xl font-bold text-text-muted sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
