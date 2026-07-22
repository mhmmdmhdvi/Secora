import { ErrorState, Skeleton } from "../../UI";
import { useTranslation } from "react-i18next";

export function SQLInjectionLoading({ label }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 sm:mt-14 px-4 sm:px-6 lg:px-8 pb-10">
      <Skeleton className="mx-auto h-5 w-64" label={label || t("lessons.loadingSql")} />
    </div>
  );
}

export function SQLInjectionError({ message }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 sm:mt-14 px-4 sm:px-6 lg:px-8 pb-10">
      <ErrorState
        title={t("lessons.sqlLoadError")}
        description={message}
      />
    </div>
  );
}
