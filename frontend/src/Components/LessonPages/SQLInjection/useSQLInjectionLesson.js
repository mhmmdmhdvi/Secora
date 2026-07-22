import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchLesson } from "../../../services/lessonsApi";
import { normalizeLanguage } from "../../../i18n";
import { mapApiLessonToSQLInjectionLesson } from "./sqlInjectionApiMapper";

export function useSQLInjectionLesson() {
  const { i18n } = useTranslation();
  const locale = normalizeLanguage(i18n.language);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setError(null);
    setLesson(null);

    fetchLesson("sql-injection", locale)
      .then((apiLesson) => {
        if (!ignore) setLesson(mapApiLessonToSQLInjectionLesson(apiLesson));
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
