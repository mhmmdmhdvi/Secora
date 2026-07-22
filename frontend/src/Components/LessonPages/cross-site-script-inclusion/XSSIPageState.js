import { ErrorState, Skeleton } from "../../UI";
import { useTranslation } from "react-i18next";

export function XSSILoading({ label }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 pb-12">
      <Skeleton className="mx-auto h-5 w-56" label={label || t("lessons.loadingXssi")} />
    </div>
  );
}

export function XSSIError({ message }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 sm:mt-14 px-4 sm:px-6 lg:px-8 pb-10">
      <ErrorState title={t("lessons.xssiLoadError")} description={message} />
    </div>
  );
}
