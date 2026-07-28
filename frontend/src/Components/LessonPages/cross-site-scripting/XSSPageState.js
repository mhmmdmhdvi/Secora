import { useTranslation } from "react-i18next";

function XSSLoading({ label }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-app text-text flex items-center justify-center px-4">
      <p className="text-text-muted">{label || t("lessons.loadingLesson")}</p>
    </div>
  );
}

function XSSError({ message }) {
  return (
    <div className="min-h-screen bg-app text-text flex items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {message}
      </div>
    </div>
  );
}

export { XSSError, XSSLoading };
