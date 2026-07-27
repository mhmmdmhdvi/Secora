import { FiBookmark, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Field } from "../UI";
import { classNames } from "../UI/classNames";
import {
  DIFFICULTY_OPTIONS,
  TOPIC_OPTIONS,
} from "../../data/lessonCatalogMeta";

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

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text-muted">{label}</span>
      <span className="relative block">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text outline-none transition focus:border-primary"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {t(`${translationPrefix}.${option}`)}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

export default LessonCatalogFilters;
