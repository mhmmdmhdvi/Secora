import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { fetchLearningXpProfile } from "../services/learningApi";
import { useAuth } from "./useAuth";

export function useLearningXpProfile() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchLearningXpProfile({ signal: controller.signal })
      .then(setProfile)
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("profile.xpLoadFailed"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, t]);

  return { isLoading, profile };
}
