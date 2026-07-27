import { FiBookmark } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function BookmarkButton({ isBookmarked, isBusy, onToggle }) {
  const { t } = useTranslation();
  const label = isBookmarked
    ? t("lessons.removeBookmark")
    : t("lessons.addBookmark");

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isBookmarked}
      title={label}
      disabled={isBusy}
      onClick={onToggle}
      className="
        absolute top-4 z-10 inline-flex h-10 w-10 items-center justify-center
        rounded-full border border-border bg-surface/95 text-text-muted shadow-sm
        transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary
        focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary/25
        disabled:cursor-not-allowed disabled:opacity-60
      "
      style={{ insetInlineEnd: "1rem" }}
    >
      <FiBookmark
        className="h-5 w-5"
        fill={isBookmarked ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}

export default BookmarkButton;
