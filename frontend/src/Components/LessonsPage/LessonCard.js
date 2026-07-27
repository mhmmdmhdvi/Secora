import { Link } from "react-router-dom";
import React from "react";
import { FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Card } from "../UI";
import { classNames } from "../UI/classNames";
import BookmarkButton from "./BookmarkButton";

function LessonCard({
  availability,
  bestQuizScore,
  bestQuizTotal,
  description,
  difficulty,
  estimatedMinutes,
  id,
  image,
  isBookmarked = false,
  isBookmarkBusy = false,
  isBookmarkVisible = false,
  isClickable = true,
  isRecommended = false,
  learningStatus = "notStarted",
  onToggleBookmark,
  title,
  topic,
}) {
  const { t } = useTranslation();
  const hasQuizScore = Number.isInteger(bestQuizScore) && bestQuizTotal > 0;

  return (
    <Card
      className={classNames(
        "relative w-full max-w-sm min-h-[470px]",
        "flex flex-col items-center text-center",
        "px-5 sm:px-6 py-6 sm:py-7",
        "transition-all duration-200",
        isClickable &&
          "hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        !isClickable && "opacity-80"
      )}
    >
      {isBookmarkVisible && (
        <BookmarkButton
          isBookmarked={isBookmarked}
          isBusy={isBookmarkBusy}
          onToggle={onToggleBookmark}
        />
      )}

      {isRecommended && (
        <span className="absolute top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-inverted"
          style={{ insetInlineStart: "1rem" }}
        >
          {t("lessons.recommended")}
        </span>
      )}

      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-center justify-center mb-5">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain rounded-2xl"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-2">
        <Badge tone={availabilityTone(availability)}>
          {t(`lessons.availability.${availability}`)}
        </Badge>
        <Badge tone={learningStatusTone(learningStatus)}>
          {t(`lessons.learningStatuses.${learningStatus}`)}
        </Badge>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-text">
        {title}
      </h3>

      <p className="text-sm sm:text-[0.95rem] text-text-muted mb-4 max-w-[270px] leading-6 line-clamp-3">
        {description}
      </p>

      <div className="mb-5 mt-auto flex flex-wrap justify-center gap-2 text-xs font-medium text-text-muted">
        <span>{t(`lessons.difficulties.${difficulty}`)}</span>
        <span aria-hidden="true">·</span>
        <span>{t(`lessons.topics.${topic}`)}</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
          {t("lessons.minutes", { minutes: estimatedMinutes })}
        </span>
      </div>

      {hasQuizScore && (
        <p className="mb-4 text-xs font-medium text-text-muted">
          {t("lessons.quizScore", {
            score: bestQuizScore,
            total: bestQuizTotal,
          })}
        </p>
      )}

      {isClickable ? (
        <Link
          to={`/lessons/${id}`}
          className="text-sm sm:text-[0.95rem] font-medium text-primary underline hover:text-primary-hover"
        >
          {availability === "preview"
            ? t("lessons.previewLesson")
            : t("lessons.exploreLesson")}
        </Link>
      ) : (
        <span className="text-sm font-semibold text-text-muted">
          {t("lessons.comingSoon")}
        </span>
      )}
    </Card>
  );
}

function Badge({ children, tone = "muted" }) {
  return (
    <span
      className={classNames(
        "rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "success" &&
          "border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-200",
        tone === "primary" && "border-primary/25 bg-primary/10 text-primary",
        tone === "warning" &&
          "border-yellow-500/25 bg-yellow-500/10 text-yellow-700 dark:text-yellow-200",
        tone === "muted" && "border-border bg-surface-muted text-text-muted"
      )}
    >
      {children}
    </span>
  );
}

function availabilityTone(availability) {
  if (availability === "ready") return "success";
  if (availability === "preview") return "warning";
  return "muted";
}

function learningStatusTone(status) {
  if (status === "completed") return "success";
  if (status === "inProgress") return "primary";
  return "muted";
}

export default LessonCard;
