import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { lessons } from "../data/lessons";
import { getLessonCatalogMeta } from "../data/lessonCatalogMeta";
import { useAppLanguage } from "./useAppLanguage";
import { useAuth } from "./useAuth";
import {
  fetchLearningPaths,
  fetchLessonBookmarks,
  fetchLessonCatalogProgress,
  fetchRecommendedNextLesson,
} from "../services/learningApi";

function lessonForSlug(slug, t) {
  const lesson = lessons.find((item) => item.id === slug);

  if (!lesson) {
    return null;
  }

  return {
    ...lesson,
    ...getLessonCatalogMeta(lesson),
    description: t(`lessonDescriptions.${lesson.id}`, {
      defaultValue: lesson.description,
    }),
  };
}

function mostRecentInProgress(progressItems) {
  return [...progressItems]
    .filter((progress) => progress.status === "inProgress")
    .sort(
      (a, b) =>
        new Date(b.lastActivityAt || 0).getTime() -
        new Date(a.lastActivityAt || 0).getTime()
    )[0];
}

export function useContinueLearning() {
  const { isAuthenticated } = useAuth();
  const { language } = useAppLanguage();
  const { t } = useTranslation();
  const [state, setState] = useState({
    bookmarks: [],
    currentPath: null,
    isLoading: isAuthenticated,
    progress: null,
    recommendation: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setState({
        bookmarks: [],
        currentPath: null,
        isLoading: false,
        progress: null,
        recommendation: null,
      });
      return undefined;
    }

    const controller = new AbortController();
    setState((current) => ({ ...current, isLoading: true }));

    Promise.all([
      fetchLessonCatalogProgress({ signal: controller.signal }),
      fetchRecommendedNextLesson(language, { signal: controller.signal }),
      fetchLearningPaths(language, { signal: controller.signal }),
      fetchLessonBookmarks({ signal: controller.signal }),
    ])
      .then(([progressPayload, recommendationPayload, pathsPayload, bookmarksPayload]) => {
        const progressItems = progressPayload?.results || [];
        const recentProgress = mostRecentInProgress(progressItems);
        const recommendation = recommendationPayload?.recommendation || null;
        const recommendedSlug = recommendation?.lesson?.slug || "";
        const continueSlug = recentProgress?.lessonSlug || recommendedSlug;
        const continueLesson = lessonForSlug(continueSlug, t);
        const paths = pathsPayload?.results || [];
        const currentPath =
          paths.find((path) => path.isRecommended) ||
          paths.find((path) => path.status === "inProgress") ||
          paths[0] ||
          null;
        const bookmarkSlugs = (bookmarksPayload?.results || []).map(
          (bookmark) => bookmark.lessonSlug
        );
        const bookmarkedLessons = bookmarkSlugs
          .map((slug) => lessonForSlug(slug, t))
          .filter(Boolean)
          .slice(0, 3);

        setState({
          bookmarks: bookmarkedLessons,
          currentPath,
          isLoading: false,
          progress: recentProgress && continueLesson
            ? {
                ...recentProgress,
                lesson: continueLesson,
              }
            : null,
          recommendation: continueLesson
            ? {
                lesson: continueLesson,
                path: recommendation?.path || null,
                reasonCode: recommendation?.reasonCode || "",
              }
            : null,
        });
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("continueLearning.loadFailed"));
          setState((current) => ({ ...current, isLoading: false }));
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, language, t]);

  return useMemo(
    () => ({
      ...state,
      isAuthenticated,
    }),
    [isAuthenticated, state]
  );
}
