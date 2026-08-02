import { FiMap } from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState, Skeleton } from "../UI";
import { useLearningPaths } from "../../hooks/useLearningPaths";
import LearningPathCard from "./LearningPathCard";
import LearningPathSelector from "./LearningPathSelector";

function LearningPathsPage() {
  const { t } = useTranslation();
  const { isLoading, paths } = useLearningPaths();
  const [activePathSlug, setActivePathSlug] = useState("");
  const selectedPathRef = useRef(null);
  const activePath = useMemo(
    () => paths.find((path) => path.slug === activePathSlug) || paths[0],
    [activePathSlug, paths]
  );

  useEffect(() => {
    if (paths.length === 0) {
      setActivePathSlug("");
      return;
    }

    const recommendedPath =
      paths.find((path) => path.isRecommended) ||
      paths.find((path) => path.status !== "completed") ||
      paths[0];

    setActivePathSlug((currentSlug) => {
      if (paths.some((path) => path.slug === currentSlug)) {
        return currentSlug;
      }

      return recommendedPath.slug;
    });
  }, [paths]);

  function handleSelectPath(slug) {
    setActivePathSlug(slug);
    window.requestAnimationFrame(() => {
      selectedPathRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl py-6 sm:py-8 md:py-10">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-primary/10 via-surface to-cyan-400/10 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <div
          className="pointer-events-none absolute -top-20 end-8 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 start-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
              {t("paths.eyebrow")}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-text sm:text-5xl">
              {t("paths.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              {t("paths.description")}
            </p>
          </div>

          <HeroPathGraphic />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : paths.length > 0 && activePath ? (
        <div className="space-y-6">
          <LearningPathSelector
            activePathSlug={activePath.slug}
            onSelectPath={handleSelectPath}
            paths={paths}
          />
          <div ref={selectedPathRef} className="scroll-mt-28">
            <LearningPathCard path={activePath} />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<FiMap aria-hidden="true" />}
          title={t("paths.emptyTitle")}
          description={t("paths.emptyDescription")}
        />
      )}
    </div>
  );
}

function HeroPathGraphic() {
  return (
    <div className="relative mx-auto hidden h-64 w-full max-w-sm lg:block" aria-hidden="true">
      <div className="absolute inset-x-8 top-4 h-48 rounded-[2rem] border border-white/40 bg-white/55 shadow-2xl shadow-primary/10 backdrop-blur dark:bg-slate-900/35" />
      <div className="absolute inset-x-4 top-10 h-48 rotate-[-3deg] rounded-[2rem] border border-primary/15 bg-surface/80 shadow-xl" />
      <div className="absolute inset-x-0 top-16 h-48 rotate-[3deg] rounded-[2rem] border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-2xl bg-primary/15" />
          <div className="h-3 w-24 rounded-full bg-surface-muted" />
        </div>
        <div className="mt-8 flex items-center justify-between">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div
                className={[
                  "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-lg",
                  index < 2
                    ? "border-primary/20 bg-primary text-white shadow-primary/20"
                    : "border-border bg-surface-muted text-text-muted",
                ].join(" ")}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-current" />
              </div>
              <div className="h-2 w-12 rounded-full bg-surface-muted" />
            </div>
          ))}
        </div>
        <div className="mt-7 h-3 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-primary to-cyan-400" />
        </div>
      </div>
    </div>
  );
}

export default LearningPathsPage;
