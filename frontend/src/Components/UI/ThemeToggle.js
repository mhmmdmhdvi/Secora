import { useTheme } from "../../hooks/useTheme";
import { classNames } from "./classNames";
import { useTranslation } from "react-i18next";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();
  const options = [
    { value: "light", label: t("theme.light"), ariaLabel: t("theme.lightAria") },
    { value: "dark", label: t("theme.dark"), ariaLabel: t("theme.darkAria") },
  ];

  return (
    <div
      aria-label={t("theme.selection", { theme: t(`theme.${theme}`) })}
      className="inline-flex rounded-full border border-border bg-surface-muted p-1"
      role="group"
    >
      {options.map((option) => {
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.ariaLabel}
            aria-pressed={active}
            onClick={() => setTheme(option.value)}
            className={classNames(
              "inline-flex min-w-20 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold",
              "text-text-muted hover:text-text focus-visible:outline-primary/40",
              active && "bg-surface text-text shadow-sm"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
