import { Link } from "react-router-dom";
import React from "react";
import { Card } from "../UI";
import { useTranslation } from "react-i18next";

function LessonCard({ id, image, title, description }) {
  const { t } = useTranslation();

  return (
    <Card
      className="
        w-full max-w-sm min-h-[420px]
        flex flex-col items-center text-center
        px-5 sm:px-6 py-6 sm:py-8
        transition-all duration-200
        hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]
      "
    >
      <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center mb-5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain rounded-2xl"
          loading="lazy"
          decoding="async"
        />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-text">
        {title}
      </h3>

      <p className="text-sm sm:text-[0.95rem] text-text-muted mb-5 max-w-[260px] leading-6 line-clamp-3">
        {description}
      </p>

      <Link
        to={`/lessons/${id}`}
        className="mt-auto text-sm sm:text-[0.95rem] font-medium text-primary underline hover:text-primary-hover"
      >
        {t("lessons.exploreLesson")}
      </Link>
    </Card>
  );
}

export default LessonCard;
