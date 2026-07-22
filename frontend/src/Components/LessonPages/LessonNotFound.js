import React from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../UI";
import { useTranslation } from "react-i18next";

function LessonNotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 sm:pt-20 px-4">
      <EmptyState
        icon="404"
        title={t("lessons.notFoundTitle")}
        description={t("lessons.notFoundDescription")}
      >
        <Link
          to="/lessons"
          className="inline-block font-semibold text-primary hover:underline"
        >
          {t("lessons.backToLessons")}
        </Link>
      </EmptyState>
    </div>
  );
}

export default LessonNotFound;
