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
    <div className="w-full min-h-screen bg-app text-text px-4 sm:px-8 lg:px-16 py-10 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
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
    <section className="w-full flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 sm:mb-12 text-center">
        {overview.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-12 mb-10 sm:mb-12 w-full max-w-3xl">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="max-w-4xl px-4 sm:px-0 text-text text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6 text-left">
        {overview.paragraphs.map((paragraph, index) => (
          <p key={index}>
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
      className={`border rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm transition-colors ${classes}`}
    >
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{metric.icon}</div>
      <p className="text-sm sm:text-lg font-semibold text-text">
        {metric.label}
      </p>
      <p className="font-bold text-sm sm:text-base">{metric.value}</p>
    </div>
  );
}

function Risks({ risks }) {
  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-2 sm:px-0">
        <SectionTitle icon={risks.icon} title={risks.title} />

        <div className="text-text text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6">
          <p>
            <GuideRichText parts={risks.paragraphs[0]} />
          </p>

          <ul className="list-disc list-outside pl-6 sm:pl-10 space-y-2">
            {risks.bullets.map((bullet, index) => (
              <li key={index}>
                <GuideRichText parts={bullet} />
              </li>
            ))}
          </ul>

          <p>
            <GuideRichText parts={risks.paragraphs[1]} />
          </p>
        </div>
      </div>
    </section>
  );
}

function Protection({ protection }) {
  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-2 sm:px-0">
        <SectionTitle icon={protection.icon} title={protection.title} />

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 dark:bg-blue-950/40 dark:border-blue-800">
          <p className="text-lg font-semibold text-text">
            {protection.callout}
          </p>
        </div>

        <div className="text-text text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6">
          {protection.blocks.map((block, index) => (
            <GuideBlock key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideBlock({ block }) {
  if (block.type === "heading") return <p><strong>{block.text}</strong></p>;
  if (block.type === "paragraph") return <p><GuideRichText parts={block.parts} /></p>;
  if (block.type === "terminal") return <GuideTerminalBox code={block.code} />;
  if (block.type === "list") {
    return (
      <ul className="list-disc list-outside pl-6 sm:pl-10 space-y-2">
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
    <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
      <span className="text-2xl sm:text-3xl" aria-hidden="true">
        {icon}
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-muted">{title}</h2>
    </div>
  );
}
