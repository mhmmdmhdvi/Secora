import { navigateTo } from "../../../services/navigation";

function renderInlineContent(parts) {
  return parts.map((part, index) => {
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    return <span key={index}>{part.text}</span>;
  });
}

function SQLInjectionCompletionCard({ lesson }) {
  return (
    <div className="mt-6 flex justify-center sm:mt-8">
      <div
        className="w-full max-w-2xl cursor-pointer rounded-2xl border border-border bg-surface-muted px-5 py-6 text-base leading-relaxed text-text transition-all hover:-translate-y-1 hover:shadow-xl sm:px-8 sm:py-7 sm:text-lg"
        onClick={() => navigateTo(lesson.guidePath)}
      >
        <p className="break-words">{renderInlineContent(lesson.completion)}</p>
      </div>
    </div>
  );
}

export default SQLInjectionCompletionCard;
