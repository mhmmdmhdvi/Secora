import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppLanguage } from "../../hooks/useAppLanguage";

const LESSON_TITLES = {
  "sql-injection": "SQL Injection",
  "cross-site-script-inclusion": "Cross-Site Script Inclusion",
  "cross-site-scripting": "Cross-Site Scripting",
  "reflected-xss": "Reflected XSS",
  "dom-based-xss": "DOM-based XSS",
};

const LESSON_ROUTE_SUFFIXES = [
  { suffix: "-quiz-start", section: "quiz" },
  { suffix: "-quiz", section: "quiz" },
  { suffix: "-guide", section: "guide" },
];

function AppBreadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const crumbs = buildCrumbs(location.pathname, t, isPersian);

  if (!crumbs.length) return null;

  return (
    <nav
      aria-label={isPersian ? "مسیر صفحه" : "Breadcrumb"}
      dir={isPersian ? "rtl" : "ltr"}
      className="sticky top-0 z-30 -mx-4 mb-6 hidden h-[72px] items-center border-b border-border bg-app/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 md:flex md:mb-7 lg:-mx-8 lg:px-8"
    >
      <ol className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto text-base sm:text-lg md:text-base">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && (
                <span className="shrink-0 text-text-muted" aria-hidden="true">
                  {isPersian ? "‹" : "›"}
                </span>
              )}

              {crumb.to && !isLast ? (
                <Link
                  to={crumb.to}
                  className="shrink-0 whitespace-nowrap font-semibold text-text-muted transition hover:text-primary"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={`shrink-0 whitespace-nowrap font-bold ${
                    isLast ? "text-text" : "text-text-muted"
                  }`}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function buildCrumbs(pathname, t, isPersian) {
  if (pathname === "/") {
    return [{ label: t("nav.home") }];
  }

  if (pathname === "/lessons") {
    return [{ label: t("nav.lessons") }];
  }

  if (pathname === "/paths") {
    return [{ label: t("nav.paths") }];
  }

  if (pathname === "/profile") {
    return [{ label: t("nav.profile") }];
  }

  if (pathname === "/about") {
    return [{ label: t("nav.about") }];
  }

  const lessonMatch = pathname.match(/^\/lessons\/([^/]+)/);
  if (lessonMatch) {
    const rawSlug = lessonMatch[1];
    const { baseSlug, section } = parseLessonSlug(rawSlug);
    const crumbs = [
      { label: t("nav.lessons"), to: "/lessons" },
      { label: lessonTitle(baseSlug), to: section ? `/lessons/${baseSlug}` : undefined },
    ];

    if (section) {
      crumbs.push({
        label: sectionLabel(section, isPersian),
      });
    }

    return crumbs;
  }

  return [];
}

export function useCurrentBreadcrumbLabel() {
  const location = useLocation();
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const crumbs = buildCrumbs(location.pathname, t, isPersian);

  if (!crumbs.length) return "Secora";

  return crumbs.map((crumb) => crumb.label).join(isPersian ? " ‹ " : " › ");
}

function parseLessonSlug(slug) {
  const routeSuffix = LESSON_ROUTE_SUFFIXES.find(({ suffix }) =>
    slug.endsWith(suffix)
  );

  if (!routeSuffix) {
    return { baseSlug: slug, section: null };
  }

  return {
    baseSlug: slug.slice(0, -routeSuffix.suffix.length),
    section: routeSuffix.section,
  };
}

function lessonTitle(slug) {
  if (LESSON_TITLES[slug]) {
    return LESSON_TITLES[slug];
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sectionLabel(section, isPersian) {
  const labels = {
    guide: isPersian ? "راهنما" : "Guide",
    quiz: isPersian ? "آزمون" : "Quiz",
  };

  return labels[section] || section;
}

export default AppBreadcrumbs;
