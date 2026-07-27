import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiMessageSquare, FiStar, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import { useAppLanguage } from "../../../hooks/useAppLanguage";
import { useAuth } from "../../../hooks/useAuth";
import { saveLessonFeedback } from "../../../services/learningApi";
import { classNames } from "../../UI/classNames";

const DIFFICULTY_OPTIONS = ["too_easy", "just_right", "too_hard"];

function LessonFeedbackCard({ lessonSlug, source = "quiz" }) {
  const { isAuthenticated } = useAuth();
  const { language } = useAppLanguage();
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [difficulty, setDifficulty] = useState("just_right");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (!lessonSlug) {
    return null;
  }

  function openFeedback() {
    if (!isAuthenticated) {
      toast.info(t("feedback.loginRequired"));
      return;
    }

    setIsOpen(true);
  }

  function closeFeedback() {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!rating || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await saveLessonFeedback(
        lessonSlug,
        {
          rating,
          difficulty,
          comment,
          source,
        },
        { locale: language }
      );
      setSubmitted(true);
      toast.success(t("feedback.saved"));
    } catch {
      toast.error(t("feedback.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openFeedback}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/50 hover:text-primary sm:w-auto"
      >
        <FiMessageSquare className="h-4 w-4" aria-hidden="true" />
        {submitted ? t("feedback.editButton") : t("feedback.openButton")}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-feedback-title"
          onMouseDown={closeFeedback}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-border bg-surface p-5 text-start shadow-2xl sm:p-6"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  {t("feedback.eyebrow")}
                </p>
                <h3
                  id="lesson-feedback-title"
                  className="mt-1 text-xl font-bold text-text"
                >
                  {submitted ? t("feedback.thanksTitle") : t("feedback.title")}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeFeedback}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted hover:text-text"
                aria-label={t("feedback.close")}
                disabled={isSubmitting}
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {submitted ? (
              <SuccessState onClose={closeFeedback} />
            ) : (
              <FeedbackForm
                comment={comment}
                difficulty={difficulty}
                isSubmitting={isSubmitting}
                onCommentChange={setComment}
                onDifficultyChange={setDifficulty}
                onRatingChange={setRating}
                onSubmit={handleSubmit}
                rating={rating}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function FeedbackForm({
  comment,
  difficulty,
  isSubmitting,
  onCommentChange,
  onDifficultyChange,
  onRatingChange,
  onSubmit,
  rating,
}) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <p className="mt-2 text-sm leading-6 text-text-muted">
        {t("feedback.description")}
      </p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-text">{t("feedback.rating")}</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={t("feedback.ratingValue", { value })}
              onClick={() => onRatingChange(value)}
              className={classNames(
                "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition",
                value <= rating
                  ? "border-primary bg-primary text-text-inverted"
                  : "border-border bg-surface-muted text-text-muted hover:border-primary/50 hover:text-primary"
              )}
            >
              <FiStar
                className="h-5 w-5"
                fill={value <= rating ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-text">
          {t("feedback.difficulty")}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onDifficultyChange(option)}
              className={classNames(
                "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                difficulty === option
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface-muted text-text-muted hover:border-primary/50"
              )}
            >
              {t(`feedback.difficultyOptions.${option}`)}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-text">
          {t("feedback.comment")}
        </span>
        <textarea
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          placeholder={t("feedback.commentPlaceholder")}
          maxLength={1000}
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
        />
      </label>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={!rating || isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverted transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? t("feedback.saving") : t("feedback.submit")}
        </button>
      </div>
    </form>
  );
}

function SuccessState({ onClose }) {
  const { t } = useTranslation();

  return (
    <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
      <div className="flex items-start gap-3">
        <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-600 dark:text-green-300" />
        <div>
          <p className="text-sm leading-6 text-text-muted">
            {t("feedback.thanksDescription")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverted hover:bg-primary-hover"
          >
            {t("feedback.done")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LessonFeedbackCard;
