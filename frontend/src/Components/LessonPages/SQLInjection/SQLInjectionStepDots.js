function SQLInjectionStepDots({ step, setStep, totalSteps }) {
  return (
    <div className="mx-auto mb-5 flex max-w-2xl flex-wrap justify-center gap-2 sm:mb-8 sm:gap-3">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-transform sm:h-3.5 sm:w-3.5 md:h-4 md:w-4
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
