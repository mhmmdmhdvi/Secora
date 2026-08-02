import { FiCheck, FiLock, FiPlayCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { classNames } from "../UI/classNames";

const NODE_STYLES = {
  completed: "border-green-500 bg-green-500 text-white",
  current: "border-primary bg-primary text-text-inverted",
  available: "border-border bg-surface text-text",
  locked: "border-border bg-surface-muted text-text-muted",
  comingSoon:
    "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
};

const CARD_STYLES = {
  completed: "border-green-500/25 bg-green-500/5",
  current: "border-primary/35 bg-primary/5 shadow-sm",
  available: "border-border bg-surface",
  locked: "border-border bg-surface-muted/70",
  comingSoon:
    "border-amber-300/70 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/5",
};

function LearningPathMap({ lessons }) {
  return (
    <div className="relative">
      <div className="hidden md:block">
        <div className="grid gap-4 rounded-[1.75rem] bg-gradient-to-br from-surface-muted/60 via-surface to-primary/5 p-4 lg:grid-cols-2 2xl:grid-cols-3">
          {lessons.map((lesson, index) => (
            <DesktopPathNode index={index} key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {lessons.map((lesson, index) => (
          <MobilePathNode
            index={index}
            isLast={index === lessons.length - 1}
            key={lesson.slug}
            lesson={lesson}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopPathNode({ index, lesson }) {
  const { t } = useTranslation();
  const Icon = iconForStatus(lesson.status);
  const isLocked = isUnavailable(lesson.status);
  const content = (
    <div
      className={classNames(
        "group min-h-full rounded-[1.55rem] border p-4 shadow-sm transition",
        !isLocked && "cursor-pointer hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lg",
        CARD_STYLES[lesson.status] || CARD_STYLES.available
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div
            className={classNames(
              "absolute inset-0 rounded-full blur-xl transition",
              lesson.status === "completed" && "bg-green-500/25",
              lesson.status === "current" && "bg-primary/30",
              lesson.status === "comingSoon" && "bg-amber-400/20",
              lesson.status === "available" && "bg-border/30"
            )}
            aria-hidden="true"
          />
          <div
            className={classNames(
              "relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-lg font-semibold shadow-lg transition",
              !isLocked && "group-hover:-translate-y-0.5",
              NODE_STYLES[lesson.status] || NODE_STYLES.available
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-text-muted">
            {t("paths.stepNumber", { number: index + 1 })} ·{" "}
            {t(`paths.nodeStatus.${lesson.status}`)}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-black leading-6 text-text">
            {lesson.title}
          </h3>
          {lesson.summary && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-muted">
              {lesson.summary}
            </p>
          )}
          <p
            className={classNames(
              "mt-3 text-xs font-bold",
              isLocked ? "text-text-muted" : "text-primary"
            )}
          >
            {lessonActionLabel(lesson, t)}
          </p>
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link to={`/lessons/${lesson.slug}`} className="rounded-[1.55rem] outline-none">
      {content}
    </Link>
  );
}

function MobilePathNode({ index, isLast, lesson }) {
  const Icon = iconForStatus(lesson.status);
  const isLocked = isUnavailable(lesson.status);

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className={classNames(
            "absolute top-10 h-[calc(100%+0.75rem)] w-px",
            lesson.status === "completed" ? "bg-green-500" : "bg-border"
          )}
          style={{ insetInlineStart: "1.25rem" }}
          aria-hidden="true"
        />
      )}

      <div
        className={classNames(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold shadow-sm",
          NODE_STYLES[lesson.status] || NODE_STYLES.available
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <PathNodeBody index={index} isLocked={isLocked} lesson={lesson} />
    </div>
  );
}

function PathNodeBody({ index, isLocked, lesson }) {
  const { t } = useTranslation();
  const body = (
    <div
      className={classNames(
        "min-w-0 flex-1 rounded-[1.4rem] border p-4 shadow-sm",
        !isLocked && "transition hover:border-primary/50",
        CARD_STYLES[lesson.status] || CARD_STYLES.available
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-text-muted">
            {t("paths.stepNumber", { number: index + 1 })} ·{" "}
            {t(`paths.nodeStatus.${lesson.status}`)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-text">
            {lesson.title}
          </h3>
          {lesson.summary && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
              {lesson.summary}
            </p>
          )}
        </div>

        <span
          className={classNames(
            "inline-flex shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold",
            isLocked
              ? "text-text-muted"
              : lesson.status === "current"
                ? "bg-primary text-text-inverted"
                : "text-primary"
          )}
        >
          {lessonActionLabel(lesson, t)}
        </span>
      </div>
    </div>
  );

  if (isLocked) {
    return body;
  }

  return (
    <Link to={`/lessons/${lesson.slug}`} className="min-w-0 flex-1 rounded-2xl">
      {body}
    </Link>
  );
}

function lessonActionLabel(lesson, t) {
  if (lesson.status === "comingSoon") return t("paths.comingSoon");
  if (lesson.status === "locked") return t("paths.lockedUntilReady");
  if (lesson.isCompleted) return t("paths.review");
  return t("paths.continue");
}

function iconForStatus(status) {
  if (status === "completed") return FiCheck;
  if (isUnavailable(status)) return FiLock;
  return FiPlayCircle;
}

function isUnavailable(status) {
  return status === "locked" || status === "comingSoon";
}

export default LearningPathMap;
