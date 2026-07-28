import { useAppLanguage } from "../../../../hooks/useAppLanguage";

export default function SectionRisks({ risks }) {
  const { language } = useAppLanguage();
  const isPersian = language === "fa";

  return (
    <section className="mt-2 flex w-full flex-col items-center sm:mt-4">
      <div className="w-full max-w-4xl px-1 sm:px-0">
        <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">
            ⚠️
          </span>
          <h2 className="break-words text-2xl font-bold text-text-muted sm:text-3xl">
            {risks.title}
          </h2>
        </div>

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className={`mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800 dark:bg-blue-950/40 sm:p-6 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          <p className="text-base font-medium text-blue-900 dark:text-blue-100 sm:text-lg">
            {risks.question}
          </p>
        </div>

        <div
          dir={isPersian ? "rtl" : "ltr"}
          className={`space-y-3 text-base leading-relaxed text-text sm:text-lg sm:space-y-4 ${
            isPersian ? "text-right" : "text-left"
          }`}
        >
          <p>{risks.intro}</p>

          <ul
            className={`list-outside list-disc space-y-2 ${
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
