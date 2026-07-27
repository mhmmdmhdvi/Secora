import { FiAward } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Card, Skeleton } from "../UI";
import { useLearningXpProfile } from "../../hooks/useLearningXpProfile";

function ProfileLevelCard() {
  const { t } = useTranslation();
  const { isLoading, profile } = useLearningXpProfile();

  if (isLoading) {
    return (
      <Card className="p-5 sm:p-6 mb-6">
        <Skeleton className="h-5 w-36 mb-5" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-3 w-full" />
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

  return (
    <Card className="p-5 sm:p-6 mb-6 overflow-hidden">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <FiAward className="h-6 w-6" aria-hidden="true" />
          </div>

          <div>
            <p className="text-sm font-medium text-text-muted">
              {t("profile.currentLevel")}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-text">
              {t("profile.levelNumber", { level: profile.level })}
              <span className="mx-2 text-text-muted">/</span>
              {levelName}
            </h2>
          </div>
        </div>

        <div className="sm:text-end">
          <p className="text-3xl font-bold text-text">
            {profile.totalXp}
            <span className="ms-2 text-sm font-semibold text-text-muted">
              {t("profile.xp")}
            </span>
          </p>
          <p className="mt-1 text-sm text-text-muted">{nextLevelText}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-text-muted">
          <span>{t("profile.levelProgress")}</span>
          <span>{profile.progressPercent}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${profile.progressPercent}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

export default ProfileLevelCard;
