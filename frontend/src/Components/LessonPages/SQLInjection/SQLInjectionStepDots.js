function SQLInjectionStepDots({ step, setStep, totalSteps }) {
  return (
    <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full cursor-pointer transition-transform
            ${i === step ? "bg-blue-500 scale-125" : ""}
            ${i < step ? "bg-gray-600" : "bg-gray-300"}
            hover:scale-110 hover:bg-gray-400`}
          onClick={() => setStep(i)}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default SQLInjectionStepDots;
