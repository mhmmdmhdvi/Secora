import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { fetchLearningAchievements } from "../services/learningApi";
import { useAuth } from "./useAuth";

export function useLearningAchievements() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState(null);
  const [isLoading, setIsLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setAchievements(null);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchLearningAchievements({ signal: controller.signal })
      .then(setAchievements)
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("profile.achievementsLoadFailed"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, t]);

  return { achievements, isLoading };
}
