import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppLanguage } from "./useAppLanguage";
import { useAuth } from "./useAuth";
import { fetchLearningPaths } from "../services/learningApi";

export function useLearningPaths() {
  const { isAuthenticated } = useAuth();
  const { language } = useAppLanguage();
  const { t } = useTranslation();
  const [paths, setPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setPaths([]);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchLearningPaths(language, { signal: controller.signal })
      .then((payload) => setPaths(payload?.results || []))
      .catch((error) => {
        if (error?.name !== "AbortError") {
          toast.error(t("paths.loadFailed"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, language, t]);

  return { isLoading, paths };
}
