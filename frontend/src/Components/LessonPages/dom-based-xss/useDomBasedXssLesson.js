import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { normalizeLanguage } from "../../../i18n";
import { fetchLesson } from "../../../services/lessonsApi";
import { mapApiLessonToDomBasedXssLesson } from "./domBasedXssApiMapper";

export function useDomBasedXssLesson() {
  const { i18n } = useTranslation();
  const locale = normalizeLanguage(i18n.language);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setError(null);
    setLesson(null);

    fetchLesson("dom-based-xss", locale)
      .then((apiLesson) => {
        if (!ignore) {
          setLesson(mapApiLessonToDomBasedXssLesson(apiLesson));
        }
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
