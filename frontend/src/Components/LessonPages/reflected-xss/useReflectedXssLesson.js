import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { normalizeLanguage } from "../../../i18n";
import { fetchLesson } from "../../../services/lessonsApi";
import { mapApiLessonToReflectedXssLesson } from "./reflectedXssApiMapper";

export function useReflectedXssLesson() {
  const { i18n } = useTranslation();
  const locale = normalizeLanguage(i18n.language);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setError(null);
    setLesson(null);

    fetchLesson("reflected-xss", locale)
      .then((apiLesson) => {
        if (!ignore) {
          setLesson(mapApiLessonToReflectedXssLesson(apiLesson));
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
