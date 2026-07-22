function renderStepContent(parts) {
  return parts.map((part, index) => {
    if (part.type === "break") return <br key={index} />;
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    if (part.type === "muted") {
      return (
        <span
          key={index}
          className={`text-text-muted${part.breakAll ? " break-all" : ""}`}
        >
          {part.text}
        </span>
      );
    }
    return <span key={index}>{part.text}</span>;
  });
}

function SQLInjectionInstructionCard({ step, nextStep, steps }) {
  return (
    <div
      className="w-full max-w-2xl p-5 sm:p-6 bg-surface text-text border rounded-2xl cursor-pointer
      border-border active:scale-[0.98] transition touch-manipulation relative"
      onClick={nextStep}
    >
      <p className="leading-7 text-sm sm:text-base pr-8">
        {renderStepContent(steps[step] || [])}
      </p>

      <span className="absolute right-4 bottom-4 text-lg text-text-muted">
        →
      </span>
    </div>
  );
}

export default SQLInjectionInstructionCard;
