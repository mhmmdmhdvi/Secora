import { useEffect, useRef, useState } from "react";
import { FiBookmark, FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Field } from "../UI";
import { classNames } from "../UI/classNames";
import {
  DIFFICULTY_OPTIONS,
  TOPIC_OPTIONS,
} from "../../data/lessonCatalogMeta";

const DIFFICULTY_TONES = {
  all: "bg-primary",
  beginner: "bg-green-500",
  intermediate: "bg-amber-500",
  advanced: "bg-rose-500",
};

function LessonCatalogFilters({
  difficulty,
  isAuthenticated,
  onDifficultyChange,
  onSearchChange,
  onSavedToggle,
  onTopicChange,
  savedCount,
  searchTerm,
  showSavedOnly,
  topic,
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 w-full max-w-5xl">
      <div className="relative mx-auto max-w-xl">
        <FiSearch
          className="absolute top-1/2 -translate-y-1/2 text-text-muted text-xl"
          style={{ insetInlineStart: "1rem" }}
        />
        <Field
          label={t("lessons.searchLabel")}
          labelClassName="sr-only"
          id="lesson-search"
          type="text"
          placeholder={t("lessons.searchPlaceholder")}
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="[&_input]:ps-12"
        />
      </div>

      <div
        className={classNames(
          "mt-5 grid grid-cols-1 gap-3",
          isAuthenticated ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        <FilterSelect
          id="lesson-topic-filter"
          label={t("lessons.topic")}
          onChange={onTopicChange}
          options={TOPIC_OPTIONS}
          translationPrefix="lessons.topics"
          value={topic}
        />
        <FilterSelect
          id="lesson-difficulty-filter"
          label={t("lessons.difficulty")}
          onChange={onDifficultyChange}
          options={DIFFICULTY_OPTIONS}
          translationPrefix="lessons.difficulties"
          value={difficulty}
        />
        {isAuthenticated && (
          <SavedLessonsToggle
            isActive={showSavedOnly}
            onToggle={onSavedToggle}
            savedCount={savedCount}
          />
        )}
      </div>
    </div>
  );
}

function SavedLessonsToggle({ isActive, onToggle, savedCount }) {
  const { t } = useTranslation();

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-text-muted">
        {t("lessons.savedLessons")}
      </span>
      <button
        type="button"
        aria-pressed={isActive}
        onClick={onToggle}
        className={classNames(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition",
          "focus:border-primary",
          isActive
            ? "border-primary bg-primary text-text-inverted"
            : "border-border bg-surface text-text hover:border-primary/50 hover:text-primary"
        )}
      >
        <span className="inline-flex items-center gap-2">
          <FiBookmark
            className="h-4 w-4"
            fill={isActive ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {t("lessons.savedLessons")}
        </span>
        <span
          className={classNames(
            "rounded-full px-2 py-0.5 text-xs",
            isActive
              ? "bg-white/20 text-text-inverted"
              : "bg-surface-muted text-text-muted"
          )}
        >
          {savedCount}
        </span>
      </button>
    </div>
  );
}

function FilterSelect({
  id,
  label,
  onChange,
  options,
  translationPrefix,
  value,
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedLabel = t(`${translationPrefix}.${value}`);
  const isDifficulty = translationPrefix === "lessons.difficulties";

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectOption(option) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative block">
      <label
        className="mb-2 block text-sm font-medium text-text-muted"
        htmlFor={id}
      >
        {label}
      </label>

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={classNames(
          "flex w-full items-center justify-between gap-3 rounded-xl border bg-surface px-4 py-3 text-sm font-semibold text-text outline-none transition",
          isOpen
            ? "border-primary ring-4 ring-primary/10"
            : "border-border hover:border-primary/50"
        )}
      >
        <span className="inline-flex min-w-0 items-center gap-2 text-start">
          {isDifficulty && (
            <span
              className={classNames(
                "h-2.5 w-2.5 shrink-0 rounded-full",
                DIFFICULTY_TONES[value] || "bg-text-muted"
              )}
              aria-hidden="true"
            />
          )}
          <span className="truncate">{selectedLabel}</span>
        </span>
        <FiChevronDown
          className={classNames(
            "h-4 w-4 shrink-0 text-text-muted transition",
            isOpen && "rotate-180 text-primary"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-surface p-1.5 text-start shadow-2xl shadow-black/10 dark:shadow-black/35"
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option)}
                className={classNames(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-medium leading-6 transition",
                  isSelected
                    ? "bg-surface-muted text-text"
                    : "text-text-muted hover:bg-surface-muted hover:text-text"
                )}
              >
                <span className="inline-flex min-w-0 items-center gap-2">
                  {isDifficulty && (
                    <span
                      className={classNames(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        DIFFICULTY_TONES[option] || "bg-text-muted"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0 whitespace-normal break-words">
                    {t(`${translationPrefix}.${option}`)}
                  </span>
                </span>
                {isSelected && (
                  <FiCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default LessonCatalogFilters;
