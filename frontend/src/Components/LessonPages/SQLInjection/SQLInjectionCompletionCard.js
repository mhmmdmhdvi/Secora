import { navigateTo } from "../../../services/navigation";

function renderInlineContent(parts) {
  return parts.map((part, index) => {
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    return <span key={index}>{part.text}</span>;
  });
}

function SQLInjectionCompletionCard({ lesson }) {
  return (
    <div className="flex justify-center mt-8 sm:mt-10">
      <div
        className="w-full max-w-2xl px-5 py-6 sm:px-8 sm:py-7 bg-surface-muted text-text rounded-2xl text-base sm:text-lg leading-relaxed cursor-pointer transition-all border border-border hover:-translate-y-1 hover:shadow-xl"
        onClick={() => navigateTo(lesson.guidePath)}
      >
        <p>{renderInlineContent(lesson.completion)}</p>
      </div>
    </div>
  );
}

export default SQLInjectionCompletionCard;
