import React from "react";
import TerminalBox from "./TerminalBox";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-app text-text">
      <section className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 xl:gap-24">
            {/* LEFT SIDE */}
            <div className="flex flex-col justify-center items-start text-start lg:items-start">
              <h1 className="font-extrabold leading-tight text-4xl sm:text-5xl xl:text-6xl text-text m-0">
                {t("landing.titleLine1")}
              </h1>

              <h2 className="font-extrabold leading-tight text-4xl sm:text-5xl xl:text-6xl text-primary mt-2 mb-6">
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
              <TerminalBox />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
