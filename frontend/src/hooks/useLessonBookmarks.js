import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  fetchLessonBookmarks,
  removeLessonBookmark,
  saveLessonBookmark,
} from "../services/learningApi";
import { useAuth } from "./useAuth";

export function useLessonBookmarks() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [bookmarkSlugs, setBookmarkSlugs] = useState(() => new Set());
  const [busySlugs, setBusySlugs] = useState(() => new Set());
  const [isReady, setIsReady] = useState(!isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setBookmarkSlugs(new Set());
      setIsReady(true);
      return undefined;
    }

    const controller = new AbortController();
    setIsReady(false);

    fetchLessonBookmarks({ signal: controller.signal })
      .then((payload) => {
        const slugs = (payload?.results || []).map((bookmark) => bookmark.lessonSlug);
        setBookmarkSlugs(new Set(slugs));
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("lessons.bookmarksLoadFailed"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsReady(true);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, t]);

  const toggleBookmark = useCallback(
    async (slug) => {
      if (!isAuthenticated) {
        toast.info(t("lessons.loginToBookmark"));
        return;
      }

      const wasBookmarked = bookmarkSlugs.has(slug);

      setBookmarkSlugs((current) => {
        const next = new Set(current);
        if (wasBookmarked) {
          next.delete(slug);
        } else {
          next.add(slug);
        }
        return next;
      });
      setBusySlugs((current) => new Set(current).add(slug));

      try {
        if (wasBookmarked) {
          await removeLessonBookmark(slug);
        } else {
          await saveLessonBookmark(slug);
        }
      } catch (error) {
        setBookmarkSlugs((current) => {
          const next = new Set(current);
          if (wasBookmarked) {
            next.add(slug);
          } else {
            next.delete(slug);
          }
          return next;
        });
        toast.error(t("lessons.bookmarkSaveFailed"));
      } finally {
        setBusySlugs((current) => {
          const next = new Set(current);
          next.delete(slug);
          return next;
        });
      }
    },
    [bookmarkSlugs, isAuthenticated, t]
  );

  return useMemo(
    () => ({
      bookmarkSlugs,
      busySlugs,
      isAuthenticated,
      isReady,
      toggleBookmark,
    }),
    [bookmarkSlugs, busySlugs, isAuthenticated, isReady, toggleBookmark]
  );
}
