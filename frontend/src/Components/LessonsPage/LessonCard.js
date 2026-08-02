import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Card } from "../UI";
import { classNames } from "../UI/classNames";
import { useAppLanguage } from "../../hooks/useAppLanguage";
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
  onToggleBookmark,
  title,
  topic,
}) {
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const ActionIcon = isPersian ? FiArrowLeft : FiArrowRight;
  const hasQuizScore = Number.isInteger(bestQuizScore) && bestQuizTotal > 0;

  return (
    <Card
      className={classNames(
        "group relative flex min-h-[500px] w-full max-w-sm flex-col overflow-hidden p-0",
        "transition-all duration-300",
        isClickable &&
          "hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.38)]",
        !isClickable && "opacity-75"
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
        <span
          className="absolute top-4 z-20 rounded-full bg-primary px-3 py-1 text-xs font-bold text-text-inverted shadow-lg shadow-primary/20"
          style={{ insetInlineStart: "1rem" }}
        >
          {t("lessons.recommended")}
        </span>
      )}

      <div className="relative mx-4 mt-4 flex h-56 items-center justify-center overflow-hidden rounded-[1.6rem] border border-border bg-gradient-to-br from-surface-muted via-surface to-primary/5">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-14 left-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex h-44 w-44 items-center justify-center p-3 transition duration-300 group-hover:scale-[1.03]">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div
        className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6"
        dir={isPersian ? "rtl" : "ltr"}
      >
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <MetaChip>{t(`lessons.difficulties.${difficulty}`)}</MetaChip>
          <MetaChip>{t(`lessons.topics.${topic}`)}</MetaChip>
          <MetaChip>
            <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
            {t("lessons.minutes", { minutes: estimatedMinutes })}
          </MetaChip>
        </div>

        <h3 className="text-center text-xl font-black leading-8 text-text" dir="ltr">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-text-muted">
          {description}
        </p>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            {hasQuizScore ? (
              <span className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-bold text-text-muted">
                {t("lessons.quizScoreCompact", {
                  score: bestQuizScore,
                  total: bestQuizTotal,
                })}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}

            {isClickable ? (
              <Link
                to={`/lessons/${id}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-text-inverted shadow-sm shadow-primary/20 transition hover:bg-primary-hover"
              >
                {availability === "preview"
                  ? t("lessons.previewLesson")
                  : t("lessons.exploreLesson")}
                <ActionIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <span className="rounded-full border border-border bg-surface-muted px-4 py-2 text-sm font-bold text-text-muted">
                {t("lessons.comingSoon")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function MetaChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted/70 px-3 py-1.5 text-xs font-bold text-text-muted">
      {children}
    </span>
  );
}

export default LessonCard;
