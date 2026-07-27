import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiTarget,
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
  shield: FiShield,
  target: FiTarget,
  zap: FiZap,
};

function ProfileAchievementsCard() {
  const { t } = useTranslation();
  const { achievements, isLoading } = useLearningAchievements();

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6 mb-6">
        <Skeleton className="h-5 w-40 mb-5" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    );
  }

  if (!achievements) return null;

  return (
    <Card className="p-5 sm:p-6 mb-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">
            {t("profile.achievements")}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {t("profile.achievementsDescription")}
          </p>
        </div>
        <p className="text-sm font-semibold text-text-muted">
          {t("profile.achievementsCount", {
            unlocked: achievements.unlockedCount,
            total: achievements.totalCount,
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {achievements.results.map((achievement) => (
          <AchievementBadge
            achievement={achievement}
            key={achievement.code}
          />
        ))}
      </div>
    </Card>
  );
}

function AchievementBadge({ achievement }) {
  const { t } = useTranslation();
  const Icon = achievement.isUnlocked
    ? ICONS[achievement.icon] || FiAward
    : FiLock;

  return (
    <div
      className={classNames(
        "rounded-xl border p-4 transition",
        achievement.isUnlocked
          ? "border-primary/25 bg-primary/5 text-text"
          : "border-border bg-surface-muted/50 text-text-muted"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={classNames(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            achievement.isUnlocked
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-surface text-text-muted"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text">
            {t(`profile.achievementNames.${achievement.code}`)}
          </h3>
          <p className="mt-1 text-xs leading-5 text-text-muted">
            {t(`profile.achievementDescriptions.${achievement.code}`)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileAchievementsCard;
