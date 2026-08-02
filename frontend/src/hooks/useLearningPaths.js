import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAuth } from "./useAuth";
import { buildLearningRoadmaps } from "../data/learningRoadmaps";
import { fetchLessonCatalogProgress } from "../services/learningApi";

export function useLearningPaths() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [paths, setPaths] = useState(() =>
    buildLearningRoadmaps({ progressBySlug: {}, t })
  );
  const [isLoading, setIsLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setPaths(buildLearningRoadmaps({ progressBySlug: {}, t }));
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchLessonCatalogProgress({ signal: controller.signal })
      .then((payload) => {
        const progressBySlug = Object.fromEntries(
          (payload?.results || []).map((progress) => [
            progress.lessonSlug,
            progress,
          ])
        );

        setPaths(buildLearningRoadmaps({ progressBySlug, t }));
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("paths.loadFailed"));
          setPaths(buildLearningRoadmaps({ progressBySlug: {}, t }));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, t]);

  return { isLoading, paths };
}
