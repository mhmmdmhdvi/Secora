import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiDatabase,
  FiFolder,
  FiGlobe,
  FiKey,
  FiMail,
  FiPackage,
  FiSearch,
  FiServer,
  FiShield,
  FiStar,
  FiTarget,
  FiTerminal,
  FiTrendingUp,
  FiUploadCloud,
  FiZap,
  FiX,
} from "react-icons/fi";

import { classNames } from "../UI/classNames";

const RewardContext = createContext({
  showRewards: () => {},
});

const ACHIEVEMENT_ICONS = {
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

function RewardProvider({ children }) {
  const { t } = useTranslation();
  const [modalQueue, setModalQueue] = useState([]);
  const activeModal = modalQueue[0] || null;

  const closeActiveModal = useCallback(() => {
    setModalQueue((queue) => queue.slice(1));
  }, []);

  const showRewards = useCallback(
    (rewards) => {
      if (!rewards) return;

      const xpAwarded = Number(rewards.xpAwarded || 0);
      if (xpAwarded > 0) {
        toast(
          <XpRewardToast
            subtitle={t("rewards.xpSubtitle")}
            title={t("rewards.xpGained", { xp: xpAwarded })}
          />,
          {
            autoClose: 2600,
            bodyClassName: "!m-0 !block !p-0",
            className:
              "!min-h-0 !overflow-visible !rounded-none !bg-transparent !p-0 !shadow-none",
            closeButton: false,
            hideProgressBar: true,
          }
        );
      }

      const upcomingModals = [];
      if (rewards.levelUp) {
        upcomingModals.push({
          type: "levelUp",
          payload: rewards.levelUp,
        });
      }

      for (const achievement of rewards.achievementsUnlocked || []) {
        upcomingModals.push({
          type: "achievement",
          payload: achievement,
        });
      }

      if (upcomingModals.length > 0) {
        setModalQueue((queue) => [...queue, ...upcomingModals]);
      }
    },
    [t]
  );

  const value = useMemo(() => ({ showRewards }), [showRewards]);

  return (
    <RewardContext.Provider value={value}>
      {children}
      {activeModal && (
        <RewardModal modal={activeModal} onClose={closeActiveModal} />
      )}
    </RewardContext.Provider>
  );
}

export function useRewards() {
  return useContext(RewardContext);
}

function XpRewardToast({ title, subtitle }) {
  const { i18n } = useTranslation();
  const isPersian = i18n.language === "fa";

  return (
    <div
      className="w-full max-w-[17.5rem] overflow-hidden rounded-2xl border border-primary/20 bg-surface text-text shadow-xl shadow-black/10 dark:shadow-black/40"
      dir={isPersian ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-3 p-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FiZap className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black" dir="ltr">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-primary via-blue-400 to-cyan-400" />
    </div>
  );
}

function RewardModal({ modal, onClose }) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-surface p-6 text-center text-text shadow-2xl shadow-black/25 sm:p-7">
        <button
          className="absolute right-4 top-4 rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text"
          onClick={onClose}
          aria-label={t("rewards.close")}
        >
          <FiX className="h-5 w-5" aria-hidden="true" />
        </button>

        {modal.type === "levelUp" ? (
          <LevelUpContent levelUp={modal.payload} />
        ) : (
          <AchievementContent achievement={modal.payload} />
        )}

        <button
          className="mt-6 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-text-inverted transition hover:bg-primary-hover"
          onClick={onClose}
        >
          {t("rewards.continue")}
        </button>
      </div>
    </div>
  );
}

function LevelUpContent({ levelUp }) {
  const { t } = useTranslation();
  const levelName = levelUp.levelCode
    ? t(`profile.levelNames.${levelUp.levelCode}`)
    : levelUp.levelName;

  return (
    <>
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
        <FiTrendingUp className="h-11 w-11" aria-hidden="true" />
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-primary">
        {t("rewards.levelUpEyebrow")}
      </p>
      <h2 className="mt-2 text-3xl font-black text-text">
        {t("rewards.levelUpTitle", { level: levelUp.toLevel })}
      </h2>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-text-muted">
        {t("rewards.levelUpDescription", {
          levelName,
          xp: levelUp.totalXp,
        })}
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-surface-muted/45 p-4">
        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
          <span>{t("rewards.levelBefore", { level: levelUp.fromLevel })}</span>
          <span>{t("rewards.levelAfter", { level: levelUp.toLevel })}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-cyan-400" />
        </div>
      </div>
    </>
  );
}

function AchievementContent({ achievement }) {
  const { t } = useTranslation();
  const Icon = ACHIEVEMENT_ICONS[achievement.icon] || FiAward;

  return (
    <>
      <AchievementHex Icon={Icon} />

      <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-primary">
        {t("rewards.achievementEyebrow")}
      </p>
      <h2 className="mt-2 text-3xl font-black text-text">
        {t(`profile.achievementNames.${achievement.code}`)}
      </h2>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-text-muted">
        {t(`profile.achievementDescriptions.${achievement.code}`)}
      </p>
    </>
  );
}

function AchievementHex({ Icon }) {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center drop-shadow-xl">
      <div
        className={classNames(
          "absolute inset-0 bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500",
          "ring-8 ring-orange-200/70 dark:ring-orange-500/20",
          "[clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]"
        )}
      />
      <div
        className="absolute inset-[11px] bg-white/20 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]"
        aria-hidden="true"
      />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-black/10 text-white">
        <Icon className="h-9 w-9 stroke-[2.3]" aria-hidden="true" />
      </div>
      <FiStar className="absolute -right-1 top-2 h-6 w-6 fill-white text-white" aria-hidden="true" />
    </div>
  );
}

export default RewardProvider;
