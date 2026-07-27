import { useTranslation } from "react-i18next";

import { classNames } from "../UI/classNames";

function LearningPathSelector({ activePathSlug, onSelectPath, paths }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
        {t("paths.selectPath")}
      </p>

      <div className="space-y-3">
        {paths.map((path) => (
          <button
            type="button"
            key={path.slug}
            onClick={() => onSelectPath(path.slug)}
            className={classNames(
              "w-full rounded-2xl border bg-surface p-4 text-start shadow-sm transition",
              "hover:border-primary/50 hover:bg-primary/5",
              activePathSlug === path.slug
                ? "border-primary ring-4 ring-primary/10"
                : "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-text">{path.title}</h2>
                  {path.isRecommended && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {t("paths.recommendedPath")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {t(`paths.pathStatus.${path.status}`)}
                </p>
              </div>

              <span className="shrink-0 text-sm font-semibold text-text">
                {path.progressPercent}%
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${path.progressPercent}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-text-muted">
              {t("paths.lessonProgress", {
                completed: path.completedLessons,
                total: path.totalLessons,
              })}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LearningPathSelector;
