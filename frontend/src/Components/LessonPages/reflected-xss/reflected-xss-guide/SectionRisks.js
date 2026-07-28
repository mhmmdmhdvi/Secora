import ReflectedGuideRichText from "./ReflectedGuideRichText";

export default function SectionRisks({ risks, isPersian = false }) {
  return (
    <section className="w-full">
      <SectionTitle
        icon={risks.icon}
        title={risks.title}
        iconTone="text-amber-500"
        isPersian={isPersian}
      />

      <div
        dir={isPersian ? "rtl" : "ltr"}
        className={`mx-auto max-w-4xl space-y-5 text-base leading-8 text-text sm:text-lg ${
          isPersian ? "text-right" : "text-left"
        }`}
      >
        {risks.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <ReflectedGuideRichText parts={paragraph} />
          </p>
        ))}

        <ul className="space-y-4">
          {risks.bullets.map((bullet) => (
            <li key={bullet.heading} className="flex gap-3">
              <span
                className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                aria-hidden="true"
              />
              <span>
                <strong>{bullet.heading}</strong>
                <span> - {bullet.text}</span>
              </span>
            </li>
          ))}
        </ul>

        {risks.closing.map((paragraph, index) => (
          <p key={`closing-${index}`}>
            <ReflectedGuideRichText parts={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ icon, title, iconTone, isPersian }) {
  return (
    <div
      dir={isPersian ? "rtl" : "ltr"}
      className="mx-auto mb-5 flex max-w-4xl items-center gap-3 sm:mb-6"
    >
      <span className={`text-4xl ${iconTone}`} aria-hidden="true">
        {icon}
      </span>
      <h2 className="text-3xl font-bold text-text-muted">{title}</h2>
    </div>
  );
}
