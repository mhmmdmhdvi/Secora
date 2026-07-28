import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import LessonCard from "./LessonCard";
import LessonCatalogFilters from "./LessonCatalogFilters";
import { lessons } from "../../data/lessons";
import { EmptyState } from "../UI";
import { useLessonBookmarks } from "../../hooks/useLessonBookmarks";
import { useLessonCatalogProgress } from "../../hooks/useLessonCatalogProgress";
import { getLessonCatalogMeta } from "../../data/lessonCatalogMeta";

function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [topic, setTopic] = useState("all");
  const { t } = useTranslation();
  const {
    bookmarkSlugs,
    busySlugs,
    isAuthenticated,
    toggleBookmark,
  } = useLessonBookmarks();
  const { progressBySlug, recommendedSlug } = useLessonCatalogProgress();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowSavedOnly(false);
    }
  }, [isAuthenticated]);

  const catalogLessons = useMemo(
    () =>
      lessons.map((lesson) => {
        const meta = getLessonCatalogMeta(lesson);
        const progress = progressBySlug.get(lesson.id) || null;
        const learningStatus = progress?.status || "notStarted";

        return {
          ...lesson,
          ...meta,
          description: t(`lessonDescriptions.${lesson.id}`, {
            defaultValue: lesson.description,
          }),
          isBookmarked: bookmarkSlugs.has(lesson.id),
          isRecommended: lesson.id === recommendedSlug,
          learningStatus,
          progress,
        };
      }),
    [bookmarkSlugs, progressBySlug, recommendedSlug, t]
  );

  const filteredLessons = catalogLessons.filter((lesson) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      lesson.title.toLowerCase().includes(normalizedSearch) ||
      lesson.description.toLowerCase().includes(normalizedSearch);
    const matchesTopic = topic === "all" || lesson.topic === topic;
    const matchesDifficulty =
      difficulty === "all" || lesson.difficulty === difficulty;
    const matchesSaved = !showSavedOnly || lesson.isBookmarked;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesSaved;
  });
  const isBookmarkEmptyState = showSavedOnly && bookmarkSlugs.size === 0;

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center">
          {t("lessons.explore")}
        </h1>

        <LessonCatalogFilters
          difficulty={difficulty}
          isAuthenticated={isAuthenticated}
          onDifficultyChange={setDifficulty}
          onSearchChange={setSearchTerm}
          onSavedToggle={() => setShowSavedOnly((current) => !current)}
          onTopicChange={setTopic}
          savedCount={bookmarkSlugs.size}
          searchTerm={searchTerm}
          showSavedOnly={showSavedOnly}
          topic={topic}
        />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                availability={lesson.availability}
                bestQuizScore={lesson.progress?.bestQuizScore}
                bestQuizTotal={lesson.progress?.bestQuizTotal}
                description={lesson.description}
                difficulty={lesson.difficulty}
                estimatedMinutes={lesson.estimatedMinutes}
                image={lesson.image}
                isBookmarkVisible={
                  isAuthenticated && lesson.availability !== "comingSoon"
                }
                isBookmarked={lesson.isBookmarked}
                isBookmarkBusy={busySlugs.has(lesson.id)}
                isClickable={lesson.isClickable}
                isRecommended={lesson.isRecommended}
                learningStatus={lesson.learningStatus}
                onToggleBookmark={() => toggleBookmark(lesson.id)}
                title={lesson.title}
                topic={lesson.topic}
              />
            ))
          ) : (
            <div className="col-span-full w-full">
              <EmptyState
                title={
                  isBookmarkEmptyState
                    ? t("lessons.noSavedTitle")
                    : t("lessons.noResultsTitle")
                }
                description={
                  isBookmarkEmptyState
                    ? t("lessons.noSavedDescription")
                    : t("lessons.noResultsDescription")
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
