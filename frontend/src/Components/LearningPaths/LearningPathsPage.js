import { FiMap } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState, Skeleton } from "../UI";
import { useLearningPaths } from "../../hooks/useLearningPaths";
import LearningPathCard from "./LearningPathCard";
import LearningPathSelector from "./LearningPathSelector";

function LearningPathsPage() {
  const { t } = useTranslation();
  const { isLoading, paths } = useLearningPaths();
  const [activePathSlug, setActivePathSlug] = useState("");
  const activePath = useMemo(
    () => paths.find((path) => path.slug === activePathSlug) || paths[0],
    [activePathSlug, paths]
  );

  useEffect(() => {
    if (paths.length === 0) {
      setActivePathSlug("");
      return;
    }

    const recommendedPath =
      paths.find((path) => path.isRecommended) ||
      paths.find((path) => path.status !== "completed") ||
      paths[0];

    setActivePathSlug((currentSlug) => {
      if (paths.some((path) => path.slug === currentSlug)) {
        return currentSlug;
      }

      return recommendedPath.slug;
    });
  }, [paths]);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 md:py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">{t("paths.eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
          {t("paths.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
          {t("paths.description")}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : paths.length > 0 && activePath ? (
        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <LearningPathSelector
            activePathSlug={activePath.slug}
            onSelectPath={setActivePathSlug}
            paths={paths}
          />
          <LearningPathCard path={activePath} />
        </div>
      ) : (
        <EmptyState
          icon={<FiMap aria-hidden="true" />}
          title={t("paths.emptyTitle")}
          description={t("paths.emptyDescription")}
        />
      )}
    </div>
  );
}

export default LearningPathsPage;
