import { useAppLanguage } from "../../../../hooks/useAppLanguage";

import { getXssGuideCopy } from "./xssGuideContent";

export default function SectionRisks() {
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const { risks } = getXssGuideCopy(language);

  return (
    <section className="w-full flex flex-col items-center mt-2 sm:mt-4">
      <div className="w-full max-w-4xl px-2 sm:px-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            ⚠️
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-muted">
            {risks.title}
          </h2>
        </div>

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className={`bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 mb-4 shadow-sm dark:bg-blue-950/40 dark:border-blue-800 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          <p className="text-base sm:text-lg font-medium text-blue-900 dark:text-blue-100">
            {risks.question}
          </p>
        </div>

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className={`text-text text-base sm:text-lg leading-relaxed space-y-3 sm:space-y-4 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          <p>{risks.intro}</p>

          <ul
            className={`list-disc list-outside space-y-2 ${
              isPersian ? "pr-6 sm:pr-10" : "pl-6 sm:pl-10"
            }`}
          >
            {risks.bullets.map((bullet, index) => (
              <li key={index}>
                <RichText parts={bullet} />
              </li>
            ))}
          </ul>

          <p>
            <strong>{risks.closing}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

function RichText({ parts }) {
  return parts.map((part, index) => {
    if (part.type === "strong") {
      return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
    }

    return <span key={`${part.text}-${index}`}>{part.text}</span>;
  });
}
