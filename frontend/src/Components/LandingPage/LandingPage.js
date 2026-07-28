import React from "react";
import TerminalBox from "./TerminalBox";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import ContinueLearningPanel from "./ContinueLearningPanel";
import LandingFooter from "./LandingFooter";

function LandingPage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const isEnglish = i18n.dir() === "ltr";
  const titleClassName = isEnglish
    ? isAuthenticated
      ? "font-sans max-w-[12ch] sm:max-w-none text-[clamp(2.7rem,10vw,4.6rem)] md:text-[clamp(3.4rem,7vw,4.7rem)] xl:whitespace-nowrap xl:text-[clamp(4rem,4.4vw,5rem)]"
      : "font-sans max-w-[12ch] sm:max-w-none text-[clamp(2.7rem,9vw,4.35rem)] md:text-[clamp(3.35rem,6vw,4.45rem)] 2xl:whitespace-nowrap"
    : "max-w-[11ch] sm:max-w-none text-[clamp(2.55rem,8.5vw,4.5rem)] lg:text-[clamp(3.25rem,5vw,4.65rem)]";
  const containerClassName = isAuthenticated
    ? "mx-auto max-w-[96rem] px-4 py-10 sm:px-6 md:py-16 lg:px-8 lg:py-20"
    : "mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-16";
  const gridClassName = isAuthenticated
    ? "grid grid-cols-1 items-center gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)] xl:gap-16 2xl:gap-20"
    : "grid grid-cols-1 items-center gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(390px,0.85fr)] xl:gap-12";

  return (
    <div className="bg-app text-text">
      <section className="relative z-10 w-full">
        <div className={containerClassName}>
          <div className={gridClassName}>
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center items-start text-start lg:items-start">
              <h1 className={`${titleClassName} m-0 font-extrabold leading-[0.98] tracking-[-0.055em] text-text`}>
                {t("landing.titleLine1")}
              </h1>

              <h2 className={`${titleClassName} mt-2 mb-6 font-extrabold leading-[0.98] tracking-[-0.055em] text-primary`}>
                {t("landing.titleLine2")}
              </h2>

              <p className="text-sm sm:text-base text-text-muted leading-7 mb-8 max-w-xl">
                {t("landing.description")}
              </p>

              <Link
                to="/lessons"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-text-inverted rounded-lg font-semibold hover:bg-primary-hover transition"
              >
                {t("landing.browseLessons")}
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-center items-center">
              <TerminalBox compact={!isAuthenticated} />
            </div>
          </div>
        </div>
      </section>
      <ContinueLearningPanel />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
