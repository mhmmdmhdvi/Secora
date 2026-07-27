import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../hooks/useAuth";

function LandingFooter() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const links = isAuthenticated
    ? [
        { label: t("nav.lessons"), to: "/lessons" },
        { label: t("nav.paths"), to: "/paths" },
        { label: t("nav.profile"), to: "/profile" },
      ]
    : [
        { label: t("nav.lessons"), to: "/lessons" },
        { label: t("nav.login"), to: "/login" },
        { label: t("auth.signUp"), to: "/signup" },
      ];

  return (
    <footer className="border-t border-border bg-app">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-text hover:text-primary"
          >
            SecureLearn
          </Link>
          <p className="mt-1 max-w-md text-sm leading-6 text-text-muted">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <nav
            aria-label={t("footer.navigation")}
            className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-text-muted"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-text-muted">
            {t("footer.copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
