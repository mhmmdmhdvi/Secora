import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppLanguage } from "./useAppLanguage";
import { useAuth } from "./useAuth";
import {
  fetchLessonCatalogProgress,
  fetchRecommendedNextLesson,
} from "../services/learningApi";

export function useLessonCatalogProgress() {
  const { isAuthenticated } = useAuth();
  const { language } = useAppLanguage();
  const { t } = useTranslation();
  const [progressBySlug, setProgressBySlug] = useState(() => new Map());
  const [recommendedSlug, setRecommendedSlug] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setProgressBySlug(new Map());
      setRecommendedSlug("");
      return undefined;
    }

    const controller = new AbortController();

    Promise.all([
      fetchLessonCatalogProgress({ signal: controller.signal }),
      fetchRecommendedNextLesson(language, { signal: controller.signal }),
    ])
      .then(([progressPayload, recommendationPayload]) => {
        setProgressBySlug(
          new Map(
            (progressPayload?.results || []).map((progress) => [
              progress.lessonSlug,
              progress,
            ])
          )
        );
        setRecommendedSlug(
          recommendationPayload?.recommendation?.lesson?.slug || ""
        );
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("lessons.catalogProgressLoadFailed"));
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, language, t]);

  return useMemo(
    () => ({
      progressBySlug,
      recommendedSlug,
    }),
    [progressBySlug, recommendedSlug]
  );
}
