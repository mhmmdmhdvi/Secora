import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import LessonCard from "./LessonCard";
import { lessons } from "../../data/lessons";

function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 md:py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Explore Lessons
        </h1>

        <div className="w-full max-w-xl mb-10 sm:mb-12 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search lesson catalog"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                image={lesson.image}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No lessons found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
