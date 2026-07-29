import { FiBarChart2, FiShield, FiZap } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Card, Skeleton } from "../UI";
import { classNames } from "../UI/classNames";
import { useLearningXpProfile } from "../../hooks/useLearningXpProfile";

const LEVEL_STYLES = {
  1: {
    accent: "from-sky-300 to-blue-600",
    ring: "ring-sky-200/70 dark:ring-sky-500/20",
    glow: "shadow-blue-500/15",
  },
  2: {
    accent: "from-emerald-300 to-green-600",
    ring: "ring-emerald-200/70 dark:ring-emerald-500/20",
    glow: "shadow-emerald-500/15",
  },
  3: {
    accent: "from-amber-300 to-orange-500",
    ring: "ring-orange-200/70 dark:ring-orange-500/20",
    glow: "shadow-orange-500/15",
  },
  4: {
    accent: "from-violet-300 to-purple-600",
    ring: "ring-violet-200/70 dark:ring-violet-500/20",
    glow: "shadow-violet-500/15",
  },
  5: {
    accent: "from-cyan-300 to-indigo-600",
    ring: "ring-cyan-200/70 dark:ring-cyan-500/20",
    glow: "shadow-cyan-500/15",
  },
};

function ProfileLevelCard() {
  const { t } = useTranslation();
  const { isLoading, profile } = useLearningXpProfile();

  if (isLoading) {
    return (
      <Card className="mb-6 overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-3xl" />
            <div>
              <Skeleton className="mb-3 h-4 w-28" />
              <Skeleton className="h-7 w-52" />
            </div>
          </div>
          <Skeleton className="h-20 w-full rounded-2xl sm:w-48" />
        </div>
        <Skeleton className="mt-6 h-3 w-full rounded-full" />
      </Card>
    );
  }

  if (!profile) return null;

  const nextLevelText =
    profile.xpForNextLevel > 0
      ? t("profile.xpToNextLevel", {
          xp: Math.max(profile.nextLevelXp - profile.totalXp, 0),
        })
      : t("profile.maxLevel");
  const levelName = t(`profile.levelNames.${profile.levelCode}`, {
    defaultValue: profile.levelName,
  });
  const levelStyle = LEVEL_STYLES[profile.level] || LEVEL_STYLES[1];
  const progressPercent = Math.min(Math.max(profile.progressPercent, 0), 100);

  return (
    <Card className="mb-6 overflow-hidden p-0">
      <div className="relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
        <div
          className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 right-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <LevelHexBadge level={profile.level} style={levelStyle} />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {t("profile.currentLevel")}
              </p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-text sm:text-3xl">
                {t("profile.levelNumber", { level: profile.level })}
              </h2>
              <p className="mt-1 text-sm font-medium text-text-muted">
                {levelName}
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[22rem]">
            <LevelStatCard
              icon={FiZap}
              label={t("profile.xp")}
              value={profile.totalXp}
              suffix="XP"
            />
            <LevelStatCard
              icon={FiBarChart2}
              label={t("profile.levelProgress")}
              value={progressPercent}
              suffix="%"
            />
          </div>
        </div>

        <div className="relative mt-6 rounded-2xl border border-border bg-surface/80 p-4 shadow-sm shadow-black/5">
          <div className="mb-3 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-text">{nextLevelText}</span>
            <span className="font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function LevelHexBadge({ level, style }) {
  return (
    <div
      className={classNames(
        "relative flex h-24 w-24 shrink-0 items-center justify-center drop-shadow-xl",
        style.glow
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
      <div className="relative flex flex-col items-center justify-center text-white">
        <FiShield className="h-7 w-7 stroke-[2.3]" aria-hidden="true" />
        <span className="mt-1 text-xs font-black tracking-wider">LVL {level}</span>
      </div>
    </div>
  );
}

function LevelStatCard({ icon: Icon, label, value, suffix }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4 shadow-sm shadow-black/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-text-muted">{label}</p>
          <p className="mt-1 text-2xl font-black text-text">
            {value}
            <span className="ms-1 text-xs font-bold text-text-muted">{suffix}</span>
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default ProfileLevelCard;
