import { useTranslation } from "react-i18next";

import { useAppLanguage } from "../../hooks/useAppLanguage";
import { classNames } from "./classNames";

const OPTIONS = [
  { value: "fa", labelKey: "language.fa" },
  { value: "en", labelKey: "language.en" },
];

function LanguageToggle() {
  const { t } = useTranslation();
  const { changeLanguage, language } = useAppLanguage();

  return (
    <div
      aria-label={t("language.selection", {
        language: t(`language.${language}`),
      })}
      className="inline-flex rounded-full border border-border bg-surface-muted p-1"
      role="group"
    >
      {OPTIONS.map((option) => {
        const active = language === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-label={t(option.labelKey)}
            aria-pressed={active}
            onClick={() => changeLanguage(option.value)}
            className={classNames(
              "inline-flex min-w-20 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold",
              "text-text-muted hover:text-text focus-visible:outline-primary/40",
              active && "bg-surface text-text shadow-sm"
            )}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;
