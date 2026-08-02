import { useRef, useState } from "react";
import {
  FiAward,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiDatabase,
  FiFolder,
  FiGlobe,
  FiKey,
  FiLock,
  FiMail,
  FiPackage,
  FiSearch,
  FiServer,
  FiShield,
  FiTarget,
  FiTerminal,
  FiUploadCloud,
  FiZap,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Card, Skeleton } from "../UI";
import { classNames } from "../UI/classNames";
import { useLearningAchievements } from "../../hooks/useLearningAchievements";

const ICONS = {
  award: FiAward,
  book: FiBookOpen,
  check: FiCheckCircle,
  code: FiCode,
  cpu: FiCpu,
  database: FiDatabase,
  folder: FiFolder,
  globe: FiGlobe,
  key: FiKey,
  mail: FiMail,
  package: FiPackage,
  search: FiSearch,
  server: FiServer,
  shield: FiShield,
  target: FiTarget,
  terminal: FiTerminal,
  upload: FiUploadCloud,
  zap: FiZap,
};

const CATEGORY_STYLES = {
  interactive: {
    accent: "from-amber-300 to-orange-500",
    ring: "ring-orange-200/70 dark:ring-orange-500/20",
    bar: "bg-orange-500",
    glow: "shadow-orange-500/15",
  },
  guide: {
    accent: "from-sky-300 to-blue-600",
    ring: "ring-sky-200/70 dark:ring-sky-500/20",
    bar: "bg-blue-500",
    glow: "shadow-blue-500/15",
  },
  quiz: {
    accent: "from-emerald-300 to-green-600",
    ring: "ring-emerald-200/70 dark:ring-emerald-500/20",
    bar: "bg-emerald-500",
    glow: "shadow-emerald-500/15",
  },
  completion: {
    accent: "from-yellow-300 to-amber-500",
    ring: "ring-yellow-200/70 dark:ring-yellow-500/20",
    bar: "bg-amber-500",
    glow: "shadow-amber-500/15",
  },
  milestone: {
    accent: "from-violet-300 to-purple-600",
    ring: "ring-violet-200/70 dark:ring-violet-500/20",
    bar: "bg-violet-500",
    glow: "shadow-violet-500/15",
  },
  lesson: {
    accent: "from-cyan-300 to-indigo-600",
    ring: "ring-cyan-200/70 dark:ring-cyan-500/20",
    bar: "bg-cyan-500",
    glow: "shadow-cyan-500/15",
  },
};

const LOCKED_STYLE = {
  accent: "from-slate-300 to-slate-500",
  ring: "ring-slate-200/80 dark:ring-slate-700/60",
  bar: "bg-slate-300 dark:bg-slate-600",
  glow: "shadow-slate-500/10",
};

const INITIAL_VISIBLE_BADGES = 12;
const VISIBLE_BADGE_INCREMENT = 12;

