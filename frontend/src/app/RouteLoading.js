import { Skeleton } from "../Components/UI";
import { useTranslation } from "react-i18next";

function RouteLoading() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-10 rounded-full" />
        <Skeleton className="mx-auto h-4 w-48" label={t("app.loading")} />
      </div>
    </div>
  );
}

export default RouteLoading;
