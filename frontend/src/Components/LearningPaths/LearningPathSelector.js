import { useTranslation } from "react-i18next";
import {
  FiCpu,
  FiDatabase,
  FiGlobe,
  FiKey,
  FiLayers,
  FiMonitor,
  FiPackage,
  FiShield,
  FiTerminal,
  FiZap,
} from "react-icons/fi";

import { classNames } from "../UI/classNames";

const PATH_ICONS = {
  "starter-web-attacks": FiZap,
  "client-side-browser-attacks": FiMonitor,
  "injection-and-code-execution": FiTerminal,
  "auth-session-access-control": FiKey,
  "data-xml-and-disclosure": FiDatabase,
  "transport-routing-and-trust": FiGlobe,
  "defense-operations-and-resilience": FiShield,
  "supply-chain-and-abuse": FiPackage,
  "ai-security": FiCpu,
};

const PATH_ACCENTS = {
  "starter-web-attacks": "from-blue-500 to-cyan-400",
  "client-side-browser-attacks": "from-violet-500 to-blue-500",
  "injection-and-code-execution": "from-orange-500 to-rose-500",
  "auth-session-access-control": "from-indigo-500 to-sky-500",
  "data-xml-and-disclosure": "from-emerald-500 to-cyan-500",
  "transport-routing-and-trust": "from-sky-500 to-blue-600",
  "defense-operations-and-resilience": "from-green-500 to-emerald-500",
  "supply-chain-and-abuse": "from-amber-500 to-orange-500",
  "ai-security": "from-fuchsia-500 to-violet-500",
};

function LearningPathSelector({ activePathSlug, onSelectPath, paths }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            {t("paths.selectPath")}
          </p>
          <h2 className="mt-1 text-2xl font-black text-text">
            {t("paths.chooseMission")}
          </h2>
        </div>
        <span className="hidden rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold text-text-muted sm:inline-flex">
          {t("paths.pathCount", { count: paths.length })}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paths.map((path) => (
          <PathOptionCard
            activePathSlug={activePathSlug}
            key={path.slug}
            onSelectPath={onSelectPath}
            path={path}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

function PathOptionCard({ activePathSlug, onSelectPath, path, t }) {
  const Icon = PATH_ICONS[path.slug] || FiLayers;
  const accent = PATH_ACCENTS[path.slug] || "from-primary to-cyan-400";
  const isActive = activePathSlug === path.slug;

  return (
    <button
      type="button"
      onClick={() => onSelectPath(path.slug)}
      className={classNames(
        "group relative min-h-[16rem] overflow-hidden rounded-[1.6rem] border bg-surface p-5 text-start shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_22px_70px_rgba(0,0,0,0.28)]",
        isActive
          ? "border-primary ring-4 ring-primary/10"
          : "border-border hover:border-primary/40"
      )}
    >
      <div
        className={classNames(
          "pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-20 blur-2xl",
          accent
        )}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={classNames(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105",
            accent
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {path.isRecommended && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              {t("paths.recommendedPath")}
            </span>
          )}
          {path.hasComingSoon && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-200">
              {t("paths.comingSoon")}
            </span>
          )}
        </div>
      </div>

      <h3 className="relative mt-5 line-clamp-2 text-xl font-black leading-7 text-text">
        {path.title}
      </h3>
      <p className="relative mt-2 line-clamp-3 text-sm leading-6 text-text-muted">
        {path.summary}
      </p>

      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-text-muted">
          <span>
            {t("paths.lessonProgress", {
              completed: path.completedLessons,
              total: path.totalLessons,
            })}
          </span>
          <span className="text-text">{path.progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={classNames("h-full rounded-full bg-gradient-to-r", accent)}
            style={{ width: `${path.progressPercent}%` }}
          />
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {path.lessons.slice(0, 8).map((lesson) => (
          <span
            key={lesson.slug}
            className={classNames(
              "h-2.5 w-2.5 rounded-full",
              lesson.status === "completed" && "bg-green-500",
              lesson.status === "current" && "bg-primary",
              lesson.status === "comingSoon" && "bg-amber-400",
              lesson.status === "available" && "bg-border"
            )}
          />
        ))}
        {path.lessons.length > 8 && (
          <span className="text-[11px] font-bold leading-none text-text-muted">
            +{path.lessons.length - 8}
          </span>
        )}
      </div>
    </button>
  );
}

export default LearningPathSelector;