function ProfileAchievementsCard() {
  const { t } = useTranslation();
  const { achievements, isLoading } = useLearningAchievements();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_BADGES);
  const galleryRef = useRef(null);

  if (isLoading) {
    return (
      <Card className="mb-6 overflow-hidden p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="hidden h-64 w-full rounded-3xl xl:block" />
        </div>
      </Card>
    );
  }

  if (!achievements) return null;

  const unlockedPercent =
    achievements.totalCount > 0
      ? Math.round((achievements.unlockedCount / achievements.totalCount) * 100)
      : 0;
  const achievementResults = achievements.results || [];
  const trophyShelf = achievementResults
    .filter((achievement) => achievement.isUnlocked)
    .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
    .slice(0, 5);
  const nextBadges = achievementResults
    .filter((achievement) => !achievement.isUnlocked && achievement.isAvailable !== false)
    .slice(0, 5);
  const shelfBadges = trophyShelf.length > 0 ? trophyShelf : nextBadges;

  const visibleAchievements = achievementResults.slice(0, visibleCount);
  const hasMoreAchievements = visibleCount < achievementResults.length;
  const hasExpandedAchievements = visibleCount > INITIAL_VISIBLE_BADGES;

  const collapseAchievements = () => {
    setVisibleCount(INITIAL_VISIBLE_BADGES);
    window.requestAnimationFrame(() => {
      galleryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <Card className="mb-6 overflow-hidden p-0">
      <div className="relative overflow-hidden border-b border-border bg-surface-muted/35 px-5 py-5 sm:px-6">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              {t("profile.achievements")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              {t("profile.achievementsDescription")}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-border bg-surface/80 p-4 shadow-sm shadow-black/5 lg:w-64">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-muted">
                  {t("profile.achievementsCount", {
                    unlocked: achievements.unlockedCount,
                    total: achievements.totalCount,
                  })}
                </p>
                <p className="mt-1 text-3xl font-black text-text">
                  {unlockedPercent}%
                </p>
              </div>
              <MiniHexBadge Icon={FiAward} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${unlockedPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {shelfBadges.length > 0 && (
          <section className="rounded-3xl border border-border bg-surface-muted/25 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-black text-text">
                  {t(
                    trophyShelf.length > 0
                      ? "profile.trophyShelf"
                      : "profile.nextBadges"
                  )}
                </h3>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {shelfBadges.map((achievement) => (
                <TrophyShelfBadge achievement={achievement} key={achievement.code} />
              ))}
            </div>
          </section>
        )}

        <div
          className="grid scroll-mt-24 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
          ref={galleryRef}
        >
          {visibleAchievements.map((achievement) => (
            <AchievementBadge achievement={achievement} key={achievement.code} />
          ))}
        </div>

        {(hasMoreAchievements || hasExpandedAchievements) && (
          <div className="flex justify-center">
            {hasMoreAchievements ? (
              <button
                aria-label={t("profile.showMoreAchievements", {
                  count: Math.min(
                    VISIBLE_BADGE_INCREMENT,
                    achievementResults.length - visibleCount
                  ),
                })}
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary hover:text-text-inverted"
                onClick={() =>
                  setVisibleCount((current) => current + VISIBLE_BADGE_INCREMENT)
                }
                type="button"
              >
                <FiChevronDown
                  className="h-5 w-5 animate-bounce motion-reduce:animate-none"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <button
                aria-label={t("profile.collapseAchievements")}
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary hover:text-text-inverted"
                onClick={collapseAchievements}
                type="button"
              >
                <FiChevronUp
                  className="h-5 w-5 animate-bounce motion-reduce:animate-none"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function AchievementBadge({ achievement }) {
  const { t } = useTranslation();
  const isAvailable = achievement.isAvailable !== false;
  const isUnlocked = achievement.isUnlocked;
  const Icon = isUnlocked ? ICONS[achievement.icon] || FiAward : FiLock;
  const style = isUnlocked
    ? CATEGORY_STYLES[achievement.category] || CATEGORY_STYLES.completion
    : LOCKED_STYLE;
  const progress = isUnlocked ? 100 : 0;
  const stateLabel = isUnlocked
    ? t("profile.achievementUnlocked", { defaultValue: "Unlocked" })
    : isAvailable
      ? t("profile.achievementLocked", { defaultValue: "Locked" })
      : t("profile.achievementComingSoon", { defaultValue: "Coming soon" });
  const chipLabel = isUnlocked
    ? t("profile.achievementEarned", { defaultValue: "Earned" })
    : isAvailable
      ? t("profile.achievementHidden", { defaultValue: "Hidden" })
      : t("profile.achievementComingSoon", { defaultValue: "Coming soon" });

  return (
    <article
      className={classNames(
        "group relative min-h-52 overflow-hidden rounded-3xl border bg-surface p-4 text-center shadow-lg transition duration-200 sm:min-h-56",
        isUnlocked
          ? `border-border shadow-black/5 hover:-translate-y-1 ${style.glow}`
          : "border-border bg-surface-muted/35 shadow-black/0"
      )}
    >
      <div
        className={classNames(
          "pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full blur-3xl",
          isUnlocked ? "bg-primary/10" : "bg-slate-400/10"
        )}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center">
        <AchievementHexBadge Icon={Icon} isUnlocked={isUnlocked} size="md" style={style} />

        <div className="mt-4 min-h-[4.75rem]">
          <h3
            className={classNames(
              "line-clamp-2 text-sm font-bold",
              isUnlocked ? "text-text" : "text-text-muted"
            )}
          >
            {t(`profile.achievementNames.${achievement.code}`)}
          </h3>
          <p className="mx-auto mt-2 line-clamp-2 max-w-[13rem] text-[11px] leading-5 text-text-muted">
            {t(`profile.achievementDescriptions.${achievement.code}`)}
          </p>
        </div>

        <div className="mt-4 w-full">
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted">
            <span>
              {stateLabel}
            </span>
            <span>{progress}/100</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className={classNames("h-full rounded-full transition-all", style.bar)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={classNames(
            "mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]",
            isUnlocked
              ? "border-primary/20 bg-primary/5 text-primary"
              : "border-border bg-surface text-text-muted"
          )}
        >
          {isUnlocked ? (
            <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <FiLock className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>
            {chipLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

function TrophyShelfBadge({ achievement }) {
  const { t } = useTranslation();
  const isUnlocked = achievement.isUnlocked;
  const Icon = isUnlocked ? ICONS[achievement.icon] || FiAward : FiLock;
  const style = isUnlocked
    ? CATEGORY_STYLES[achievement.category] || CATEGORY_STYLES.completion
    : LOCKED_STYLE;

  return (
    <article className="rounded-3xl border border-border bg-surface p-3 text-center shadow-sm shadow-black/5">
      <AchievementHexBadge Icon={Icon} isUnlocked={isUnlocked} size="sm" style={style} />
      <h4 className="mx-auto mt-3 line-clamp-2 max-w-[9rem] text-xs font-black text-text">
        {t(`profile.achievementNames.${achievement.code}`)}
      </h4>
    </article>
  );
}

function AchievementHexBadge({ Icon, isUnlocked, size = "lg", style }) {
  const isSmall = size === "sm";
  const isMedium = size === "md";

  return (
    <div
      className={classNames(
        "relative mx-auto flex items-center justify-center drop-shadow-xl",
        isSmall ? "h-16 w-16" : isMedium ? "h-20 w-20" : "h-24 w-24",
        isUnlocked ? style.glow : "opacity-80 grayscale"
      )}
    >
      <div
        className={classNames(
          "absolute inset-0 bg-gradient-to-br ring-8",
          style.accent,
          style.ring,
          "[clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]"
        )}
      />
      <div
        className="absolute inset-[10px] bg-white/20 dark:bg-white/10 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]"
        aria-hidden="true"
      />
      <div
        className={classNames(
          "relative flex items-center justify-center rounded-2xl text-white",
          isSmall ? "h-9 w-9" : isMedium ? "h-12 w-12" : "h-14 w-14",
          isUnlocked ? "bg-black/10" : "bg-black/15"
        )}
      >
        <Icon
          className={classNames(
            "stroke-[2.3]",
            isSmall ? "h-5 w-5" : isMedium ? "h-7 w-7" : "h-8 w-8"
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function MiniHexBadge({ Icon }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center drop-shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 ring-4 ring-blue-200/60 dark:ring-blue-500/20 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]" />
      <div
        className="absolute inset-[7px] bg-white/15 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]"
        aria-hidden="true"
      />
      <Icon className="relative h-6 w-6 text-white" aria-hidden="true" />
    </div>
  );
}

export default ProfileAchievementsCard;
