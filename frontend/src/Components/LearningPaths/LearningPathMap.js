import { FiCheck, FiLock, FiPlayCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { classNames } from "../UI/classNames";

const NODE_STYLES = {
  completed: "border-green-500 bg-green-500 text-white",
  current: "border-primary bg-primary text-text-inverted",
  available: "border-border bg-surface text-text",
  locked: "border-border bg-surface-muted text-text-muted",
};

const CARD_STYLES = {
  completed: "border-green-500/25 bg-green-500/5",
  current: "border-primary/35 bg-primary/5 shadow-sm",
  available: "border-border bg-surface",
  locked: "border-border bg-surface-muted/70",
};

function LearningPathMap({ lessons }) {
  return (
    <div>
      <div className="hidden overflow-x-auto pb-2 md:block">
        <div className="flex min-w-max items-start py-2">
          {lessons.map((lesson, index) => (
            <PathSegment
              index={index}
              isLast={index === lessons.length - 1}
              key={lesson.slug}
              lesson={lesson}
            />
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

function PathSegment({ index, isLast, lesson }) {
  return (
    <>
      <DesktopPathNode index={index} lesson={lesson} />
      {!isLast && <DesktopConnector isComplete={lesson.status === "completed"} />}
    </>
  );
}

function DesktopPathNode({ index, lesson }) {
  const { t } = useTranslation();
  const Icon = iconForStatus(lesson.status);
  const isLocked = lesson.status === "locked";
  const content = (
    <div
      className={classNames(
        "group flex w-48 flex-col items-center text-center",
        !isLocked && "cursor-pointer"
      )}
    >
      <div
        className={classNames(
          "flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-semibold shadow-sm transition",
          !isLocked && "group-hover:-translate-y-0.5",
          NODE_STYLES[lesson.status] || NODE_STYLES.available
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <div
        className={classNames(
          "mt-2 flex min-h-[13.5rem] w-full flex-col rounded-2xl border p-4 transition",
          !isLocked && "group-hover:border-primary/50",
          CARD_STYLES[lesson.status] || CARD_STYLES.available
        )}
      >
        <p className="text-xs font-semibold text-text-muted">
          {t("paths.stepNumber", { number: index + 1 })} ·{" "}
          {t(`paths.nodeStatus.${lesson.status}`)}
        </p>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-text">
          {lesson.title}
        </h3>
        {lesson.summary && (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-text-muted">
            {lesson.summary}
          </p>
        )}
        <p
          className={classNames(
            "mt-auto pt-3 text-xs font-semibold",
            isLocked ? "text-text-muted" : "text-primary"
          )}
        >
          {lessonActionLabel(lesson, t)}
        </p>
      </div>
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link to={`/lessons/${lesson.slug}`} className="rounded-2xl outline-none">
      {content}
    </Link>
  );
}

function DesktopConnector({ isComplete }) {
  return (
    <div className="mt-6 flex w-16 shrink-0 items-center px-2" aria-hidden="true">
      <div className="h-1 w-full rounded-full bg-surface-muted">
        <div
          className={classNames(
            "h-full rounded-full transition-all",
            isComplete ? "w-full bg-green-500" : "w-1/3 bg-border"
          )}
        />
      </div>
    </div>
  );
}

function MobilePathNode({ index, isLast, lesson }) {
  const Icon = iconForStatus(lesson.status);
  const isLocked = lesson.status === "locked";

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
        "min-w-0 flex-1 rounded-2xl border p-4",
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
  if (lesson.status === "locked") return t("paths.lockedUntilReady");
  if (lesson.isCompleted) return t("paths.review");
  return t("paths.continue");
}

function iconForStatus(status) {
  if (status === "completed") return FiCheck;
  if (status === "locked") return FiLock;
  return FiPlayCircle;
}

export default LearningPathMap;
