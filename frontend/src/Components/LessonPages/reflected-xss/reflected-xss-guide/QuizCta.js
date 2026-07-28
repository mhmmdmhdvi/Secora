import { useNavigate } from "react-router-dom";

export default function QuizCta({ cta }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(cta.path)}
      className="mx-auto mt-2 block w-full max-w-4xl rounded-2xl border-4 border-black bg-indigo-500 p-6 text-center text-white shadow-md transition hover:bg-indigo-600 hover:shadow-lg active:scale-[0.99] dark:border-white/20 sm:p-8"
    >
      <p className="mb-2 text-sm font-semibold opacity-90 sm:text-base">
        {cta.eyebrow}
      </p>
      <h2 className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold sm:text-3xl">
        <span aria-hidden="true">{cta.icon}</span>
        <span className="text-indigo-950 dark:text-white">{cta.label}</span>
        <span>{cta.title}</span>
      </h2>
      <p className="mt-3 text-sm opacity-95 sm:text-base">{cta.summary}</p>
    </button>
  );
}
