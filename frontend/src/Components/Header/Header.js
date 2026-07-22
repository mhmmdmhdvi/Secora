import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-app py-3 md:py-5 border-b border-border/60">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[64px] md:min-h-[72px] flex items-center justify-between border border-border rounded-xl bg-surface px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-7 min-w-0">
            <Link
              to="/"
              className="text-lg md:text-xl font-bold text-text no-underline whitespace-nowrap"
            >
              SecureLearn
            </Link>

            <nav className="flex items-center gap-4 md:gap-6 min-w-0">
              <Link
                to="/lessons"
                className="text-text-muted text-sm md:text-base no-underline transition-colors duration-200 hover:text-text"
              >
                {t("nav.lessons")}
              </Link>
            </nav>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-3">
            <Link
              to="/login"
              className="text-primary font-semibold text-sm md:text-base no-underline hover:text-primary-hover transition-colors duration-200"
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
