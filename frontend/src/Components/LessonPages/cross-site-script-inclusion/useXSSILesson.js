import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchLesson } from "../../../services/lessonsApi";
import { normalizeLanguage } from "../../../i18n";
import { mapApiLessonToXSSILesson } from "./xssiApiMapper";

export function useXSSILesson() {
  const { i18n } = useTranslation();
  const locale = normalizeLanguage(i18n.language);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setError(null);
    setLesson(null);

    fetchLesson("cross-site-script-inclusion", locale)
      .then((apiLesson) => {
        if (!ignore) setLesson(mapApiLessonToXSSILesson(apiLesson));
      })
      .catch((err) => {
        if (!ignore) setError(err);
      });

    return () => {
      ignore = true;
    };
  }, [locale]);

  return { lesson, error };
}
