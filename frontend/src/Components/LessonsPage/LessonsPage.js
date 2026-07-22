import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import LessonCard from "./LessonCard";
import { lessons } from "../../data/lessons";
import { EmptyState, Field } from "../UI";
import { useTranslation } from "react-i18next";

function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(`lessonDescriptions.${lesson.id}`, { defaultValue: lesson.description })
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          {t("lessons.explore")}
        </h1>

        <div className="w-full max-w-xl mb-10 sm:mb-12 relative">
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="[&_input]:ps-12"
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                description={t(`lessonDescriptions.${lesson.id}`, {
                  defaultValue: lesson.description,
                })}
                image={lesson.image}
              />
            ))
          ) : (
            <div className="col-span-full w-full">
              <EmptyState
                title={t("lessons.noResultsTitle")}
                description={t("lessons.noResultsDescription")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
