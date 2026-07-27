import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "./useAuth";
import { fetchLessonProgress, saveLessonProgress } from "../services/learningApi";

export function useLessonProgress(slug) {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [isReady, setIsReady] = useState(!isAuthenticated);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setError(null);

    if (!isAuthenticated || !slug) {
      setProgress(null);
      setIsReady(true);
      return () => controller.abort();
    }

    setIsReady(false);

    fetchLessonProgress(slug, { signal: controller.signal })
      .then((payload) => {
        setProgress(payload);
        setIsReady(true);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
          setIsReady(true);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, slug]);

  const saveProgress = useCallback(
    (updates) => {
      if (!isAuthenticated || !slug) {
        return Promise.resolve(null);
      }

      return saveLessonProgress(slug, updates).then((payload) => {
        setProgress(payload);
        return payload;
      });
    },
    [isAuthenticated, slug]
  );

  return useMemo(
    () => ({
      error,
      isAuthenticated,
      isReady,
      progress,
      saveProgress,
    }),
    [error, isAuthenticated, isReady, progress, saveProgress]
  );
}
