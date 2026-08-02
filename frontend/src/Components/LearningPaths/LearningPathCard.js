import { FiArrowRight, FiCheckCircle, FiClock, FiMapPin, FiTarget } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card } from "../UI";
import LearningPathMap from "./LearningPathMap";

function LearningPathCard({ path }) {
  const { t } = useTranslation();
  const nextLesson =
    path.nextLesson ||
    path.lessons.find((lesson) => lesson.slug === path.nextLessonSlug);
  const isComplete = path.totalLessons > 0 && path.completedLessons === path.totalLessons;

  return (
    <Card className="overflow-hidden shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface via-primary/5 to-cyan-400/10 p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -top-20 end-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="relative max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted">
                {t(`paths.pathStatus.${path.status}`)}
              </span>
              {path.isRecommended && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {t("paths.recommendedPath")}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-semibold text-text sm:text-3xl">
              {path.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-text-muted">{path.summary}</p>
          </div>

          <PathAction nextLesson={nextLesson} path={path} isComplete={isComplete} />
        </div>

        <div className="relative mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-text-muted">
            <span>{isComplete ? t("paths.pathCompleted") : t("paths.pathProgress")}</span>
            <span>{path.progressPercent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${path.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-0 border-b border-border sm:grid-cols-3">
        <PathStat
          label={t("paths.completedLessons")}
          value={`${path.completedLessons}/${path.totalLessons}`}
        />
        <PathStat
          icon={<FiClock className="h-4 w-4" aria-hidden="true" />}
          label={t("paths.estimatedTime")}
          value={t("paths.minutes", { minutes: path.estimatedMinutes })}
        />
        <PathStat
          icon={<FiMapPin className="h-4 w-4" aria-hidden="true" />}
          label={t("paths.remaining")}
          value={t("paths.remainingLessons", { count: path.remainingLessons })}
        />
      </div>

      <div className="p-5 sm:p-6">
        {nextLesson && (
          <div className="mb-6 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-4 shadow-sm sm:p-5">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-text-inverted shadow-lg shadow-primary/20">
                <FiTarget className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  {t("paths.currentTarget")}
                </p>
                <h3 className="mt-2 text-base font-black text-text">
                  {nextLesson.title}
                </h3>
                {nextLesson.summary && (
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
                    {nextLesson.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <LearningPathMap lessons={path.lessons} />
      </div>
    </Card>
  );
}

function PathAction({ isComplete, nextLesson, path }) {
  const { t } = useTranslation();

  if (nextLesson) {
    return (
      <Link
        to={`/lessons/${nextLesson.slug}`}
        className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverted shadow-lg shadow-primary/20 hover:bg-primary-hover"
      >
        {t("paths.nextLesson")}
        <FiArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </Link>
    );
  }

  if (path.hasComingSoon && !isComplete) {
    return (
      <div className="relative inline-flex items-center justify-center rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-200">
        {t("paths.comingSoon")}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-700 dark:text-green-200">
      <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
      {t("paths.allDone")}
    </div>
  );
}

function PathStat({ icon = null, label, value }) {
  return (
    <div className="border-border bg-surface/80 p-4 sm:border-e">
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold text-text">{value}</p>
    </div>
  );
}

export default LearningPathCard;
