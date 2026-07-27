import { FiArrowRight, FiBookmark, FiClock, FiMap, FiPlayCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Card, Skeleton } from "../UI";
import { classNames } from "../UI/classNames";
import { useContinueLearning } from "../../hooks/useContinueLearning";

function ContinueLearningPanel() {
  const { t } = useTranslation();
  const {
    bookmarks,
    currentPath,
    isAuthenticated,
    isLoading,
    progress,
    recommendation,
  } = useContinueLearning();

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="border-t border-border bg-surface-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-40 w-full" label={t("continueLearning.loading")} />
        </div>
      </section>
    );
  }

  const primaryLesson = progress?.lesson || recommendation?.lesson;

  return (
    <section className="border-t border-border bg-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              {t("continueLearning.eyebrow")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-text">
              {t("continueLearning.title")}
            </h2>
          </div>
          <Link
            to="/paths"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            {t("continueLearning.viewPaths")}
            <FiArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
          <PrimaryContinueCard progress={progress} recommendation={recommendation} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <PathMiniCard path={currentPath} />
            <SavedLessonsMiniCard bookmarks={bookmarks} />
          </div>
        </div>

        {!primaryLesson && (
          <p className="mt-4 text-sm leading-6 text-text-muted">
            {t("continueLearning.emptyHint")}
          </p>
        )}
      </div>
    </section>
  );
}

function PrimaryContinueCard({ progress, recommendation }) {
  const { t } = useTranslation();
  const lesson = progress?.lesson || recommendation?.lesson;

  if (!lesson) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex h-full flex-col justify-between gap-6">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiPlayCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-text">
              {t("continueLearning.startTitle")}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-text-muted">
              {t("continueLearning.startDescription")}
            </p>
          </div>

          <Link
            to="/lessons"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverted hover:bg-primary-hover"
          >
            {t("continueLearning.browseLessons")}
            <FiArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="flex items-center justify-center bg-surface-muted p-5">
          <img
            src={lesson.image}
            alt={lesson.title}
            className="h-32 w-32 rounded-2xl object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold text-primary">
              {progress
                ? t("continueLearning.resumeLabel")
                : t("continueLearning.recommendedLabel")}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-text">{lesson.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-text-muted">
              {lesson.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {progress?.totalSteps && (
                <StatusPill>
                  {t("continueLearning.stepProgress", {
                    current: progress.currentStep,
                    total: progress.totalSteps,
                  })}
                </StatusPill>
              )}
              {recommendation?.path?.title && (
                <StatusPill>{t("continueLearning.fromPath", {
                  path: recommendation.path.title,
                })}</StatusPill>
              )}
              <StatusPill>
                <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
                {t("lessons.minutes", { minutes: lesson.estimatedMinutes })}
              </StatusPill>
            </div>
          </div>

          <Link
            to={`/lessons/${lesson.id}`}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverted hover:bg-primary-hover"
          >
            {progress
              ? t("continueLearning.continueLesson")
              : t("continueLearning.startRecommended")}
            <FiArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

function PathMiniCard({ path }) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FiMap className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">
            {t("continueLearning.currentPath")}
          </p>
          {path ? (
            <>
              <h3 className="mt-1 line-clamp-1 text-base font-semibold text-text">
                {path.title}
              </h3>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${path.progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {t("continueLearning.pathProgress", {
                  percent: path.progressPercent,
                })}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm leading-6 text-text-muted">
              {t("continueLearning.noPath")}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function SavedLessonsMiniCard({ bookmarks }) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-muted">
          <FiBookmark className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text">
              {t("continueLearning.savedLessons")}
            </p>
            <Link
              to="/lessons"
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              {t("continueLearning.viewAll")}
            </Link>
          </div>

          {bookmarks.length > 0 ? (
            <div className="mt-3 space-y-2">
              {bookmarks.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className="block rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text hover:border-primary/40"
                >
                  {lesson.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-text-muted">
              {t("continueLearning.noSavedLessons")}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatusPill({ children }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full border border-border",
        "bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted"
      )}
    >
      {children}
    </span>
  );
}

export default ContinueLearningPanel;
