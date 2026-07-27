import { FiArrowRight, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
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
    <Card className="overflow-hidden">
      <div className="border-b border-border p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
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

          {nextLesson ? (
            <Link
              to={`/lessons/${nextLesson.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverted hover:bg-primary-hover"
            >
              {t("paths.nextLesson")}
              <FiArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          ) : (
            <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-700 dark:text-green-200">
              <FiCheckCircle className="h-4 w-4" aria-hidden="true" />
              {t("paths.allDone")}
            </div>
          )}
        </div>

        <div className="mt-6">
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
          <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("paths.currentTarget")}
            </p>
            <h3 className="mt-2 text-base font-semibold text-text">
              {nextLesson.title}
            </h3>
            {nextLesson.summary && (
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
                {nextLesson.summary}
              </p>
            )}
          </div>
        )}

        <LearningPathMap lessons={path.lessons} />
      </div>
    </Card>
  );
}

function PathStat({ icon = null, label, value }) {
  return (
    <div className="border-border p-4 sm:border-e">
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold text-text">{value}</p>
    </div>
  );
}

export default LearningPathCard;
